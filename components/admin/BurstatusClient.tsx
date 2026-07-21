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

type CardKind = CageTransitionType

const KIND_META: Record<CardKind, { label: string; className: string }> = {
  checkout: {
    label: 'UT',
    className: 'border-blue-300 bg-blue-50 text-blue-800',
  },
  checkin: {
    label: 'INN',
    className: 'border-green-300 bg-green-50 text-green-800',
  },
  swap: {
    label: 'BYTTE',
    className: 'border-orange-300 bg-orange-50 text-orange-800',
  },
}

const KIND_ORDER: CardKind[] = ['checkout', 'checkin', 'swap']

type BookingRow =
  | { kind: 'checkin'; cages: string[] }
  | { kind: 'checkout'; cages: string[] }
  | { kind: 'swap'; from: string[]; to: string[] }

type BookingCard = {
  bookingId: string
  ownerName: string
  catNames: string
  rows: BookingRow[]
}

function ownerLabel(first: string | null, last: string | null): string {
  return [last, first].filter(Boolean).join(', ') || '—'
}

// One card per booking per day, with one row per transition type
// (checkin/checkout/swap) that actually happens that day -- a booking
// swapping between two cages produces a single "swap" row instead of a
// separate card per cage, and a booking split across multiple cages lists
// all of them on the same card instead of duplicating it.
function buildBookingCards(
  entries: CheckinCheckoutEntry[],
  assignments: CageAssignment[],
  date: string
): BookingCard[] {
  const cards = new Map<string, BookingCard>()

  function getCard(
    bookingId: string,
    ownerName: string,
    catNames: string
  ): BookingCard {
    let card = cards.get(bookingId)
    if (!card) {
      card = { bookingId, ownerName, catNames, rows: [] }
      cards.set(bookingId, card)
    }
    return card
  }

  for (const e of entries) {
    // e.cage_assignments spans the whole stay (can include segments from a
    // later mid-stay swap) -- only the segment(s) covering the selected day
    // are actually relevant to a checkin/checkout event on that day.
    const activeCageLabels = Array.from(
      new Set(
        e.cage_assignments
          .filter((ca) => date >= ca.date_from && date <= ca.date_to)
          .map((ca) => ca.cage_label)
      )
    )
    const cages =
      activeCageLabels.length > 0 ? activeCageLabels : ['Ikke tildelt']
    const card = getCard(
      e.booking_id,
      ownerLabel(e.owner_first, e.owner_last),
      e.cat_names ?? ''
    )
    card.rows.push({ kind: e.event_type, cages })
  }

  const byBooking = new Map<string, CageAssignment[]>()
  for (const a of assignments) {
    const arr = byBooking.get(a.booking_id) ?? []
    arr.push(a)
    byBooking.set(a.booking_id, arr)
  }

  for (const [bookingId, list] of byBooking) {
    // Use the set difference of cages vacated vs. cages newly occupied on
    // this date, rather than pairing individual segments 1:1 -- the data
    // doesn't link a specific cat to a specific new cage, so a positional
    // pairing (end[0]<->start[0]) can misattribute or silently drop a cage
    // when a booking splits into (or consolidates from) multiple cages on
    // the swap day. A cage present in both sets didn't actually change and
    // is excluded, which also prevents a same-day multi-cage booking (both
    // date_from and date_to equal to `date` for more than one cage) from
    // being misread as a swap.
    const endingLabels = new Set(
      list.filter((a) => a.date_to === date).map((a) => a.cage_label)
    )
    const startingLabels = new Set(
      list.filter((a) => a.date_from === date).map((a) => a.cage_label)
    )
    const from = [...endingLabels].filter((l) => !startingLabels.has(l))
    const to = [...startingLabels].filter((l) => !endingLabels.has(l))
    if (from.length > 0 && to.length > 0) {
      const first = list[0]
      const card = getCard(
        bookingId,
        ownerLabel(first.owner_first, first.owner_last),
        first.cat_names
      )
      card.rows.push({ kind: 'swap', from, to })
    }
  }

  return Array.from(cards.values())
}

function primaryCageLabel(card: BookingCard): string | null {
  const row = card.rows[0]
  if (!row) return null
  return row.kind === 'swap' ? (row.from[0] ?? null) : row.cages[0]
}

function sortBookingCards(
  cards: BookingCard[],
  cageOrder: Map<string, { section: CageSection; number: number }>
): BookingCard[] {
  return [...cards].sort((a, b) => {
    const ka = Math.min(...a.rows.map((r) => KIND_ORDER.indexOf(r.kind)))
    const kb = Math.min(...b.rows.map((r) => KIND_ORDER.indexOf(r.kind)))
    if (ka !== kb) return ka - kb

    const oa = cageOrder.get(primaryCageLabel(a) ?? '')
    const ob = cageOrder.get(primaryCageLabel(b) ?? '')
    if (oa && ob) {
      if (oa.section !== ob.section) {
        return SECTION_ORDER.indexOf(oa.section) - SECTION_ORDER.indexOf(ob.section)
      }
      if (oa.number !== ob.number) return oa.number - ob.number
    }

    return a.ownerName.localeCompare(b.ownerName)
  })
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
  const bookingCards = sortBookingCards(
    buildBookingCards(entries, assignments, date),
    cageOrder
  )

  function countCards(kind: CardKind): number {
    return bookingCards.filter((c) => c.rows.some((r) => r.kind === kind)).length
  }
  const counts = {
    checkin: countCards('checkin'),
    checkout: countCards('checkout'),
    swap: countCards('swap'),
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
        {bookingCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border/40 py-12 text-sm text-muted-foreground">
            Ingen innsjekk, utsjekk eller burbytte denne dagen
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookingCards.map((card) => (
              <div
                key={card.bookingId}
                className="space-y-2 rounded-lg border border-border/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {card.ownerName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {card.catNames}
                  </p>
                </div>
                {card.rows.map((row) => {
                  const confirmed = confirmations.some(
                    (c) =>
                      c.booking_id === card.bookingId &&
                      c.transition_type === row.kind
                  )
                  const meta = KIND_META[row.kind]
                  return (
                    <div
                      key={row.kind}
                      className={cn(
                        'flex items-start gap-2 rounded-md border p-2 text-xs',
                        meta.className,
                        confirmed && 'opacity-50'
                      )}
                    >
                      <Checkbox
                        checked={confirmed}
                        onCheckedChange={() =>
                          handleToggle(card.bookingId, row.kind)
                        }
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="rounded bg-black/10 px-1 py-0.5 text-[9px] font-semibold">
                          {meta.label}
                        </span>
                        <p className="mt-1 font-medium">
                          {row.kind === 'swap'
                            ? `${row.from.join(', ')} → ${row.to.join(', ')}`
                            : row.cages.join(', ')}
                        </p>
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
