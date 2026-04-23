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
    totalCount: 19,
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

// High season date ranges (month is 0-indexed)
// Summer: June 15 – August 15
// Christmas: December 20 – January 2
// Easter: computed dynamically (Friday before Palm Sunday – 2nd Easter day)
export interface SeasonRange {
  label: string
  start: { month: number; day: number }
  end: { month: number; day: number }
}

export const FIXED_HIGH_SEASON_RANGES: SeasonRange[] = [
  { label: 'Sommer', start: { month: 5, day: 15 }, end: { month: 7, day: 15 } },
  { label: 'Jul', start: { month: 11, day: 20 }, end: { month: 0, day: 2 } }, // wraps year
]

// ─── Pricing ──────────────────────────────────────────────────────────────────

export interface PriceTable {
  low: Record<number, number> // cat count → price per night
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
  date_from: string // YYYY-MM-DD
  date_to: string // YYYY-MM-DD
  cage_type: CageType
  cage_count: number
  num_cats: number
  price: number
  special_instructions: string | null
  created_at: string
}

// Booking enriched with the cat IDs from booking_cats join table
export interface BookingWithCats extends Booking {
  cat_ids: string[]
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export type BookingStep = 'cats' | 'dates' | 'cage' | 'behavior' | 'summary'

export interface BookingState {
  step: BookingStep
  selectedCatIds: string[]
  dateFrom: Date | null
  dateTo: Date | null
  cageType: CageType | null
  specialInstructions: string
}

export const INITIAL_BOOKING_STATE: BookingState = {
  step: 'cats',
  selectedCatIds: [],
  dateFrom: null,
  dateTo: null,
  cageType: null,
  specialInstructions: '',
}

// ─── Price Breakdown ──────────────────────────────────────────────────────────

export interface NightBreakdown {
  date: string // YYYY-MM-DD
  season: Season
  pricePerCage: number
  cageCount: number
  total: number
}

export interface PriceBreakdown {
  nights: NightBreakdown[]
  totalNights: number
  totalPrice: number
  lowSeasonNights: number
  highSeasonNights: number
}
