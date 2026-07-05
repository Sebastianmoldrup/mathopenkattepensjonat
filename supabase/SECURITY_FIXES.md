# Security fixes — booking, admin RPCs, storage (2026-07-01)

This documents a security/code-quality audit of the booking flow, admin RPCs,
and cat-photo storage, what's already fixed in the app code, what still needs
to be applied to the (production) Supabase database, and the edge cases and
tradeoffs considered along the way. The three SQL files in
`supabase/manual-migrations/` are the actual fixes for the database side —
this file is the narrative explaining *why* they exist and how to apply them
safely.

The database is production. Nothing in `manual-migrations/` is applied
automatically — each file must be run manually in the Supabase SQL editor,
one at a time, in order, with its own verification step before moving to the
next.

---

## 1. Booking creation had no ownership check and trusted the client's price

**Where:** `create_booking_with_cats` (Postgres function), called from
`lib/booking/actions.ts` → `createBooking`.

**What was wrong:** the function is `SECURITY DEFINER` (runs with the
function owner's privileges, which bypasses RLS for the caller) and never
checked `auth.uid()` against the `p_user_id` argument it was given. It also
inserted the client-supplied `p_price` verbatim, with no server-side
recalculation.

Concretely, this meant:
- Any authenticated user could create a booking attributed to a *different*
  user's account, by simply passing someone else's `user_id` in the request.
  Normally the `bookings` table's own RLS policy
  (`WITH CHECK (auth.uid() = user_id)`) would stop this — but because the
  function is `SECURITY DEFINER`, it runs as the function owner and RLS is
  bypassed entirely. The safety net existed on the table; the RPC just
  routed around it.
- Any authenticated user could set an arbitrary price (including `0` or
  negative) for a real booking, since nothing recomputed or validated it.

**Why it wasn't caught by testing:** the Next.js server action always sends a
correct `userId` and `price` because that's what the UI computes. The
vulnerability only shows up if someone bypasses the app and calls the
Supabase RPC directly with a valid session token and the public anon key
(which is, by design, embedded in every client bundle) — e.g. via
`supabase.rpc('create_booking_with_cats', {...})` from the browser console,
or by replaying/tampering with the request. Supabase RPCs are exposed over
PostgREST independently of the app's UI.

**Three overloads existed simultaneously** (9, 10, and 11 parameters — from
iterative migrations over time). The app only calls the 11-param version, but
the two older ones were still independently callable with the exact same gap.
Patching only the newest one would have left the hole open via the older
signatures.

### What's done locally (app code)

`lib/booking/actions.ts` → `createBooking` now:
- Calls `supabase.auth.getUser()` and throws if there's no session or the
  session's user doesn't match `payload.userId` (defense in depth — this
  doesn't fix the actual vulnerability, since the DB is the real trust
  boundary, but it fails fast for the normal app flow and avoids relying on
  the DB fix alone).
- Recomputes the price server-side via `calculatePriceBreakdown(...)`
  (already imported in this file, in `lib/booking/pricing.ts`) instead of
  trusting `payload.price`.
- Derives `num_cats` from `payload.catIds.length` instead of the separately
  client-supplied `payload.numCats`, closing a secondary tampering vector
  (a client could otherwise send `catIds` with 3 cats but `numCats: 1` to get
  a cheaper per-cat rate).
- Passes `user.id` (the verified session user, not `payload.userId`) into the
  RPC call.

### What still has to change in Supabase

Run **`supabase/manual-migrations/001_booking_ownership_and_price.sql`**:
1. Drops the two stale overloads of `create_booking_with_cats`.
2. Re-creates the live (11-param) overload with an
   `auth.uid() = p_user_id` check at the top — this is the actual fix; the
   app-side check above is a courtesy, not a substitute.

**Verification (included at the bottom of the file):** call the function with
a mismatched `p_user_id` — should raise `Unauthorized`. Call it with the
session's own id — should still succeed.

### Edge cases / residual risk considered

- **Price validation is not ported into SQL.** `calculatePriceBreakdown` is a
  pure function of inputs already in the payload (dates, cage type, cage
  count, cat count), so recomputing it in the Next.js server action is
  reliable for all normal app usage. But it does **not** stop someone who
  bypasses the app entirely and calls the RPC directly with a fabricated
  price — that's only blocked if the pricing engine is duplicated inside the
  SQL function, which would mean maintaining two copies of business logic
  (seasonal rates, Easter calculation, minimum-stay floor) forever, with real
  drift risk as pricing rules change.
  **Decision made:** accept this residual risk. Every booking is created as
  `status = 'pending'` and reviewed by an admin before confirmation (per the
  existing "booking is a request, not an instant confirmation" model) — a
  suspicious price would surface there before any commitment is finalized.
  If zero residual risk is ever required, the two remaining options are (a)
  port the pricing engine into SQL, or (b) revoke `EXECUTE` on the RPC from
  `anon`/`authenticated` entirely and route all calls through a
  `service_role` key held only server-side — both are bigger changes,
  deliberately deferred.
- **Pending-vs-pending double booking was left alone, on purpose.**
  `check_cat_conflict` and `get_bookings_for_availability` both only check
  against `status = 'confirmed'` bookings (there's a code comment in both —
  `-- ← removed 'pending'` — indicating this was a deliberate prior change),
  and the cage-capacity check in `createBooking` is commented out. This means
  two different customers can each get a `pending` booking for the same
  cat/cage/dates, with the conflict only surfacing when an admin tries to
  confirm the second one. **This was discussed and intentionally not
  changed** — it reads as a deliberate choice to let admins arbitrate
  conflicts manually rather than have the system hard-block requests (which
  risks falsely blocking legitimate customers if an old pending request was
  never cleaned up). If this should actually be tightened, that's a product
  decision, not a pure bug fix, and needs its own discussion.

---

## 2. Four admin RPCs were missing the `is_admin()` authorization check

**Where:** `admin_get_cage_assignments(p_from date, p_to date)` (the
date-range overload — the `p_booking_id` overload was fine),
`admin_get_cage_conflicts`, `admin_get_free_cages`,
`admin_get_unassigned_confirmed`.

**What was wrong:** every other admin RPC (35 of 39) opens with
`if not is_admin() then raise exception 'Unauthorized'` (or, for
`LANGUAGE sql` functions, filters with `WHERE public.is_admin()`). These four
didn't have that check at all. Since they're all `SECURITY DEFINER`, RLS on
the underlying tables is bypassed regardless — the internal `is_admin()`
check is the *only* thing standing between a caller and the data. Three of
these four functions return booking-owner first/last name plus cat names, so
any authenticated user with `EXECUTE` privilege on the function (the default
Supabase grant) could pull customer PII by calling the RPC directly, without
being an admin and without going through the admin panel at all.

**Why it wasn't caught by testing:** the app only ever calls these from the
admin panel (already gated by `is_admin()` in `proxy.ts` middleware), so
normal usage never exposed the gap. It's only visible from a direct RPC call.

### What still has to change in Supabase

Run **`supabase/manual-migrations/002_admin_rpc_guards.sql`** — re-creates
all four functions, adding `public.is_admin()` to their `WHERE` clause,
matching the exact pattern already used by their sibling functions in this
schema (e.g. `admin_get_all_bookings`, `admin_get_cage_assignments(p_booking_id uuid)`).

No app code changes were needed for this one — the admin panel already only
calls these when the session is an admin, so behavior for legitimate admin
use is unchanged.

### Edge case considered

These are `LANGUAGE sql` functions, so they can't use `IF ... RAISE EXCEPTION`
(that requires `plpgsql`). Adding `is_admin()` as an `AND`/`WHERE` condition
means a non-admin caller gets an **empty result set**, not an error — this
matches the existing behavior of every other `LANGUAGE sql` admin function in
the schema, so it's consistent rather than a new pattern.

---

## 3. `readUser` looked like an IDOR but is actually blocked by RLS — no fix needed

**Where:** `actions/user/readUser.ts`.

This function takes a `userId` argument and queries `users` with no
comparison to the caller's session, which looked like it would let any
authenticated user read any other user's profile (address, phone, emergency
contact) by ID. **This was investigated and ruled out**: `users` has RLS
enabled (confirmed directly against the production database:
`relrowsecurity = true`) with a `SELECT` policy of
`auth.uid() = id`, restricted to the `authenticated` role. That policy blocks
cross-user reads regardless of what `userId` the app code passes in — so this
finding was downgraded from the original audit and no change was made.

---

## 4. Open redirect in the auth confirmation link

**Where:** `app/(auth)/confirm/route.ts`.

**What was wrong:** the `next` query parameter was passed straight into
`redirect(next)` with no validation. A real confirmation/invite email link
has a valid `token_hash`/`type` (so OTP verification succeeds), but the
`next` parameter could be swapped for an off-site URL
(`next=https://evil.example`) or a protocol-relative bypass
(`next=//evil.example`, which browsers can interpret as `https://evil.example`)
— turning a legitimate confirmation link into a phishing redirect after
real authentication succeeds.

### What's done locally (app code)

`app/(auth)/confirm/route.ts` now only allows `next` values that start with
`/` and are not `//`- or `/\`-prefixed (both are bypasses browsers can treat
as protocol-relative); anything else falls back to `/`. The error-page
redirect also now URL-encodes the error message instead of interpolating it
raw into the query string.

No Supabase-side change needed — this was purely an app-code fix.

---

## 5. `catphotos` storage bucket had no ownership scoping

**Where:** `storage.objects` RLS policies for `bucket_id = 'catphotos'`.

**What was wrong:** the `INSERT`, `UPDATE`, and `DELETE` policies only
checked `bucket_id = 'catphotos'` — any authenticated user could upload,
overwrite, or delete *any* object in the bucket, not just their own cat's
photo. There was no ownership check at all.

**Related dead code found:** while investigating this, `actions/cat/createCatBucket.ts`'s
`uploadCatPhoto` function turned out to have zero call sites anywhere in the
app — it was never actually used. It also wrote to a different, redundant
path convention (`catphotos/{catId}.{ext}`, i.e. a `catphotos` subfolder
*inside* the `catphotos` bucket) than the three live upload paths
(`createCat.ts`, `updateCat.ts`, `createCatAndReturn.ts`), which all
consistently use a flat `{uuid}.{ext}`. Since it was unused, it was deleted
rather than fixed — there was no live inconsistency to reconcile.

### What's done locally (app code)

Deleted `actions/cat/createCatBucket.ts` (dead code, confirmed unused).

### What still has to change in Supabase

Run **`supabase/manual-migrations/003_catphotos_storage_ownership.sql`** —
drops the three unscoped `INSERT`/`UPDATE`/`DELETE` policies and replaces
them with policies that verify the object belongs to a cat owned by the
calling user (or that the caller is an admin), by joining
`storage.filename(name)` (minus the extension) back to `public.cats.id`. The
public `SELECT` policies are untouched — cat photos are meant to be publicly
viewable via `getPublicUrl()`, and that's intentional.

### Edge case considered

`storage.filename(name)` (a Supabase Storage helper) is used instead of
manual string parsing specifically because it strips any folder prefix — so
the new policy correctly handles both the live flat `{uuid}.{ext}` objects
*and* any legacy objects that might exist under the old, now-deleted
`catphotos/{catId}.{ext}` convention, without needing a data migration.

---

## 6. Everything else fixed in this pass (no Supabase changes needed)

- **`eslint.config.mjs`** — added `{ ignores: ['.next/**'] }`. Lint was
  walking generated `.next/dev/types/` files and reporting 56,495
  false-positive errors, burying the real ~64 pre-existing issues (unrelated
  `any` types, unused vars, a couple of real bugs like conditionally-called
  hooks in `ImageCarousel.tsx` — none of that was touched in this pass, it's
  now just visible again).
- **Dead code removed:** duplicate `AuthButton` implementations
  (`components/AuthButton.tsx`, `components/auth-button.tsx`, plus
  `components/navbar/MobileMenu.tsx`, which was the only thing importing the
  kebab-case one and was itself never rendered anywhere — the live navbar in
  `components/Navbar.tsx` reimplements the same logic inline instead), the
  orphaned `hero.tsx`/`next-logo.tsx`/`supabase-logo.tsx` chain,
  `theme-switcher.tsx`, `ChangeEmailButton.tsx`, `navbar/AdminButton.tsx`,
  `admin/BookingDetailSheet.tsx`, `admin/PrintButton.tsx`, unused images
  (`public/img/wip.png`, `wip.webp`), orphaned duplicate zod schemas
  (`schemas/loginSchema.ts`, `schemas/profileSchema.ts` — the app actually
  uses `lib/validation/login.ts` and inline schemas in `profile-form.tsx`/
  `AdminProfileForm.tsx`), and `lib/supabase/utils.ts` in its entirety (210
  lines, zero live importers — it turned out `hasEnvVars`, its one
  seemingly-live export, is actually a different function of the same name
  in `lib/utils.ts`, imported by `proxy.ts` via a relative path that
  resolves to that file, not this one).

**Not touched in this pass** (out of scope, no action requested): Tailwind
v3→v4 migration, shadcn `radix-ui` package consolidation, Zod `.email()` v4
syntax migration, Supabase `"latest"` version pinning in `package.json`,
`eslint-config-next` version mismatch, stale "Next.js 15" mention in README,
inline duplicate schemas in `profile-form.tsx`/`AdminProfileForm.tsx`.

---

## Applying the Supabase migrations

1. Open the Supabase SQL editor for this project.
2. Run `supabase/manual-migrations/001_booking_ownership_and_price.sql` in
   full. Run its verification queries (commented at the bottom of the file,
   adjust the placeholder UUIDs to real values).
3. Once confirmed working, run `002_admin_rpc_guards.sql`. Verify as a
   non-admin session (should get empty results, not errors) and as an admin
   session (should be unchanged).
4. Once confirmed working, run `003_catphotos_storage_ownership.sql`. Verify
   as a cat owner (upload/delete should still work) and, if feasible, as a
   different account (should now be rejected).

Each file has a **Rollback** section (commented SQL, near the bottom) with
the exact original definition, captured directly from the production
database before any change — if a migration causes an unexpected issue, the
rollback block restores the prior state exactly.

## Local verification already done

- `pnpm lint` — clean of `.next/` noise; only pre-existing, out-of-scope
  issues remain.
- `pnpm build` — succeeds, all 49 routes generate, no broken imports from the
  deletions.
- Not yet done: a live end-to-end run of the booking flow and the `/confirm`
  route in the browser — recommended before/alongside applying migration 001.
