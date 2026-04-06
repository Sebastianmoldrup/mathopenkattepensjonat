'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { BookingWithCats } from '@/lib/booking/types'
import {
  getFullyBookedDates,
  getCatBlockedDates,
} from '@/lib/booking/availability'
import { getSeason, addDays } from '@/lib/booking/pricing'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DateRangeSelectionProps {
  numCats: number
  selectedCatIds: string[]
  bookings: BookingWithCats[]
  dateFrom: Date | null
  dateTo: Date | null
  onChange: (from: Date | null, to: Date | null) => void
  onNext: () => void
  onBack: () => void
}

type FocusField = 'start' | 'end'

const OPENING_DATE = new Date(2026, 6, 1) // 1. juli 2026

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

const WEEKDAYS_SHORT = ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø']

function toKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getTime() === b.getTime()
}

function calcNights(a: Date | null, b: Date | null): number {
  if (!a || !b) return 0
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 864e5)
}

function fmtShort(d: Date | null): string {
  if (!d) return ''
  return `${d.getDate()}. ${MONTHS_NO[d.getMonth()]}`
}

function fmtFull(d: Date | null): string {
  if (!d) return '—'
  return `${d.getDate()}. ${MONTHS_NO[d.getMonth()]} ${d.getFullYear()}`
}

function addMonths(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  let m = month + delta
  let y = year
  while (m > 11) {
    m -= 12
    y++
  }
  while (m < 0) {
    m += 12
    y--
  }
  return { year: y, month: m }
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday-based offset (0 = Monday … 6 = Sunday) */
function getMonthStartOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

interface MonthGridProps {
  year: number
  month: number
  minDate: Date
  maxDate: Date
  blockedSet: Set<string>
  rangeStart: Date | null
  rangeEnd: Date | null
  hoverDate: Date | null
  today: Date
  onDayClick: (date: Date) => void
  onDayHover: (date: Date) => void
  onMouseLeave: () => void
  showPrevNav: boolean
  showNextNav: boolean
  onPrev: () => void
  onNext: () => void
}

function MonthGrid({
  year,
  month,
  minDate,
  maxDate,
  blockedSet,
  rangeStart,
  rangeEnd,
  hoverDate,
  today,
  onDayClick,
  onDayHover,
  onMouseLeave,
  showPrevNav,
  showNextNav,
  onPrev,
  onNext,
}: MonthGridProps) {
  const title = `${MONTHS_NO[month].charAt(0).toUpperCase()}${MONTHS_NO[month].slice(1)} ${year}`
  const offset = getMonthStartOffset(year, month)
  const daysInMonth = getDaysInMonth(year, month)

  // Normalise range so lo ≤ hi
  const lo =
    rangeStart && rangeEnd
      ? rangeStart <= rangeEnd
        ? rangeStart
        : rangeEnd
      : rangeStart
  const hi =
    rangeStart && rangeEnd
      ? rangeStart <= rangeEnd
        ? rangeEnd
        : rangeStart
      : null

  const effHover = !hi && hoverDate && lo && hoverDate > lo ? hoverDate : null

  return (
    <div onMouseLeave={onMouseLeave}>
      {/* Month header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onPrev}
          aria-label="Forrige måned"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg border border-border',
            'text-base text-muted-foreground transition-colors hover:bg-accent',
            !showPrevNav && 'invisible'
          )}
        >
          ‹
        </button>
        <span className="text-sm font-medium capitalize">{title}</span>
        <button
          onClick={onNext}
          aria-label="Neste måned"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg border border-border',
            'text-base text-muted-foreground transition-colors hover:bg-accent',
            !showNextNav && 'invisible'
          )}
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS_SHORT.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[11px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {/* Leading empty cells */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const date = new Date(year, month, d)
          const key = toKey(date)
          const isPast = date < minDate || date > maxDate
          const isBlocked = blockedSet.has(key)
          const isHigh = getSeason(date) === 'high'
          const isToday = sameDay(date, today)

          const isStart = sameDay(date, lo)
          const isEnd = !!hi && sameDay(date, hi)
          const inRange = !!lo && !!hi && date > lo && date < hi
          const isHoverEnd = !!effHover && sameDay(date, effHover)
          const inHoverRange =
            !!lo && !hi && !!effHover && date > lo && date < effHover

          const disabled = isPast || isBlocked

          return (
            <div
              key={d}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={fmtFull(date)}
              aria-disabled={disabled}
              onMouseEnter={() => !disabled && onDayHover(date)}
              onClick={() => !disabled && onDayClick(date)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !disabled && onDayClick(date)
              }
              className={cn(
                'relative flex h-9 select-none items-center justify-center text-[13px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',

                // Base state
                !disabled &&
                  !isStart &&
                  !isEnd &&
                  !inRange &&
                  'cursor-pointer rounded-lg',

                // Disabled
                isPast && 'cursor-not-allowed text-muted-foreground opacity-35',

                // Blocked
                isBlocked &&
                  'cursor-not-allowed rounded-lg bg-red-100 text-red-400 line-through opacity-70',

                // High season (only when not selected/in-range)
                !disabled &&
                  isHigh &&
                  !isStart &&
                  !isEnd &&
                  !inRange &&
                  !inHoverRange &&
                  !isHoverEnd &&
                  'rounded-lg border-2 border-amber-400 bg-amber-100 font-medium text-amber-900',

                // Hover on non-special days
                !disabled &&
                  !isBlocked &&
                  !isStart &&
                  !isEnd &&
                  !inRange &&
                  !isHigh &&
                  !inHoverRange &&
                  !isHoverEnd &&
                  'hover:bg-accent',

                // Range selection
                isStart &&
                  !isEnd &&
                  'z-10 rounded-l-lg rounded-r-none bg-primary font-medium text-primary-foreground',
                isEnd &&
                  !isStart &&
                  'z-10 rounded-l-none rounded-r-lg bg-primary font-medium text-primary-foreground',
                isStart &&
                  isEnd &&
                  'z-10 rounded-lg bg-primary font-medium text-primary-foreground',
                inRange &&
                  'rounded-none bg-primary/15 font-medium text-primary',

                // Hover preview
                inHoverRange && 'rounded-none bg-primary/10',
                isHoverEnd &&
                  'rounded-l-none rounded-r-lg bg-primary/30 text-primary',

                // Today indicator handled via ::after below — add class
                isToday && 'day-today font-semibold'
              )}
            >
              {d}
              {isToday && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangeSelection({
  numCats,
  selectedCatIds,
  bookings,
  dateFrom,
  dateTo,
  onChange,
  onNext,
  onBack,
}: DateRangeSelectionProps) {
  const isDesktop = useIsDesktop()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const minDate = useMemo(() => {
    return today >= OPENING_DATE ? today : OPENING_DATE
  }, [today])

  const maxDate = useMemo(() => addDays(minDate, 365), [minDate])

  // ── Blocked date sets ──────────────────────────────────────────────────────
  const fullyBookedSet = useMemo(
    () => getFullyBookedDates(bookings, numCats, minDate, maxDate),
    [bookings, numCats, minDate, maxDate]
  )

  const catBlockedSet = useMemo(
    () => getCatBlockedDates(bookings, selectedCatIds, minDate, maxDate),
    [bookings, selectedCatIds, minDate, maxDate]
  )

  const blockedSet = useMemo<Set<string>>(() => {
    const merged = new Set(fullyBookedSet)
    catBlockedSet.forEach((k) => merged.add(k))
    return merged
  }, [fullyBookedSet, catBlockedSet])

  const [leftYear, setLeftYear] = useState(minDate.getFullYear())
  const [leftMonth, setLeftMonth] = useState(minDate.getMonth())
  const [focus, setFocus] = useState<FocusField>('start')
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Sync initial month to minDate whenever it changes
  useEffect(() => {
    setLeftYear(minDate.getFullYear())
    setLeftMonth(minDate.getMonth())
  }, [minDate])

  function hasBlockedInRange(from: Date, to: Date): boolean {
    const cur = new Date(from)
    while (cur < to) {
      if (blockedSet.has(toKey(cur))) return true
      cur.setDate(cur.getDate() + 1)
    }
    return false
  }

  const handleDayClick = useCallback(
    (date: Date) => {
      if (focus === 'start' || (!dateFrom && !dateTo)) {
        onChange(date, null)
        setFocus('end')
        setHoverDate(null)
      } else {
        // Selecting end
        let from = dateFrom!
        let to = date
        if (to < from) {
          ;[from, to] = [to, from]
        }

        if (hasBlockedInRange(from, to)) {
          // Reset — treat click as new start
          onChange(date, null)
          setFocus('end')
          setHoverDate(null)
        } else {
          onChange(from, to)
          setFocus('start')
          setHoverDate(null)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateFrom, dateTo, focus, blockedSet, onChange]
  )

  const handleDayHover = useCallback(
    (date: Date) => {
      if (dateFrom && !dateTo) setHoverDate(date)
    },
    [dateFrom, dateTo]
  )

  const handleMouseLeave = useCallback(() => {
    if (!dateTo) setHoverDate(null)
  }, [dateTo])

  function nav(delta: number) {
    const { year, month } = addMonths(leftYear, leftMonth, delta)
    setLeftYear(year)
    setLeftMonth(month)
  }

  const rightYear = addMonths(leftYear, leftMonth, 1).year
  const rightMonth = addMonths(leftYear, leftMonth, 1).month

  const nights = calcNights(dateFrom, dateTo)
  const canProceed = !!dateFrom && !!dateTo && nights >= 1

  const focusStart = () => setFocus('start')
  const focusEnd = () => setFocus('end')

  function clearAll() {
    onChange(null, null)
    setFocus('start')
    setHoverDate(null)
  }

  const hintText = !dateFrom
    ? 'Velg innsjekkdato'
    : !dateTo
      ? 'Velg nå utsjekkdato'
      : `${nights} natt${nights !== 1 ? 'er' : ''} valgt — ser bra ut!`

  const sharedGridProps = {
    minDate,
    maxDate,
    blockedSet,
    rangeStart: dateFrom,
    rangeEnd: dateTo,
    hoverDate,
    today,
    onDayClick: handleDayClick,
    onDayHover: handleDayHover,
    onMouseLeave: handleMouseLeave,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Velg datoer
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg innsjekk- og utsjekkdato.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 shrink-0 rounded border-2 border-amber-400 bg-amber-100" />
          Høysesong
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 shrink-0 rounded border border-border bg-background" />
          Lavsesong
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 shrink-0 rounded bg-primary" />
          Valgt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 shrink-0 rounded border border-red-300 bg-red-100" />
          Utilgjengelig
        </span>
      </div>

      {/* Calendar card */}
      <div className="w-full overflow-hidden rounded-xl border bg-card">
        {/* Check-in / Check-out fields */}
        <div className="grid grid-cols-2 border-b border-border">
          <button
            onClick={focusStart}
            className={cn(
              'border-r border-border px-5 py-3.5 text-left transition-colors',
              focus === 'start' ? 'bg-green-100' : 'hover:bg-accent'
            )}
          >
            <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Innsjekk
            </div>
            <div
              className={cn(
                'text-sm font-medium',
                !dateFrom && 'font-normal text-muted-foreground'
              )}
            >
              {dateFrom ? fmtShort(dateFrom) : 'Legg til dato'}
            </div>
          </button>

          <button
            onClick={focusEnd}
            className={cn(
              'px-5 py-3.5 text-left transition-colors',
              focus === 'end' ? 'bg-green-100' : 'hover:bg-accent'
            )}
          >
            <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Utsjekk
            </div>
            <div
              className={cn(
                'text-sm font-medium',
                !dateTo && 'font-normal text-muted-foreground'
              )}
            >
              {dateTo ? fmtShort(dateTo) : 'Legg til dato'}
            </div>
          </button>
        </div>

        {/* Month grids */}
        <div
          className={cn(
            'p-4 sm:p-5',
            isDesktop ? 'grid grid-cols-2 gap-8' : ''
          )}
        >
          <MonthGrid
            {...sharedGridProps}
            year={leftYear}
            month={leftMonth}
            showPrevNav={true}
            showNextNav={!isDesktop}
            onPrev={() => nav(-1)}
            onNext={() => nav(1)}
          />
          {isDesktop && (
            <MonthGrid
              {...sharedGridProps}
              year={rightYear}
              month={rightMonth}
              showPrevNav={false}
              showNextNav={true}
              onPrev={() => nav(-1)}
              onNext={() => nav(1)}
            />
          )}
        </div>

        {/* Hint */}
        <div className="border-t border-border px-5 pb-3 pt-3 text-xs text-muted-foreground">
          {hintText}
        </div>
      </div>

      {/* Selection summary */}
      {dateFrom && (
        <div className="rounded-xl border bg-card p-4">
          {dateTo ? (
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="mb-0.5 text-xs text-muted-foreground">Innsjekk</p>
                <p className="font-semibold">{fmtFull(dateFrom)}</p>
              </div>
              <div>
                <p className="mb-0.5 text-xs text-muted-foreground">Utsjekk</p>
                <p className="font-semibold">{fmtFull(dateTo)}</p>
              </div>
              <div>
                <p className="mb-0.5 text-xs text-muted-foreground">Netter</p>
                <p className="font-semibold text-primary">{nights}</p>
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <InfoIcon className="h-4 w-4 shrink-0" />
              Velg utsjekkdato for å fortsette
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <div className="flex items-center gap-3">
          {/* {(dateFrom || dateTo) && ( */}
          {/*   <button */}
          {/*     onClick={clearAll} */}
          {/*     className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground" */}
          {/*   > */}
          {/*     Tøm */}
          {/*   </button> */}
          {/* )} */}
          <Button onClick={onNext} disabled={!canProceed} size="lg">
            Neste
          </Button>
        </div>
      </div>
    </div>
  )
}
