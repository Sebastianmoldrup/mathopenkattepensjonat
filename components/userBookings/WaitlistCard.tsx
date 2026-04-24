'use client'

import { useState, useTransition } from 'react'
import {
  UserWaitlistEntry,
  cancelWaitlistEntry,
} from '@/lib/userBookings/actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CalendarDays, BedDouble, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CAGE_LABELS: Record<string, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

const STATUS_LABELS: Record<string, string> = {
  waiting: 'Venter',
  converted: 'Gjort om til booking',
  cancelled: 'Kansellert',
}

const STATUS_COLORS: Record<string, string> = {
  waiting: 'bg-amber-50 text-amber-700 border-amber-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

const MONTHS_NO = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mai',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'des',
]

function fmtDate(s: string): string {
  const [y, m, d] = s.split('-').map(Number)
  return `${d}. ${MONTHS_NO[m - 1]} ${y}`
}

interface WaitlistCardProps {
  entry: UserWaitlistEntry
  onCancelled: () => void
}

export function WaitlistCard({ entry, onCancelled }: WaitlistCardProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const nights = Math.round(
    (new Date(entry.date_to).getTime() - new Date(entry.date_from).getTime()) /
      864e5
  )

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelWaitlistEntry(entry.id)
      if (result.success) onCancelled()
    })
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-semibold">Venteliste</span>
        </div>
        <Badge
          variant="outline"
          className={cn('shrink-0 text-xs', STATUS_COLORS[entry.status])}
        >
          {STATUS_LABELS[entry.status]}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Ønsket innsjekk</p>
          <p className="font-medium">{fmtDate(entry.date_from)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ønsket utsjekk</p>
          <p className="font-medium">{fmtDate(entry.date_to)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Netter</p>
          <p className="font-medium">{nights}</p>
        </div>
        {entry.cage_type && (
          <div>
            <p className="text-xs text-muted-foreground">Ønsket bur</p>
            <p className="font-medium">
              {CAGE_LABELS[entry.cage_type] ?? entry.cage_type}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground">Antall katter</p>
          <p className="font-medium">{entry.num_cats}</p>
        </div>
      </div>

      {entry.special_instructions && (
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {entry.special_instructions}
        </p>
      )}

      {/* Info */}
      {entry.status === 'waiting' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Vi tar kontakt dersom det åpner seg plass i ønsket periode.
        </div>
      )}

      {/* Cancel */}
      {entry.status === 'waiting' && (
        <div>
          {!confirmCancel ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmCancel(true)}
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            >
              <XCircle className="h-3.5 w-3.5" />
              Meld meg av ventelisten
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Er du sikker?</p>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancel}
                disabled={isPending}
                className="h-7 gap-1 text-xs"
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Ja, meld av
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmCancel(false)}
                className="h-7 text-xs"
              >
                Avbryt
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
