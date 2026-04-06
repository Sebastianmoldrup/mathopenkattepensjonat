'use client'

import { useMemo } from 'react'
import { Booking, CageType, CAGE_CONFIGS } from '@/lib/booking/types'
import { getAvailableCageOptions, CageOption } from '@/lib/booking/availability'
import { calculatePriceBreakdown } from '@/lib/booking/pricing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Cat, Crown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CageSelectionProps {
  numCats: number
  dateFrom: Date
  dateTo: Date
  bookings: Booking[]
  selectedCageType: CageType | null
  onSelect: (cageType: CageType, cageCount: number) => void
  onNext: () => void
  onBack: () => void
}

const CAGE_ICONS: Record<CageType, React.ReactNode> = {
  standard: <Cat className="h-6 w-6" />,
  senior_comfort: <Star className="h-6 w-6" />,
  suite: <Crown className="h-6 w-6" />,
}

const CAGE_DESCRIPTIONS: Record<
  CageType,
  { title: string; bullets: string[] }
> = {
  standard: {
    title: 'Standard',
    bullets: [
      'Romslig og komfortabelt bur',
      'Passer for 1–2 katter',
      'Daglig stell og mating inkludert',
    ],
  },
  senior_comfort: {
    title: 'Senior & Komfort',
    bullets: [
      'Tilpasset eldre eller sensitive katter',
      'Ekstra myk innredning',
      'Nær tilsyn av personalet',
    ],
  },
  suite: {
    title: 'Suite',
    bullets: [
      'Vår største og mest eksklusive løsning',
      'Plass til opptil 3 katter',
      'Ekstra leke- og klatremuligheter',
    ],
  },
}

export function CageSelection({
  numCats,
  dateFrom,
  dateTo,
  bookings,
  selectedCageType,
  onSelect,
  onNext,
  onBack,
}: CageSelectionProps) {
  const availableOptions = useMemo(
    () => getAvailableCageOptions(bookings, numCats, dateFrom, dateTo),
    [bookings, numCats, dateFrom, dateTo]
  )

  const allOptions = useMemo(() => {
    if (numCats <= 2) {
      return [
        { cageType: 'standard' as CageType, cageCount: 1 },
        { cageType: 'senior_comfort' as CageType, cageCount: 1 },
        { cageType: 'suite' as CageType, cageCount: 1 },
      ]
    }
    return [
      { cageType: 'suite' as CageType, cageCount: 1 },
      { cageType: 'standard' as CageType, cageCount: 2 },
    ]
  }, [numCats])

  function isAvailable(cageType: CageType, cageCount: number) {
    return availableOptions.some(
      (o) => o.cageType === cageType && o.cageCount === cageCount
    )
  }

  function getPricePreview(cageType: CageType, cageCount: number): string {
    const breakdown = calculatePriceBreakdown(
      cageType,
      cageCount,
      numCats,
      dateFrom,
      dateTo
    )
    return `${breakdown.totalPrice.toLocaleString('nb-NO')} kr`
  }

  function getDailyPriceRange(cageType: CageType, cageCount: number): string {
    const breakdown = calculatePriceBreakdown(
      cageType,
      cageCount,
      numCats,
      dateFrom,
      dateTo
    )
    const prices = breakdown.nights.map((n) => n.total)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return `${min} kr/natt`
    return `${min}–${max} kr/natt`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Velg burtype</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {numCats === 3
            ? 'Med 3 katter kan du velge Suite (1 bur) eller 2 standard-bur.'
            : 'Velg burtype som passer best for din katt.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allOptions.map(({ cageType, cageCount }) => {
          const available = isAvailable(cageType, cageCount)
          const isSelected = selectedCageType === cageType
          const desc = CAGE_DESCRIPTIONS[cageType]
          const config = CAGE_CONFIGS[cageType]

          return (
            <button
              key={`${cageType}-${cageCount}`}
              onClick={() => available && onSelect(cageType, cageCount)}
              disabled={!available}
              className={cn(
                'relative flex flex-col gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : available
                    ? 'border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm'
                    : 'cursor-not-allowed border-border bg-muted/40 opacity-50'
              )}
            >
              {/* Not available badge */}
              {!available && (
                <span className="absolute right-3 top-3">
                  <Badge variant="destructive" className="gap-1 text-xs">
                    <XCircle className="h-3 w-3" />
                    Fullt booket
                  </Badge>
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && available && (
                <span className="absolute right-3 top-3 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              )}

              {/* Icon + title */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-muted-foreground',
                    isSelected && 'text-primary'
                  )}
                >
                  {CAGE_ICONS[cageType]}
                </span>
                <div>
                  <p className="font-semibold leading-none">
                    {cageCount === 2 ? '2× Standard (split)' : desc.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Opptil {cageCount === 2 ? '3' : config.maxCats} katter
                    {cageCount === 2 && ' · 2 bur'}
                  </p>
                </div>
              </div>

              {/* Bullets */}
              <ul className="space-y-1">
                {desc.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-xs">•</span>
                    {b}
                    {cageType === 'standard' &&
                    cageCount === 2 &&
                    b === desc.bullets[0]
                      ? ' (2 separate bur)'
                      : ''}
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              {available && (
                <div className="mt-auto space-y-0.5 border-t border-border pt-3">
                  <p className="text-lg font-bold">
                    {getPricePreview(cageType, cageCount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getDailyPriceRange(cageType, cageCount)}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button onClick={onNext} disabled={!selectedCageType} size="lg">
          Neste
        </Button>
      </div>
    </div>
  )
}
