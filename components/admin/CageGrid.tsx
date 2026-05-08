'use client'

import React, { useState, useTransition } from 'react'
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
} from '@/lib/admin/cageActions'
import type {
  CageAssignment,
  UnassignedBooking,
  CageOption,
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
    cages: ['Uten bur'],
    headerClass: 'bg-gray-50 text-gray-500',
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
  const [freeCages, setFreeCages] = useState(initialFree)
  const [sidebarFreeCages, setSidebarFreeCages] = useState<CageOption[]>([])
  const [selected, setSelected] = useState<SelectedBlock | null>(null)
  const [isPending, startTransition] = useTransition()

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
    const [newAssignments, newUnassigned, newFree] = await Promise.all([
      getCageAssignments(localStr(from), localStr(to)),
      getUnassignedConfirmed(),
      getFreeCages(localStr(from), localStr(to)),
    ])
    setAssignments(newAssignments)
    setUnassigned(newUnassigned)
    setFreeCages(newFree)
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

  function getAssignmentsForCageAndDay(
    cageLabel: string,
    day: Date
  ): CageAssignment[] {
    return assignments.filter((a) => {
      if (a.cage_label !== cageLabel) return false
      const from = parseISO(a.date_from)
      const to = parseISO(a.date_to)
      return !isAfter(from, day) && isAfter(to, day)
    })
  }

  function renderCageRow(cageLabel: string) {
    const cells: React.ReactNode[] = []
    let d = 0

    while (d < daysInCurrentMonth) {
      const day = days[d]
      const dayAssignments = getAssignmentsForCageAndDay(cageLabel, day)

      if (dayAssignments.length === 0) {
        const isToday = localStr(day) === localStr(today)
        cells.push(
          <td
            key={d}
            className={`h-8 border-b border-r border-border/20 p-0.5 ${isToday ? 'bg-blue-50/30' : ''}`}
          />
        )
        d++
        continue
      }

      const a = dayAssignments[0]
      const from = parseISO(a.date_from)
      const to = parseISO(a.date_to)
      const visualEnd = addDays(to, -1)
      const blockStart = isAfter(from, windowStart) ? from : windowStart
      const blockEnd = isBefore(visualEnd, windowEnd) ? visualEnd : windowEnd

      let span = 0
      for (let dd = d; dd < daysInCurrentMonth; dd++) {
        const cur = days[dd]
        if (!isBefore(cur, blockStart) && !isAfter(cur, blockEnd)) span++
        else if (span > 0) break
      }
      if (span === 0) span = 1

      const continuesLeft = isBefore(from, windowStart)
      const continuesRight = isAfter(visualEnd, windowEnd)

      const isCageSwap = assignments.some(
        (other) =>
          other.booking_id === a.booking_id &&
          other.assignment_id !== a.assignment_id &&
          other.cage_id !== a.cage_id &&
          isBefore(parseISO(other.date_from), from)
      )

      const isToday = localStr(day) === localStr(today)
      const label = isCageSwap
        ? `↪ ${blockLabel(a.owner_first, a.owner_last, a.cat_names)}`
        : blockLabel(a.owner_first, a.owner_last, a.cat_names)

      const isSelected =
        selected?.type === 'assigned' &&
        selected.assignment.assignment_id === a.assignment_id

      cells.push(
        <td
          key={d}
          colSpan={span}
          className={`h-8 border-b border-r border-border/20 p-0.5 ${isToday ? 'bg-blue-50/30' : ''}`}
        >
          <button
            onClick={() =>
              handleSelectBlock({ type: 'assigned', assignment: a })
            }
            className={[
              'flex h-full w-full items-center rounded-sm px-1.5 text-[10px] font-medium',
              'overflow-hidden whitespace-nowrap text-left transition-all',
              continuesLeft ? 'rounded-l-none' : '',
              continuesRight ? 'rounded-r-none' : '',
              isSelected ? 'ring-2 ring-amber-500 ring-offset-0' : '',
              isCageSwap
                ? 'bg-[#F0997B] text-[#4A1B0C] hover:brightness-95'
                : 'bg-[#C0DD97] text-[#27500A] hover:brightness-95',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="truncate">{label}</span>
            {a.has_note && (
              <span className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black/20" />
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
              className="h-8 border-b border-r border-border/20 bg-amber-50/20 p-0.5"
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
          if (!isBefore(cur, blockStart) && isBefore(cur, blockEnd)) span++
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
            className="h-8 border-b border-r border-border/20 bg-amber-50/20 p-0.5"
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
          <td className="whitespace-nowrap border-b border-r border-border/20 bg-amber-50/40 px-2 text-[10px] font-medium text-amber-700">
            Ikke tildelt
          </td>
          {cells}
        </tr>
      )
    })
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">Burplassering</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { color: '#C0DD97', label: 'Tildelt' },
            { color: '#FAC775', label: 'Ikke tildelt' },
            { color: '#F0997B', label: 'Burbytte' },
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

      {/* Alerts */}
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

      {/* Navigation */}
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

      {/* Grid */}
      <div
        className={`overflow-x-auto rounded-lg border border-border/30 transition-opacity ${
          isPending ? 'opacity-60' : ''
        }`}
      >
        <table
          className="w-full border-collapse"
          style={{ tableLayout: 'fixed', minWidth: 900 }}
        >
          <thead>
            <tr>
              <th className="w-[80px] border-b border-r border-border/20 bg-muted/40 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                Bur
              </th>
              {days.map((day) => {
                const isToday = localStr(day) === localStr(today)
                const isFirstOfMonth = day.getDate() === 1
                return (
                  <th
                    key={localStr(day)}
                    className={`border-b border-r border-border/20 py-1 text-center font-medium ${
                      isToday
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-muted/40 text-muted-foreground'
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
                {section.cages.map((cageLabel) => (
                  <tr key={cageLabel}>
                    <td className="whitespace-nowrap border-b border-r border-border/20 bg-muted/30 px-2 text-[10px] font-medium text-muted-foreground">
                      {cageLabel}
                    </td>
                    {renderCageRow(cageLabel)}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
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
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onSplit={handleSplit}
          isPending={isPending}
        />
      )}
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

type SidebarMode = 'view' | 'assign' | 'change' | 'split' | 'confirm-delete'

type SidebarProps = {
  selected: SelectedBlock
  allCages: CageOption[]
  freeCages: CageOption[]
  dateFrom: string
  dateTo: string
  onClose: () => void
  onAssign: (cageId: string, dateFrom: string, dateTo: string) => Promise<void>
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
  onUpdate,
  onDelete,
  onSplit,
  isPending,
}: SidebarProps) {
  const [mode, setMode] = useState<SidebarMode>('view')
  const [selectedCageId, setSelectedCageId] = useState('')
  const [splitDate, setSplitDate] = useState('')

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
  const conflictCage = selectedCageId
    ? !freeFull.find((c) => c.cage_id === selectedCageId)
    : false

  const splitDays = React.useMemo(() => {
    const from = parseISO(dateFrom)
    const to = parseISO(dateTo)
    const count =
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) - 1
    return Array.from({ length: Math.max(0, count) }, (_, i) =>
      addDays(from, i + 1)
    )
  }, [dateFrom, dateTo])

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
          ...(isAssigned ? [{ label: 'Bur', value: a!.cage_label }] : []),
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

      {mode === 'assign' && (
        <div className="space-y-3 border-t border-border/20 pt-1">
          <p className="text-xs text-muted-foreground">
            Velg et ledig bur for hele perioden:
          </p>
          {freeFull.length === 0 && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Ingen bur er helt ledige. Tildel et delvis ledig bur og bruk "Del
              opp opphold" etterpå.
            </p>
          )}
          <select
            value={selectedCageId}
            onChange={(e) => setSelectedCageId(e.target.value)}
            className="w-full rounded-md border border-border/40 bg-background px-2 py-1.5 text-xs"
          >
            <option value="">Velg bur...</option>
            {freeFull.map((c) => (
              <option key={c.cage_id} value={c.cage_id}>
                {c.cage_label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              disabled={!selectedCageId || isPending}
              onClick={() => onAssign(selectedCageId, dateFrom, dateTo)}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {isPending ? 'Lagrer...' : 'Bekreft tildeling'}
            </button>
            <button
              onClick={() => {
                setMode('view')
                setSelectedCageId('')
              }}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

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
          {conflictCage && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Dette buret er delvis opptatt. Bekreft og bruk "Del opp opphold"
              etterpå.
            </p>
          )}
          <div className="flex gap-2">
            <button
              disabled={!selectedCageId || isPending}
              onClick={() => onUpdate(selectedCageId, dateFrom, dateTo)}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {isPending ? 'Lagrer...' : 'Bekreft endring'}
            </button>
            <button
              onClick={() => {
                setMode('view')
                setSelectedCageId('')
              }}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

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
              value={selectedCageId}
              onChange={(e) => setSelectedCageId(e.target.value)}
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
              disabled={!splitDate || !selectedCageId || isPending}
              onClick={() => onSplit(splitDate, selectedCageId)}
              className="flex-1 rounded-md border border-blue-200 bg-blue-50 py-2 text-xs text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-40"
            >
              {isPending ? 'Lagrer...' : 'Bekreft splitting'}
            </button>
            <button
              onClick={() => {
                setMode('view')
                setSelectedCageId('')
                setSplitDate('')
              }}
              className="rounded-md border border-border/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

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
              onClick={() => setMode('view')}
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
