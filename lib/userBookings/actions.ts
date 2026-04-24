'use server'

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
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget.' }

  // Verify ownership before updating
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, user_id, status, date_from')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) {
    return { success: false, error: 'Booking ikke funnet.' }
  }

  if (booking.user_id !== user.id) {
    return { success: false, error: 'Ingen tilgang.' }
  }

  if (booking.status === 'cancelled') {
    return { success: false, error: 'Bookingen er allerede avbestilt.' }
  }

  if (booking.status === 'completed') {
    return {
      success: false,
      error: 'Fullførte bookinger kan ikke avbestilles.',
    }
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', user.id) // double-check via RLS

  if (updateError) {
    console.error('[cancelBooking]', updateError.message)
    return {
      success: false,
      error: 'Kunne ikke avbestille bookingen. Prøv igjen.',
    }
  }

  revalidatePath('/minside/bookinger')
  revalidatePath('/minside')

  return { success: true }
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export interface UserWaitlistEntry {
  id: string
  date_from: string
  date_to: string
  num_cats: number
  cage_type: string | null
  cage_count: number
  special_instructions: string | null
  status: string
  created_at: string
}

export async function getUserWaitlistEntries(): Promise<UserWaitlistEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('waitlist')
    .select(
      'id, date_from, date_to, num_cats, cage_type, cage_count, special_instructions, status, created_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getUserWaitlistEntries]', error.message)
    return []
  }

  return data ?? []
}

export async function cancelWaitlistEntry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('waitlist')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) {
    console.error('[cancelWaitlistEntry]', error.message)
    return {
      success: false,
      error: 'Kunne ikke kansellere ventelisteregistrering.',
    }
  }

  revalidatePath('/minside/bookinger')
  revalidatePath('/minside')
  return { success: true }
}
