// ─── Cage Types ───────────────────────────────────────────────────────────────

export type CageType = 'standard' | 'senior_comfort' | 'suite'

export interface CageConfig {
  type: CageType
  label: string
  description: string
  maxCats: number
  totalCount: number
}

export const CAGE_CONFIGS: Record<CageType, CageConfig> = {
  standard: {
    type: 'standard',
    label: 'Standard',
    description: 'Romslig og komfortabelt bur for 1–2 katter',
    maxCats: 2,
    totalCount: 14,
  },
  senior_comfort: {
    type: 'senior_comfort',
    label: 'Senior & Komfort',
    description:
      'Ekstra tilpasset for eldre katter eller katter med spesielle behov',
    maxCats: 2,
    totalCount: 3,
  },
  suite: {
    type: 'suite',
    label: 'Suite',
    description: 'Vår romsligste løsning – plass til opptil 3 katter i luksus',
    maxCats: 3,
    totalCount: 3,
  },
}

// ─── Season ───────────────────────────────────────────────────────────────────

export type Season = 'low' | 'high'

export interface SeasonRange {
  label: string
  start: { month: number; day: number }
  end: { month: number; day: number }
}

export const FIXED_HIGH_SEASON_RANGES: SeasonRange[] = [
  { label: 'Sommer', start: { month: 5, day: 15 }, end: { month: 7, day: 15 } },
  { label: 'Jul', start: { month: 11, day: 20 }, end: { month: 0, day: 2 } },
]

// ─── Pricing (day-based: both check-in and check-out are billed) ──────────────
// Versioned, like OPENING_HOURS in lib/booking/hours.ts is for hours: one
// file is the single source of truth for every price shown anywhere
// (booking wizard, /priser, booking emails), and the version that applies
// to a given moment is picked automatically by `effectiveFrom`.
//
// This does NOT touch already-created bookings -- booking.price is a
// snapshot column written once at creation (see createBooking in
// lib/booking/actions.ts), so an existing booking (even one dated far in
// the future) keeps whatever price it was created with no matter what
// gets added here later.
//
// To change prices for real: append a new entry to PRICING_VERSIONS below
// with the new `pricing` table and the date the change should take effect
// (`effectiveFrom`, inclusive, local date). Entries MUST stay sorted
// ascending by effectiveFrom -- getActivePricing() in pricing.ts assumes
// this and picks the LAST entry that has already started. No other code
// change is needed: once that date arrives (server clock, at the moment a
// booking is actually created -- see createBooking, which recomputes the
// price itself server-side rather than trusting whatever the browser had
// cached), new bookings automatically start using the new prices, and
// /priser automatically shows them too.
//
// Only ONE version exists today (the baseline, in effect since the site's
// pricing was first set) -- nothing is scheduled to change yet.

export interface PriceTable {
  low: Record<number, number>
  high: Record<number, number>
}

export interface PricingVersion {
  effectiveFrom: string // YYYY-MM-DD, local date, inclusive
  pricing: Record<CageType, PriceTable>
}

export const PRICING_VERSIONS: PricingVersion[] = [
  {
    effectiveFrom: '2020-01-01',
    pricing: {
      standard: {
        low: { 1: 220, 2: 320 },
        high: { 1: 250, 2: 350 },
      },
      senior_comfort: {
        low: { 1: 220, 2: 320 },
        high: { 1: 250, 2: 350 },
      },
      suite: {
        low: { 1: 400, 2: 400, 3: 400 },
        high: { 1: 450, 2: 450, 3: 450 },
      },
    },
  },
  // Example of a future change -- uncomment, fill in the real numbers and
  // date, and deploy ahead of the effective date:
  // {
  //   effectiveFrom: '2027-01-01',
  //   pricing: {
  //     standard: { low: { 1: 0, 2: 0 }, high: { 1: 0, 2: 0 } },
  //     senior_comfort: { low: { 1: 0, 2: 0 }, high: { 1: 0, 2: 0 } },
  //     suite: { low: { 1: 0, 2: 0, 3: 0 }, high: { 1: 0, 2: 0, 3: 0 } },
  //   },
  // },
]

// ─── Cats ─────────────────────────────────────────────────────────────────────

export interface Cat {
  id: string
  name: string
  breed: string | null
  gender: string | null
  age: string | null
  image_url: string | null
  owner_id: string
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string
  user_id: string
  date_from: string
  date_to: string
  cage_type: CageType
  cage_count: number
  num_cats: number
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'waitlist'
  special_instructions: string | null
  outdoor_cage_requested: boolean
  waitlist_requested: boolean
  // Optional (not just nullable): existing rows/queries that don't select
  // these columns simply omit them, rather than every call site needing to
  // supply an explicit null.
  checkin_time?: string | null
  checkout_time?: string | null
  time_notes?: string | null
  created_at: string
}

export interface BookingWithCats extends Booking {
  cat_ids: string[]
}

// ─── Price Breakdown (day-based) ──────────────────────────────────────────────

export interface DayBreakdown {
  date: string
  season: Season
  pricePerCage: number
  cageCount: number
  total: number
}

// Alias for backward compat
export type NightBreakdown = DayBreakdown

export interface PriceBreakdown {
  days: DayBreakdown[]
  totalDays: number
  totalPrice: number
  lowSeasonDays: number
  highSeasonDays: number
  // Aliases
  nights: DayBreakdown[]
  totalNights: number
  lowSeasonNights: number
  highSeasonNights: number
}
