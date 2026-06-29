# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Next.js)
pnpm build      # Production build
pnpm lint       # ESLint
```

No test suite is configured.

## Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=        # used for metadataBase (OG tags)
```

## Tech stack

Next.js 15 App Router · TypeScript · Tailwind CSS · shadcn/ui · Supabase (PostgreSQL + Auth + Storage + RLS) · Resend (email) · Vercel (deploy) · pnpm

## Architecture

### Route groups and access control

- `/app/(auth)/` — auth flow pages (login, registrering, glemt-passord, endre-passord, confirm route)
- `/app/minside/` — authenticated customer dashboard (protected by Supabase session)
- `/app/admin/` — admin panel, protected in `proxy.ts` via a Supabase RPC `is_admin()` check; unauthenticated → `/login`, non-admin → `/`
- All other routes are public marketing/info pages

Session handling runs in `proxy.ts` (Next.js middleware). Always create a new Supabase client per function call — never store it in a module-level variable (important for Fluid compute / edge runtime).

### Supabase clients

- `lib/supabase/server.ts` — async server-side client using `@supabase/ssr` + Next.js cookies
- `lib/supabase/client.ts` — browser client for client components
- `lib/supabase/proxy.ts` — session refresh used by the middleware

### Booking system (`lib/booking/`)

The booking wizard has two parallel flows persisted in `sessionStorage`:
- **Guest flow** (`GuestWizardState`): count → dates → cage → summary (unauthenticated user explores availability)
- **Authed flow** (`AuthedWizardState`): cats → dates → cage → summary (logged-in user with real cats)

On login during guest flow, `authedStorage.fromGuest()` hydrates the authed state from the guest state (preserving selected dates/cage).

Key modules:
- `lib/booking/types.ts` — `CAGE_CONFIGS`, `PRICING`, `FIXED_HIGH_SEASON_RANGES`, core interfaces
- `lib/booking/availability.ts` — date-range availability logic, cage usage, cat conflict detection
- `lib/booking/pricing.ts` — day-by-day price breakdown, easter high-season calculation, minimum 2-night floor
- `lib/booking/cancellation.ts` — fee calculation (low: 24h free window, high: 7 days; 50% after)
- `lib/booking/actions.ts` — server actions: `createBooking` (RPC `create_booking_with_cats`), `getUpcomingYearBookings` (RPC `get_bookings_for_availability`), `sendBookingRequestEmail`
- `lib/booking/wizardStorage.ts` — `sessionStorage` helpers for wizard state

**Date handling gotcha:** Always use local time (not `toISOString()`) when converting dates to `YYYY-MM-DD` strings — UTC shift causes off-by-one errors in CEST (UTC+2). Use the `localKey()` / `toLocalDateStr()` helpers.

**Pricing note:** Both check-in day and check-out day are billed (day-based, not night-based), with a minimum of 2 days.

**Booking is a request, not an instant confirmation.** Status starts as `pending`; admin confirms separately. A `booking_snapshots` table stores a point-in-time snapshot of owner + cat details at booking time.

### Cage inventory

| Type           | Count | Max cats |
|----------------|-------|----------|
| standard       | 14    | 2        |
| senior_comfort | 3     | 2        |
| suite          | 3     | 3        |

3 cats: suite (1 cage) or 2× standard split

### Admin panel (`app/admin/`, `lib/admin/`, `components/admin/`)

- Dashboard with stats, alerts, revenue chart
- Bookings table with search/filter/sort and PDF export (`@react-pdf/renderer`)
- Check-in/check-out with signature capture
- Health log and veterinary notes per cat
- Daily checklists (morning + evening routines)
- HMS registrations
- Cancellation overview with fee tracking
- §5 documentation export (per booking + annual bulk)

### Server actions pattern

Actions live in `actions/` (cat CRUD, auth) and `lib/*/actions.ts` (booking, admin, userBookings). All are `'use server'` files. Client components import and call them directly.

### Forms

Forms use `react-hook-form` + `zod` schemas (in `schemas/`). Validation schemas are shared between client-side validation and server-side parsing.

### Email

`lib/email/resend.ts` + `lib/email/templates/booking.ts`. Emails are sent inline in server actions; failures are caught and logged without blocking the primary operation.

### UI components

`components/ui/` contains shadcn/ui primitives. Domain-specific components are grouped under `components/admin/`, `components/booking/`, `components/landing/`, `components/userBookings/`, `components/navbar/`.

### Pricing / season logic

High season: 15 Jun–15 Aug, 20 Dec–2 Jan, and Easter week (Palm Sunday through Easter Monday). Easter range is computed dynamically per year via the Butcher algorithm (`getEasterSunday`).
