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
import {
  AdminBooking,
  Incident,
  EditableIncident,
  formatDateNO,
  CAGE_LABELS,
} from '@/lib/admin/utils'
import {
  adminGetIncidentsForBooking,
  adminCreateIncident,
  adminUpdateIncident,
} from '@/lib/admin/formActions'
import { AlertTriangle, Loader2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IncidentFormDialogProps {
  booking: AdminBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, the dialog opens straight into edit mode for this incident
   * instead of a blank "new avvik" form (used from the "Alle avvik"
   * overview, which doesn't otherwise open this dialog). */
  initialEditIncident?: EditableIncident | null
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
  initialEditIncident = null,
}: IncidentFormDialogProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loadingIncidents, setLoadingIncidents] = useState(false)
  const [editTarget, setEditTarget] = useState<EditableIncident | null>(null)
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])
  const [occurredAt, setOccurredAt] = useState(todayLocalStr())
  const [whatHappened, setWhatHappened] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function loadFromEditTarget(target: EditableIncident) {
    setSelectedCatIds(target.cat_ids ?? [])
    setOccurredAt(target.occurred_at)
    setWhatHappened(target.what_happened)
    setActionsTaken(target.actions_taken ?? '')
    setFollowUp(target.follow_up ?? '')
  }

  function startEdit(target: EditableIncident) {
    setEditTarget(target)
    loadFromEditTarget(target)
    setError(null)
  }

  function cancelEdit() {
    setEditTarget(null)
    setSelectedCatIds([])
    setOccurredAt(todayLocalStr())
    setWhatHappened('')
    setActionsTaken('')
    setFollowUp('')
    setError(null)
  }

  useEffect(() => {
    if (!open || !booking) return
    setError(null)
    if (initialEditIncident) {
      setEditTarget(initialEditIncident)
      loadFromEditTarget(initialEditIncident)
    } else {
      setEditTarget(null)
      setSelectedCatIds([])
      setOccurredAt(todayLocalStr())
      setWhatHappened('')
      setActionsTaken('')
      setFollowUp('')
    }
    setLoadingIncidents(true)
    adminGetIncidentsForBooking(booking.id).then((data) => {
      setIncidents(data)
      setLoadingIncidents(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const result = editTarget
      ? await adminUpdateIncident(
          editTarget.id,
          selectedCatIds,
          whatHappened.trim(),
          actionsTaken.trim(),
          followUp.trim(),
          occurredAt
        )
      : await adminCreateIncident(
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
    if (editTarget) {
      // Editing is a one-off correction -- close rather than leaving a
      // now-stale "editing" form open pointed at an incident whose data
      // has already been saved.
      onOpenChange(false)
    } else {
      setSelectedCatIds([])
      setOccurredAt(todayLocalStr())
      setWhatHappened('')
      setActionsTaken('')
      setFollowUp('')
    }
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
            {incidents
              .filter((incident) => incident.id !== editTarget?.id)
              .map((incident) => (
                <div
                  key={incident.id}
                  className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-medium text-amber-900">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      {incident.cat_names ?? 'Ukjent katt'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-700">
                        {formatDateNO(incident.occurred_at)}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(incident)}
                        className="flex items-center gap-1 text-xs font-medium text-amber-700 underline-offset-2 hover:underline"
                      >
                        <Pencil className="h-3 w-3" />
                        Rediger
                      </button>
                    </div>
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

        {/* New / edit incident form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {editTarget ? 'Rediger avvik' : 'Nytt avvik'}
              </p>
              {editTarget && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
                >
                  Avbryt redigering
                </button>
              )}
            </div>
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
            {editTarget ? 'Oppdater avvik' : 'Lagre avvik'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
