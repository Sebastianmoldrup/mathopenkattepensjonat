'use client'

import { useMemo, useState, useCallback } from 'react'
import {
  AdminBooking,
  CAGE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatDateNO,
} from '@/lib/admin/utils'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
const TOTAL_CAGES = 20

// Defined outside component — stable references, no recreation on render
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

function getOccupancyColor(count: number): string {
  if (count === 0) return ''
  if (count <= 5) return 'bg-primary/20'
  if (count <= 10) return 'bg-primary/40'
  if (count <= 15) return 'bg-primary/60'
  return 'bg-primary/80'
}

// Stable today value — computed once outside component
const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)
const TODAY_KEY = localKey(TODAY)

interface OccupancyCalendarProps {
  bookings: AdminBooking[]
}

export function OccupancyCalendar({
  bookings: allBookings,
}: OccupancyCalendarProps) {
  const [year, setYear] = useState(TODAY.getFullYear())
  const [month, setMonth] = useState(TODAY.getMonth())
  const [selected, setSelected] = useState<AdminBooking[] | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Build occupancy map — only recomputes when bookings change
  const occupancyMap = useMemo(() => {
    const map = new Map<string, AdminBooking[]>()
    const activeBookings = allBookings.filter(
      (b) => b.status === 'pending' || b.status === 'confirmed'
    )
    for (const booking of activeBookings) {
      const [fy, fm, fd] = booking.date_from.split('-').map(Number)
      const [ty, tm, td] = booking.date_to.split('-').map(Number)
      const from = new Date(fy, fm - 1, fd)
      const to = new Date(ty, tm - 1, td)
      const current = new Date(from)
      while (current < to) {
        const key = localKey(current)
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(booking)
        current.setDate(current.getDate() + 1)
      }
    }
    return map
  }, [allBookings])

  const nav = useCallback((delta: number) => {
    setMonth((m) => {
      let next = m + delta
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

  const handleDayClick = useCallback(
    (day: number, year: number, month: number) => {
      const date = new Date(year, month, day)
      const key = localKey(date)
      const bookingsOnDay = occupancyMap.get(key) ?? []
      setSelectedDate(key)
      setSelected(bookingsOnDay.length > 0 ? bookingsOnDay : null)
    },
    [occupancyMap]
  )

  const daysInMonth = getDaysInMonth(year, month)
  const offset = getStartOffset(year, month)

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border bg-card p-5">
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
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/20" /> 1–5 bur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/40" /> 6–10 bur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/60" /> 11–15 bur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/80" /> 16–20 bur
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1">
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
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const bookingsOnDay = occupancyMap.get(key) ?? []
            const count = bookingsOnDay.reduce(
              (sum, b) => sum + b.cage_count,
              0
            )
            const isToday = key === TODAY_KEY
            const isSelected = key === selectedDate
            const isPast = new Date(year, month, day) < TODAY

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day, year, month)}
                className={cn(
                  'relative flex h-10 w-full flex-col items-center justify-center rounded-md transition-all',
                  getOccupancyColor(count),
                  isToday && 'ring-2 ring-primary',
                  isSelected && 'ring-2 ring-foreground',
                  isPast && 'opacity-50',
                  count > 0
                    ? 'cursor-pointer hover:opacity-80'
                    : 'hover:bg-muted'
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-medium leading-none',
                    count > 10 && 'text-primary-foreground'
                  )}
                >
                  {day}
                </span>
                {count > 0 && (
                  <span
                    className={cn(
                      'mt-0.5 text-[8px] leading-none',
                      count > 10 ? 'text-primary-foreground/80' : 'text-primary'
                    )}
                  >
                    {count}/{TOTAL_CAGES}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day bookings */}
      {selectedDate && (
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">
            Bookinger {formatDateNO(selectedDate)}
            {selected ? ` (${selected.length})` : ' — ingen aktive bookinger'}
          </h3>
          {selected ? (
            <div className="space-y-2">
              {selected.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {b.user_first_name} {b.user_last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.num_cats} katt{b.num_cats !== 1 ? 'er' : ''} ·{' '}
                      {b.cage_count === 2
                        ? '2× Standard'
                        : CAGE_LABELS[b.cage_type]}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-1 text-xs font-medium',
                      STATUS_COLORS[b.status]
                    )}
                  >
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>
              ))}
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
