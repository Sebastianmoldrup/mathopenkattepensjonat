import { Booking, BookingWithCats, CageType, CAGE_CONFIGS } from './types'

// ─── Count cages used on a specific date ──────────────────────────────────────

/**
 * Returns how many cages of each type are occupied on a given date.
 * A booking occupies cages on all nights from date_from up to (not including) date_to.
 */
export function getCageUsageOnDate(
  bookings: Booking[],
  date: Date
): Record<CageType, number> {
  const usage: Record<CageType, number> = {
    standard: 0,
    senior_comfort: 0,
    suite: 0,
  }

  const d = dateOnly(date)

  for (const booking of bookings) {
    const from = dateOnly(new Date(booking.date_from))
    const to = dateOnly(new Date(booking.date_to))

    // The booking occupies nights from date_from to date_to - 1
    if (d >= from && d < to) {
      usage[booking.cage_type] += booking.cage_count
    }
  }

  return usage
}

/**
 * Returns how many cages of a given type are AVAILABLE on a date.
 */
export function getAvailableCount(
  bookings: Booking[],
  date: Date,
  cageType: CageType
): number {
  const usage = getCageUsageOnDate(bookings, date)
  return CAGE_CONFIGS[cageType].totalCount - usage[cageType]
}

// ─── Check if a date range is available for a given cage selection ─────────────

export interface AvailabilityCheck {
  cageType: CageType
  cageCount: number // 1 normally, 2 for 3-cat standard split
}

/**
 * Returns true if every night in [dateFrom, dateTo) has enough free cages.
 */
export function isRangeAvailable(
  bookings: Booking[],
  dateFrom: Date,
  dateTo: Date,
  check: AvailabilityCheck
): boolean {
  const current = dateOnly(dateFrom)
  const end = dateOnly(dateTo)

  while (current < end) {
    const available = getAvailableCount(bookings, current, check.cageType)
    if (available < check.cageCount) return false
    current.setDate(current.getDate() + 1)
  }

  return true
}

/**
 * Returns a Set of date strings (YYYY-MM-DD) that are fully booked
 * for ALL cage types that could accommodate the given number of cats.
 * Used to disable dates in the calendar.
 */
export function getFullyBookedDates(
  bookings: Booking[],
  numCats: number,
  dateFrom: Date,
  dateTo: Date
): Set<string> {
  const fullyBooked = new Set<string>()
  const current = dateOnly(dateFrom)
  const end = dateOnly(dateTo)

  const eligibleOptions = getEligibleCageOptions(numCats)

  while (current < end) {
    const allFull = eligibleOptions.every(({ cageType, cageCount }) => {
      const available = getAvailableCount(bookings, current, cageType)
      return available < cageCount
    })

    if (allFull) {
      fullyBooked.add(current.toISOString().split('T')[0])
    }

    current.setDate(current.getDate() + 1)
  }

  return fullyBooked
}

/**
 * Returns a Set of date strings where at least one night in
 * a prospective range starting at `startDate` would be unavailable.
 * Used to block date ranges in the calendar.
 */
export function getUnavailableStartDates(
  bookings: Booking[],
  numCats: number,
  calendarStart: Date,
  calendarEnd: Date
): Set<string> {
  return getFullyBookedDates(bookings, numCats, calendarStart, calendarEnd)
}

// ─── Eligible cage options per cat count ─────────────────────────────────────

export interface CageOption {
  cageType: CageType
  cageCount: number
  label: string
}

/**
 * Returns the cage options available for a given number of cats.
 * 1–2 cats: standard, senior_comfort, suite (1 cage each)
 * 3 cats:   suite (1 cage) or standard split (2 cages)
 */
export function getEligibleCageOptions(numCats: number): CageOption[] {
  if (numCats <= 2) {
    return [
      { cageType: 'standard', cageCount: 1, label: 'Standard' },
      { cageType: 'senior_comfort', cageCount: 1, label: 'Senior & Komfort' },
      { cageType: 'suite', cageCount: 1, label: 'Suite' },
    ]
  }
  // 3 cats
  return [
    { cageType: 'suite', cageCount: 1, label: 'Suite' },
    { cageType: 'standard', cageCount: 2, label: '2× Standard (split)' },
  ]
}

/**
 * Checks which cage options are available for the full date range.
 */
export function getAvailableCageOptions(
  bookings: Booking[],
  numCats: number,
  dateFrom: Date,
  dateTo: Date
): CageOption[] {
  return getEligibleCageOptions(numCats).filter((opt) =>
    isRangeAvailable(bookings, dateFrom, dateTo, {
      cageType: opt.cageType,
      cageCount: opt.cageCount,
    })
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// ─── Cat conflict checks ───────────────────────────────────────────────────────

/**
 * Returns a Set of date strings (YYYY-MM-DD) where at least one of the
 * given cat IDs is already booked. A cat is considered booked on all
 * nights from date_from up to (not including) date_to.
 */
export function getCatBlockedDates(
  bookings: BookingWithCats[],
  catIds: string[],
  rangeStart: Date,
  rangeEnd: Date
): Set<string> {
  const blocked = new Set<string>()
  if (catIds.length === 0) return blocked

  const catIdSet = new Set(catIds)

  for (const booking of bookings) {
    // Check if this booking contains any of our selected cats
    const hasConflictingCat = booking.cat_ids.some((id) => catIdSet.has(id))
    if (!hasConflictingCat) continue

    const bookingFrom = dateOnly(new Date(booking.date_from))
    const bookingTo = dateOnly(new Date(booking.date_to))
    const windowStart = dateOnly(rangeStart)
    const windowEnd = dateOnly(rangeEnd)

    // Walk each night of the booking and mark it blocked if within our window
    const current = new Date(bookingFrom)
    while (current < bookingTo) {
      if (current >= windowStart && current < windowEnd) {
        blocked.add(current.toISOString().split('T')[0])
      }
      current.setDate(current.getDate() + 1)
    }
  }

  return blocked
}

/**
 * Returns true if any of the given cats are already booked on any night
 * within [dateFrom, dateTo).
 */
export function hasCatConflict(
  bookings: BookingWithCats[],
  catIds: string[],
  dateFrom: Date,
  dateTo: Date
): boolean {
  const catIdSet = new Set(catIds)

  for (const booking of bookings) {
    const hasConflictingCat = booking.cat_ids.some((id) => catIdSet.has(id))
    if (!hasConflictingCat) continue

    const bookingFrom = dateOnly(new Date(booking.date_from))
    const bookingTo = dateOnly(new Date(booking.date_to))
    const from = dateOnly(dateFrom)
    const to = dateOnly(dateTo)

    // Overlap check: two ranges overlap if one starts before the other ends
    if (from < bookingTo && to > bookingFrom) return true
  }

  return false
}
