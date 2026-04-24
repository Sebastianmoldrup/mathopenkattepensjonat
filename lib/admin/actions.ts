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
  sendBookingCancelledByAdminEmail,
  sendCancellationFeeReminderEmail,
} from '@/lib/email/resend'
import { calculatePriceBreakdown } from '@/lib/booking/pricing'
import { CageType } from '@/lib/booking/types'

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
      'booking_id, cats(id, name, breed, image_url, medical_notes, diet, behavior_notes, age)'
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

  if (status === 'cancelled') {
    // Admin cancels — use dedicated RPC (no fee by default)
    const { error } = await supabase.rpc('admin_cancel_booking', {
      p_booking_id: bookingId,
      p_cancellation_fee: null,
      p_note: null,
    })
    if (error) {
      console.error('[adminUpdateBookingStatus cancel]', error.message)
      return { success: false, error: 'Kunne ikke avbestille booking.' }
    }
    await sendBookingCancelledByAdminEmail({ ...booking, status })
  } else {
    const { error } = await supabase.rpc('admin_update_booking_status', {
      p_booking_id: bookingId,
      p_status: status,
    })
    if (error) {
      console.error('[adminUpdateBookingStatus]', error.message)
      return { success: false, error: 'Kunne ikke oppdatere status.' }
    }
    if (status === 'confirmed') {
      await sendBookingConfirmedEmail({ ...booking, status })
    }
  }

  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')
  revalidatePath('/admin/avbestillinger')

  return { success: true }
}

// ─── Update fee status ─────────────────────────────────────────────────────────

export async function adminUpdateFeeStatus(
  bookingId: string,
  feePaid: boolean,
  cancellationFee?: number,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_update_fee_status', {
    p_booking_id: bookingId,
    p_fee_paid: feePaid,
    p_cancellation_fee: cancellationFee ?? null,
    p_note: note ?? null,
  })

  if (error) {
    console.error('[adminUpdateFeeStatus]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere gebyrstatus.' }
  }

  revalidatePath('/admin/avbestillinger')
  return { success: true }
}

// ─── Get cancellations ─────────────────────────────────────────────────────────

export interface CancellationEntry {
  id: string
  date_from: string
  date_to: string
  price: number
  cancelled_by: string | null
  cancellation_fee: number | null
  fee_paid: boolean
  cancellation_note: string | null
  created_at: string
  user_email: string
  user_first_name: string | null
  user_last_name: string | null
  user_phone: string | null
  cat_names: string | null
}

export async function adminGetCancellations(): Promise<CancellationEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_cancellations')
  if (error) {
    console.error('[adminGetCancellations]', error.message)
    return []
  }
  return data ?? []
}

// ─── Send fee reminder ─────────────────────────────────────────────────────────

export async function adminSendFeeReminder(
  booking: AdminBooking,
  feeAmount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendCancellationFeeReminderEmail(booking, feeAmount)
    return { success: true }
  } catch (e) {
    console.error('[adminSendFeeReminder]', e)
    return { success: false, error: 'Kunne ikke sende påminnelse.' }
  }
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

// ─── Update cage ───────────────────────────────────────────────────────────────

export async function adminUpdateBookingCage(
  bookingId: string,
  cageType: string,
  cageCount: number,
  price: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_update_booking_cage', {
    p_booking_id: bookingId,
    p_cage_type: cageType,
    p_cage_count: cageCount,
    p_price: price,
  })

  if (error) {
    console.error('[adminUpdateBookingCage]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere bur.' }
  }

  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')
  return { success: true }
}

// ─── Delete booking ────────────────────────────────────────────────────────────

export async function adminDeleteBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_delete_booking', {
    p_booking_id: bookingId,
  })

  if (error) {
    console.error('[adminDeleteBooking]', error.message)
    return { success: false, error: 'Kunne ikke slette booking.' }
  }

  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')
  return { success: true }
}

// ─── Customers ─────────────────────────────────────────────────────────────────

export interface CustomerEntry {
  user_id: string
  user_email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  address: string | null
  emergency_contact: string | null
  booking_count: number
  last_booking: string | null
  cat_names: string | null
}

export async function adminGetCustomers(): Promise<CustomerEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_customers')
  if (error) {
    console.error('[adminGetCustomers]', error.message)
    return []
  }
  return data ?? []
}

// ─── Waitlist ──────────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string
  date_from: string
  date_to: string
  num_cats: number
  special_instructions: string | null
  priority: number
  status: string
  admin_notes: string | null
  created_at: string
  user_id: string
  user_email: string
  user_first_name: string | null
  user_last_name: string | null
  user_phone: string | null
}

export async function adminGetWaitlist(): Promise<WaitlistEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_waitlist')
  if (error) {
    console.error('[adminGetWaitlist]', error.message)
    return []
  }
  return data ?? []
}

export async function adminUpdateWaitlistStatus(
  id: string,
  status: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_update_waitlist_status', {
    p_id: id,
    p_status: status,
    p_notes: notes ?? null,
  })
  if (error) {
    console.error('[adminUpdateWaitlistStatus]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere.' }
  }
  revalidatePath('/admin/venteliste')
  return { success: true }
}

export async function adminUpdateWaitlistPriority(
  id: string,
  priority: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_update_waitlist_priority', {
    p_id: id,
    p_priority: priority,
  })
  if (error) {
    console.error('[adminUpdateWaitlistPriority]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere prioritet.' }
  }
  revalidatePath('/admin/venteliste')
  return { success: true }
}

// ─── Waitlist to Bookings ──────────────────────────────────────────────────────────────────

export async function adminConvertWaitlistToBooking(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: entry, error: fetchError } = await supabase
    .from('waitlist')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !entry) {
    return { success: false, error: 'Kunne ikke hente ventelistedata.' }
  }

  const breakdown = calculatePriceBreakdown(
    (entry.cage_type ?? 'standard') as CageType,
    entry.cage_count ?? 1,
    entry.num_cats,
    new Date(entry.date_from),
    new Date(entry.date_to)
  )

  const { error } = await supabase.rpc('admin_convert_waitlist_to_booking', {
    p_waitlist_id: id,
    p_price: breakdown.totalPrice,
  })

  if (error) {
    console.error('[adminConvertWaitlistToBooking]', error.message)
    return { success: false, error: 'Kunne ikke konvertere til booking.' }
  }

  revalidatePath('/admin/venteliste')
  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')
  return { success: true }
}
