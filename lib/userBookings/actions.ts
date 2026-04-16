'use server'

import { calculateCancellationFee } from '@/lib/booking/cancellation'
import { sendBookingCancelledEmail } from '@/lib/email/resend'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { BookingStatus, UserBooking } from './utils'

// ─── Fetch user bookings ───────────────────────────────────────────────────────

export async function getUserBookingsWithCats(): Promise<UserBooking[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      date_from,
      date_to,
      cage_type,
      cage_count,
      num_cats,
      price,
      status,
      special_instructions,
      created_at,
      booking_cats (
        cats (
          id,
          name,
          image_url,
          breed
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('date_from', { ascending: false })

  if (error) {
    console.error('[getUserBookingsWithCats]', error.message)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    date_from: row.date_from,
    date_to: row.date_to,
    cage_type: row.cage_type,
    cage_count: row.cage_count,
    num_cats: row.num_cats,
    price: row.price,
    status: row.status as BookingStatus,
    special_instructions: row.special_instructions,
    created_at: row.created_at,
    cats: (row.booking_cats ?? []).map((bc: any) => bc.cats).filter(Boolean),
  }))
}

// ─── Cancel booking ───────────────────────────────────────────────────────────

export async function cancelBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string; feeAmount?: number }> {
  console.log('[cancelBooking] called with bookingId:', bookingId) // ← legg til denne
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget.' }

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, user_id, status, date_from, date_to, price')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking)
    return { success: false, error: 'Booking ikke funnet.' }
  if (booking.user_id !== user.id)
    return { success: false, error: 'Ingen tilgang.' }

  const feeResult = calculateCancellationFee(booking.date_from, booking.price)

  const { error: cancelError } = await supabase.rpc(
    'customer_cancel_booking_with_fee',
    {
      p_booking_id: bookingId,
      p_cancellation_fee: feeResult.hasFee ? feeResult.feeAmount : null,
    }
  )

  if (cancelError) {
    console.error('[cancelBooking]', cancelError.message)
    return {
      success: false,
      error: 'Kunne ikke avbestille bookingen. Prøv igjen.',
    }
  }

  const { data: catRows } = await supabase
    .from('booking_cats')
    .select('cats(name)')
    .eq('booking_id', bookingId)

  const catNames = (catRows ?? [])
    .map((row: any) => row.cats?.name)
    .filter(Boolean) as string[]

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', user.id)
    .maybeSingle()

  const bookingForEmail = {
    id: booking.id,
    date_from: booking.date_from,
    date_to: booking.date_to,
    price: booking.price,
    user_email: user.email!,
    user_first_name: profile?.first_name ?? null,
    user_last_name: profile?.last_name ?? null,
    cats: catNames.map((name) => ({ name })),
  } as any

  const emailResult = await sendBookingCancelledEmail(
    bookingForEmail,
    feeResult.hasFee ? feeResult.feeAmount : 0
  )

  if (!emailResult.success) {
    console.error('[cancelBooking] email failed:', emailResult.error)
  }

  revalidatePath('/minside/bookinger')
  revalidatePath('/minside')

  return {
    success: true,
    feeAmount: feeResult.hasFee ? feeResult.feeAmount : 0,
  }
}
