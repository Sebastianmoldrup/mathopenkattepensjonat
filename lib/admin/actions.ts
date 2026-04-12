'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  AdminBooking,
  AdminBookingStatus,
  DailyChecklist,
  RevenueStats,
} from './utils'
import {
  sendBookingConfirmedEmail,
  sendBookingCancelledEmail,
} from '@/lib/email/resend'

// ─── Auth guard ────────────────────────────────────────────────────────────────

export async function requireAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('is_admin')
  if (!data) redirect('/admin/login')
}

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('is_admin')
  return !!data
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function adminGetAllBookings(): Promise<AdminBooking[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('admin_get_all_bookings')

  if (error) {
    console.error('[adminGetAllBookings]', error.message)
    return []
  }

  // Fetch cats for each booking
  const bookingIds = (data ?? []).map((b: any) => b.id)
  const { data: catRows } = await supabase
    .from('booking_cats')
    .select(
      'booking_id, cats(id, name, breed, image_url, medical_notes, diet, behavior_notes)'
    )
    .in('booking_id', bookingIds)

  const catMap = new Map<string, any[]>()
  for (const row of catRows ?? []) {
    if (!catMap.has(row.booking_id)) catMap.set(row.booking_id, [])
    if (row.cats) catMap.get(row.booking_id)!.push(row.cats)
  }

  return (data ?? []).map((row: any) => ({
    ...row,
    cats: catMap.get(row.id) ?? [],
  }))
}

// ─── Update booking status ─────────────────────────────────────────────────────

export async function adminUpdateBookingStatus(
  bookingId: string,
  status: AdminBookingStatus,
  booking: AdminBooking
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_update_booking_status', {
    p_booking_id: bookingId,
    p_status: status,
  })

  if (error) {
    console.error('[adminUpdateBookingStatus]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere status.' }
  }

  // Send email on confirm or cancel
  if (status === 'confirmed') {
    await sendBookingConfirmedEmail({ ...booking, status })
  } else if (status === 'cancelled') {
    await sendBookingCancelledEmail({ ...booking, status })
  }

  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')

  return { success: true }
}

// ─── Update admin notes ────────────────────────────────────────────────────────

export async function adminUpdateBookingNotes(
  bookingId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_update_booking_notes', {
    p_booking_id: bookingId,
    p_notes: notes,
  })

  if (error) {
    console.error('[adminUpdateBookingNotes]', error.message)
    return { success: false, error: 'Kunne ikke lagre notat.' }
  }

  revalidatePath('/admin/bookinger')
  return { success: true }
}

// ─── Checklists ────────────────────────────────────────────────────────────────

export async function adminGetChecklists(
  from?: string,
  to?: string
): Promise<DailyChecklist[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('admin_get_checklists', {
    p_from: from,
    p_to: to,
  })

  if (error) {
    console.error('[adminGetChecklists]', error.message)
    return []
  }

  return data ?? []
}

export async function adminUpsertChecklist(
  date: string,
  fields: {
    feeding_done: boolean
    medication_done: boolean
    litter_cleaned: boolean
    cage_inspection_done: boolean
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_upsert_checklist', {
    p_date: date,
    p_feeding_done: fields.feeding_done,
    p_medication_done: fields.medication_done,
    p_litter_cleaned: fields.litter_cleaned,
    p_cage_inspection_done: fields.cage_inspection_done,
    p_notes: fields.notes ?? null,
  })

  if (error) {
    console.error('[adminUpsertChecklist]', error.message)
    return { success: false, error: 'Kunne ikke lagre sjekkliste.' }
  }

  revalidatePath('/admin/sjekkliste')
  return { success: true }
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export async function adminGetRevenueStats(): Promise<RevenueStats[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('admin_get_revenue_stats')

  if (error) {
    console.error('[adminGetRevenueStats]', error.message)
    return []
  }

  return data ?? []
}

export async function adminGetOccupancyData(): Promise<AdminBooking[]> {
  return adminGetAllBookings()
}
