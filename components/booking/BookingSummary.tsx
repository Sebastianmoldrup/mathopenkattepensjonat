'use client'

import { useState } from 'react'
import {
  Cat,
  CageType,
  CAGE_CONFIGS,
  BookingWithCats,
} from '@/lib/booking/types'
import {
  calculatePriceBreakdown,
  formatDateNO,
  diffInDays,
} from '@/lib/booking/pricing'
import { createBooking } from '@/lib/booking/actions'
import { hasCatConflict } from '@/lib/booking/availability'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CalendarDays,
  Cat as CatIcon,
  BedDouble,
  Receipt,
  SunMedium,
  Snowflake,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface BookingSummaryProps {
  userId: string
  selectedCats: Cat[]
  dateFrom: Date
  dateTo: Date
  cageType: CageType
  cageCount: number
  specialInstructions: string
  bookings: BookingWithCats[]
  onInstructionsChange: (value: string) => void
  onBack: () => void
  onConfirmed: () => void
}

const CAGE_LABELS: Record<CageType, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

export function BookingSummary({
  userId,
  selectedCats,
  dateFrom,
  dateTo,
  cageType,
  cageCount,
  specialInstructions,
  bookings,
  onInstructionsChange,
  onBack,
  onConfirmed,
}: BookingSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const numCats = selectedCats.length
  const nights = diffInDays(dateFrom, dateTo)
  const breakdown = calculatePriceBreakdown(
    cageType,
    cageCount,
    numCats,
    dateFrom,
    dateTo
  )

  // Group consecutive nights by season for cleaner display
  const seasonGroups = groupNightsBySeason(breakdown.nights)

  async function handleConfirm() {
    setIsSubmitting(true)
    setError(null)

    // Last-line defence: re-check cat availability before writing to DB
    const catIds = selectedCats.map((c) => c.id)
    if (hasCatConflict(bookings, catIds, dateFrom, dateTo)) {
      setError(
        'En eller flere av de valgte kattene er allerede booket i denne perioden. ' +
          'Gå tilbake og velg andre datoer.'
      )
      setIsSubmitting(false)
      return
    }

    const result = await createBooking({
      userId,
      catIds,
      dateFrom,
      dateTo,
      cageType,
      cageCount,
      numCats,
      price: breakdown.totalPrice,
      specialInstructions: specialInstructions || undefined,
    })

    if ('error' in result) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setConfirmed(true)
    setTimeout(() => onConfirmed(), 1500)
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-semibold">Booking bekreftet!</h2>
        <p className="text-sm text-muted-foreground">
          Du videresendes til Min side...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Oppsummering</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gjennomgå bookingen din før du bekrefter.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left column: booking details */}
        <div className="space-y-4">
          {/* Cats */}
          <SummaryCard
            icon={<CatIcon className="h-4 w-4" />}
            title={`Katter (${numCats})`}
          >
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedCats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5"
                >
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm">
                        🐱
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </SummaryCard>

          {/* Dates */}
          <SummaryCard
            icon={<CalendarDays className="h-4 w-4" />}
            title="Datoer"
          >
            <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Innsjekk</p>
                <p className="font-medium">{formatDateNO(dateFrom)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Utsjekk</p>
                <p className="font-medium">{formatDateNO(dateTo)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Varighet</p>
                <p className="font-medium">
                  {nights} {nights === 1 ? 'natt' : 'netter'}
                </p>
              </div>
            </div>
          </SummaryCard>

          {/* Cage */}
          <SummaryCard icon={<BedDouble className="h-4 w-4" />} title="Burtype">
            <div className="space-y-1 pt-1 text-sm">
              <p className="font-medium">
                {cageCount === 2
                  ? '2× Standard (split)'
                  : CAGE_LABELS[cageType]}
              </p>
              <p className="text-xs text-muted-foreground">
                {CAGE_CONFIGS[cageType].description}
                {cageCount === 2 && ' · 2 separate bur'}
              </p>
            </div>
          </SummaryCard>

          {/* Special instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium">
              Spesielle instruksjoner (valgfritt)
            </Label>
            <Textarea
              id="instructions"
              value={specialInstructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              placeholder="Allergier, medisiner, rutiner eller annet personalet bør vite..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        {/* Right column: price breakdown */}
        <div className="space-y-4">
          <SummaryCard
            icon={<Receipt className="h-4 w-4" />}
            title="Prisberegning"
          >
            <div className="space-y-3 pt-2">
              {/* Season groups */}
              {seasonGroups.map((group, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    {group.season === 'high' ? (
                      <SunMedium className="h-3 w-3 text-amber-500" />
                    ) : (
                      <Snowflake className="h-3 w-3 text-blue-400" />
                    )}
                    {group.season === 'high' ? 'Høysesong' : 'Lavsesong'}
                  </div>
                  <div className="space-y-1 rounded-md bg-muted/40 px-3 py-2">
                    {group.lines.map((line, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {line.label}
                        </span>
                        <span className="font-medium">
                          {line.amount.toLocaleString('nb-NO')} kr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Season summary if mixed */}
              {breakdown.lowSeasonNights > 0 &&
                breakdown.highSeasonNights > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Snowflake className="h-2.5 w-2.5 text-blue-400" />
                      {breakdown.lowSeasonNights} lavsesong-
                      {breakdown.lowSeasonNights === 1 ? 'natt' : 'netter'}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <SunMedium className="h-2.5 w-2.5 text-amber-500" />
                      {breakdown.highSeasonNights} høysesong-
                      {breakdown.highSeasonNights === 1 ? 'natt' : 'netter'}
                    </Badge>
                  </div>
                )}

              <Separator />

              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Totalt</span>
                <span className="text-xl font-bold">
                  {breakdown.totalPrice.toLocaleString('nb-NO')} kr
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Inkl. alle avgifter. Betales ved innsjekk.
              </p>
            </div>
          </SummaryCard>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Tilbake
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          size="lg"
          className="min-w-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Bekrefter...
            </>
          ) : (
            'Bekreft booking'
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SummaryCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

interface SeasonLine {
  label: string
  amount: number
}
interface SeasonGroup {
  season: 'low' | 'high'
  lines: SeasonLine[]
}

function groupNightsBySeason(
  nights: import('@/lib/booking/types').NightBreakdown[]
): SeasonGroup[] {
  const groups: SeasonGroup[] = []
  let currentGroup: SeasonGroup | null = null

  // Condense: group consecutive same-season nights and show price per night × count
  let i = 0
  while (i < nights.length) {
    const season = nights[i].season
    let j = i
    while (j < nights.length && nights[j].season === season) j++
    const chunk = nights.slice(i, j)

    // Within the chunk, group identical nightly prices
    const priceGroups = new Map<number, number>() // total → count
    for (const n of chunk) {
      priceGroups.set(n.total, (priceGroups.get(n.total) ?? 0) + 1)
    }

    const lines: SeasonLine[] = []
    for (const [price, count] of priceGroups) {
      lines.push({
        label: `${count} ${count === 1 ? 'natt' : 'netter'} × ${price.toLocaleString('nb-NO')} kr`,
        amount: price * count,
      })
    }

    groups.push({ season, lines })
    i = j
  }

  return groups
}
