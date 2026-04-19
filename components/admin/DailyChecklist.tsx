'use client'

import { useState, useTransition } from 'react'
import { DailyChecklist } from '@/lib/admin/utils'
import { adminUpsertChecklist } from '@/lib/admin/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyChecklistFormProps {
  date: string
  existing: DailyChecklist | null
}

const CHECKLIST_ITEMS = [
  { key: 'feeding_done', label: 'Mat og vann gitt til alle katter' },
  { key: 'medication_done', label: 'Medisiner gitt (der det er aktuelt)' },
  { key: 'litter_cleaned', label: 'Kattebøtter rengjort' },
  { key: 'cage_inspection_done', label: 'Burene inspisert og i orden' },
] as const

type ChecklistKey = (typeof CHECKLIST_ITEMS)[number]['key']

export function DailyChecklistForm({
  date,
  existing,
}: DailyChecklistFormProps) {
  const [fields, setFields] = useState({
    feeding_done: existing?.feeding_done ?? false,
    medication_done: existing?.medication_done ?? false,
    litter_cleaned: existing?.litter_cleaned ?? false,
    cage_inspection_done: existing?.cage_inspection_done ?? false,
    notes: existing?.notes ?? '',
  })
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completedCount = CHECKLIST_ITEMS.filter(
    (item) => fields[item.key]
  ).length
  const allDone = completedCount === CHECKLIST_ITEMS.length

  function toggle(key: ChecklistKey) {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await adminUpsertChecklist(date, fields)
      if (result.success) {
        setSaved(true)
      } else {
        setError(result.error ?? 'Noe gikk galt.')
      }
    })
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {new Date(date + 'T12:00:00').toLocaleDateString('nb-NO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {completedCount} av {CHECKLIST_ITEMS.length} oppgaver fullført
          </p>
        </div>
        {allDone && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Alt fullført
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%`,
          }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.key}
            onClick={() => toggle(item.key)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
              fields[item.key]
                ? 'border-green-200 bg-green-50'
                : 'bg-background hover:bg-muted/40'
            )}
          >
            <Checkbox
              checked={fields[item.key]}
              onCheckedChange={() => toggle(item.key)}
              className="shrink-0"
            />
            <Label
              className={cn(
                'cursor-pointer text-sm font-medium',
                fields[item.key] && 'text-muted-foreground line-through'
              )}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Generelle notater for dagen
        </Label>
        <Textarea
          value={fields.notes}
          onChange={(e) => {
            setFields((prev) => ({ ...prev, notes: e.target.value }))
            setSaved(false)
          }}
          placeholder="Avvik, hendelser, spesielle observasjoner..."
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      {/* Save */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Lagret
        </p>
      )}

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lagrer...
          </>
        ) : (
          'Lagre sjekkliste'
        )}
      </Button>
    </div>
  )
}
