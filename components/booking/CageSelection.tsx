'use client'

import { useMemo, useState } from 'react'
import { CageType, CAGE_CONFIGS } from '@/lib/booking/types'
import { calculatePriceBreakdown, parseDateStr } from '@/lib/booking/pricing'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CheckCircle2, Cat, Crown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CageSelectionProps {
  numCats: number
  dateFrom: string
  dateTo: string
  selectedCageType: CageType | null
  onSelect: (cageType: CageType, cageCount: number) => void
  onNext: () => void
  onBack: () => void
  nextLabel?: string
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
    bullets: ['Romslig og komfortabelt bur', 'Passer for 1–2 katter'],
  },
  senior_comfort: {
    title: 'Senior & Komfort',
    bullets: [
      'Tilrettelagt for eldre katter med helseutfordringer',
      'Litt mindre enn standardbur, med liten trapp mellom etasjene',
      'Anbefales for katter over 10 år eller med helseutfordringer',
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
  selectedCageType,
  onSelect,
  onNext,
  onBack,
  nextLabel = 'Neste',
}: CageSelectionProps) {
  const [showSeniorWarning, setShowSeniorWarning] = useState(false)
  const [pendingSelection, setPendingSelection] = useState<{
    cageType: CageType
    cageCount: number
  } | null>(null)

  // Options depend on number of cats:
  // 1-2 cats: Standard (1 bur), Senior & Komfort (1 bur), Suite (1 bur)
  // 3 cats: Suite (1 bur), 2× Standard split (2 bur)
  const allOptions = useMemo(() => {
    if (numCats >= 3)
      return [
        { cageType: 'suite' as CageType, cageCount: 1 },
        { cageType: 'standard' as CageType, cageCount: 2 },
      ]
    return [
      { cageType: 'standard' as CageType, cageCount: 1 },
      { cageType: 'senior_comfort' as CageType, cageCount: 1 },
      { cageType: 'suite' as CageType, cageCount: 1 },
    ]
  }, [numCats])

  function getTotalPrice(cageType: CageType, cageCount: number): string {
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
    const prices = breakdown.days.map((d) => d.total)
    if (prices.length === 0) return ''
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return `${min} kr/natt`
    return `${min}–${max} kr/natt`
  }

  function isOneNight(): boolean {
    const from = parseDateStr(dateFrom)
    const to = parseDateStr(dateTo)
    return Math.round((to.getTime() - from.getTime()) / 864e5) === 1
  }

  function handleCageClick(cageType: CageType, cageCount: number) {
    if (cageType === 'senior_comfort') {
      setPendingSelection({ cageType, cageCount })
      setShowSeniorWarning(true)
    } else {
      onSelect(cageType, cageCount)
    }
  }

  function confirmSeniorSelection() {
    if (pendingSelection)
      onSelect(pendingSelection.cageType, pendingSelection.cageCount)
    setShowSeniorWarning(false)
    setPendingSelection(null)
  }

  function selectStandardInstead() {
    onSelect('standard', 1)
    setShowSeniorWarning(false)
    setPendingSelection(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Velg burtype</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {numCats >= 3
            ? 'Med 3 katter kan du velge Suite (1 bur) eller 2× Standard (2 separate bur).'
            : 'Velg burtype som passer best for din katt.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allOptions.map(({ cageType, cageCount }) => {
          const isSelected =
            selectedCageType === cageType &&
            // For standard, also check cageCount to distinguish 1x vs 2x
            (cageType !== 'standard' ||
              (cageType === 'standard' &&
                ((numCats >= 3 && cageCount === 2) ||
                  (numCats < 3 && cageCount === 1))))
          const desc = CAGE_DESCRIPTIONS[cageType]
          const config = CAGE_CONFIGS[cageType]
          const is2xSplit = cageType === 'standard' && cageCount === 2

          return (
            <button
              key={`${cageType}-${cageCount}`}
              onClick={() => handleCageClick(cageType, cageCount)}
              className={cn(
                'relative flex flex-col gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm'
              )}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              )}

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
                    {is2xSplit ? '2× Standard (split)' : desc.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {is2xSplit
                      ? 'Opptil 3 katter · 2 separate bur'
                      : `Opptil ${config.maxCats} katter`}
                  </p>
                </div>
              </div>

              <ul className="space-y-1">
                {desc.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-xs">•</span>
                    {b}
                  </li>
                ))}
                {is2xSplit && (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-xs">•</span>Kattene fordeles på
                    2 bur
                  </li>
                )}
              </ul>

              <div className="mt-auto space-y-0.5 border-t border-border pt-3">
                <p className="text-lg font-bold">
                  {getTotalPrice(cageType, cageCount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getDailyPriceRange(cageType, cageCount)}
                </p>
                {isOneNight() && (
                  <p className="text-xs text-amber-600">
                    Minimum pris tilsvarer 2 døgn
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button onClick={onNext} disabled={!selectedCageType} size="lg">
          {nextLabel}
        </Button>
      </div>

      <Dialog open={showSeniorWarning} onOpenChange={setShowSeniorWarning}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Senior & Komfort bur</DialogTitle>

            <DialogDescription className="sr-only">
              Velg burtype for oppholdet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              Dersom katten din ikke er over 10 år eller har helseutfordringer,
              anbefaler vi å velge standardbur. Katter i Senior & Komfort-bur
              kan bli flyttet til standardbur dersom behovet er større hos andre
              katter.
            </div>
            <p>Ønsker du likevel å velge Senior & Komfort?</p>
          </div>
          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button variant="outline" onClick={selectStandardInstead}>
              Velg standardbur istedet
            </Button>
            <Button onClick={confirmSeniorSelection}>
              Ja, velg Senior & Komfort
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
