import { Resend } from 'resend'
import { AdminBooking } from '@/lib/admin/utils'
import {
  bookingConfirmedTemplate,
  bookingCancelledTemplate,
} from './templates/booking'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Mathopen Kattepensjonat <post@mathopenkattepensjonat.no>'

export async function sendBookingConfirmedEmail(booking: AdminBooking) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject: '✅ Booking bekreftet – Mathopen Kattepensjonat',
    html: bookingConfirmedTemplate(booking),
  })

  if (error) {
    console.error('[sendBookingConfirmedEmail]', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function sendBookingCancelledEmail(booking: AdminBooking) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject: '❌ Booking avbestilt – Mathopen Kattepensjonat',
    html: bookingCancelledTemplate(booking),
  })

  if (error) {
    console.error('[sendBookingCancelledEmail]', error)
    return { success: false, error }
  }

  return { success: true }
}
