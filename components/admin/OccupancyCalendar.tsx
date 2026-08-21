'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import {
  AdminBooking,
  CAGE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatDateNO,
} from '@/lib/admin/utils'
import {
  getCageAssignments,
  CageAssignment,
  CageSection,
} from '@/lib/admin/cageActions'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, LogIn, LogOut, Cat, Repeat } from 'lucide-react'

// Physical cages are numbered globally 1-max across the whole building, not
// restarting per section (confirmed by the owner: Standard 1-14, Senior &
// Komfort 15-17, Suite 18-20, Utebur 21-27) -- this is purely a display
// concern for staff walking the building, the underlying `cages` table
// still stores per-section labels ("Suite 2") and numbers. Deliberately
// NOT touching that table or burplassering's cage matching (which keys off
// the raw label string) -- this offset is display-only, scoped to this
// page, translating the label's trailing local number at render time.
const CAGE_SECTION_OFFSET: Record<CageSection, number> = {
  standard: 0,
  senior_comfort: 14,
  suite: 17,
  outdoor: 20,
}

const CAGE_SECTION_LABELS: Record<CageSection, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
  outdoor: 'Utebur',
}

// Cage labels are consistently "{Type} {N}" (e.g. "Suite 2") -- confirmed
// against the live cages table. Falls back to the raw label if a label
// ever doesn't match, rather than showing a wrong number.
function toGlobalCageLabel(label: string, section: CageSection): string {
  const match = label.match(/(\d+)\s*$/)
  if (!match) return label
  return `Bur ${Number(match[1]) + CAGE_SECTION_OFFSET[section]}`
}

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
const MONTHS_NO = [
  'Januar',
  'Februar',
  'Mars',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Desember',
]

function localKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDaysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}

function getStartOffset(y: number, m: number): number {
  const day = new Date(y, m, 1).getDay()
  return day === 0 ? 6 : day - 1
}

interface DayData {
  catCount: number
  innCount: number
  utCount: number
  bookings: AdminBooking[]
}

interface OccupancyCalendarProps {
  bookings: AdminBooking[]
}

type CageStatus =
  | { kind: 'none' }
  | { kind: 'active'; cages: CageAssignment[] }
  | { kind: 'swap'; from: CageAssignment[]; to: CageAssignment[] }

// Same set-difference approach used (and regression-tested) for the
// burstatus page's swap detection: pair cages by which ones are actually
// vacated vs. newly occupied on this specific date, rather than pairing
// segments positionally. That avoids two real bugs a naive 1:1 pairing
// hits -- dropping a cage when a booking splits into multiple cages on
// its swap day, and fabricating a phantom swap when a booking simply has
// more than one cage active on the same day with no real change (a label
// present in both the "ending" and "starting" sets didn't actually
// change, so it's excluded from both).
function getCageStatus(segments: CageAssignment[], date: string): CageStatus {
  const ending = segments.filter((s) => s.date_to === date)
  const starting = segments.filter((s) => s.date_from === date)
  const endingLabels = new Set(ending.map((s) => s.cage_label))
  const startingLabels = new Set(starting.map((s) => s.cage_label))
  const from = ending.filter((s) => !startingLabels.has(s.cage_label))
  const to = starting.filter((s) => !endingLabels.has(s.cage_label))

  if (from.length > 0 && to.length > 0) {
    return { kind: 'swap', from, to }
  }

  const active = segments.filter((s) => date >= s.date_from && date <= s.date_to)
  if (active.length > 0) {
    return { kind: 'active', cages: active }
  }
  return { kind: 'none' }
}

export function OccupancyCalendar({
  bookings: allBookings,
}: OccupancyCalendarProps) {
  // Computed inside the component (not at module scope) so it's evaluated
  // fresh per render -- a module-level `new Date()` only runs once per
  // Node.js server-process lifetime (module caching), so in a long-running
  // dev/prod server it silently goes stale and disagrees with the
  // browser's freshly-evaluated "now" on every subsequent page load,
  // causing a hydration mismatch on the `isToday` styling.
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const todayKey = useMemo(() => localKey(today), [today])

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Cage assignments (which specific physical cage, not just type) are
  // fetched scoped to the visible month and refetched on navigation --
  // same pattern burplassering already uses for this exact RPC, rather
  // than pulling years of assignment history up front the way `bookings`
  // itself is (that's fine for booking rows, but assignments are a much
  // larger, per-day table).
  const [cageAssignments, setCageAssignments] = useState<CageAssignment[]>([])

  useEffect(() => {
    let cancelled = false
    const monthStart = localKey(new Date(year, month, 1))
    const monthEnd = localKey(new Date(year, month + 1, 0))
    getCageAssignments(monthStart, monthEnd)
      .then((data) => {
        if (!cancelled) setCageAssignments(data)
      })
      .catch((err) => {
        console.error('[OccupancyCalendar] getCageAssignments', err)
        if (!cancelled) setCageAssignments([])
      })
    return () => {
      cancelled = true
    }
  }, [year, month])

  const assignmentsByBooking = useMemo(() => {
    const map = new Map<string, CageAssignment[]>()
    for (const a of cageAssignments) {
      const arr = map.get(a.booking_id) ?? []
      arr.push(a)
      map.set(a.booking_id, arr)
    }
    return map
  }, [cageAssignments])

  // Build per-day occupancy + inn/ut counts -- only recomputes when bookings change.
  // Both check-in day and check-out day count as occupied (matches the
  // day-based billing model: both days are billed), so date ranges are
  // walked inclusive of date_to, not exclusive like the cage-capacity math
  // in lib/booking/availability.ts (which deliberately excludes checkout
  // day so a cage can be re-booked same-day without double counting).
  const dayMap = useMemo(() => {
    const map = new Map<string, DayData>()
    const activeBookings = allBookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'completed'
    )

    function getDay(key: string): DayData {
      let entry = map.get(key)
      if (!entry) {
        entry = { catCount: 0, innCount: 0, utCount: 0, bookings: [] }
        map.set(key, entry)
      }
      return entry
    }

    for (const booking of activeBookings) {
      const [fy, fm, fd] = booking.date_from.split('-').map(Number)
      const [ty, tm, td] = booking.date_to.split('-').map(Number)
      const from = new Date(fy, fm - 1, fd)
      const to = new Date(ty, tm - 1, td)

      const current = new Date(from)
      while (current <= to) {
        const key = localKey(current)
        const day = getDay(key)
        day.catCount += booking.num_cats
        day.bookings.push(booking)
        current.setDate(current.getDate() + 1)
      }

      getDay(booking.date_from).innCount += booking.num_cats
      getDay(booking.date_to).utCount += booking.num_cats
    }

    return map
  }, [allBookings])

  // Heatmap intensity relative to the busiest day in the *visible* month,
  // not a hardcoded cage/cat total -- avoids yet another stale constant to
  // keep in sync as cage inventory changes.
  const monthMaxCatCount = useMemo(() => {
    let max = 0
    for (let d = 1; d <= getDaysInMonth(year, month); d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      max = Math.max(max, dayMap.get(key)?.catCount ?? 0)
    }
    return max
  }, [dayMap, year, month])

  function getOccupancyColor(count: number): string {
    if (count === 0 || monthMaxCatCount === 0) return ''
    const ratio = count / monthMaxCatCount
    if (ratio <= 0.25) return 'bg-primary/15'
    if (ratio <= 0.5) return 'bg-primary/30'
    if (ratio <= 0.75) return 'bg-primary/50'
    return 'bg-primary/70'
  }

  const nav = useCallback((delta: number) => {
    setMonth((m) => {
      const next = m + delta
      if (next > 11) {
        setYear((y) => y + 1)
        return 0
      }
      if (next < 0) {
        setYear((y) => y - 1)
        return 11
      }
      return next
    })
  }, [])

  const handleDayClick = useCallback((key: string) => {
    setSelectedDate((prev) => (prev === key ? null : key))
  }, [])

  const daysInMonth = getDaysInMonth(year, month)
  const offset = getStartOffset(year, month)
  const selectedDay = selectedDate ? dayMap.get(selectedDate) : null

  // Check-ins/check-outs surfaced above bookings that are just passing
  // through that day -- those are the ones staff actually need to act on.
  // Matches the checkout-before-checkin convention already used on the
  // burstatus page. A stable sort (native Array#sort in modern JS engines)
  // keeps each group's original relative order, so this only reorders the
  // three priority buckets, nothing within them.
  const sortedBookings = useMemo(() => {
    if (!selectedDay) return []
    function priority(b: AdminBooking): number {
      if (b.date_to === selectedDate) return 0
      if (b.date_from === selectedDate) return 1
      return 2
    }
    return [...selectedDay.bookings].sort((a, b) => priority(a) - priority(b))
  }, [selectedDay, selectedDate])

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => nav(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-base font-semibold">
            {MONTHS_NO[month]} {year}
          </h2>
          <button
            onClick={() => nav(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5 text-green-600" /> Innsjekk
          </span>
          <span className="flex items-center gap-1.5">
            <LogOut className="h-3.5 w-3.5 text-blue-600" /> Utsjekk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/70" /> Mange katter
            denne måneden
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const data = dayMap.get(key)
            const catCount = data?.catCount ?? 0
            const innCount = data?.innCount ?? 0
            const utCount = data?.utCount ?? 0
            const isToday = key === todayKey
            const isSelected = key === selectedDate

            return (
              <button
                key={day}
                onClick={() => handleDayClick(key)}
                className={cn(
                  'flex h-20 w-full flex-col items-center justify-center gap-0.5 rounded-md transition-all sm:h-16',
                  getOccupancyColor(catCount),
                  isToday && 'ring-2 ring-primary',
                  isSelected && 'ring-2 ring-foreground',
                  catCount > 0
                    ? 'cursor-pointer hover:opacity-80'
                    : 'hover:bg-muted'
                )}
              >
                <span className="text-[11px] font-medium leading-none text-muted-foreground">
                  {day}
                </span>
                {catCount > 0 && (
                  <span className="flex items-center gap-0.5 text-sm font-semibold leading-none">
                    <Cat className="h-3 w-3" />
                    {catCount}
                  </span>
                )}
                {(innCount > 0 || utCount > 0) && (
                  <span className="flex flex-col items-center gap-0 text-[9px] leading-tight sm:flex-row sm:gap-1.5 sm:leading-none">
                    {innCount > 0 && (
                      <span className="flex items-center gap-0.5 text-green-700">
                        <LogIn className="h-2.5 w-2.5" />
                        {innCount}
                      </span>
                    )}
                    {utCount > 0 && (
                      <span className="flex items-center gap-0.5 text-blue-700">
                        <LogOut className="h-2.5 w-2.5" />
                        {utCount}
                      </span>
                    )}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day bookings */}
      {selectedDate && (
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-5">
          <h3 className="text-sm font-semibold">
            Bookinger {formatDateNO(selectedDate)}
            {selectedDay
              ? ` (${selectedDay.bookings.length})`
              : ' — ingen aktive bookinger'}
          </h3>
          {selectedDay ? (
            <div className="space-y-2">
              {sortedBookings.map((b) => {
                const isCheckinToday = b.date_from === selectedDate
                const isCheckoutToday = b.date_to === selectedDate
                const cageStatus = selectedDate
                  ? getCageStatus(assignmentsByBooking.get(b.id) ?? [], selectedDate)
                  : ({ kind: 'none' } as const)

                return (
                <div key={b.id} className="space-y-2.5 rounded-lg border p-3 text-sm sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {b.user_first_name} {b.user_last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.num_cats} katt{b.num_cats !== 1 ? 'er' : ''}
                      </p>
                      {cageStatus.kind === 'swap' ? (
                        <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-orange-700">
                          <Repeat className="h-3.5 w-3.5 shrink-0" />
                          {cageStatus.from
                            .map((s) => toGlobalCageLabel(s.cage_label, s.cage_section))
                            .join(', ')}{' '}
                          →{' '}
                          {cageStatus.to
                            .map((s) => toGlobalCageLabel(s.cage_label, s.cage_section))
                            .join(', ')}
                          <span className="text-xs font-normal text-muted-foreground">
                            (bytte i dag)
                          </span>
                        </p>
                      ) : cageStatus.kind === 'active' ? (
                        <p className="mt-0.5 text-sm font-semibold">
                          {cageStatus.cages
                            .map((s) => toGlobalCageLabel(s.cage_label, s.cage_section))
                            .join(', ')}{' '}
                          <span className="text-xs font-normal text-muted-foreground">
                            ·{' '}
                            {[
                              ...new Set(
                                cageStatus.cages.map((s) => CAGE_SECTION_LABELS[s.cage_section])
                              ),
                            ].join(', ')}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                          {b.cage_count === 2 ? '2× Standard' : CAGE_LABELS[b.cage_type]}{' '}
                          <span className="text-xs font-normal">(ikke tildelt)</span>
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      {isCheckinToday && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-green-300 bg-green-50 px-1.5 py-1 text-xs font-medium text-green-800"
                        >
                          <LogIn className="h-3 w-3" /> Innsjekk i dag
                        </Badge>
                      )}
                      {isCheckoutToday && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-blue-300 bg-blue-50 px-1.5 py-1 text-xs font-medium text-blue-800"
                        >
                          <LogOut className="h-3 w-3" /> Utsjekk i dag
                        </Badge>
                      )}
                      {!isCheckinToday && !isCheckoutToday && (
                        <Badge
                          variant="outline"
                          className="px-1.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                          Blir i dag
                        </Badge>
                      )}
                      <span
                        className={cn(
                          'rounded-full border px-2 py-1 text-xs font-medium',
                          STATUS_COLORS[b.status]
                        )}
                      >
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                  </div>

                  {b.cats && b.cats.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t pt-2.5">
                      {b.cats.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5"
                        >
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
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium leading-none">
                              {cat.name}
                            </span>
                            {(cat.gets_medication ||
                              (cat.behavior_notes && cat.behavior_notes.trim())) && (
                              <div className="flex flex-wrap gap-1">
                                {cat.gets_medication && (
                                  <Badge
                                    variant="outline"
                                    className="border-amber-300 bg-amber-100 px-1.5 py-0 text-[10px] font-normal leading-tight text-amber-800"
                                  >
                                    På medisiner
                                  </Badge>
                                )}
                                {cat.behavior_notes && cat.behavior_notes.trim() && (
                                  <Badge
                                    variant="outline"
                                    className="border-orange-300 bg-orange-100 px-1.5 py-0 text-[10px] font-normal leading-tight text-orange-800"
                                  >
                                    Adferdsnotat
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ingen bookinger på denne datoen.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
