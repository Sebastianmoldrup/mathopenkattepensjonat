import { Resend } from 'resend'
import { AdminBooking } from '@/lib/admin/utils'
import {
  bookingConfirmedTemplate,
  bookingCancelledTemplate,
  bookingCancelledByAdminTemplate,
  cancellationFeeReminderTemplate,
  bookingRequestReceivedTemplate,
} from './templates/booking'

const FROM_EMAIL = 'Mathopen Kattepensjonat <post@mathopenkattepensjonat.no>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

export async function sendBookingConfirmedEmail(booking: AdminBooking) {
  const { error } = await getResend().emails.send({
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

export async function sendBookingCancelledEmail(
  booking: AdminBooking,
  feeAmount?: number
) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject: 'Avbestilling bekreftet – Mathopen Kattepensjonat',
    html: bookingCancelledTemplate(booking, feeAmount),
  })
  if (error) {
    console.error('[sendBookingCancelledEmail]', error)
    return { success: false, error }
  }
  return { success: true }
}

export async function sendBookingCancelledByAdminEmail(booking: AdminBooking) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject: 'Avlysning av booking – Mathopen Kattepensjonat',
    html: bookingCancelledByAdminTemplate(booking),
  })
  if (error) {
    console.error('[sendBookingCancelledByAdminEmail]', error)
    return { success: false, error }
  }
  return { success: true }
}

export async function sendCancellationFeeReminderEmail(
  booking: AdminBooking,
  feeAmount: number
) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject:
      'Påminnelse: Utestående avbestillingsgebyr – Mathopen Kattepensjonat',
    html: cancellationFeeReminderTemplate(booking, feeAmount),
  })
  if (error) {
    console.error('[sendCancellationFeeReminderEmail]', error)
    return { success: false, error }
  }
  return { success: true }
}

export async function sendBookingRequestReceivedEmail(booking: AdminBooking) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: booking.user_email,
    subject: '📋 Bookingforespørsel mottatt – Mathopen Kattepensjonat',
    html: bookingRequestReceivedTemplate(booking),
  })
  if (error) {
    console.error('[sendBookingRequestReceivedEmail]', error)
    return { success: false, error }
  }
  return { success: true }
}
