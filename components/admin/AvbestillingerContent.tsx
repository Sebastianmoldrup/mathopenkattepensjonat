'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  CancellationEntry,
  adminUpdateFeeStatus,
  adminSendFeeReminder,
} from '@/lib/admin/actions'
import { AdminBooking } from '@/lib/admin/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  CheckCircle2,
  Mail,
  XCircle,
  Edit2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}.${m}.${y}`
}

// ─── Filter types ─────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'unpaid' | 'paid' | 'no_fee' | 'admin' | 'customer'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'unpaid', label: 'Ubetalt gebyr' },
  { key: 'paid', label: 'Betalt gebyr' },
  { key: 'no_fee', label: 'Gebyrfri' },
  { key: 'admin', label: 'Avlyst av oss' },
  { key: 'customer', label: 'Avbestilt av kunde' },
]

// ─── Single row ───────────────────────────────────────────────────────────────

function CancellationRow({ entry }: { entry: CancellationEntry }) {
  const [isPending, startTransition] = useTransition()
  const [editingFee, setEditingFee] = useState(false)
  const [feeInput, setFeeInput] = useState(
    entry.cancellation_fee?.toString() ?? ''
  )
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
    null
  )
  const [currentFee, setCurrentFee] = useState(entry.cancellation_fee)
  const [currentPaid, setCurrentPaid] = useState(entry.fee_paid)
  const [expanded, setExpanded] = useState(false)

  const ownerName =
    `${entry.user_first_name ?? ''} ${entry.user_last_name ?? ''}`.trim() ||
    entry.user_email
  const cancelledByAdmin = entry.cancelled_by === 'admin'
  const hasFee = currentFee !== null && currentFee > 0

  function handleMarkPaid(paid: boolean) {
    setMessage(null)
    startTransition(async () => {
      const result = await adminUpdateFeeStatus(entry.id, paid)
      if (result.success) {
        setCurrentPaid(paid)
        setMessage({
          text: paid ? 'Markert som betalt' : 'Angret betalt-status',
          ok: true,
        })
      } else {
        setMessage({ text: result.error ?? 'Noe gikk galt', ok: false })
      }
    })
  }

  function handleSaveFee() {
    const fee = parseFloat(feeInput) || 0
    setMessage(null)
    startTransition(async () => {
      const result = await adminUpdateFeeStatus(
        entry.id,
        currentPaid,
        fee || undefined
      )
      if (result.success) {
        setCurrentFee(fee || null)
        setFeeInput(fee ? fee.toString() : '')
        setEditingFee(false)
        setMessage({ text: 'Gebyr oppdatert', ok: true })
      } else {
        setMessage({ text: result.error ?? 'Noe gikk galt', ok: false })
      }
    })
  }

  function handleSendReminder() {
    if (!currentFee) return
    setMessage(null)
    startTransition(async () => {
      const booking = {
        id: entry.id,
        date_from: entry.date_from,
        date_to: entry.date_to,
        price: entry.price,
        user_email: entry.user_email,
        user_first_name: entry.user_first_name,
        user_last_name: entry.user_last_name,
        cats: (entry.cat_names ?? '').split(', ').map((name) => ({ name })),
      } as unknown as AdminBooking
      const result = await adminSendFeeReminder(booking, currentFee)
      setMessage(
        result.success
          ? { text: 'Påminnelse sendt', ok: true }
          : { text: result.error ?? 'Noe gikk galt', ok: false }
      )
    })
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card transition-all',
        hasFee && !currentPaid && 'border-amber-200',
        hasFee && currentPaid && 'border-green-200'
      )}
    >
      {/* ── Summary row (always visible) ─────────────────────────────────── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/20"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Status dot */}
          <span
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              !hasFee
                ? 'bg-muted-foreground/40'
                : currentPaid
                  ? 'bg-green-500'
                  : 'bg-amber-500'
            )}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{ownerName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {entry.cat_names ?? '—'} · {formatDate(entry.date_from)} –{' '}
              {formatDate(entry.date_to)}
            </p>
          </div>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2">
          {/* Fee badge */}
          {hasFee ? (
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-xs font-semibold',
                currentPaid
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              )}
            >
              {currentPaid ? '✓' : '!'} {currentFee!.toLocaleString('nb-NO')} kr
            </span>
          ) : (
            <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              Gebyrfri
            </span>
          )}
          <span className="hidden text-xs text-muted-foreground sm:block">
            {cancelledByAdmin ? 'Avlyst av oss' : 'Av kunde'}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* ── Expanded detail ───────────────────────────────────────────────── */}
      {expanded && (
        <div className="space-y-4 border-t bg-muted/10 px-4 py-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">E-post</p>
              <p className="truncate font-medium">{entry.user_email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <p className="font-medium">{entry.user_phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bookingverdi</p>
              <p className="font-medium">
                {entry.price.toLocaleString('nb-NO')} kr
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avbestilt av</p>
              <p className="font-medium">
                {cancelledByAdmin ? 'Oss (admin)' : 'Kunden'}
              </p>
            </div>
          </div>

          {/* Fee editor */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Avbestillingsgebyr
            </p>
            {editingFee ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  className="h-8 w-28 text-sm"
                  placeholder="0"
                  type="number"
                  min="0"
                />
                <span className="text-sm text-muted-foreground">kr</span>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleSaveFee}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Lagre'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => setEditingFee(false)}
                >
                  Avbryt
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    hasFee
                      ? currentPaid
                        ? 'text-green-700'
                        : 'text-amber-700'
                      : 'text-muted-foreground'
                  )}
                >
                  {hasFee
                    ? `${currentFee!.toLocaleString('nb-NO')} kr`
                    : 'Ingen gebyr'}
                </span>
                <button
                  onClick={() => {
                    setEditingFee(true)
                    setFeeInput(currentFee?.toString() ?? '')
                  }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          {entry.cancellation_note && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Notat</p>
              <p className="text-sm">{entry.cancellation_note}</p>
            </div>
          )}

          {/* Actions */}
          {hasFee && (
            <div className="flex flex-wrap gap-2 pt-1">
              {!currentPaid ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleMarkPaid(true)}
                    disabled={isPending}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    Marker som betalt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendReminder}
                    disabled={isPending}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Mail className="h-3.5 w-3.5" />
                    )}
                    Send påminnelse
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleMarkPaid(false)}
                  disabled={isPending}
                  className="h-8 gap-1.5 text-xs text-muted-foreground"
                >
                  <XCircle className="h-3.5 w-3.5" /> Angre betalt-status
                </Button>
              )}
            </div>
          )}

          {/* Message */}
          {message && (
            <p
              className={cn(
                'rounded-md px-2 py-1.5 text-xs',
                message.ok
                  ? 'bg-green-50 text-green-700'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {message.text}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AvbestillingerContent({
  entries,
}: {
  entries: CancellationEntry[]
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'unpaid':
        return entries.filter(
          (e) => e.cancellation_fee && e.cancellation_fee > 0 && !e.fee_paid
        )
      case 'paid':
        return entries.filter(
          (e) => e.cancellation_fee && e.cancellation_fee > 0 && e.fee_paid
        )
      case 'no_fee':
        return entries.filter(
          (e) => !e.cancellation_fee || e.cancellation_fee === 0
        )
      case 'admin':
        return entries.filter((e) => e.cancelled_by === 'admin')
      case 'customer':
        return entries.filter((e) => e.cancelled_by === 'customer')
      default:
        return entries
    }
  }, [entries, activeFilter])

  // Summary counts
  const unpaidCount = entries.filter(
    (e) => e.cancellation_fee && e.cancellation_fee > 0 && !e.fee_paid
  ).length
  const paidCount = entries.filter(
    (e) => e.cancellation_fee && e.cancellation_fee > 0 && e.fee_paid
  ).length
  const totalUnpaid = entries
    .filter((e) => e.cancellation_fee && e.cancellation_fee > 0 && !e.fee_paid)
    .reduce((sum, e) => sum + (e.cancellation_fee ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Totalt avbestillinger', value: entries.length, color: '' },
          {
            label: 'Utestående gebyr',
            value: unpaidCount,
            color: unpaidCount > 0 ? 'text-amber-600' : '',
          },
          {
            label: 'Totalt utestående',
            value: `${totalUnpaid.toLocaleString('nb-NO')} kr`,
            color: totalUnpaid > 0 ? 'text-amber-600' : '',
          },
          {
            label: 'Gebyr betalt',
            value: paidCount,
            color: paidCount > 0 ? 'text-green-600' : '',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className={cn('text-xl font-bold', color)}>{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === 'all'
              ? entries.length
              : key === 'unpaid'
                ? unpaidCount
                : key === 'paid'
                  ? paidCount
                  : key === 'no_fee'
                    ? entries.filter(
                        (e) => !e.cancellation_fee || e.cancellation_fee === 0
                      ).length
                    : key === 'admin'
                      ? entries.filter((e) => e.cancelled_by === 'admin').length
                      : entries.filter((e) => e.cancelled_by === 'customer')
                          .length

          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                activeFilter === key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  activeFilter === key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <CancellationRow key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border bg-card py-16 text-sm text-muted-foreground">
          {entries.length === 0
            ? 'Ingen avbestillinger ennå'
            : 'Ingen treff for dette filteret'}
        </div>
      )}
    </div>
  )
}
