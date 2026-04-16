'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateCancellationFee } from '@/lib/booking/cancellation'
import { sendBookingCancelledEmail } from '@/lib/email/resend'

export async function cancelBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string; feeAmount?: number }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget.' }

  // Fetch booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, user_id, status, date_from, date_to, price')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking)
    return { success: false, error: 'Booking ikke funnet.' }
  if (booking.user_id !== user.id)
    return { success: false, error: 'Ingen tilgang.' }

  // Calculate fee
  const feeResult = calculateCancellationFee(booking.date_from, booking.price)

  // Cancel via RPC
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

  // Fetch cat names for email
  const { data: catRows } = await supabase
    .from('booking_cats')
    .select('cats(name)')
    .eq('booking_id', bookingId)

  const catNames = (catRows ?? [])
    .map((row: any) => row.cats?.name)
    .filter(Boolean) as string[]

  // Fetch user profile for name (email comes from auth user)
  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  // Build email object — use auth user email which is always present
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

  console.log(
    '[cancelBooking] sending email to:',
    user.email,
    'cats:',
    catNames
  )

  const emailResult = await sendBookingCancelledEmail(
    bookingForEmail,
    feeResult.hasFee ? feeResult.feeAmount : 0
  )

  if (!emailResult.success) {
    console.error('[cancelBooking] email failed:', emailResult.error)
    // Don't fail the cancellation if email fails — booking is already cancelled
  }

  revalidatePath('/minside/bookinger')
  revalidatePath('/minside')

  return {
    success: true,
    feeAmount: feeResult.hasFee ? feeResult.feeAmount : 0,
  }
}
