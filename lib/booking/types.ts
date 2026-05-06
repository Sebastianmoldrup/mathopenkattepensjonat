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

export interface PriceTable {
  low: Record<number, number>
  high: Record<number, number>
}

export const PRICING: Record<CageType, PriceTable> = {
  standard: {
    low: { 1: 220, 2: 320 },
    high: { 1: 250, 2: 350 },
  },
  senior_comfort: {
    low: { 1: 220, 2: 320 },
    high: { 1: 250, 2: 350 },
  },
  suite: {
    low: { 1: 350, 2: 350, 3: 400 },
    high: { 1: 450, 2: 450, 3: 450 },
  },
}

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
  created_at: string
}

export interface BookingWithCats extends Booking {
  cat_ids: string[]
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export type BookingStep =
  | 'count'
  | 'dates'
  | 'cage'
  | 'auth'
  | 'cats'
  | 'summary'

export const SESSION_STORAGE_KEY = 'booking_wizard_state'

export interface BookingState {
  step: BookingStep
  catCount: number | null
  // Stored as YYYY-MM-DD strings to survive sessionStorage serialization
  dateFrom: string | null
  dateTo: string | null
  cageType: CageType | null
  cageCount: number
  selectedCatIds: string[]
  specialInstructions: string
  wantsOutdoorCage: boolean
  waitlistRequested: boolean
}

export const INITIAL_BOOKING_STATE: BookingState = {
  step: 'count',
  catCount: null,
  dateFrom: null,
  dateTo: null,
  cageType: null,
  cageCount: 1,
  selectedCatIds: [],
  specialInstructions: '',
  wantsOutdoorCage: false,
  waitlistRequested: false,
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
