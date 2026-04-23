import { createClient } from '@/lib/supabase/client' // adjust to your supabase client path
import { Booking, BookingWithCats, Cat } from './types'
import { calculatePriceBreakdown } from './pricing'

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

// ─── Cats ─────────────────────────────────────────────────────────────────────

export async function getUserCats(userId: string): Promise<Cat[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cats')
    .select('id, name, breed, gender, age, image_url, owner_id')
    .eq('owner_id', userId)
    .order('name', { ascending: true })

  if (error) {
    console.error('[getUserCats]', error.message)
    return []
  }

  return data ?? []
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

/**
 * Fetches all bookings (with their cat IDs) that overlap the next 12 months.
 * Uses a security definer RPC function to bypass RLS for availability checks —
 * users can only see their own bookings directly, but availability requires
 * reading all bookings to count cage usage.
 */
export async function getUpcomingYearBookings(): Promise<BookingWithCats[]> {
  const supabase = createClient()

  const today = new Date()
  const oneYearAhead = new Date(today)
  oneYearAhead.setFullYear(today.getFullYear() + 1)

  const fromStr = localStr(today)
  const toStr = localStr(oneYearAhead)

  // Step 1: fetch all bookings via security definer function (bypasses RLS)
  const { data: bookingRows, error: bookingError } = await supabase.rpc(
    'get_bookings_for_availability',
    {
      from_date: fromStr,
      to_date: toStr,
    }
  )

  if (bookingError) {
    console.error('[getUpcomingYearBookings] rpc error:', bookingError.message)
    return []
  }

  if (!bookingRows || bookingRows.length === 0) return []

  // Step 2: fetch booking_cats for these bookings to get cat IDs
  // (only needed for cat conflict checks — uses current user's RLS context)
  const bookingIds = bookingRows.map((r: any) => r.id)

  const { data: catRows, error: catError } = await supabase
    .from('booking_cats')
    .select('booking_id, cat_id')
    .in('booking_id', bookingIds)

  if (catError) {
    console.error(
      '[getUpcomingYearBookings] booking_cats error:',
      catError.message
    )
    // Still return bookings without cat data — cage availability still works
  }

  // Build a map of booking_id → cat_ids
  const catMap = new Map<string, string[]>()
  for (const row of catRows ?? []) {
    if (!catMap.has(row.booking_id)) catMap.set(row.booking_id, [])
    catMap.get(row.booking_id)!.push(row.cat_id)
  }

  return bookingRows.map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    date_from: row.date_from,
    date_to: row.date_to,
    cage_type: row.cage_type,
    cage_count: row.cage_count,
    num_cats: row.num_cats,
    price: row.price,
    special_instructions: row.special_instructions,
    created_at: row.created_at,
    cat_ids: catMap.get(row.id) ?? [],
  }))
}

/**
 * Fetches all bookings for the current user.
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, user_id, date_from, date_to, cage_type, cage_count, num_cats, price, special_instructions, created_at'
    )
    .eq('user_id', userId)
    .order('date_from', { ascending: false })

  if (error) {
    console.error('[getUserBookings]', error.message)
    return []
  }

  return data ?? []
}

// ─── Create Booking ───────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  userId: string
  catIds: string[]
  dateFrom: Date
  dateTo: Date
  cageType: import('./types').CageType
  cageCount: number
  numCats: number
  specialInstructions?: string
  wantsOutdoorCage?: boolean
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<{ id: string } | { error: string }> {
  const supabase = createClient()

  const fromStr = localStr(payload.dateFrom)
  const toStr = localStr(payload.dateTo)

  // Server side price calculation
  const breakdown = calculatePriceBreakdown(
    payload.cageType,
    payload.cageCount,
    payload.numCats,
    payload.dateFrom,
    payload.dateTo
  )
  const price = breakdown.totalPrice

  // Check for cat booking dates conflict
  const { data: hasConflict, error: conflictError } = await supabase.rpc(
    'check_cat_conflict',
    {
      cat_ids: payload.catIds,
      from_date: fromStr,
      to_date: toStr,
    }
  )

  if (conflictError) {
    return { error: 'Kunne ikke verifisere tilgjengelighet. Prøv igjen.' }
  }

  if (hasConflict) {
    return {
      error:
        'En eller flere av kattene er allerede booket i denne perioden. Velg andre datoer.',
    }
  }

  // Check for cage availability
  const { data: cageAvailable, error: cageError } = await supabase.rpc(
    'check_cage_availability',
    {
      p_cage_type: payload.cageType,
      p_cage_count: payload.cageCount,
      p_date_from: fromStr,
      p_date_to: toStr,
    }
  )

  if (cageError) {
    return { error: 'Kunne ikke verifisere burstilgjengelighet. Prøv igjen.' }
  }

  if (!cageAvailable) {
    return {
      error:
        'Beklager, dette buret er ikke lenger tilgjengelig. Velg en annen periode.',
    }
  }

  // Atomic insert via transaction RPC
  const { data: bookingId, error: insertError } = await supabase.rpc(
    'create_booking_with_cats',
    {
      p_user_id: payload.userId,
      p_date_from: fromStr,
      p_date_to: toStr,
      p_cage_type: payload.cageType,
      p_cage_count: payload.cageCount,
      p_num_cats: payload.numCats,
      p_price: price,
      p_cat_ids: payload.catIds,
      p_special_instructions: payload.specialInstructions ?? null,
      p_wants_outdoor_cage: payload.wantsOutdoorCage ?? false,
    }
  )

  if (insertError || !bookingId) {
    console.error('[createBooking] insert failed:', insertError?.message)
    return { error: 'Kunne ikke opprette booking. Prøv igjen.' }
  }

  return { id: bookingId }
}
