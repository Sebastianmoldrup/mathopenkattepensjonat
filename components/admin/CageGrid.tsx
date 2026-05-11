'use client'

import React, { useState, useRef, useTransition, useEffect } from 'react'
import { addDays, format, parseISO, isBefore, isAfter } from 'date-fns'
import { nb } from 'date-fns/locale'
import { AlertTriangle, Clock } from 'lucide-react'
import {
  assignCage,
  updateCageAssignment,
  deleteCageAssignment,
  splitCageAssignment,
  getCageAssignments,
  getUnassignedConfirmed,
  getFreeCages,
  getCageConflicts,
} from '@/lib/admin/cageActions'
import type {
  CageAssignment,
  UnassignedBooking,
  CageOption,
  CageConflict,
} from '@/lib/admin/cageActions'

const SECTIONS = [
  {
    key: 'standard',
    label: 'Standard (1–14)',
    cages: Array.from({ length: 14 }, (_, i) => `Standard ${i + 1}`),
    headerClass: 'bg-blue-50 text-blue-700',
  },
  {
    key: 'senior_comfort',
    label: 'Senior & Komfort (1–3)',
    cages: ['Senior & Komfort 1', 'Senior & Komfort 2', 'Senior & Komfort 3'],
    displayLabels: ['S&K 1', 'S&K 2', 'S&K 3'],
    headerClass: 'bg-purple-50 text-purple-700',
  },
  {
    key: 'suite',
    label: 'Suite (1–3)',
    cages: ['Suite 1', 'Suite 2', 'Suite 3'],
    headerClass: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'outdoor',
    label: 'Utebur (1–5)',
    cages: ['Utebur 1', 'Utebur 2', 'Utebur 3', 'Utebur 4', 'Utebur 5'],
    headerClass: 'bg-teal-50 text-teal-700',
  },
  {
    key: 'other',
    label: 'Uten bur',
    cages: Array.from({ length: 10 }, (_, i) =>
      i === 0 ? 'Uten bur' : `Uten bur ${i + 1}`
    ),
    headerClass: 'bg-gray-100 text-gray-500',
  },
]

const CAGE_TYPE_LABELS: Record<string, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

type SelectedBlock =
  | { type: 'assigned'; assignment: CageAssignment }
  | { type: 'unassigned'; booking: UnassignedBooking }

type Props = {
  initialAssignments: CageAssignment[]
  initialUnassigned: UnassignedBooking[]
  initialFree: CageOption[]
  allCages: CageOption[]
  initialWindowStart: string
}

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function blockLabel(
  ownerFirst: string,
  ownerLast: string,
  cats: string
): string {
  const firstCat = cats.split(',')[0].trim()
  return `${ownerLast} — ${firstCat}`
}

export default function CageGrid({
  initialAssignments,
  initialUnassigned,
  initialFree,
  allCages,
  initialWindowStart,
}: Props) {
  const parsed = parseISO(initialWindowStart)
  const [windowStart, setWindowStart] = useState<Date>(
    new Date(parsed.getFullYear(), parsed.getMonth(), 1)
  )
  const [assignments, setAssignments] = useState(initialAssignments)
  const [unassigned, setUnassigned] = useState(initialUnassigned)
  const [sidebarFreeCages, setSidebarFreeCages] = useState<CageOption[]>([])
  const [selected, setSelected] = useState<SelectedBlock | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    refreshData(windowStart)
  }, [])

  const daysInCurrentMonth = new Date(
    windowStart.getFullYear(),
    windowStart.getMonth() + 1,
    0
  ).getDate()
  const windowEnd = addDays(windowStart, daysInCurrentMonth - 1)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) =>
    addDays(windowStart, i)
  )

  async function refreshData(from: Date) {
    const dim = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate()
    const to = addDays(from, dim - 1)
    const [newAssignments, newUnassigned] = await Promise.all([
      getCageAssignments(localStr(from), localStr(to)),
      getUnassignedConfirmed(),
    ])
    setAssignments(newAssignments)
    setUnassigned(newUnassigned)
  }

  function handleMonthChange(direction: -1 | 0 | 1) {
    let newStart: Date
    if (direction === 0) {
      const t = new Date()
      newStart = new Date(t.getFullYear(), t.getMonth(), 1)
    } else {
      newStart = new Date(
        windowStart.getFullYear(),
        windowStart.getMonth() + direction,
        1
      )
    }
    setWindowStart(newStart)
    setSelected(null)
    startTransition(async () => {
      await refreshData(newStart)
    })
  }

  async function handleSelectBlock(block: SelectedBlock) {
    const from =
      block.type === 'assigned'
        ? block.assignment.date_from
        : block.booking.date_from
    const to =
      block.type === 'assigned'
        ? block.assignment.date_to
        : block.booking.date_to
    const free = await getFreeCages(from, to)
    setSidebarFreeCages(free)
    setSelected(block)
  }

  async function handleAssign(
    cageId: string,
    dateFrom: string,
    dateTo: string
  ) {
    if (selected?.type !== 'unassigned') return
    startTransition(async () => {
      await assignCage(selected.booking.booking_id, cageId, dateFrom, dateTo)
      await refreshData(windowStart)
      setSelected(null)
    })
  }

  async function handleUpdate(
    cageId: string,
    dateFrom: string,
    dateTo: string
  ) {
    if (selected?.type !== 'assigned') return
    startTransition(async () => {
      await updateCageAssignment(
        selected.assignment.assignment_id,
        cageId,
        dateFrom,
        dateTo
      )
      await refreshData(windowStart)
      setSelected(null)
    })
  }

  async function handleDelete() {
    if (selected?.type !== 'assigned') return
    startTransition(async () => {
      await deleteCageAssignment(selected.assignment.assignment_id)
      await refreshData(windowStart)
      setSelected(null)
    })
  }

  async function handleSplit(splitDate: string, secondCageId: string) {
    if (selected?.type !== 'assigned') return
    startTransition(async () => {
      await splitCageAssignment(
        selected.assignment.assignment_id,
        splitDate,
        secondCageId
      )
      await refreshData(windowStart)
      setSelected(null)
    })
  }

  // For unassigned conflict flow: assign first then split
  async function handleAssignThenSplit(
    firstCageId: string,
    dateFrom: string,
    dateTo: string,
    splitDate: string,
    secondCageId: string
  ) {
    if (selected?.type !== 'unassigned') return
    startTransition(async () => {
      const assignmentId = await assignCage(
        selected.booking.booking_id,
        firstCageId,
        dateFrom,
        dateTo
      )
      await splitCageAssignment(assignmentId, splitDate, secondCageId)
      await refreshData(windowStart)
      setSelected(null)
    })
  }

  const outsideUnassigned = unassigned.filter((b) => {
    const from = parseISO(b.date_from)
    const to = parseISO(b.date_to)
    return isBefore(to, windowStart) || isAfter(from, windowEnd)
  })

  const insideUnassigned = unassigned.filter((b) => {
    const from = parseISO(b.date_from)
    const to = parseISO(b.date_to)
    return !(isBefore(to, windowStart) || isAfter(from, windowEnd))
  })

  function renderCageRow(cageLabel: string) {
    const cells: React.ReactNode[] = []
    let d = 0

    while (d < daysInCurrentMonth) {
      const day = days[d]
      const dayStr = localStr(day)
      const isToday = dayStr === localStr(today)

      const dayAssignments = assignments.filter((x) => {
        if (x.cage_label !== cageLabel) return false
        return dayStr >= x.date_from && dayStr <= x.date_to
      })

      if (dayAssignments.length === 0) {
        cells.push(
          <td
            key={d}
            className={`h-8 border-b border-r border-border/40 p-0 ${isToday ? 'bg-blue-50/40' : ''}`}
          />
        )
        d++
        continue
      }

      // Two bookings share this day — split cell in half
      if (dayAssignments.length >= 2) {
        const left =
          dayAssignments.find((x) => x.date_to === dayStr) ?? dayAssignments[0]
        const right =
          dayAssignments.find((x) => x.date_from === dayStr) ??
          dayAssignments[1]

        const leftSwap = assignments.some(
          (o) =>
            o.booking_id === left.booking_id &&
            o.assignment_id !== left.assignment_id &&
            o.cage_id !== left.cage_id &&
            o.date_from < left.date_from
        )
        const rightSwap = assignments.some(
          (o) =>
            o.booking_id === right.booking_id &&
            o.assignment_id !== right.assignment_id &&
            o.cage_id !== right.cage_id &&
            o.date_from < right.date_from
        )

        const isSelectedLeft =
          selected?.type === 'assigned' &&
          selected.assignment.assignment_id === left.assignment_id
        const isSelectedRight =
          selected?.type === 'assigned' &&
          selected.assignment.assignment_id === right.assignment_id

        cells.push(
          <td
            key={d}
            className={`h-8 border-b border-r border-border/40 p-0 ${isToday ? 'bg-blue-50/40' : ''}`}
          >
            <div className="flex h-full w-full">
              <button
                onClick={() =>
                  handleSelectBlock({ type: 'assigned', assignment: left })
                }
                className={`flex h-full w-1/2 items-center overflow-hidden px-1 text-[9px] font-medium ${isSelectedLeft ? 'ring-2 ring-inset ring-amber-500' : ''}`}
                style={{
                  background: leftSwap ? '#F0997B' : '#C0DD97',
                  color: leftSwap ? '#4A1B0C' : '#27500A',
                  borderRadius: 0,
                }}
              >
                <span className="truncate">
                  {blockLabel(
                    left.owner_first,
                    left.owner_last,
                    left.cat_names
                  )}
                </span>
              </button>
              <button
                onClick={() =>
                  handleSelectBlock({ type: 'assigned', assignment: right })
                }
                className={`flex h-full w-1/2 items-center overflow-hidden px-1 text-[9px] font-medium ${isSelectedRight ? 'ring-2 ring-inset ring-amber-500' : ''}`}
                style={{
                  background: rightSwap ? '#F0997B' : '#C0DD97',
                  color: rightSwap ? '#4A1B0C' : '#27500A',
                  borderRadius: 0,
                }}
              >
                <span className="truncate">
                  {blockLabel(
                    right.owner_first,
                    right.owner_last,
                    right.cat_names
                  )}
                </span>
              </button>
            </div>
          </td>
        )
        d++
        continue
      }

      const a = dayAssignments[0]
      const isCageSwap = assignments.some(
        (other) =>
          other.booking_id === a.booking_id &&
          other.assignment_id !== a.assignment_id &&
          other.cage_id !== a.cage_id &&
          other.date_from < a.date_from
      )

      const label = isCageSwap
        ? `↪ ${blockLabel(a.owner_first, a.owner_last, a.cat_names)}`
        : blockLabel(a.owner_first, a.owner_last, a.cat_names)

      const isSelected =
        selected?.type === 'assigned' &&
        selected.assignment.assignment_id === a.assignment_id

      const bg = isCageSwap ? '#F0997B' : '#C0DD97'
      const color = isCageSwap ? '#4A1B0C' : '#27500A'

      let span = 0
      for (let dd = d; dd < daysInCurrentMonth; dd++) {
        const cur = localStr(days[dd])
        if (cur >= a.date_from && cur < a.date_to) span++
        else if (span > 0) break
      }

      const collisionOnLastDay = assignments.some(
        (x) =>
          x.cage_label === cageLabel &&
          x.assignment_id !== a.assignment_id &&
          x.date_from === a.date_to
      )
      if (!collisionOnLastDay && a.date_to <= localStr(windowEnd)) span++
      if (span === 0) span = 1

      const collisionOnFirstDay = assignments.some(
        (x) =>
          x.cage_label === cageLabel &&
          x.assignment_id !== a.assignment_id &&
          x.date_to === a.date_from
      )

      const continuesRight =
        a.date_to > localStr(windowEnd) || collisionOnLastDay
      const startsHere =
        a.date_from >= localStr(windowStart) && !collisionOnFirstDay

      cells.push(
        <td
          key={d}
          colSpan={span}
          className={`h-8 border-b border-r border-border/40 p-0 ${isToday ? 'bg-blue-50/40' : ''}`}
        >
          <button
            onClick={() =>
              handleSelectBlock({ type: 'assigned', assignment: a })
            }
            className={`flex h-full w-full items-center overflow-hidden px-1.5 text-[10px] font-medium ${isSelected ? 'ring-2 ring-inset ring-amber-500' : ''}`}
            style={{
              background: bg,
              color,
              borderRadius: continuesRight
                ? startsHere
                  ? '2px 0 0 2px'
                  : '0'
                : startsHere
                  ? '2px'
                  : '0 2px 2px 0',
            }}
          >
            <span className="truncate">{label}</span>
            <span className="ml-1 flex-shrink-0 rounded bg-black/10 px-1 py-0.5 text-[9px]">
              {a.cage_label
                .replace('Senior & Komfort', 'S&K')
                .replace(/\s*\d+$/, '')}
            </span>
            {a.has_note && (
              <span className="ml-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black/20" />
            )}
          </button>
        </td>
      )
      d += span
    }

    return cells
  }

  function renderUnassignedRows() {
    if (insideUnassigned.length === 0) return null

    return insideUnassigned.map((booking) => {
      const from = parseISO(booking.date_from)
      const to = parseISO(booking.date_to)
      const cells: React.ReactNode[] = []
      let d = 0

      while (d < daysInCurrentMonth) {
        const day = days[d]
        const inRange = !isAfter(from, day) && isAfter(to, day)

        if (!inRange) {
          cells.push(
            <td
              key={d}
              className="h-8 border-b border-r border-border/40 bg-amber-50/30 p-0"
            />
          )
          d++
          continue
        }

        const blockStart = isAfter(from, windowStart) ? from : windowStart
        const blockEnd = isBefore(to, windowEnd) ? to : windowEnd

        let span = 0
        for (let dd = d; dd < daysInCurrentMonth; dd++) {
          const cur = days[dd]
          if (!isBefore(cur, blockStart) && !isAfter(cur, blockEnd)) span++
          else if (span > 0) break
        }
        if (span === 0) span = 1

        const isSelected =
          selected?.type === 'unassigned' &&
          selected.booking.booking_id === booking.booking_id

        cells.push(
          <td
            key={d}
            colSpan={span}
            className="h-8 border-b border-r border-border/40 bg-amber-50/30 p-0"
          >
            <button
              onClick={() => handleSelectBlock({ type: 'unassigned', booking })}
              className={[
                'flex h-full w-full items-center rounded-sm px-1.5 text-[10px] font-medium',
                'overflow-hidden whitespace-nowrap text-left transition-all',
                'bg-[#FAC775] text-[#633806] hover:brightness-95',
                isSelected ? 'ring-2 ring-amber-600 ring-offset-0' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="truncate">
                {blockLabel(
                  booking.owner_first,
                  booking.owner_last,
                  booking.cat_names
                )}
              </span>
              <span className="ml-1.5 flex-shrink-0 rounded bg-black/10 px-1 py-0.5 text-[9px] font-medium">
                {CAGE_TYPE_LABELS[booking.cage_type] ?? booking.cage_type}
              </span>
            </button>
          </td>
        )
        d += span
      }

      return (
        <tr key={booking.booking_id}>
          <td className="whitespace-nowrap border-b border-r border-border/40 bg-amber-50/60 px-2 text-[10px] font-medium text-amber-700">
            Ikke tildelt
          </td>
          {cells}
        </tr>
      )
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">Burplassering</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { color: '#C0DD97', label: 'Tildelt' },
            { color: '#F0997B', label: 'Burbytte' },
            { color: '#FAC775', label: 'Ikke tildelt' },
          ].map(({ color, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
            >
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                style={{ background: color }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>

      {(insideUnassigned.length > 0 || outsideUnassigned.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {insideUnassigned.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {insideUnassigned.length} booking
              {insideUnassigned.length > 1 ? 'er' : ''} uten burtildeling i
              dette vinduet
            </div>
          )}
          {outsideUnassigned.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              {outsideUnassigned.length} utenfor vinduet:{' '}
              {outsideUnassigned
                .map((b) =>
                  format(parseISO(b.date_from), 'd. MMM', { locale: nb })
                )
                .join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMonthChange(-1)}
            disabled={isPending}
            className="flex items-center gap-1 rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            ‹ Forrige
          </button>
          <button
            onClick={() => handleMonthChange(0)}
            disabled={isPending}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            I dag
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            disabled={isPending}
            className="flex items-center gap-1 rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            Neste ›
          </button>
        </div>
        <span className="text-sm font-medium text-foreground">
          {format(windowStart, 'MMMM yyyy', { locale: nb })}
        </span>
      </div>

      {selected && (
        <CageGridSidebar
          selected={selected}
          allCages={allCages}
          freeCages={sidebarFreeCages}
          dateFrom={
            selected.type === 'assigned'
              ? selected.assignment.date_from
              : selected.booking.date_from
          }
          dateTo={
            selected.type === 'assigned'
              ? selected.assignment.date_to
              : selected.booking.date_to
          }
          onClose={() => setSelected(null)}
          onAssign={handleAssign}
          onAssignThenSplit={handleAssignThenSplit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onSplit={handleSplit}
          isPending={isPending}
        />
      )}

      <div
        className={`rounded-lg border border-border/40 transition-opacity ${isPending ? 'opacity-60' : ''}`}
      >
        <div className="overflow-x-auto">
          <div className="max-h-[75vh] overflow-y-auto">
            <table
              className="w-full border-collapse"
              style={{ tableLayout: 'fixed', minWidth: 900 }}
            >
              <thead className="sticky top-0 z-10 bg-muted/80">
                <tr>
                  <th className="w-[80px] border-b border-r border-border/40 bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                    Bur
                  </th>
                  {days.map((day) => {
                    const isToday = localStr(day) === localStr(today)
                    const isFirstOfMonth = day.getDate() === 1
                    return (
                      <th
                        key={localStr(day)}
                        className={`border-b border-r border-border/40 py-1 text-center font-medium ${
                          isToday
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-muted/60 text-muted-foreground'
                        }`}
                        style={{ fontSize: 9 }}
                      >
                        {isFirstOfMonth
                          ? format(day, 'd MMM', { locale: nb })
                          : format(day, 'd')}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {renderUnassignedRows()}
                {SECTIONS.map((section) => (
                  <React.Fragment key={section.key}>
                    <tr>
                      <td
                        colSpan={daysInCurrentMonth + 1}
                        className={`border-b px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${section.headerClass}`}
                      >
                        {section.label}
                      </td>
                    </tr>
                    {section.cages.map((cageLabel, idx) => (
                      <tr key={cageLabel}>
                        <td className="whitespace-nowrap border-b border-r border-border/40 bg-muted/40 px-2 text-[10px] font-medium text-muted-foreground">
                          {section.displayLabels?.[idx] ?? cageLabel}
                        </td>
                        {renderCageRow(cageLabel)}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

type SidebarMode =
  | 'view'
  | 'assign'
  | 'change'
  | 'split'
  | 'confirm-delete'
  | 'conflict'

type SidebarProps = {
  selected: SelectedBlock
  allCages: CageOption[]
  freeCages: CageOption[]
  dateFrom: string
  dateTo: string
  onClose: () => void
  onAssign: (cageId: string, dateFrom: string, dateTo: string) => Promise<void>
  onAssignThenSplit: (
    firstCageId: string,
    dateFrom: string,
    dateTo: string,
    splitDate: string,
    secondCageId: string
  ) => Promise<void>
  onUpdate: (cageId: string, dateFrom: string, dateTo: string) => Promise<void>
  onDelete: () => Promise<void>
  onSplit: (splitDate: string, secondCageId: string) => Promise<void>
  isPending: boolean
}

function CageGridSidebar({
  selected,
  allCages,
  freeCages,
  dateFrom,
  dateTo,
  onClose,
  onAssign,
  onAssignThenSplit,
  onUpdate,
  onDelete,
  onSplit,
  isPending,
}: SidebarProps) {
  const [mode, setMode] = useState<SidebarMode>('view')
  const [selectedCageId, setSelectedCageId] = useState('')
  const [secondCageId, setSecondCageId] = useState('')
  const [splitDate, setSplitDate] = useState('')
  const [conflicts, setConflicts] = useState<CageConflict[]>([])
  const [checkingConflicts, setCheckingConflicts] = useState(false)
  // Store first cage selection when transitioning to conflict mode
  const firstCageRef = useRef('')

  const isAssigned = selected.type === 'assigned'
  const a = isAssigned ? selected.assignment : null
  const b = !isAssigned ? selected.booking : null

  const ownerName = isAssigned
    ? `${a!.owner_first} ${a!.owner_last}`
    : `${b!.owner_first} ${b!.owner_last}`
  const catNames = isAssigned ? a!.cat_names : b!.cat_names

  const periodLabel = `${format(parseISO(dateFrom), 'd. MMM', { locale: nb })} – ${format(
    parseISO(dateTo),
    'd. MMM yyyy',
    { locale: nb }
  )}`

  const freeFull = freeCages.filter((c) => c.is_fully_free)
  const allSorted = [...allCages].sort((x, y) => {
    if (x.cage_section !== y.cage_section)
      return x.cage_section.localeCompare(y.cage_section)
    return x.cage_number - y.cage_number
  })

  const splitDays = React.useMemo(() => {
    const from = parseISO(dateFrom)
    const to = parseISO(dateTo)
    const count =
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) - 1
    return Array.from({ length: Math.max(0, count) }, (_, i) =>
      addDays(from, i + 1)
    )
  }, [dateFrom, dateTo])

  function resetMode() {
    setMode('view')
    setSelectedCageId('')
    setSecondCageId('')
    setSplitDate('')
    setConflicts([])
    firstCageRef.current = ''
  }

  async function handleConfirmAssign() {
    if (!selectedCageId) return
    setCheckingConflicts(true)
    try {
      const foundConflicts = await getCageConflicts(
        selectedCageId,
        dateFrom,
        dateTo
      )
      if (foundConflicts.length > 0) {
        firstCageRef.current = selectedCageId
        setConflicts(foundConflicts)
        setSplitDate(foundConflicts[0].conflict_from)
        setSelectedCageId('')
        setMode('conflict')
      } else {
        await onAssign(selectedCageId, dateFrom, dateTo)
      }
    } catch {
      await onAssign(selectedCageId, dateFrom, dateTo)
    } finally {
      setCheckingConflicts(false)
    }
  }

  async function handleConfirmUpdate() {
    if (!selectedCageId) return
    setCheckingConflicts(true)
    try {
      const foundConflicts = await getCageConflicts(
        selectedCageId,
        dateFrom,
        dateTo
      )
      if (foundConflicts.length > 0) {
        firstCageRef.current = selectedCageId
        setConflicts(foundConflicts)
        setSplitDate(foundConflicts[0].conflict_from)
        setSelectedCageId('')
        setMode('conflict')
      } else {
        await onUpdate(selectedCageId, dateFrom, dateTo)
      }
    } catch {
      await onUpdate(selectedCageId, dateFrom, dateTo)
    } finally {
      setCheckingConflicts(false)
    }
  }

  async function handleConfirmConflictSplit() {
    if (!splitDate || !secondCageId) return
    if (isAssigned) {
      await onSplit(splitDate, secondCageId)
    } else {
      await onAssignThenSplit(
        firstCageRef.current,
        dateFrom,
        dateTo,
        splitDate,
        secondCageId
      )
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/30 bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{ownerName}</p>
          <p className="text-xs text-muted-foreground">{catNames}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md border border-border/30 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Lukk
        </button>
      </div>

      <div className="space-y-1 border-t border-border/20 pt-3">
        {[
          { label: 'Periode', value: periodLabel },
          ...(isAssigned
            ? [{ label: 'Bur', value: a!.cage_label }]
            : [
                {
                  label: 'Burtype',
                  value: CAGE_TYPE_LABELS[b!.cage_type] ?? b!.cage_type,
                },
              ]),
          {
            label: 'Status',
            value: isAssigned
              ? 'Bekreftet — tildelt'
              : 'Bekreftet — ikke tildelt',
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* VIEW */}
      {mode === 'view' && (
        <div className="flex flex-wrap gap-2 border-t border-border/20 pt-1">
          {!isAssigned && (
            <button
              onClick={() => setMode('assign')}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100"
            >
              Tildel bur
            </button>
          )}
          {isAssigned && (
            <>
              <button
                onClick={() => setMode('change')}
                className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100"
              >
                Endre bur
              </button>
              <button
                onClick={() => setMode('split')}
                className="flex-1 rounded-md border border-border/30 bg-muted/50 py-2 text-xs text-foreground transition-colors hover:bg-muted"
              >
                Del opp opphold
              </button>
              <button
                onClick={() => setMode('confirm-delete')}
                className="flex-1 rounded-md border border-red-200 bg-red-50 py-2 text-xs text-red-700 transition-colors hover:bg-red-100"
              >
                Fjern tildeling
              </button>
            </>
          )}
        </div>
      )}

      {/* ASSIGN */}
      {mode === 'assign' && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <p className="text-xs text-muted-foreground">
            Velg bur for oppholdet:
          </p>
          {freeFull.length === 0 && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Ingen bur er helt ledige for hele perioden. Velg et bur for første
              del — systemet oppdager konflikter automatisk og hjelper deg med å
              splitte.
            </p>
          )}
          <select
            value={selectedCageId}
            onChange={(e) => setSelectedCageId(e.target.value)}
            className="w-full rounded-md border border-border/40 bg-background px-2 py-1.5 text-xs"
          >
            <option value="">Velg bur...</option>
            {allSorted.map((c) => {
              const free = freeCages.find((f) => f.cage_id === c.cage_id)
              const isFullyFree = free?.is_fully_free ?? false
              return (
                <option key={c.cage_id} value={c.cage_id}>
                  {c.cage_label}
                  {!isFullyFree ? ' — delvis opptatt' : ' — ledig'}
                </option>
              )
            })}
          </select>
          <div className="flex gap-2">
            <button
              disabled={!selectedCageId || isPending || checkingConflicts}
              onClick={handleConfirmAssign}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {checkingConflicts
                ? 'Sjekker...'
                : isPending
                  ? 'Lagrer...'
                  : 'Bekreft tildeling'}
            </button>
            <button
              onClick={resetMode}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* CHANGE */}
      {mode === 'change' && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <p className="text-xs text-muted-foreground">
            Velg nytt bur. Bur uten ledig hele perioden er merket.
          </p>
          <select
            value={selectedCageId}
            onChange={(e) => setSelectedCageId(e.target.value)}
            className="w-full rounded-md border border-border/40 bg-background px-2 py-1.5 text-xs"
          >
            <option value="">Velg bur...</option>
            {allSorted.map((c) => (
              <option key={c.cage_id} value={c.cage_id}>
                {c.cage_label}
                {!c.is_fully_free ? ' — delvis opptatt' : ''}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              disabled={!selectedCageId || isPending || checkingConflicts}
              onClick={handleConfirmUpdate}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {checkingConflicts
                ? 'Sjekker...'
                : isPending
                  ? 'Lagrer...'
                  : 'Bekreft endring'}
            </button>
            <button
              onClick={resetMode}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* CONFLICT */}
      {mode === 'conflict' && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            <p className="mb-1 font-medium">Kollisjon oppdaget</p>
            {conflicts.map((c) => (
              <p key={c.assignment_id}>
                {c.owner_last} — {c.cat_names} er i dette buret{' '}
                {format(parseISO(c.conflict_from), 'd. MMM', { locale: nb })} –{' '}
                {format(parseISO(c.conflict_to), 'd. MMM', { locale: nb })}
              </p>
            ))}
            <p className="mt-1.5">
              Oppholdet splittes automatisk. Første del får valgt bur, andre del
              trenger et annet bur fra splittdatoen.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Splittdato (første dag i nytt bur) — foreslått automatisk
            </label>
            <div className="flex flex-wrap gap-1">
              {splitDays.map((d) => {
                const str = localStr(d)
                return (
                  <button
                    key={str}
                    type="button"
                    onClick={() => setSplitDate(str)}
                    className={[
                      'rounded border px-2 py-1 text-[10px] transition-colors',
                      splitDate === str
                        ? 'border-blue-300 bg-blue-100 text-blue-800'
                        : 'border-border/30 bg-muted/40 text-muted-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    {format(d, 'd. MMM', { locale: nb })}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Bur for del 2
            </label>
            <select
              value={secondCageId}
              onChange={(e) => setSecondCageId(e.target.value)}
              className="w-full rounded-md border border-border/40 bg-background px-2 py-1.5 text-xs"
            >
              <option value="">Velg bur for del 2...</option>
              {allSorted
                .filter((c) => c.cage_id !== firstCageRef.current)
                .map((c) => (
                  <option key={c.cage_id} value={c.cage_id}>
                    {c.cage_label}
                    {!c.is_fully_free ? ' — delvis opptatt' : ''}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              disabled={!splitDate || !secondCageId || isPending}
              onClick={handleConfirmConflictSplit}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {isPending ? 'Lagrer...' : 'Bekreft splitting'}
            </button>
            <button
              onClick={resetMode}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* SPLIT */}
      {mode === 'split' && isAssigned && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <p className="text-xs text-muted-foreground">
            Første del beholder{' '}
            <span className="font-medium text-foreground">{a!.cage_label}</span>
            . Velg første dag i nytt bur:
          </p>
          <div className="flex flex-wrap gap-1">
            {splitDays.map((d) => {
              const str = localStr(d)
              return (
                <button
                  key={str}
                  type="button"
                  onClick={() => setSplitDate(str)}
                  className={[
                    'rounded border px-2 py-1 text-[10px] transition-colors',
                    splitDate === str
                      ? 'border-blue-300 bg-blue-100 text-blue-800'
                      : 'border-border/30 bg-muted/40 text-muted-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {format(d, 'd. MMM', { locale: nb })}
                </button>
              )
            })}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Bur for del 2
            </label>
            <select
              value={secondCageId}
              onChange={(e) => setSecondCageId(e.target.value)}
              className="w-full rounded-md border border-border/40 bg-background px-2 py-1.5 text-xs"
            >
              <option value="">Velg bur...</option>
              {allSorted
                .filter((c) => c.cage_id !== a!.cage_id)
                .map((c) => (
                  <option key={c.cage_id} value={c.cage_id}>
                    {c.cage_label}
                    {!c.is_fully_free ? ' — delvis opptatt' : ''}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              disabled={!splitDate || !secondCageId || isPending}
              onClick={() => onSplit(splitDate, secondCageId)}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {isPending ? 'Lagrer...' : 'Bekreft splitting'}
            </button>
            <button
              onClick={resetMode}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {mode === 'confirm-delete' && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <p className="text-xs text-muted-foreground">
            Er du sikker? Bookingen flyttes tilbake til "Ikke tildelt".
          </p>
          <div className="flex gap-2">
            <button
              disabled={isPending}
              onClick={onDelete}
              className="flex-1 rounded-md border border-red-200 bg-red-50 py-2 text-xs text-red-700 transition-colors hover:bg-red-100 disabled:opacity-40"
            >
              {isPending ? 'Fjerner...' : 'Ja, fjern tildeling'}
            </button>
            <button
              onClick={resetMode}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
