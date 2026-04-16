import { getSeason } from '@/lib/booking/pricing'

// ─── Cancellation policy ───────────────────────────────────────────────────────
// Low season:  free cancellation up to 24h before check-in
// High season: free cancellation up to 7 days before check-in
// After deadline: 50% of total price

export interface CancellationFeeResult {
  hasFee: boolean
  feeAmount: number // 0 if within free window
  percentCharged: number // 0 or 50
  season: 'low' | 'high'
  deadline: Date
  hoursUntilCheckin: number
  daysUntilCheckin: number
  withinFreeWindow: boolean
}

export function calculateCancellationFee(
  dateFrom: string, // YYYY-MM-DD
  price: number,
  now: Date = new Date()
): CancellationFeeResult {
  const [y, m, d] = dateFrom.split('-').map(Number)
  const checkIn = new Date(y, m - 1, d)
  const season = getSeason(checkIn)

  const msUntilCheckin = checkIn.getTime() - now.getTime()
  const hoursUntilCheckin = msUntilCheckin / (1000 * 60 * 60)
  const daysUntilCheckin = msUntilCheckin / (1000 * 60 * 60 * 24)

  let deadline: Date
  let withinFreeWindow: boolean

  if (season === 'high') {
    deadline = new Date(checkIn)
    deadline.setDate(checkIn.getDate() - 7)
    deadline.setHours(0, 0, 0, 0)
    withinFreeWindow = now < deadline
  } else {
    deadline = new Date(checkIn)
    deadline.setDate(checkIn.getDate() - 1)
    deadline.setHours(0, 0, 0, 0)
    withinFreeWindow = hoursUntilCheckin > 24
  }

  const hasFee = !withinFreeWindow
  const percentCharged = hasFee ? 50 : 0
  const feeAmount = hasFee ? Math.round(price * 0.5) : 0

  return {
    hasFee,
    feeAmount,
    percentCharged,
    season,
    deadline,
    hoursUntilCheckin,
    daysUntilCheckin,
    withinFreeWindow,
  }
}

export function formatDeadlineNO(date: Date): string {
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
