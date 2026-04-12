'use client'

import { useState, useTransition } from 'react'
import {
  DailyRoutine,
  DailyRoutineFields,
  RoutinePeriod,
  emptyRoutine,
} from '@/lib/admin/formTypes'
import { adminUpsertDailyRoutine } from '@/lib/admin/formActions'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Sun, Sunset } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyRoutineFormProps {
  date: string
  period: RoutinePeriod
  existing: DailyRoutine | null
}

type CheckKey = keyof DailyRoutineFields

interface CheckItem {
  key: CheckKey
  label: string
}

const TILSYN: CheckItem[] = [
  { key: 'visuell_sjekk', label: 'Visuell sjekk av alle katter' },
  { key: 'atferd_kontroll', label: 'Kontroll av atferd og allmenntilstand' },
  { key: 'medisiner_gitt', label: 'Medisiner gitt (hvis aktuelt)' },
  { key: 'pelsstell', label: 'Pelsstell gitt' },
]

const AKTIVITET: CheckItem[] = [
  { key: 'aktivisering', label: 'Aktivisering / sosial kontakt' },
]

const KATTEDO: CheckItem[] = [
  { key: 'kattedo_sjekk', label: 'Sjekk av kattedo' },
  {
    key: 'kattedo_tømt',
    label: 'Kattedo tømt / etterfylt / skiftet ved behov',
  },
  {
    key: 'rengjøring_bur',
    label: 'Rengjøring av bur og fellesområde ved behov',
  },
]

const MAT: CheckItem[] = [
  { key: 'vann_gitt', label: 'Ferskt vann gitt' },
  { key: 'fôr_gitt', label: 'Kattefôr gitt' },
]

const MILJØ: CheckItem[] = [
  {
    key: 'temperatur_ventilasjon',
    label: 'Kontroll av temperatur og ventilasjon',
  },
]

const RENHOLD: CheckItem[] = [
  { key: 'gulv_rengjort', label: 'Gulv i kattepensjonatet sjekket / rengjort' },
  { key: 'bur_rengjort', label: 'Bur / rom rengjort ved behov' },
  {
    key: 'kattesand_skiftet',
    label: 'Felles kattesand tømt / etterfylt / skiftet ved behov',
  },
  { key: 'skåler_rengjort', label: 'Fôr- og vannskåler rengjort ved behov' },
  { key: 'avfall_tømt', label: 'Avfall tømt' },
]

function fromExisting(e: DailyRoutine | null): DailyRoutineFields {
  if (!e) return emptyRoutine()
  const { id: _id, date: _d, period: _p, updated_at: _u, ...rest } = e as any
  return rest
}

export function DailyRoutineForm({
  date,
  period,
  existing,
}: DailyRoutineFormProps) {
  const [fields, setFields] = useState<DailyRoutineFields>(
    fromExisting(existing)
  )
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMorgen = period === 'morgen'
  const periodLabel = isMorgen ? 'Morgen' : 'Dag / Kveld'

  const mainItems = [...TILSYN, ...AKTIVITET, ...KATTEDO, ...MAT, ...MILJØ]
  const checkedMain = mainItems.filter((i) => fields[i.key] === true).length
  const totalMain = mainItems.length

  function toggle(key: CheckKey) {
    setFields((p) => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  function setText(key: CheckKey, value: string) {
    setFields((p) => ({ ...p, [key]: value || null }))
    setSaved(false)
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await adminUpsertDailyRoutine(date, period, fields as any)
      if (result.success) setSaved(true)
      else setError(result.error ?? 'Noe gikk galt.')
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-3 border-b px-5 py-4',
          isMorgen ? 'bg-amber-50' : 'bg-blue-50'
        )}
      >
        {isMorgen ? (
          <Sun className="h-5 w-5 text-amber-500" />
        ) : (
          <Sunset className="h-5 w-5 text-blue-500" />
        )}
        <div>
          <h3 className="font-semibold">{periodLabel}</h3>
          <p className="text-xs text-muted-foreground">
            {checkedMain} av {totalMain} oppgaver fullført
          </p>
        </div>
        {checkedMain === totalMain && (
          <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
        )}
      </div>

      <div className="space-y-6 p-5">
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(checkedMain / totalMain) * 100}%` }}
          />
        </div>

        <Section
          title="🐾 Tilsyn og helse"
          items={TILSYN}
          fields={fields}
          toggle={toggle}
        />
        <Section
          title="🎯 Aktivitet og trivsel"
          items={AKTIVITET}
          fields={fields}
          toggle={toggle}
        />
        <Section
          title="🚿 Kattedo og hygiene"
          items={KATTEDO}
          fields={fields}
          toggle={toggle}
        />
        <Section
          title="🍽️ Mat og vann"
          items={MAT}
          fields={fields}
          toggle={toggle}
        />
        <Section
          title="🌡️ Miljø"
          items={MILJØ}
          fields={fields}
          toggle={toggle}
        />

        {/* Medisinering */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            💊 Medisinering (hvis aktuelt)
          </p>
          <Textarea
            value={fields.medisinering_notater ?? ''}
            onChange={(e) => setText('medisinering_notater', e.target.value)}
            placeholder="Beskriv medisiner gitt, dose og klokkeslett..."
            rows={2}
            className="resize-none text-sm"
          />
        </div>

        {/* Avvik */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">⚠️ Avvik / observasjoner</p>
          <Textarea
            value={fields.avvik_beskrivelse ?? ''}
            onChange={(e) => setText('avvik_beskrivelse', e.target.value)}
            placeholder="Beskriv eventuelle avvik eller observasjoner..."
            rows={2}
            className="resize-none text-sm"
          />
          <div className="flex gap-6">
            <CheckRow
              checked={fields.tiltak_iverksatt}
              label="Tiltak iverksatt"
              onChange={() => toggle('tiltak_iverksatt')}
            />
            <CheckRow
              checked={fields.veterinær_kontaktet}
              label="Veterinær kontaktet"
              onChange={() => toggle('veterinær_kontaktet')}
            />
          </div>
        </div>

        {/* Renhold — only show on dag_kveld */}
        {!isMorgen && (
          <Section
            title="🧹 Daglig renhold"
            items={RENHOLD}
            fields={fields}
            toggle={toggle}
          />
        )}

        {/* Bekreftelse */}
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-semibold">✍️ Bekreftelse</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Navn</Label>
              <Input
                value={fields.bekreftet_navn ?? ''}
                onChange={(e) => setText('bekreftet_navn', e.target.value)}
                placeholder="Fullt navn"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Klokkeslett</Label>
              <Input
                type="time"
                value={fields.klokkeslett ?? ''}
                onChange={(e) => setText('klokkeslett', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && (
          <p className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Lagret
          </p>
        )}

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lagrer...
            </>
          ) : (
            `Lagre ${periodLabel}`
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  items,
  fields,
  toggle,
}: {
  title: string
  items: CheckItem[]
  fields: DailyRoutineFields
  toggle: (key: CheckKey) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <CheckRow
            key={item.key}
            checked={!!fields[item.key]}
            label={item.label}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>
    </div>
  )
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <div
      onClick={onChange}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors',
        checked ? 'border-green-200 bg-green-50' : 'hover:bg-muted/40'
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0"
      />
      <span className={cn(checked && 'text-muted-foreground line-through')}>
        {label}
      </span>
    </div>
  )
}
