'use client'

import { useState, useTransition } from 'react'
import {
  WaitlistEntry,
  adminUpdateWaitlistStatus,
  adminUpdateWaitlistPriority,
} from '@/lib/admin/actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { formatDateNO, nightsBetween } from '@/lib/admin/utils'
import { adminConvertWaitlistToBooking } from '@/lib/admin/actions'
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  XCircle,
  ArrowRightCircle,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

function WaitlistRow({ entry }: { entry: WaitlistEntry }) {
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(entry.admin_notes ?? '')
  const [priority, setPriority] = useState(entry.priority)
  const [currentStatus, setCurrentStatus] = useState(entry.status)
  const [message, setMessage] = useState<string | null>(null)

  const ownerName =
    `${entry.user_first_name ?? ''} ${entry.user_last_name ?? ''}`.trim() ||
    entry.user_email
  const nights = nightsBetween(entry.date_from, entry.date_to)

  function handleUpdateStatus(status: string) {
    startTransition(async () => {
      const result = await adminUpdateWaitlistStatus(
        entry.id,
        status,
        notes || undefined
      )
      if (result.success) {
        setCurrentStatus(status)
        setMessage(STATUS_LABELS[status])
      } else {
        setMessage(result.error ?? 'Noe gikk galt')
      }
    })
  }

  function handleUpdatePriority() {
    startTransition(async () => {
      await adminUpdateWaitlistPriority(entry.id, priority)
    })
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card',
        currentStatus === 'waiting' && 'border-amber-200',
        currentStatus === 'converted' && 'border-green-200'
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/20"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              currentStatus === 'waiting'
                ? 'bg-amber-500'
                : currentStatus === 'converted'
                  ? 'bg-green-500'
                  : 'bg-muted-foreground/30'
            )}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{ownerName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateNO(entry.date_from)} – {formatDateNO(entry.date_to)} ·{' '}
              {nights} netter · {entry.num_cats}{' '}
              {entry.num_cats === 1 ? 'katt' : 'katter'}
            </p>
          </div>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          {entry.priority > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {entry.priority}
            </span>
          )}
          <Badge
            variant="outline"
            className={cn('text-xs', STATUS_COLORS[currentStatus])}
          >
            {STATUS_LABELS[currentStatus]}
          </Badge>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t bg-muted/10 px-4 py-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">E-post</p>
              <p className="truncate font-medium">{entry.user_email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <p className="font-medium">{entry.user_phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registrert</p>
              <p className="font-medium">
                {new Date(entry.created_at).toLocaleDateString('nb-NO')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Antall katter</p>
              <p className="font-medium">{entry.num_cats}</p>
            </div>
          </div>

          {entry.special_instructions && (
            <div>
              <p className="text-xs text-muted-foreground">Spesielle ønsker</p>
              <p className="text-sm">{entry.special_instructions}</p>
            </div>
          )}

          {/* Priority */}
          <div className="flex items-center gap-2">
            <p className="shrink-0 text-xs text-muted-foreground">
              Prioritet (0 = ingen)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPriority(Math.max(0, priority - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md border text-sm hover:bg-muted"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {priority}
              </span>
              <button
                onClick={() => setPriority(priority + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border text-sm hover:bg-muted"
              >
                +
              </button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleUpdatePriority}
              disabled={isPending}
            >
              Lagre
            </Button>
          </div>
          {/* Notes */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Interne notater</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Legg til notater..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {currentStatus === 'waiting' && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => adminConvertWaitlistToBooking(entry.id)}
                disabled={isPending}
                className="gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRightCircle className="h-3.5 w-3.5" />
                )}
                Gjør om til booking
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={isPending}
                className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Kanseller
              </Button>
            </div>
          )}

          {message && (
            <p className="text-xs text-muted-foreground">{message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export function WaitlistContent({ entries }: { entries: WaitlistEntry[] }) {
  const waiting = entries.filter((e) => e.status === 'waiting')
  const converted = entries.filter((e) => e.status === 'converted')
  const cancelled = entries.filter((e) => e.status === 'cancelled')

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Venter på plass',
            value: waiting.length,
            color: waiting.length > 0 ? 'text-amber-600' : '',
          },
          {
            label: 'Gjort om til booking',
            value: converted.length,
            color: 'text-green-600',
          },
          { label: 'Kansellert', value: cancelled.length, color: '' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {waiting.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Venter ({waiting.length})
          </h2>
          {waiting.map((e) => (
            <WaitlistRow key={e.id} entry={e} />
          ))}
        </div>
      )}

      {converted.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Gjort om til booking ({converted.length})
          </h2>
          {converted.map((e) => (
            <WaitlistRow key={e.id} entry={e} />
          ))}
        </div>
      )}

      {cancelled.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Kansellert ({cancelled.length})
          </h2>
          {cancelled.map((e) => (
            <WaitlistRow key={e.id} entry={e} />
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border bg-card py-16 text-sm text-muted-foreground">
          Ingen ventelisteregistreringer ennå
        </div>
      )}
    </div>
  )
}
