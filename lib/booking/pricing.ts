import {
  Season,
  FIXED_HIGH_SEASON_RANGES,
  PRICING,
  CageType,
  PriceBreakdown,
  DayBreakdown,
} from './types'

// ─── Easter Calculation ───────────────────────────────────────────────────────

export function getEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

export function getEasterHighSeasonRange(year: number): {
  start: Date
  end: Date
} {
  const easter = getEasterSunday(year)
  const start = new Date(easter)
  start.setDate(easter.getDate() - 8)
  const end = new Date(easter)
  end.setDate(easter.getDate() + 1)
  return { start, end }
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * Parse YYYY-MM-DD without UTC shift.
 */
export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Format a Date to YYYY-MM-DD using local time.
 */
export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getSeason(date: Date): Season {
  const d = toDateOnly(date)
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()

  for (const range of FIXED_HIGH_SEASON_RANGES) {
    if (range.start.month > range.end.month) {
      const afterStart =
        month > range.start.month ||
        (month === range.start.month && day >= range.start.day)
      const beforeEnd =
        month < range.end.month ||
        (month === range.end.month && day <= range.end.day)
      if (afterStart || beforeEnd) return 'high'
    } else {
      const afterStart =
        month > range.start.month ||
        (month === range.start.month && day >= range.start.day)
      const beforeEnd =
        month < range.end.month ||
        (month === range.end.month && day <= range.end.day)
      if (afterStart && beforeEnd) return 'high'
    }
  }

  const easter = getEasterHighSeasonRange(year)
  if (d >= toDateOnly(easter.start) && d <= toDateOnly(easter.end))
    return 'high'
  const easterPrev = getEasterHighSeasonRange(year - 1)
  if (d >= toDateOnly(easterPrev.start) && d <= toDateOnly(easterPrev.end))
    return 'high'

  return 'low'
}

// ─── Price Per Day ────────────────────────────────────────────────────────────

export function getPricePerCagePerDay(
  cageType: CageType,
  catsInCage: number,
  season: Season
): number {
  return PRICING[cageType][season][catsInCage] ?? 0
}

function getPriceForStandardSplit(season: Season): number {
  return (
    getPricePerCagePerDay('standard', 2, season) +
    getPricePerCagePerDay('standard', 1, season)
  )
}

// ─── Full Price Breakdown (day-based) ─────────────────────────────────────────
//
// Day-based pricing: BOTH check-in day AND check-out day are billed.
// Monday check-in → Wednesday check-out = 3 days billed.
// Minimum 2 days.

export function calculatePriceBreakdown(
  cageType: CageType,
  cageCount: number,
  numCats: number,
  dateFrom: Date | string,
  dateTo: Date | string
): PriceBreakdown {
  const from =
    typeof dateFrom === 'string' ? parseDateStr(dateFrom) : toDateOnly(dateFrom)
  const to =
    typeof dateTo === 'string' ? parseDateStr(dateTo) : toDateOnly(dateTo)

  const days: DayBreakdown[] = []
  const current = new Date(from)

  // Iterate from dateFrom to dateTo INCLUSIVE (day-based)
  while (current <= to) {
    const season = getSeason(current)
    const dateStr = toLocalDateStr(current)

    let pricePerCage: number
    let total: number

    if (cageType === 'standard' && cageCount === 2 && numCats === 3) {
      pricePerCage = getPricePerCagePerDay('standard', 2, season)
      total = getPriceForStandardSplit(season)
    } else {
      pricePerCage = getPricePerCagePerDay(cageType, numCats, season)
      total = pricePerCage * cageCount
    }

    days.push({ date: dateStr, season, pricePerCage, cageCount, total })
    current.setDate(current.getDate() + 1)
  }

  const totalPrice = days.reduce((sum, d) => sum + d.total, 0)
  const lowSeasonDays = days.filter((d) => d.season === 'low').length
  const highSeasonDays = days.filter((d) => d.season === 'high').length

  return {
    days,
    totalDays: days.length,
    totalPrice,
    lowSeasonDays,
    highSeasonDays,
    // Aliases for backward compat
    nights: days,
    totalNights: days.length,
    lowSeasonNights: lowSeasonDays,
    highSeasonNights: highSeasonDays,
  }
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function formatDateNO(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateStr(date) : date
  return d.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function diffInDays(from: Date | string, to: Date | string): number {
  const f = typeof from === 'string' ? parseDateStr(from) : toDateOnly(from)
  const t = typeof to === 'string' ? parseDateStr(to) : toDateOnly(to)
  return Math.round((t.getTime() - f.getTime()) / 864e5)
}
