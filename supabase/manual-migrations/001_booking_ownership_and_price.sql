-- ============================================================
-- 001: Enforce booking ownership in create_booking_with_cats
-- ============================================================
-- Problem: create_booking_with_cats is SECURITY DEFINER and never checks
-- that the calling session (auth.uid()) matches p_user_id. Because
-- SECURITY DEFINER functions run as the function owner, this bypasses the
-- "Users can insert their own booking" RLS policy on public.bookings
-- (WITH CHECK (auth.uid() = user_id)) entirely -- any authenticated user
-- could create a booking attributed to a different account by passing an
-- arbitrary p_user_id.
--
-- Three overloads of this function currently coexist in the schema (9, 10,
-- and 11 params, from iterative migrations). The app only calls the 11-param
-- version, but the older two remain independently callable and have the
-- same gap -- so they must be dropped, not just left alongside a patched
-- version of the newest one.
--
-- Run this whole file in one go in the Supabase SQL editor. Verification
-- queries are at the bottom (commented out -- run manually, adjust the
-- test UUIDs to real values in your database).
-- ============================================================

-- --- Drop the two stale overloads ---------------------------------------

drop function if exists public.create_booking_with_cats(
  uuid, date, date, cage_type, integer, integer, numeric, uuid[], text
);

drop function if exists public.create_booking_with_cats(
  uuid, date, date, cage_type, integer, integer, numeric, uuid[], text, boolean
);

-- --- Replace the live (11-param) overload with an ownership check -------

CREATE OR REPLACE FUNCTION public.create_booking_with_cats(
  p_user_id uuid,
  p_date_from date,
  p_date_to date,
  p_cage_type cage_type,
  p_cage_count integer,
  p_num_cats integer,
  p_price numeric,
  p_cat_ids uuid[],
  p_special_instructions text DEFAULT NULL::text,
  p_wants_outdoor_cage boolean DEFAULT false,
  p_waitlist_requested boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_booking_id uuid;
begin
  if auth.uid() is null or auth.uid() != p_user_id then
    raise exception 'Unauthorized';
  end if;

  insert into public.bookings (
    user_id, date_from, date_to, cage_type, cage_count, num_cats,
    price, special_instructions, outdoor_cage_requested, waitlist_requested
  )
  values (
    p_user_id, p_date_from, p_date_to, p_cage_type, p_cage_count, p_num_cats,
    p_price, p_special_instructions, p_wants_outdoor_cage, p_waitlist_requested
  )
  returning id into v_booking_id;

  insert into public.booking_cats (booking_id, cat_id)
  select v_booking_id, unnest(p_cat_ids);

  return v_booking_id;
end;
$function$;

-- ============================================================
-- Rollback (restores pre-migration state exactly)
-- ============================================================
-- Re-create the 9-param and 10-param overloads:
--
-- CREATE OR REPLACE FUNCTION public.create_booking_with_cats(p_user_id uuid, p_date_from date, p_date_to date, p_cage_type cage_type, p_cage_count integer, p_num_cats integer, p_price numeric, p_cat_ids uuid[], p_special_instructions text DEFAULT NULL::text)
--  RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
-- declare
--   v_booking_id uuid;
-- begin
--   insert into bookings (user_id, date_from, date_to, cage_type, cage_count, num_cats, price, special_instructions)
--   values (p_user_id, p_date_from, p_date_to, p_cage_type, p_cage_count, p_num_cats, p_price, p_special_instructions)
--   returning id into v_booking_id;
--   insert into booking_cats (booking_id, cat_id) select v_booking_id, unnest(p_cat_ids);
--   return v_booking_id;
-- end;
-- $function$;
--
-- CREATE OR REPLACE FUNCTION public.create_booking_with_cats(p_user_id uuid, p_date_from date, p_date_to date, p_cage_type cage_type, p_cage_count integer, p_num_cats integer, p_price numeric, p_cat_ids uuid[], p_special_instructions text DEFAULT NULL::text, p_wants_outdoor_cage boolean DEFAULT false)
--  RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
-- declare v_booking_id uuid;
-- begin
--   insert into public.bookings (user_id, date_from, date_to, cage_type, cage_count, num_cats, price, special_instructions, wants_outdoor_cage)
--   values (p_user_id, p_date_from, p_date_to, p_cage_type, p_cage_count, p_num_cats, p_price, p_special_instructions, p_wants_outdoor_cage)
--   returning id into v_booking_id;
--   insert into public.booking_cats (booking_id, cat_id) select v_booking_id, unnest(p_cat_ids);
--   return v_booking_id;
-- end;
-- $function$;
--
-- Then restore the 11-param version to its original (no ownership check):
--
-- CREATE OR REPLACE FUNCTION public.create_booking_with_cats(p_user_id uuid, p_date_from date, p_date_to date, p_cage_type cage_type, p_cage_count integer, p_num_cats integer, p_price numeric, p_cat_ids uuid[], p_special_instructions text DEFAULT NULL::text, p_wants_outdoor_cage boolean DEFAULT false, p_waitlist_requested boolean DEFAULT false)
--  RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
-- declare v_booking_id uuid;
-- begin
--   insert into public.bookings (user_id, date_from, date_to, cage_type, cage_count, num_cats, price, special_instructions, outdoor_cage_requested, waitlist_requested)
--   values (p_user_id, p_date_from, p_date_to, p_cage_type, p_cage_count, p_num_cats, p_price, p_special_instructions, p_wants_outdoor_cage, p_waitlist_requested)
--   returning id into v_booking_id;
--   insert into public.booking_cats (booking_id, cat_id) select v_booking_id, unnest(p_cat_ids);
--   return v_booking_id;
-- end;
-- $function$;

-- ============================================================
-- Verification (run manually after applying, with real UUIDs from your DB)
-- ============================================================
-- Should raise "Unauthorized" (mismatched user):
-- select public.create_booking_with_cats(
--   '00000000-0000-0000-0000-000000000000'::uuid, -- some other user's id
--   current_date, current_date + 2, 'standard'::cage_type, 1, 1, 500,
--   array[]::uuid[]
-- );
--
-- Should succeed (run this while authenticated as the matching user, or via
-- `select auth.uid()` to confirm which session you're testing as):
-- select public.create_booking_with_cats(
--   auth.uid(),
--   current_date, current_date + 2, 'standard'::cage_type, 1, 1, 500,
--   array[]::uuid[]
-- );
