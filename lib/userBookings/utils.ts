import { getSeason } from '@/lib/booking/pricing'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingCat {
  id: string
  name: string
  image_url: string | null
  breed: string | null
}

export interface UserBooking {
  id: string
  date_from: string
  date_to: string
  cage_type: string
  cage_count: number
  num_cats: number
  price: number
  status: BookingStatus
  special_instructions: string | null
  created_at: string
  cats: BookingCat[]
}

// ─── Cancellation policy ───────────────────────────────────────────────────────
// Low season:  cancel up to 24 hours before check-in
// High season: cancel up to 7 days before check-in
// After deadline: 50% charge applies — cancellation must be done via email

const LOW_SEASON_HOURS = 24
const HIGH_SEASON_DAYS = 7

export interface CancellationEligibility {
  canCancel: boolean
  // If false — why not
  reason:
    | 'already_cancelled'
    | 'completed'
    | 'past_deadline'
    | 'not_cancellable'
    | null
  // If past deadline, show the 50% charge warning
  pastDeadline: boolean
  // The actual deadline date for display
  deadline: Date | null
  // Season that applies to this booking
  season: 'low' | 'high'
}

export function getCancellationEligibility(
  status: BookingStatus,
  dateFrom: string, // YYYY-MM-DD
  now: Date = new Date()
): CancellationEligibility {
  if (status === 'cancelled') {
    return {
      canCancel: false,
      reason: 'already_cancelled',
      pastDeadline: false,
      deadline: null,
      season: 'low',
    }
  }
  if (status === 'completed') {
    return {
      canCancel: false,
      reason: 'completed',
      pastDeadline: false,
      deadline: null,
      season: 'low',
    }
  }

  const checkIn = parseDateStr(dateFrom)
  const season = getSeason(checkIn)

  let deadline: Date
  if (season === 'high') {
    deadline = new Date(checkIn)
    deadline.setDate(checkIn.getDate() - HIGH_SEASON_DAYS)
    deadline.setHours(0, 0, 0, 0)
  } else {
    deadline = new Date(checkIn)
    deadline.setHours(checkIn.getHours() - LOW_SEASON_HOURS)
    // For simplicity: 24h before midnight of check-in day
    deadline = new Date(checkIn)
    deadline.setDate(checkIn.getDate() - 1)
    deadline.setHours(0, 0, 0, 0)
  }

  const pastDeadline = now >= deadline

  // Users can still cancel past deadline — but 50% charge applies
  // Only block if status doesn't allow it
  if (status !== 'pending' && status !== 'confirmed') {
    return {
      canCancel: false,
      reason: 'not_cancellable',
      pastDeadline,
      deadline,
      season,
    }
  }

  return {
    canCancel: true,
    reason: null,
    pastDeadline,
    deadline,
    season,
  }
}

export function formatDeadline(deadline: Date): string {
  return deadline.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDateNO(dateStr: string): string {
  const d = parseDateStr(dateStr)
  return d.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Venter på bekreftelse',
  confirmed: 'Bekreftet',
  completed: 'Gjennomført',
  cancelled: 'Avbestilt',
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
}

export const CAGE_TYPE_LABELS: Record<string, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}
