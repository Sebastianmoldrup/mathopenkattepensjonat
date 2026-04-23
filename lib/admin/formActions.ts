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
  gets_medication: boolean
  medication_details: string | null
  has_cat_experience: boolean
  gets_along_with_cats: string
  has_stress_issues: boolean
  stress_details: string | null
  aggression_risk: string
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
