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

import { sendBookingWaitlistEmail } from '@/lib/email/resend'

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
  const { data: catRows, error: catError } = await supabase
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

  switch (status) {
    case 'cancelled': {
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
      break
    }

    case 'waitlist': {
      const { error } = await supabase.rpc('admin_update_booking_status', {
        p_booking_id: bookingId,
        p_status: status,
      })
      if (error) {
        console.error('[adminUpdateBookingStatus waitlist]', error.message)
        return { success: false, error: 'Kunne ikke oppdatere status.' }
      }
      await sendBookingWaitlistEmail({ ...booking, status })
      break
    }

    case 'confirmed': {
      const { error } = await supabase.rpc('admin_update_booking_status', {
        p_booking_id: bookingId,
        p_status: status,
      })
      if (error) {
        console.error('[adminUpdateBookingStatus confirmed]', error.message)
        return { success: false, error: 'Kunne ikke oppdatere status.' }
      }
      await sendBookingConfirmedEmail({ ...booking, status })
      break
    }

    default: {
      const { error } = await supabase.rpc('admin_update_booking_status', {
        p_booking_id: bookingId,
        p_status: status,
      })
      if (error) {
        console.error('[adminUpdateBookingStatus]', error.message)
        return { success: false, error: 'Kunne ikke oppdatere status.' }
      }
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

// ─── Update booking details ────────────────────────────────────────────────────

import { sendBookingUpdatedEmail } from '@/lib/email/resend'

export async function adminUpdateBookingDetails(
  bookingId: string,
  details: {
    date_from: string
    date_to: string
    cage_type: string
    cage_count: number
    price: number
    wants_outdoor_cage: boolean
    special_instructions: string | null
  },
  existingBooking: AdminBooking
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_update_booking_details', {
    p_booking_id: bookingId,
    p_date_from: details.date_from,
    p_date_to: details.date_to,
    p_cage_type: details.cage_type,
    p_cage_count: details.cage_count,
    p_price: details.price,
    p_wants_outdoor_cage: details.wants_outdoor_cage,
    p_special_instructions: details.special_instructions,
  })

  if (error) {
    console.error('[adminUpdateBookingDetails]', error.message)
    return { success: false, error: 'Kunne ikke oppdatere booking.' }
  }

  // Send email only if dates or price changed
  const dateChanged =
    details.date_from !== existingBooking.date_from ||
    details.date_to !== existingBooking.date_to
  const priceChanged = details.price !== existingBooking.price

  if (dateChanged || priceChanged) {
    await sendBookingUpdatedEmail(
      { ...existingBooking, ...details },
      {
        dateChanged,
        priceChanged,
        oldDateFrom: existingBooking.date_from,
        oldDateTo: existingBooking.date_to,
        oldPrice: existingBooking.price,
      }
    )
  }

  revalidatePath('/admin/bookinger')
  revalidatePath('/admin')
  return { success: true }
}

// ─── Checkin/Checkout ─────────────────────────────────────────────────────────

export interface CheckinCheckoutEntry {
  booking_id: string
  event_type: 'checkin' | 'checkout'
  date_from: string
  date_to: string
  owner_first: string | null
  owner_last: string | null
  owner_email: string
  owner_phone: string | null
  cat_names: string | null
  cage_type: string
  cage_count: number
  num_cats: number
  special_instructions: string | null
  wants_outdoor_cage: boolean
  admin_notes: string | null
  is_checked_in: boolean
  is_checked_out: boolean
  checked_in_at: string | null
  checked_out_at: string | null
  checked_in_by: string | null
  checked_out_by: string | null
  label_printed: boolean
  cage_assignments: { cage_label: string; date_from: string; date_to: string }[]
}

export async function adminGetCheckinCheckoutByDate(
  date: string
): Promise<CheckinCheckoutEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc(
    'admin_get_checkin_checkout_by_date',
    { p_date: date }
  )
  if (error) {
    console.error('[adminGetCheckinCheckoutByDate]', error.message)
    return []
  }
  return (data ?? []) as CheckinCheckoutEntry[]
}

export async function adminGetCheckinCheckoutLog(bookingId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_checkin_checkout_log', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminGetCheckinCheckoutLog]', error.message)
    return null
  }
  return data?.[0] ?? null
}

export async function adminUpsertCheckin(
  bookingId: string,
  checklist: Record<string, boolean | string>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_upsert_checkin', {
    p_booking_id: bookingId,
    p_checklist: checklist,
  })
  if (error) {
    console.error('[adminUpsertCheckin]', error.message)
    return { success: false, error: 'Kunne ikke lagre innsjekk.' }
  }
  return { success: true }
}

export async function adminUpsertCheckout(
  bookingId: string,
  checklist: Record<string, boolean | string>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_upsert_checkout', {
    p_booking_id: bookingId,
    p_checklist: checklist,
  })
  if (error) {
    console.error('[adminUpsertCheckout]', error.message)
    return { success: false, error: 'Kunne ikke lagre utsjekk.' }
  }
  return { success: true }
}

// ─── Printing ─────────────────────────────────────────────────────────

export interface BookingLabelCat {
  name: string
  image_url: string | null
  id_chip: string | null
  insurance_number: string | null
  gets_medication: boolean | null
  medication_details: string | null
  diet: string | null
}

export interface BookingLabelData {
  booking: {
    id: string
    date_from: string
    date_to: string
    label_printed: boolean
  }
  owner: {
    first_name: string | null
    last_name: string | null
    phone: string | null
    emergency_contact: string | null
  }
  cats: BookingLabelCat[]
}

export async function adminGetBookingLabelData(
  bookingId: string
): Promise<BookingLabelData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_booking_label_data', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminGetBookingLabelData]', error.message)
    return null
  }
  return data as BookingLabelData
}

export async function adminGetDailyLabelData(
  date: string
): Promise<BookingLabelData[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_daily_label_data', {
    p_date: date,
  })
  if (error) {
    console.error('[adminGetDailyLabelData]', error.message)
    return []
  }
  return (data ?? []) as BookingLabelData[]
}

export async function adminMarkLabelPrinted(bookingId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_mark_label_printed', {
    p_booking_id: bookingId,
  })
  if (error) {
    console.error('[adminMarkLabelPrinted]', error.message)
  }
}

