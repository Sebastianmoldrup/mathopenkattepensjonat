'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AdminBooking, Incident, formatDateNO, CAGE_LABELS } from '@/lib/admin/utils'
import {
  adminGetIncidentsForBooking,
  adminCreateIncident,
} from '@/lib/admin/formActions'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IncidentFormDialogProps {
  booking: AdminBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Local date, not toISOString() -- UTC shift causes an off-by-one day in
// CEST (same gotcha as the booking date helpers elsewhere in this repo).
function todayLocalStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function IncidentFormDialog({
  booking,
  open,
  onOpenChange,
}: IncidentFormDialogProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loadingIncidents, setLoadingIncidents] = useState(false)
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])
  const [occurredAt, setOccurredAt] = useState(todayLocalStr())
  const [whatHappened, setWhatHappened] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !booking) return
    setSelectedCatIds([])
    setOccurredAt(todayLocalStr())
    setWhatHappened('')
    setActionsTaken('')
    setFollowUp('')
    setError(null)
    setLoadingIncidents(true)
    adminGetIncidentsForBooking(booking.id).then((data) => {
      setIncidents(data)
      setLoadingIncidents(false)
    })
  }, [open, booking])

  if (!booking) return null

  const cats = booking.cats ?? []
  const allSelected = cats.length > 0 && selectedCatIds.length === cats.length

  function toggleCat(catId: string) {
    setSelectedCatIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    )
  }

  function toggleAll() {
    setSelectedCatIds(allSelected ? [] : cats.map((c) => c.id))
  }

  async function handleSave() {
    if (selectedCatIds.length === 0 || !whatHappened.trim()) {
      setError('Velg minst én katt og beskriv hva som skjedde.')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await adminCreateIncident(
      booking!.id,
      selectedCatIds,
      whatHappened.trim(),
      actionsTaken.trim(),
      followUp.trim(),
      occurredAt
    )
    if (!result.success) {
      setError(result.error ?? 'Noe gikk galt.')
      setSubmitting(false)
      return
    }
    const fresh = await adminGetIncidentsForBooking(booking!.id)
    setIncidents(fresh)
    setSelectedCatIds([])
    setOccurredAt(todayLocalStr())
    setWhatHappened('')
    setActionsTaken('')
    setFollowUp('')
    setSubmitting(false)
  }

  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (splitt)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrer avvik</DialogTitle>
          <DialogDescription>
            {booking.user_first_name} {booking.user_last_name} ·{' '}
            {formatDateNO(booking.date_from)}–{formatDateNO(booking.date_to)} ·{' '}
            {cageLabel}
          </DialogDescription>
        </DialogHeader>

        {/* Existing incidents */}
        {loadingIncidents ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : incidents.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tidligere registrerte avvik
            </p>
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-medium text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {incident.cat_names ?? 'Ukjent katt'}
                  </span>
                  <span className="text-xs text-amber-700">
                    {formatDateNO(incident.occurred_at)}
                  </span>
                </div>
                <p className="text-amber-900">{incident.what_happened}</p>
                {incident.actions_taken && (
                  <p className="text-amber-800">
                    <span className="font-medium">Gjort:</span>{' '}
                    {incident.actions_taken}
                  </p>
                )}
                {incident.follow_up && (
                  <p className="text-amber-800">
                    <span className="font-medium">Tiltak videre:</span>{' '}
                    {incident.follow_up}
                  </p>
                )}
              </div>
            ))}
            <Separator className="mt-3" />
          </div>
        ) : null}

        {/* New incident form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nytt avvik
            </p>
            <div className="space-y-2">
              <div
                onClick={toggleAll}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                  allSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'
                )}
              >
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                <span className="font-medium">Alle katter</span>
              </div>
              {cats.map((cat) => {
                const checked = selectedCatIds.includes(cat.id)
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCat(cat.id)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                      checked ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleCat(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Dato</Label>
            <Input
              type="date"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Hva skjedde</label>
            <Textarea
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Beskriv hendelsen..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Hva ble gjort</label>
            <Textarea
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              placeholder="Umiddelbare tiltak..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Tiltak videre</label>
            <Textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Oppfølging fremover..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button onClick={handleSave} disabled={submitting} className="w-full gap-1.5">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Lagre avvik
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
