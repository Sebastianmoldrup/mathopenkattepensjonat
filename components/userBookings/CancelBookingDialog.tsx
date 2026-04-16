'use client'

import { useState } from 'react'
// import { cancelBooking } from '@/lib/userBookings/actions'
import { cancelBooking } from '@/lib/booking/cancelBooking'
import {
  CancellationEligibility,
  formatDeadline,
} from '@/lib/userBookings/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2, Mail } from 'lucide-react'

interface CancelBookingDialogProps {
  bookingId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  eligibility: CancellationEligibility
}

export function CancelBookingDialog({
  bookingId,
  open,
  onOpenChange,
  eligibility,
}: CancelBookingDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    setIsLoading(true)
    setError(null)

    const result = await cancelBooking(bookingId)

    if (!result.success) {
      setError(result.error ?? 'Noe gikk galt.')
      setIsLoading(false)
      return
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avbestill booking</DialogTitle>
          <DialogDescription>
            Er du sikker på at du vil avbestille denne bookingen?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Past deadline warning */}
          {eligibility.pastDeadline && (
            <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Avbestillingsfristen er passert
              </div>
              <p className="text-sm text-amber-700">
                {eligibility.season === 'high'
                  ? 'For høysesong må avbestilling skje senest 7 dager før ankomst.'
                  : 'For lavsesong må avbestilling skje senest 24 timer før ankomst.'}
              </p>
              <p className="text-sm font-medium text-amber-800">
                Ved avbestilling nå belastes 50 % av oppholdets pris.
              </p>
            </div>
          )}

          {/* Normal policy info */}
          {!eligibility.pastDeadline && eligibility.deadline && (
            <div className="space-y-1 rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Avbestillingsfrist:{' '}
                </span>
                {formatDeadline(eligibility.deadline)}
              </p>
              <p className="text-sm text-muted-foreground">
                {eligibility.season === 'high'
                  ? 'Høysesong: senest 7 dager før ankomst uten gebyr.'
                  : 'Lavsesong: senest 24 timer før ankomst uten gebyr.'}
              </p>
            </div>
          )}

          {/* Email notice */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Mail className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Avbestilling skal bekreftes skriftlig per e-post. Vi sender deg en
              bekreftelse.
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Avbryt
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Avbestiller...
              </>
            ) : (
              'Bekreft avbestilling'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
