-- ============================================================
-- 003: Scope catphotos storage writes to the cat's owner
-- ============================================================
-- Problem: the current INSERT/DELETE policies on storage.objects for the
-- catphotos bucket only check bucket_id = 'catphotos' -- any authenticated
-- user can upload or delete ANY object in the bucket, not just their own
-- cat's photo. There's no path/ownership scoping at all.
--
-- All live upload code (actions/cat/createCat.ts, updateCat.ts,
-- createCatAndReturn.ts) writes objects as a flat "{catId}.{ext}" (no
-- folder prefix), so ownership can be derived by joining the object's
-- filename (minus extension) back to public.cats.owner_id.
-- storage.filename(name) is used instead of manual string parsing so this
-- also works correctly for any pre-existing objects that may have a
-- "catphotos/" folder prefix from the old (now-deleted, dead-code)
-- uploadCatPhoto helper.
--
-- This migration does NOT touch the SELECT policies -- cat photos are
-- meant to be publicly viewable via getPublicUrl(), so public read access
-- is intentional and unchanged.
-- ============================================================

-- --- Drop the existing unscoped INSERT/DELETE/UPDATE policies -----------
-- (exact names as they exist in the live database)

drop policy if exists "Authenticated users can insert cat photo v4b5cn_0" on storage.objects;
drop policy if exists "Authenticated users can delete cat photo v4b5cn_0" on storage.objects;
drop policy if exists "Users can update their cat photos v4b5cn_0" on storage.objects;

-- --- Recreate them scoped to the cat's owner (or admin) ------------------

create policy "Owners can insert their cat photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'catphotos'
  and exists (
    select 1 from public.cats c
    where c.id::text = split_part(storage.filename(name), '.', 1)
      and (c.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "Owners can delete their cat photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'catphotos'
  and exists (
    select 1 from public.cats c
    where c.id::text = split_part(storage.filename(name), '.', 1)
      and (c.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "Owners can update their cat photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'catphotos'
  and exists (
    select 1 from public.cats c
    where c.id::text = split_part(storage.filename(name), '.', 1)
      and (c.owner_id = auth.uid() or public.is_admin())
  )
);

-- ============================================================
-- Rollback (restores pre-migration state exactly)
-- ============================================================
-- drop policy if exists "Owners can insert their cat photos" on storage.objects;
-- drop policy if exists "Owners can delete their cat photos" on storage.objects;
-- drop policy if exists "Owners can update their cat photos" on storage.objects;
--
-- create policy "Authenticated users can insert cat photo v4b5cn_0"
-- on storage.objects for insert to authenticated
-- with check (bucket_id = 'catphotos'::text);
--
-- create policy "Authenticated users can delete cat photo v4b5cn_0"
-- on storage.objects for delete to authenticated
-- using (bucket_id = 'catphotos'::text);
--
-- create policy "Users can update their cat photos v4b5cn_0"
-- on storage.objects for update to authenticated
-- using (bucket_id = 'catphotos'::text);

-- ============================================================
-- Verification (run manually after applying)
-- ============================================================
-- As the owner of a real cat row, confirm you can still upload/delete/update
-- that cat's photo (path "{that cat's id}.jpg" or similar).
--
-- As a different authenticated user (not that cat's owner, not admin),
-- attempt to upload/delete/update an object at the same path -- should now
-- be rejected by RLS (permission denied / no rows affected).
--
-- As an admin (is_admin() = true), confirm you can still upload/delete/update
-- any cat's photo (used by the admin panel).
