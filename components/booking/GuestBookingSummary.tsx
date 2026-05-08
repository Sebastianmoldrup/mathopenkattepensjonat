'use client'

import { useState } from 'react'
import { CageType } from '@/lib/booking/types'
import {
  calculatePriceBreakdown,
  formatDateNO,
  parseDateStr,
} from '@/lib/booking/pricing'
import { AuthGateStep } from './AuthGateStep'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TriangleAlert } from 'lucide-react'

const CAGE_LABELS: Record<CageType, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

interface Props {
  catCount: number
  dateFrom: string
  dateTo: string
  cageType: CageType
  cageCount: number
  onBack: () => void
  onLoginSuccess: () => void
}

export function GuestBookingSummary({
  catCount,
  dateFrom,
  dateTo,
  cageType,
  cageCount,
  onBack,
  onLoginSuccess,
}: Props) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const breakdown = calculatePriceBreakdown(
    cageType,
    cageCount,
    catCount,
    dateFrom,
    dateTo
  )
  const dateFromDate = parseDateStr(dateFrom)
  const dateToDate = parseDateStr(dateTo)

  const cageLabel =
    cageCount === 2 && cageType === 'standard'
      ? '2× Standard (split)'
      : CAGE_LABELS[cageType]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Oppsummering</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Logg inn for å velge katter og sende bookingforespørsel.
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
            <p className="text-xs text-muted-foreground">Antall katter</p>
            <p className="text-sm font-semibold">{catCount}</p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-2 p-4">
          <p className="mb-2 text-xs text-muted-foreground">Estimert pris</p>
          {breakdown.lowSeasonDays > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Lavsesong · {breakdown.lowSeasonDays} natt
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
                Høysesong · {breakdown.highSeasonDays} natt
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
            <span>Estimert totalt</span>
            <span className="text-lg text-primary">
              {breakdown.totalPrice.toLocaleString('nb-NO')} kr
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            * Endelig pris avhenger av faktisk antall katter valgt ved
            innlogging.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Logg inn for å velge katter og sende bookingforespørsel. Periode og
          burtype huskes.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button size="lg" onClick={() => setShowAuthDialog(true)}>
          Logg inn og fortsett
        </Button>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Logg inn for å fortsette</DialogTitle>
          </DialogHeader>
          <AuthGateStep
            onAuthenticated={() => {
              setShowAuthDialog(false)
              onLoginSuccess()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
