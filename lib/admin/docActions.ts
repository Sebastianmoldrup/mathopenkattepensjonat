'use server'

import { createClient } from '@/lib/supabase/server'
import { BookingDocumentation, BulkBookingEntry } from './docTypes'

export async function adminGetBookingDocumentation(
  bookingId: string
): Promise<BookingDocumentation | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc(
    'admin_get_booking_documentation',
    {
      p_booking_id: bookingId,
    }
  )
  if (error) {
    console.error('[adminGetBookingDocumentation]', error.message)
    return null
  }
  return data as BookingDocumentation
}

export async function adminGetBookingsForYear(
  year: number
): Promise<BulkBookingEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_bookings_for_year', {
    p_year: year,
  })
  if (error) {
    console.error('[adminGetBookingsForYear]', error.message)
    return []
  }
  return (data as BulkBookingEntry[]) ?? []
}
