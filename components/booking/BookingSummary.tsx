'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Cat, CageType, Booking } from '@/lib/booking/types'
import {
  calculatePriceBreakdown,
  formatDateNO,
  parseDateStr,
} from '@/lib/booking/pricing'
import { createBooking } from '@/lib/booking/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, TriangleAlert } from 'lucide-react'

interface BookingSummaryProps {
  userId: string
  selectedCats: Cat[]
  dateFrom: string
  dateTo: string
  cageType: CageType
  cageCount: number
  numCats: number
  specialInstructions: string
  bookings: Booking[]
  wantsOutdoorCage: boolean
  waitlistRequested: boolean
  onInstructionsChange: (v: string) => void
  onOutdoorCageChange: (v: boolean) => void
  onWaitlistChange: (v: boolean) => void
  onBack: () => void
  onConfirmed: () => void
  userEmail: string
  userFirstName: string
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
  numCats,
  specialInstructions,
  wantsOutdoorCage,
  waitlistRequested,
  onInstructionsChange,
  onOutdoorCageChange,
  onWaitlistChange,
  onBack,
  onConfirmed,
  userEmail,
  userFirstName,
}: BookingSummaryProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const breakdown = calculatePriceBreakdown(
    cageType,
    cageCount,
    numCats,
    dateFrom,
    dateTo
  )
  const dateFromDate = parseDateStr(dateFrom)
  const dateToDate = parseDateStr(dateTo)

  const cageLabel =
    cageCount === 2 && cageType === 'standard'
      ? '2× Standard (split)'
      : CAGE_LABELS[cageType]

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      await createBooking({
        userId,
        dateFrom,
        dateTo,
        cageType,
        cageCount,
        numCats,
        price: breakdown.totalPrice,
        catIds: selectedCats.map((c) => c.id),
        catNames: selectedCats.map((c) => c.name),
        specialInstructions: specialInstructions || undefined,
        wantsOutdoorCage,
        waitlistRequested,
        userEmail,
        userFirstName: userFirstName,
      })
      onConfirmed()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Noe gikk galt. Prøv igjen.'
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Oppsummering</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bekreft bookingen din.
        </p>
      </div>

      {/* Amber info banner */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Bookingen din er <strong>ikke bekreftet</strong> før du mottar en
          bekreftelse på e-post fra oss. Vi behandler forespørselen din så raskt
          som mulig.
        </p>
      </div>

      {/* Booking details */}
      <div className="divide-y divide-border rounded-xl border bg-card">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Innsjekk</p>
            <p className="text-sm font-semibold">
              {formatDateNO(dateFromDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Utsjekk</p>
            <p className="text-sm font-semibold">{formatDateNO(dateToDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Burtype</p>
            <p className="text-sm font-semibold">{cageLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dager</p>
            <p className="text-sm font-semibold">{breakdown.totalDays}</p>
          </div>
        </div>

        {/* Cats */}
        <div className="p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Katter ({selectedCats.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {selectedCats.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border bg-muted">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="32px"
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

        {/* Price breakdown */}
        <div className="space-y-2 p-4">
          <p className="mb-2 text-xs text-muted-foreground">Prisfordeling</p>
          {breakdown.lowSeasonDays > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Lavsesong · {breakdown.lowSeasonDays} dag
                {breakdown.lowSeasonDays !== 1 ? 'er' : ''}
              </span>
              <span>
                {breakdown.days
                  .filter((d) => d.season === 'low')
                  .reduce((s, d) => s + d.total, 0)
                  .toLocaleString('nb-NO')}{' '}
                kr
              </span>
            </div>
          )}
          {breakdown.highSeasonDays > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Høysesong · {breakdown.highSeasonDays} dag
                {breakdown.highSeasonDays !== 1 ? 'er' : ''}
              </span>
              <span>
                {breakdown.days
                  .filter((d) => d.season === 'high')
                  .reduce((s, d) => s + d.total, 0)
                  .toLocaleString('nb-NO')}{' '}
                kr
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Totalt</span>
            <span className="text-lg text-primary">
              {breakdown.totalPrice.toLocaleString('nb-NO')} kr
            </span>
          </div>
        </div>
      </div>

      {/* Outdoor cage option */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30">
        <input
          type="checkbox"
          checked={wantsOutdoorCage}
          onChange={(e) => onOutdoorCageChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <div>
          <p className="text-sm font-medium">Ønsker utebur</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Vi har 4 utebur tilgjengelig. Dette er et ønske og kan ikke
            garanteres.
          </p>
        </div>
      </label>

      {/* Waitlist option */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30">
        <input
          type="checkbox"
          checked={waitlistRequested}
          onChange={(e) => onWaitlistChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <div>
          <p className="text-sm font-medium">
            Sett meg på venteliste ved fullt
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Dersom det ikke er plass, ønsker jeg å stå på venteliste og bli
            kontaktet hvis det åpner seg.
          </p>
        </div>
      </label>

      {/* Special instructions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Spesielle instruksjoner</label>
        <Textarea
          value={specialInstructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="Annen informasjon du ønsker å dele med oss..."
          rows={3}
          className="resize-none"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={submitting}>
          Tilbake
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          size="lg"
          className="min-w-36"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sender inn…
            </>
          ) : (
            'Send bookingforespørsel'
          )}
        </Button>
      </div>
    </div>
  )
}
