import { Season, FIXED_HIGH_SEASON_RANGES } from './types'
import { getSeason } from './pricing'

// ─── Opening hours ──────────────────────────────────────────────────────────
// Single source of truth for delivery/pickup hours, referenced by the
// marketing pages (as display copy) and the booking-flow time picker
// (TimeSelection.tsx, admin's BookingDetailDialog.tsx). Previously this was
// hardcoded as near-identical prose across ~9 files with no shared source,
// which is exactly the kind of drift that caused the suite-pricing and
// cage-numbering issues earlier -- update it here, not per-page.
//
// Low season: weekdays 18:30-19:30, Saturday closed, Sunday 19:00-20:00.
// High season: open every day -- weekdays 17:30-19:00, Sat+Sun 13:00-14:30.
// "High season" and Saturday-closure follow the same season definition
// already used for pricing and the low-season-Saturday booking block
// (getSeason / FIXED_HIGH_SEASON_RANGES / Easter week).
//
// Christmas is the one deliberate exception: it stays priced as high season
// (getSeason() / pricing.ts are untouched), but customers get the ordinary
// (low season) hours for delivery/pickup -- including Saturday closed, same
// as the rest of low season. isChristmasPeriod() below is what carries that
// exception into getOpeningHoursForDate() and, via isClosedSaturday() in
// availability.ts, into which Saturdays are bookable as a check-in/check-out
// day at all -- the two need to agree, or a customer could pick a Christmas
// Saturday as their check-in day and then find every slot on it "Stengt".

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
    sunday: { opens: '19:00', closes: '20:00' },
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

const CHRISTMAS_RANGE = FIXED_HIGH_SEASON_RANGES.find((r) => r.label === 'Jul')!

/** True for the Christmas high-season window (20 Dec - 2 Jan) -- reuses the
 * same range pricing.ts already defines rather than re-declaring the dates. */
export function isChristmasPeriod(date: Date): boolean {
  const month = date.getMonth()
  const day = date.getDate()
  const { start, end } = CHRISTMAS_RANGE
  // Range wraps the year boundary (Dec -> Jan), so "in range" is
  // "on/after start" OR "on/before end", not AND.
  const afterStart =
    month > start.month || (month === start.month && day >= start.day)
  const beforeEnd = month < end.month || (month === end.month && day <= end.day)
  return afterStart || beforeEnd
}

/** Returns the opening hours for a specific calendar date, or null if closed that day. */
export function getOpeningHoursForDate(date: Date): TimeRange | null {
  const season: Season = isChristmasPeriod(date) ? 'low' : getSeason(date)
  const day = date.getDay() // 0 = Sunday, 6 = Saturday
  const hours = OPENING_HOURS[season]
  if (day === 0) return hours.sunday
  if (day === 6) return hours.saturday
  return hours.weekday
}

export function isOpenOnDate(date: Date): boolean {
  return getOpeningHoursForDate(date) !== null
}

/**
 * Start times of each stepMinutes-wide slot fully contained in range, e.g.
 * ("18:30"-"19:30", 15) -> ["18:30", "18:45", "19:00", "19:15"]. Every
 * current window divides evenly (60min/90min ÷ 15min); a window that
 * doesn't just drops its last partial slot rather than erroring.
 */
export function generateSlots(range: TimeRange, stepMinutes = 15): string[] {
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }
  const toHHMM = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const opens = toMinutes(range.opens)
  const closes = toMinutes(range.closes)
  const slots: string[] = []
  for (let start = opens; start + stepMinutes <= closes; start += stepMinutes) {
    slots.push(toHHMM(start))
  }
  return slots
}
