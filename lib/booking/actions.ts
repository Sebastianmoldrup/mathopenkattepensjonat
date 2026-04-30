'use server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { Booking, BookingWithCats, Cat } from './types'
import { calculatePriceBreakdown } from './pricing'

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getUser() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

// ─── Cats ─────────────────────────────────────────────────────────────────────

export async function getUserCats(userId: string): Promise<Cat[]> {
  const supabase = await createServerClient()
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

export async function getUpcomingYearBookings(): Promise<BookingWithCats[]> {
  const supabase = createBrowserClient()

  const today = new Date()
  const oneYearAhead = new Date(today)
  oneYearAhead.setFullYear(today.getFullYear() + 1)

  const fromStr = localStr(today)
  const toStr = localStr(oneYearAhead)

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
  }

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

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = createBrowserClient()

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
  const supabase = createBrowserClient()

  const fromStr = localStr(payload.dateFrom)
  const toStr = localStr(payload.dateTo)

  const breakdown = calculatePriceBreakdown(
    payload.cageType,
    payload.cageCount,
    payload.numCats,
    payload.dateFrom,
    payload.dateTo
  )
  const price = breakdown.totalPrice

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

// ─── Email ────────────────────────────────────────────────────────────────────

export async function sendBookingRequestEmail(payload: {
  userEmail: string
  userFirstName: string | null
  catNames: string[]
  dateFrom: string
  dateTo: string
  nights: number
}): Promise<void> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const firstName = payload.userFirstName ?? 'der'
  const catList = payload.catNames.join(', ')

  await resend.emails.send({
    from: 'Mathopen Kattepensjonat <post@mathopenkattepensjonat.no>',
    to: payload.userEmail,
    subject: '📋 Bookingforespørsel mottatt – Mathopen Kattepensjonat',
    html: `<!DOCTYPE html><html lang="no"><head><meta charset="UTF-8" /></head><body style="margin:0;padding:0;background:#f5f0eb;"><div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;"><div style="padding:32px;"><h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName}! 🐾</h2><p style="font-size:15px;color:#444;line-height:1.7;">Takk for at du sendte inn en bookingforespørsel til <strong>Mathopen Kattepensjonat</strong>! Vi er glade for at du vurderer oss for <strong>${catList}</strong>.</p><div style="background:#f9f6f2;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e8e0d8;"><p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Din forespørsel</p><table style="width:100%;border-collapse:collapse;font-size:14px;"><tr><td style="padding:5px 0;color:#666;width:130px;">Katter</td><td style="padding:5px 0;font-weight:bold;">${catList}</td></tr><tr><td style="padding:5px 0;color:#666;">Innsjekk</td><td style="padding:5px 0;font-weight:bold;">${payload.dateFrom}</td></tr><tr><td style="padding:5px 0;color:#666;">Utsjekk</td><td style="padding:5px 0;font-weight:bold;">${payload.dateTo}</td></tr><tr><td style="padding:5px 0;color:#666;">Netter</td><td style="padding:5px 0;font-weight:bold;">${payload.nights} ${payload.nights === 1 ? 'natt' : 'netter'}</td></tr></table></div><div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:14px 20px;border-radius:4px;font-size:14px;margin:0 0 24px;line-height:1.7;color:#78350f;"><p style="margin:0;font-weight:bold;">Dette er en forespørsel — ikke en bekreftet booking</p><p style="margin:8px 0 0;">Vi behandler forespørsler fortløpende. Du vil høre fra oss innen <strong>3 arbeidsdager</strong>.</p></div><p style="font-size:14px;color:#555;">Spørsmål? <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a> eller <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>.</p></div><div style="background:#c8b49a;padding:24px 32px;"><table style="width:100%;border-collapse:collapse;margin-bottom:14px;"><tr><td style="vertical-align:middle;width:108px;"><img src="https://cccacsaixeqraulymlwo.supabase.co/storage/v1/object/public/logo/logo.webp" alt="Mathopen Kattepensjonat" width="100" height="100" style="display:block;border-radius:12px;object-fit:cover;" /></td><td style="vertical-align:middle;padding-left:18px;"><p style="margin:0 0 4px;font-size:17px;font-weight:bold;color:#fff;">Mathopen Kattepensjonat AS</p><p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);font-style:italic;">Det trygge hjemmet mens du er bortreist</p></td></tr></table><table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.25);padding-top:14px;margin-top:14px;"><tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">📞 <a href="tel:+4747322279" style="color:#fff;text-decoration:none;">+47 473 22 279</a></td></tr><tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">🏠 Storingavika 2, 5174 Mathopen</td></tr><tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">🌐 <a href="https://mathopenkattepensjonat.no" style="color:#fff;text-decoration:none;">mathopenkattepensjonat.no</a></td></tr><tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">✉️ <a href="mailto:post@mathopenkattepensjonat.no" style="color:#fff;text-decoration:none;">post@mathopenkattepensjonat.no</a></td></tr></table></div></div></body></html>`,
  })
}
