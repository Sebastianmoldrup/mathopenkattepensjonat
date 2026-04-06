import { Season, FIXED_HIGH_SEASON_RANGES, PRICING, CageType, PriceBreakdown, NightBreakdown } from './types';

// ─── Easter Calculation (Anonymous Gregorian algorithm) ───────────────────────

export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/**
 * High season Easter range:
 * Start: Friday before Palm Sunday = Easter Sunday - 8 days
 * End:   2nd Easter day (Easter Monday) = Easter Sunday + 1 day
 */
export function getEasterHighSeasonRange(year: number): { start: Date; end: Date } {
  const easter = getEasterSunday(year);
  const start = new Date(easter);
  start.setDate(easter.getDate() - 8); // Friday before Palm Sunday
  const end = new Date(easter);
  end.setDate(easter.getDate() + 1);   // Easter Monday (2. påskedag)
  return { start, end };
}

// ─── Season Check ─────────────────────────────────────────────────────────────

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getSeason(date: Date): Season {
  const d = toDateOnly(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  // Check fixed ranges
  for (const range of FIXED_HIGH_SEASON_RANGES) {
    // Christmas: Dec 20 – Jan 2 (wraps year)
    if (range.start.month > range.end.month) {
      const afterStart = month > range.start.month || (month === range.start.month && day >= range.start.day);
      const beforeEnd = month < range.end.month || (month === range.end.month && day <= range.end.day);
      if (afterStart || beforeEnd) return 'high';
    } else {
      const afterStart = month > range.start.month || (month === range.start.month && day >= range.start.day);
      const beforeEnd = month < range.end.month || (month === range.end.month && day <= range.end.day);
      if (afterStart && beforeEnd) return 'high';
    }
  }

  // Check Easter (computed per year)
  const easter = getEasterHighSeasonRange(year);
  if (d >= toDateOnly(easter.start) && d <= toDateOnly(easter.end)) return 'high';
  // Also check previous year's Easter range end (for Jan dates)
  const easterPrev = getEasterHighSeasonRange(year - 1);
  if (d >= toDateOnly(easterPrev.start) && d <= toDateOnly(easterPrev.end)) return 'high';

  return 'low';
}

// ─── Price Per Night ──────────────────────────────────────────────────────────

/**
 * Returns the price for ONE cage for ONE night.
 * For the 2-standard-cage scenario (3 cats split), call this per cage
 * with the cats assigned to that cage.
 */
export function getPricePerCagePerNight(
  cageType: CageType,
  catsInCage: number,
  season: Season,
): number {
  return PRICING[cageType][season][catsInCage] ?? 0;
}

/**
 * For 3 cats in 2 standard cages: cage 1 gets 2 cats, cage 2 gets 1 cat.
 * Returns combined price for both cages for one night.
 */
function getPriceForStandardSplit(season: Season): number {
  return (
    getPricePerCagePerNight('standard', 2, season) +
    getPricePerCagePerNight('standard', 1, season)
  );
}

// ─── Full Price Breakdown ─────────────────────────────────────────────────────

/**
 * Calculates a full price breakdown for a booking.
 * dateFrom is check-in, dateTo is check-out.
 * Nights = days between dateFrom and dateTo (dateTo is not a night).
 */
export function calculatePriceBreakdown(
  cageType: CageType,
  cageCount: number,
  numCats: number,
  dateFrom: Date,
  dateTo: Date,
): PriceBreakdown {
  const nights: NightBreakdown[] = [];

  const current = toDateOnly(dateFrom);
  const end = toDateOnly(dateTo);

  while (current < end) {
    const season = getSeason(current);
    const dateStr = current.toISOString().split('T')[0];

    let pricePerCage: number;
    let total: number;

    if (cageType === 'standard' && cageCount === 2 && numCats === 3) {
      // Special split: 2 cats in cage 1, 1 cat in cage 2
      pricePerCage = getPricePerCagePerNight('standard', 2, season); // representative
      total = getPriceForStandardSplit(season);
    } else {
      pricePerCage = getPricePerCagePerNight(cageType, numCats, season);
      total = pricePerCage * cageCount;
    }

    nights.push({ date: dateStr, season, pricePerCage, cageCount, total });
    current.setDate(current.getDate() + 1);
  }

  const totalPrice = nights.reduce((sum, n) => sum + n.total, 0);
  const lowSeasonNights = nights.filter((n) => n.season === 'low').length;
  const highSeasonNights = nights.filter((n) => n.season === 'high').length;

  return {
    nights,
    totalNights: nights.length,
    totalPrice,
    lowSeasonNights,
    highSeasonNights,
  };
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatDateNO(date: Date): string {
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function diffInDays(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((toDateOnly(to).getTime() - toDateOnly(from).getTime()) / msPerDay);
}
