-- ============================================================
-- 002: Add missing is_admin() guard to 4 admin RPCs
-- ============================================================
-- Problem: 35 of 39 admin_* RPCs check is_admin() internally (they're all
-- SECURITY DEFINER, so this internal check is the *only* enforcement --
-- RLS on the underlying tables is bypassed). These 4 were missing it:
--   - admin_get_cage_assignments(p_from date, p_to date)  [the date-range
--     overload -- the p_booking_id overload already has the check]
--   - admin_get_cage_conflicts
--   - admin_get_free_cages
--   - admin_get_unassigned_confirmed
-- Three of them return booking-owner first/last name + cat names; any
-- caller with EXECUTE privilege (default Supabase grant: authenticated,
-- sometimes anon) could pull this data directly via the RPC regardless of
-- their own admin status.
--
-- Fix follows the exact pattern already used by sibling functions in this
-- schema: for LANGUAGE sql functions, add is_admin() as an AND condition in
-- WHERE (returns an empty set for non-admins, not an error -- matches how
-- e.g. admin_get_all_bookings and admin_get_cage_assignments(p_booking_id)
-- already behave).
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_get_cage_assignments(p_from date, p_to date)
 RETURNS TABLE(assignment_id uuid, booking_id uuid, cage_id uuid, cage_label text, cage_section text, date_from date, date_to date, owner_first text, owner_last text, cat_names text, has_note boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT
    ca.id AS assignment_id,
    ca.booking_id,
    ca.cage_id,
    c.label AS cage_label,
    c.section::text AS cage_section,
    ca.date_from,
    ca.date_to,
    u.first_name AS owner_first,
    u.last_name AS owner_last,
    STRING_AGG(cats.name, ', ' ORDER BY cats.name) AS cat_names,
    (ca.notes IS NOT NULL AND ca.notes != '') AS has_note
  FROM public.cage_assignments ca
  JOIN public.cages c ON c.id = ca.cage_id
  JOIN public.bookings b ON b.id = ca.booking_id
  JOIN public.users u ON u.id = b.user_id
  LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id
  LEFT JOIN public.cats ON cats.id = bc.cat_id
  WHERE public.is_admin()
    AND b.status = 'confirmed'
    AND ca.date_from <= p_to
    AND ca.date_to >= p_from
  GROUP BY ca.id, ca.booking_id, ca.cage_id, c.label, c.section, c.number, ca.date_from, ca.date_to, u.first_name, u.last_name, ca.notes
  ORDER BY c.section, c.number, ca.date_from;
$function$;

CREATE OR REPLACE FUNCTION public.admin_get_cage_conflicts(p_cage_id uuid, p_date_from date, p_date_to date)
 RETURNS TABLE(assignment_id uuid, booking_id uuid, conflict_from date, conflict_to date, owner_first text, owner_last text, cat_names text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT
    ca.id AS assignment_id,
    ca.booking_id,
    ca.date_from AS conflict_from,
    ca.date_to AS conflict_to,
    u.first_name AS owner_first,
    u.last_name AS owner_last,
    STRING_AGG(c.name, ', ' ORDER BY c.name) AS cat_names
  FROM public.cage_assignments ca
  JOIN public.bookings b ON b.id = ca.booking_id
  JOIN public.users u ON u.id = b.user_id
  LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id
  LEFT JOIN public.cats c ON c.id = bc.cat_id
  WHERE public.is_admin()
    AND ca.cage_id = p_cage_id
    AND ca.date_from < p_date_to
    AND ca.date_to > p_date_from
    AND b.status = 'confirmed'
  GROUP BY ca.id, ca.booking_id, ca.date_from, ca.date_to, u.first_name, u.last_name
  ORDER BY ca.date_from;
$function$;

CREATE OR REPLACE FUNCTION public.admin_get_free_cages(p_from date, p_to date)
 RETURNS TABLE(cage_id uuid, cage_label text, cage_section text, cage_number integer, is_fully_free boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT
    c.id AS cage_id,
    c.label AS cage_label,
    c.section::text AS cage_section,
    c.number AS cage_number,
    NOT EXISTS (
      SELECT 1 FROM public.cage_assignments ca
      WHERE ca.cage_id = c.id
        AND ca.date_from < p_to
        AND ca.date_to > p_from
    ) AS is_fully_free
  FROM public.cages c
  WHERE public.is_admin()
  ORDER BY c.section, c.number;
$function$;

CREATE OR REPLACE FUNCTION public.admin_get_unassigned_confirmed()
 RETURNS TABLE(booking_id uuid, date_from date, date_to date, owner_first text, owner_last text, cat_names text, cage_type text, num_cats integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT
    b.id AS booking_id,
    b.date_from,
    b.date_to,
    u.first_name AS owner_first,
    u.last_name AS owner_last,
    STRING_AGG(c.name, ', ' ORDER BY c.name) AS cat_names,
    b.cage_type::text,
    b.num_cats
  FROM public.bookings b
  JOIN public.users u ON u.id = b.user_id
  LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id
  LEFT JOIN public.cats c ON c.id = bc.cat_id
  WHERE public.is_admin()
    AND b.status = 'confirmed'
    AND NOT EXISTS (
      SELECT 1 FROM public.cage_assignments ca WHERE ca.booking_id = b.id
    )
  GROUP BY b.id, b.date_from, b.date_to, u.first_name, u.last_name, b.cage_type, b.num_cats
  ORDER BY b.date_from;
$function$;

-- ============================================================
-- Rollback (restores pre-migration state exactly -- removes the
-- public.is_admin() condition from each function, everything else identical)
-- ============================================================
-- CREATE OR REPLACE FUNCTION public.admin_get_cage_assignments(p_from date, p_to date)
--  RETURNS TABLE(assignment_id uuid, booking_id uuid, cage_id uuid, cage_label text, cage_section text, date_from date, date_to date, owner_first text, owner_last text, cat_names text, has_note boolean)
--  LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
--   SELECT ca.id AS assignment_id, ca.booking_id, ca.cage_id, c.label AS cage_label, c.section::text AS cage_section,
--     ca.date_from, ca.date_to, u.first_name AS owner_first, u.last_name AS owner_last,
--     STRING_AGG(cats.name, ', ' ORDER BY cats.name) AS cat_names, (ca.notes IS NOT NULL AND ca.notes != '') AS has_note
--   FROM public.cage_assignments ca JOIN public.cages c ON c.id = ca.cage_id JOIN public.bookings b ON b.id = ca.booking_id
--   JOIN public.users u ON u.id = b.user_id LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id LEFT JOIN public.cats ON cats.id = bc.cat_id
--   WHERE b.status = 'confirmed' AND ca.date_from <= p_to AND ca.date_to >= p_from
--   GROUP BY ca.id, ca.booking_id, ca.cage_id, c.label, c.section, c.number, ca.date_from, ca.date_to, u.first_name, u.last_name, ca.notes
--   ORDER BY c.section, c.number, ca.date_from;
-- $function$;
--
-- CREATE OR REPLACE FUNCTION public.admin_get_cage_conflicts(p_cage_id uuid, p_date_from date, p_date_to date)
--  RETURNS TABLE(assignment_id uuid, booking_id uuid, conflict_from date, conflict_to date, owner_first text, owner_last text, cat_names text)
--  LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
--   SELECT ca.id AS assignment_id, ca.booking_id, ca.date_from AS conflict_from, ca.date_to AS conflict_to,
--     u.first_name AS owner_first, u.last_name AS owner_last, STRING_AGG(c.name, ', ' ORDER BY c.name) AS cat_names
--   FROM public.cage_assignments ca JOIN public.bookings b ON b.id = ca.booking_id JOIN public.users u ON u.id = b.user_id
--   LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id LEFT JOIN public.cats c ON c.id = bc.cat_id
--   WHERE ca.cage_id = p_cage_id AND ca.date_from < p_date_to AND ca.date_to > p_date_from AND b.status = 'confirmed'
--   GROUP BY ca.id, ca.booking_id, ca.date_from, ca.date_to, u.first_name, u.last_name ORDER BY ca.date_from;
-- $function$;
--
-- CREATE OR REPLACE FUNCTION public.admin_get_free_cages(p_from date, p_to date)
--  RETURNS TABLE(cage_id uuid, cage_label text, cage_section text, cage_number integer, is_fully_free boolean)
--  LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
--   SELECT c.id AS cage_id, c.label AS cage_label, c.section::text AS cage_section, c.number AS cage_number,
--     NOT EXISTS (SELECT 1 FROM public.cage_assignments ca WHERE ca.cage_id = c.id AND ca.date_from < p_to AND ca.date_to > p_from) AS is_fully_free
--   FROM public.cages c ORDER BY c.section, c.number;
-- $function$;
--
-- CREATE OR REPLACE FUNCTION public.admin_get_unassigned_confirmed()
--  RETURNS TABLE(booking_id uuid, date_from date, date_to date, owner_first text, owner_last text, cat_names text, cage_type text, num_cats integer)
--  LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
-- AS $function$
--   SELECT b.id AS booking_id, b.date_from, b.date_to, u.first_name AS owner_first, u.last_name AS owner_last,
--     STRING_AGG(c.name, ', ' ORDER BY c.name) AS cat_names, b.cage_type::text, b.num_cats
--   FROM public.bookings b JOIN public.users u ON u.id = b.user_id LEFT JOIN public.booking_cats bc ON bc.booking_id = b.id
--   LEFT JOIN public.cats c ON c.id = bc.cat_id
--   WHERE b.status = 'confirmed' AND NOT EXISTS (SELECT 1 FROM public.cage_assignments ca WHERE ca.booking_id = b.id)
--   GROUP BY b.id, b.date_from, b.date_to, u.first_name, u.last_name, b.cage_type, b.num_cats ORDER BY b.date_from;
-- $function$;

-- ============================================================
-- Verification (run manually after applying)
-- ============================================================
-- As a non-admin authenticated session, all four should return 0 rows (no error):
-- select * from public.admin_get_cage_assignments(current_date, current_date + 30);
-- select * from public.admin_get_cage_conflicts('00000000-0000-0000-0000-000000000000'::uuid, current_date, current_date + 30);
-- select * from public.admin_get_free_cages(current_date, current_date + 30);
-- select * from public.admin_get_unassigned_confirmed();
--
-- As an admin session, confirm rows still return as before.
