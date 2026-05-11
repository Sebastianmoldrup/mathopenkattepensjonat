'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DailyRoutine, CheckinLog, HealthLog, RoutinePeriod } from './formTypes'

// ─── Daily Routines ───────────────────────────────────────────────────────────

export async function adminGetDailyRoutines(
  from?: string,
  to?: string
): Promise<DailyRoutine[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_daily_routines', {
    p_from: from,
    p_to: to,
  })
  if (error) {
    console.error('[adminGetDailyRoutines]', error.message)
    return []
  }
  return data ?? []
}

export async function adminUpsertDailyRoutine(
  date: string,
  period: RoutinePeriod,
  fields: Record<string, boolean | string | null>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_upsert_daily_routine', {
    p_date: date,
    p_period: period,
    p_data: fields,
  })
  if (error) {
    console.error('[adminUpsertDailyRoutine]', error.message)
    return { success: false, error: 'Kunne ikke lagre rutine.' }
  }
  revalidatePath('/admin/sjekkliste')
  return { success: true }
}

// ─── Checkin / Checkout ───────────────────────────────────────────────────────

export async function adminGetCheckinLog(
  bookingId: string
): Promise<CheckinLog | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_checkin_log', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminGetCheckinLog]', error.message)
    return null
  }
  return data?.[0] ?? null
}

export async function adminUpsertCheckinLog(
  bookingId: string,
  fields: Record<string, boolean | string | null>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_upsert_checkin_log', {
    p_booking_id: bookingId,
    p_data: fields,
  })
  if (error) {
    console.error('[adminUpsertCheckinLog]', error.message)
    return { success: false, error: 'Kunne ikke lagre innsjekk/utsjekk.' }
  }
  revalidatePath('/admin/bookinger')
  return { success: true }
}

// ─── Health Logs ──────────────────────────────────────────────────────────────

export async function adminGetHealthLogs(
  bookingId: string
): Promise<HealthLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_health_logs', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminGetHealthLogs]', error.message)
    return []
  }
  return data ?? []
}

export async function adminInsertHealthLog(
  fields: Record<string, boolean | string | null>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_insert_health_log', {
    p_data: fields,
  })
  if (error) {
    console.error('[adminInsertHealthLog]', error.message)
    return { success: false, error: 'Kunne ikke lagre helselogg.' }
  }
  revalidatePath('/admin/bookinger')
  return { success: true }
}

// ─── Cat Behavior Notes ────────────────────────────────────────────────────────

export interface CatBehaviorNote {
  id: string
  cat_id: string
  cat_name: string
  cat_breed: string | null
  cat_age: string | null
  cat_gender: string | null
  cat_image_url: string | null
  is_sterilized: boolean | null
  id_chip: string | null
  last_vaccine_date: string | null
  deworming_info: string | null
  flea_treatment_info: string | null
  medical_notes: string | null
  diet: string | null
  behavior_notes: string | null
  gets_medication: boolean | null
  medication_details: string | null
  has_cat_experience: boolean | null
  gets_along_with_cats: string | null
  has_stress_issues: boolean | null
  stress_details: string | null
  aggression_risk: string | null
  aggression_details: string | null
}

export async function adminGetCatBehaviorNotes(
  bookingId: string
): Promise<CatBehaviorNote[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_cat_behavior_notes', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminGetCatBehaviorNotes]', error.message)
    return []
  }
  return data ?? []
}
