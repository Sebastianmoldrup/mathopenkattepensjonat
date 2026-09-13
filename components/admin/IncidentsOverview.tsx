'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { IncidentOverview, formatDateNO, CAGE_LABELS } from '@/lib/admin/utils'
import { AlertTriangle } from 'lucide-react'

interface IncidentsOverviewProps {
  incidents: IncidentOverview[]
}

export function IncidentsOverview({ incidents }: IncidentsOverviewProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return incidents
    return incidents.filter((i) => {
      const owner = `${i.owner_first ?? ''} ${i.owner_last ?? ''}`.toLowerCase()
      const cats = (i.cat_names ?? '').toLowerCase()
      return owner.includes(q) || cats.includes(q)
    })
  }, [incidents, search])

  if (incidents.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Ingen avvik registrert ennå.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Søk etter eier eller katt..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 max-w-xs text-sm"
      />

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
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {formatDateNO(incident.occurred_at)}
                  </span>
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
    </div>
  )
}
