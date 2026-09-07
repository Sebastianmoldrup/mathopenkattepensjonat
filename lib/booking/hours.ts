import { Season } from './types'
import { getSeason } from './pricing'

// ─── Opening hours ──────────────────────────────────────────────────────────
// Single source of truth for delivery/pickup hours, referenced by both the
// marketing pages (as display copy) and, eventually, a booking-time slot
// picker. Previously this was hardcoded as near-identical prose across ~9
// files with no shared source, which is exactly the kind of drift that
// caused the suite-pricing and cage-numbering issues earlier -- update it
// here, not per-page.
//
// Low season: weekdays 18:30-19:30, Saturday closed, Sunday 13:00-14:00.
// High season: open every day -- weekdays 17:30-19:00, Sat+Sun 13:00-14:30.
// "High season" and Saturday-closure follow the same season definition
// already used for pricing and the low-season-Saturday booking block
// (getSeason / FIXED_HIGH_SEASON_RANGES / Easter week).

export interface TimeRange {
  opens: string // HH:mm
  closes: string // HH:mm
}

export const OPENING_HOURS: Record<
  Season,
  { weekday: TimeRange; saturday: TimeRange | null; sunday: TimeRange }
> = {
  low: {
    weekday: { opens: '18:30', closes: '19:30' },
    saturday: null,
    sunday: { opens: '13:00', closes: '14:00' },
  },
  high: {
    weekday: { opens: '17:30', closes: '19:00' },
    saturday: { opens: '13:00', closes: '14:30' },
    sunday: { opens: '13:00', closes: '14:30' },
  },
}

/** Formats a range as e.g. "18:30–19:30" for display. */
export function formatRange(range: TimeRange): string {
  return `${range.opens}–${range.closes}`
}

/** Returns the opening hours for a specific calendar date, or null if closed that day. */
export function getOpeningHoursForDate(date: Date): TimeRange | null {
  const season = getSeason(date)
  const day = date.getDay() // 0 = Sunday, 6 = Saturday
  const hours = OPENING_HOURS[season]
  if (day === 0) return hours.sunday
  if (day === 6) return hours.saturday
  return hours.weekday
}

export function isOpenOnDate(date: Date): boolean {
  return getOpeningHoursForDate(date) !== null
}
