'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AdminBooking,
  IncidentOverview,
  formatDateNO,
  CAGE_LABELS,
} from '@/lib/admin/utils'
import { AlertTriangle, Pencil } from 'lucide-react'
import { IncidentFormDialog } from './IncidentFormDialog'

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

const ALL = 'alle'

interface IncidentsOverviewProps {
  incidents: IncidentOverview[]
  bookings: AdminBooking[]
}

export function IncidentsOverview({
  incidents,
  bookings,
}: IncidentsOverviewProps) {
  const [search, setSearch] = useState('')
  const [year, setYear] = useState(ALL)
  const [month, setMonth] = useState(ALL)
  const [editing, setEditing] = useState<IncidentOverview | null>(null)

  const bookingsById = useMemo(() => {
    const map = new Map<string, AdminBooking>()
    for (const b of bookings) map.set(b.id, b)
    return map
  }, [bookings])

  const years = useMemo(() => {
    const set = new Set(
      incidents.map((i) => String(new Date(i.occurred_at).getFullYear()))
    )
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [incidents])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return incidents.filter((i) => {
      const occurred = new Date(i.occurred_at)
      if (year !== ALL && String(occurred.getFullYear()) !== year) return false
      if (month !== ALL && String(occurred.getMonth()) !== month) return false
      if (!q) return true
      const owner = `${i.owner_first ?? ''} ${i.owner_last ?? ''}`.toLowerCase()
      const cats = (i.cat_names ?? '').toLowerCase()
      return owner.includes(q) || cats.includes(q)
    })
  }, [incidents, search, year, month])

  if (incidents.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Ingen avvik registrert ennå.
      </div>
    )
  }

  const editingBooking = editing ? (bookingsById.get(editing.booking_id) ?? null) : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Søk etter eier eller katt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs text-sm"
        />
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-9 w-[110px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Alle år</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="h-9 w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Alle måneder</SelectItem>
            {MONTHS_NO.map((m, i) => (
              <SelectItem key={m} value={String(i)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
          Ingen treff.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((incident) => {
            const cageLabel =
              incident.cage_count === 2
                ? '2× Standard (splitt)'
                : (CAGE_LABELS[incident.cage_type] ?? incident.cage_type)
            const ownerName =
              `${incident.owner_first ?? ''} ${incident.owner_last ?? ''}`.trim() ||
              'Ukjent eier'

            return (
              <div
                key={incident.id}
                className="space-y-2 rounded-xl border bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      {incident.cat_names ?? 'Ukjent katt'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {ownerName} · {cageLabel} ·{' '}
                      {formatDateNO(incident.date_from)}–
                      {formatDateNO(incident.date_to)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDateNO(incident.occurred_at)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditing(incident)}
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Rediger
                    </button>
                  </div>
                </div>

                <p className="text-sm">{incident.what_happened}</p>
                {incident.actions_taken && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Gjort:</span>{' '}
                    {incident.actions_taken}
                  </p>
                )}
                {incident.follow_up && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Tiltak videre:
                    </span>{' '}
                    {incident.follow_up}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <IncidentFormDialog
        booking={editingBooking}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        initialEditIncident={editing}
      />
    </div>
  )
}
