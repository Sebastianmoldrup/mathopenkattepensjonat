'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Loader2, LogIn, LogOut, Repeat } from 'lucide-react'
import { adminGetCheckinCheckoutByDate } from '@/lib/admin/actions'
import type { CheckinCheckoutEntry } from '@/lib/admin/actions'
import { getCageAssignments } from '@/lib/admin/cageActions'
import type { CageAssignment, CageSection } from '@/lib/admin/cageActions'
import {
  getCageDayConfirmations,
  toggleCageConfirmation,
} from '@/lib/admin/cageStatusActions'
import type {
  CageConfirmation,
  CageTransitionType,
} from '@/lib/admin/cageStatusActions'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type CageOption = {
  cage_id: string
  cage_label: string
  cage_section: CageSection
  cage_number: number
}

type Props = {
  initialDate: string
  initialEntries: CheckinCheckoutEntry[]
  initialAssignments: CageAssignment[]
  initialConfirmations: CageConfirmation[]
  allCages: CageOption[]
}

function localStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const SECTION_ORDER: CageSection[] = [
  'standard',
  'senior_comfort',
  'suite',
  'outdoor',
]
const SECTION_LABELS: Record<CageSection, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
  outdoor: 'Utebur',
}

type CageEventKind = 'checkin' | 'checkout' | 'swap-out' | 'swap-in'

const KIND_META: Record<
  CageEventKind,
  { label: string; order: number; className: string }
> = {
  checkout: {
    label: 'UT',
    order: 0,
    className: 'border-blue-300 bg-blue-50 text-blue-800',
  },
  'swap-out': {
    label: 'UT · bytte',
    order: 0,
    className: 'border-orange-300 bg-orange-50 text-orange-800',
  },
  checkin: {
    label: 'INN',
    order: 1,
    className: 'border-green-300 bg-green-50 text-green-800',
  },
  'swap-in': {
    label: 'INN · bytte',
    order: 1,
    className: 'border-orange-300 bg-orange-50 text-orange-800',
  },
}

type CageEvent = {
  key: string
  bookingId: string
  transitionType: CageTransitionType
  kind: CageEventKind
  cageLabel: string
  ownerName: string
  catNames: string
  otherCageLabel: string | null
}

function ownerLabel(first: string | null, last: string | null): string {
  return [last, first].filter(Boolean).join(', ') || '—'
}

function buildCageEvents(
  entries: CheckinCheckoutEntry[],
  assignments: CageAssignment[],
  date: string
): CageEvent[] {
  const events: CageEvent[] = []

  for (const e of entries) {
    const owner = ownerLabel(e.owner_first, e.owner_last)
    // e.cage_assignments spans the whole stay (can include segments from a
    // later mid-stay swap) -- only the segment(s) covering the selected day
    // are actually relevant to a checkin/checkout event on that day.
    const activeCageLabels = new Set(
      e.cage_assignments
        .filter((ca) => date >= ca.date_from && date <= ca.date_to)
        .map((ca) => ca.cage_label)
    )
    const cages = activeCageLabels.size > 0 ? Array.from(activeCageLabels) : ['Ikke tildelt']
    for (const cageLabel of cages) {
      events.push({
        key: `${e.booking_id}-${e.event_type}-${cageLabel}`,
        bookingId: e.booking_id,
        transitionType: e.event_type,
        kind: e.event_type,
        cageLabel,
        ownerName: owner,
        catNames: e.cat_names ?? '',
        otherCageLabel: null,
      })
    }
  }

  for (const a of assignments) {
    const owner = ownerLabel(a.owner_first, a.owner_last)

    if (a.date_from === date) {
      const prev = assignments.find(
        (o) =>
          o.booking_id === a.booking_id &&
          o.assignment_id !== a.assignment_id &&
          o.cage_id !== a.cage_id &&
          o.date_from < a.date_from
      )
      if (prev) {
        events.push({
          key: `${a.assignment_id}-swap-in`,
          bookingId: a.booking_id,
          transitionType: 'swap',
          kind: 'swap-in',
          cageLabel: a.cage_label,
          ownerName: owner,
          catNames: a.cat_names,
          otherCageLabel: prev.cage_label,
        })
      }
    }

    if (a.date_to === date) {
      const next = assignments.find(
        (o) =>
          o.booking_id === a.booking_id &&
          o.assignment_id !== a.assignment_id &&
          o.cage_id !== a.cage_id &&
          o.date_from > a.date_from
      )
      if (next) {
        events.push({
          key: `${a.assignment_id}-swap-out`,
          bookingId: a.booking_id,
          transitionType: 'swap',
          kind: 'swap-out',
          cageLabel: a.cage_label,
          ownerName: owner,
          catNames: a.cat_names,
          otherCageLabel: next.cage_label,
        })
      }
    }
  }

  return events
}

function groupEventsByCage(
  events: CageEvent[],
  cageOrder: Map<string, { section: CageSection; number: number }>
): { cageLabel: string; events: CageEvent[] }[] {
  const groups = new Map<string, CageEvent[]>()
  for (const ev of events) {
    const arr = groups.get(ev.cageLabel) ?? []
    arr.push(ev)
    groups.set(ev.cageLabel, arr)
  }

  const result = Array.from(groups.entries()).map(([cageLabel, evs]) => ({
    cageLabel,
    events: [...evs].sort(
      (x, y) => KIND_META[x.kind].order - KIND_META[y.kind].order
    ),
  }))

  result.sort((a, b) => {
    const oa = cageOrder.get(a.cageLabel)
    const ob = cageOrder.get(b.cageLabel)
    if (!oa || !ob) return a.cageLabel.localeCompare(b.cageLabel)
    if (oa.section !== ob.section) {
      return SECTION_ORDER.indexOf(oa.section) - SECTION_ORDER.indexOf(ob.section)
    }
    return oa.number - ob.number
  })

  return result
}

export default function BurstatusClient({
  initialDate,
  initialEntries,
  initialAssignments,
  initialConfirmations,
  allCages,
}: Props) {
  const router = useRouter()
  const [date, setDate] = useState(initialDate)
  const [entries, setEntries] = useState(initialEntries)
  const [assignments, setAssignments] = useState(initialAssignments)
  const [confirmations, setConfirmations] = useState(initialConfirmations)
  const [isLoading, setIsLoading] = useState(false)

  function handleDateChange(newDate: string) {
    if (!ISO_DATE_RE.test(newDate)) return
    setDate(newDate)
    router.push('/admin/burstatus?dato=' + newDate, { scroll: false })
    setIsLoading(true)
    const parsed = new Date(newDate + 'T12:00:00')
    const windowFrom = localStr(addDays(parsed, -1))
    const windowTo = localStr(addDays(parsed, 1))
    Promise.all([
      adminGetCheckinCheckoutByDate(newDate),
      getCageAssignments(windowFrom, windowTo),
      getCageDayConfirmations(newDate),
    ]).then(([newEntries, newAssignments, newConfirmations]) => {
      setEntries(newEntries)
      setAssignments(newAssignments)
      setConfirmations(newConfirmations)
      setIsLoading(false)
    })
  }

  function navigateDay(direction: -1 | 1) {
    const d = parseISO(date)
    d.setDate(d.getDate() + direction)
    handleDateChange(localStr(d))
  }

  async function handleToggle(
    bookingId: string,
    transitionType: CageTransitionType
  ) {
    const wasConfirmed = confirmations.some(
      (c) => c.booking_id === bookingId && c.transition_type === transitionType
    )
    setConfirmations((prev) =>
      wasConfirmed
        ? prev.filter(
            (c) =>
              !(c.booking_id === bookingId && c.transition_type === transitionType)
          )
        : [
            ...prev,
            {
              booking_id: bookingId,
              transition_type: transitionType,
              confirmed_by: null,
              confirmed_at: new Date().toISOString(),
            },
          ]
    )
    try {
      await toggleCageConfirmation(date, bookingId, transitionType)
    } catch {
      const fresh = await getCageDayConfirmations(date)
      setConfirmations(fresh)
    }
  }

  const cageOrder = new Map(
    allCages.map((c) => [c.cage_label, { section: c.cage_section, number: c.cage_number }])
  )
  const cageEvents = buildCageEvents(entries, assignments, date)
  const cageGroups = groupEventsByCage(cageEvents, cageOrder)

  function countDistinctBookings(kind: CageEventKind): number {
    return new Set(
      cageEvents.filter((e) => e.kind === kind).map((e) => e.bookingId)
    ).size
  }
  const counts = {
    checkin: countDistinctBookings('checkin'),
    checkout: countDistinctBookings('checkout'),
    swap: countDistinctBookings('swap-in'),
  }

  const occupantByCageLabel = new Map<string, CageAssignment>()
  for (const a of assignments) {
    if (date >= a.date_from && date <= a.date_to) {
      occupantByCageLabel.set(a.cage_label, a)
    }
  }

  const dateLabel = format(parseISO(date), 'EEEE d. MMMM yyyy', { locale: nb })
  const isToday = date === localStr(new Date())

  const cagesBySection = SECTION_ORDER.map((section) => ({
    section,
    cages: allCages
      .filter((c) => c.cage_section === section)
      .sort((a, b) => a.cage_number - b.cage_number),
  })).filter((s) => s.cages.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold capitalize">{dateLabel}</h1>
          {isToday && (
            <span className="text-xs text-muted-foreground">I dag</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDay(-1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            ‹ Forrige
          </button>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="h-8 w-40 text-xs"
          />
          <button
            onClick={() => handleDateChange(localStr(new Date()))}
            disabled={isLoading || isToday}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            I dag
          </button>
          <button
            onClick={() => navigateDay(1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            Neste ›
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Laster...
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <LogIn className="h-3.5 w-3.5 text-green-600" />
          {counts.checkin} innsjekk
        </span>
        <span className="flex items-center gap-1.5">
          <LogOut className="h-3.5 w-3.5 text-blue-600" />
          {counts.checkout} utsjekk
        </span>
        <span className="flex items-center gap-1.5">
          <Repeat className="h-3.5 w-3.5 text-orange-600" />
          {counts.swap} burbytte
        </span>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Bur-hendelser i dag</h2>
        {cageGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border/40 py-12 text-sm text-muted-foreground">
            Ingen innsjekk, utsjekk eller burbytte denne dagen
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cageGroups.map((group) => (
              <div
                key={group.cageLabel}
                className="space-y-2 rounded-lg border border-border/40 p-3"
              >
                <p className="text-xs font-semibold text-foreground">
                  {group.cageLabel}
                </p>
                {group.events.map((ev) => {
                  const confirmed = confirmations.some(
                    (c) =>
                      c.booking_id === ev.bookingId &&
                      c.transition_type === ev.transitionType
                  )
                  const meta = KIND_META[ev.kind]
                  return (
                    <div
                      key={ev.key}
                      className={cn(
                        'flex items-start gap-2 rounded-md border p-2 text-xs',
                        meta.className,
                        confirmed && 'opacity-50'
                      )}
                    >
                      <Checkbox
                        checked={confirmed}
                        onCheckedChange={() =>
                          handleToggle(ev.bookingId, ev.transitionType)
                        }
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-black/10 px-1 py-0.5 text-[9px] font-semibold">
                            {meta.label}
                          </span>
                          <span className="truncate font-medium">
                            {ev.ownerName}
                          </span>
                        </div>
                        <p className="truncate text-muted-foreground">
                          {ev.catNames}
                        </p>
                        {ev.otherCageLabel && (
                          <p className="mt-0.5 font-medium">
                            {ev.kind === 'swap-out' ? '→ ' : '← '}
                            {ev.otherCageLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Alle bur</h2>
        <div className="space-y-4">
          {cagesBySection.map(({ section, cages }) => (
            <div key={section} className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {SECTION_LABELS[section]}
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
                {cages.map((c) => {
                  const occ = occupantByCageLabel.get(c.cage_label)
                  const isSwapInvolved =
                    !!occ &&
                    assignments.some(
                      (o) =>
                        o.booking_id === occ.booking_id &&
                        o.assignment_id !== occ.assignment_id &&
                        o.cage_id !== occ.cage_id
                    )
                  return (
                    <div
                      key={c.cage_id}
                      className="rounded-md border border-border/40 p-2 text-[10px]"
                      style={
                        occ
                          ? {
                              background: isSwapInvolved ? '#F0997B' : '#C0DD97',
                              color: isSwapInvolved ? '#4A1B0C' : '#27500A',
                            }
                          : undefined
                      }
                    >
                      <p className="truncate font-semibold">{c.cage_label}</p>
                      {occ ? (
                        <p className="truncate">
                          {ownerLabel(occ.owner_first, occ.owner_last)} —{' '}
                          {occ.cat_names}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">Ledig</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
