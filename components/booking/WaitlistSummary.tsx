'use client'

import { useState, useTransition } from 'react'
import { Cat, CageType } from '@/lib/booking/types'
import { CatBehaviorData } from '@/lib/booking/behaviorActions'
import { addToWaitlist } from '@/lib/booking/waitlist'
import { calculatePriceBreakdown } from '@/lib/booking/pricing'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  Loader2,
  Clock,
  SunMedium,
  Snowflake,
} from 'lucide-react'
import Image from 'next/image'

const CAGE_LABELS: Record<CageType, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

const MONTHS_NO = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
]

function fmtFull(d: Date): string {
  return `${d.getDate()}. ${MONTHS_NO[d.getMonth()]} ${d.getFullYear()}`
}

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface WaitlistSummaryProps {
  selectedCats: Cat[]
  dateFrom: Date
  dateTo: Date
  cageType: CageType
  cageCount: number
  specialInstructions: string
  behaviorData: CatBehaviorData[]
  wantsOutdoorCage: boolean
  onInstructionsChange: (value: string) => void
  onBack: () => void
  onConfirmed: () => void
}

export function WaitlistSummary({
  selectedCats,
  dateFrom,
  dateTo,
  cageType,
  cageCount,
  specialInstructions,
  behaviorData,
  wantsOutdoorCage = false,
  onInstructionsChange,
  onBack,
  onConfirmed,
}: WaitlistSummaryProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  console.log({ behaviorData }, wantsOutdoorCage)

  const nights = Math.round((dateTo.getTime() - dateFrom.getTime()) / 864e5)
  const breakdown = calculatePriceBreakdown(
    cageType,
    cageCount,
    selectedCats.length,
    dateFrom,
    dateTo
  )

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await addToWaitlist({
        dateFrom: localStr(dateFrom),
        dateTo: localStr(dateTo),
        numCats: selectedCats.length,
        cageType,
        cageCount,
        specialInstructions: specialInstructions || undefined,
        behaviorNotes: behaviorData.length > 0 ? behaviorData : undefined,
      })
      if (result.success) {
        setConfirmed(true)
        setTimeout(() => onConfirmed(), 1500)
      } else {
        setError(result.error ?? 'Noe gikk galt. Prøv igjen.')
      }
    })
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Du er på ventelisten!</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Vi tar kontakt så fort det åpner seg en ledig plass i perioden du
          ønsker.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Venteliste — oppsummering
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Gjennomgå venteliste-registreringen din før du bekrefter.
        </p>
      </div>

      {/* Waitlist notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="mt-0.5">
          Mathopen Kattepensjonat tar kontakt med deg dersom det åpner seg plass
          i perioden du ønsker. Du vil ikke bli belastet noe beløp før en
          eventuell booking er bekreftet.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          {/* Cats */}
          <div className="space-y-1 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Katter ({selectedCats.length})
            </p>
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
          </div>

          {/* Dates */}
          <div className="space-y-1 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Ønskede datoer
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Innsjekk</p>
                <p className="font-medium">{fmtFull(dateFrom)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Utsjekk</p>
                <p className="font-medium">{fmtFull(dateTo)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Varighet</p>
                <p className="font-medium">
                  {nights} {nights === 1 ? 'natt' : 'netter'}
                </p>
              </div>
            </div>
          </div>

          {/* Cage */}
          <div className="space-y-1 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Ønsket burtype
            </p>
            <p className="pt-1 text-sm font-medium">
              {cageCount === 2 ? '2× Standard (split)' : CAGE_LABELS[cageType]}
            </p>
          </div>

          {/* Outdoor cage note */}
          {wantsOutdoorCage && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
              🌿 Ønsker utebur — vi vil tildele et utebur dersom det er
              tilgjengelig.
            </div>
          )}

          {/* Special instructions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Spesielle ønsker (valgfritt)
            </Label>
            <Textarea
              value={specialInstructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              placeholder="F.eks. spesielle behov eller annen informasjon..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        {/* Right column — price estimate */}
        <div className="space-y-4">
          <div className="space-y-1 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Estimert pris
            </p>
            <div className="space-y-3 pt-2">
              {breakdown.lowSeasonNights > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Snowflake className="h-3 w-3" />
                    Lavsesong
                  </div>
                  <div className="rounded-md bg-secondary/60 px-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {breakdown.lowSeasonNights} netter
                      </span>
                      <span className="font-medium">
                        {breakdown.nights
                          .filter((n) => n.season === 'low')
                          .reduce((s, n) => s + n.total, 0)
                          .toLocaleString('nb-NO')}{' '}
                        kr
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {breakdown.highSeasonNights > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <SunMedium className="h-3 w-3 text-primary" />
                    Høysesong
                  </div>
                  <div className="rounded-md bg-secondary/60 px-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {breakdown.highSeasonNights} netter
                      </span>
                      <span className="font-medium">
                        {breakdown.nights
                          .filter((n) => n.season === 'high')
                          .reduce((s, n) => s + n.total, 0)
                          .toLocaleString('nb-NO')}{' '}
                        kr
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Estimert totalt</span>
                <span className="text-xl font-bold">
                  {breakdown.totalPrice.toLocaleString('nb-NO')} kr
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Estimert pris basert på valgt periode og burtype. Endelig pris
                bekreftes ved booking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={isPending}>
          Tilbake
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          size="lg"
          className="min-w-44"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrerer...
            </>
          ) : (
            'Meld meg på venteliste'
          )}
        </Button>
      </div>
    </div>
  )
}
