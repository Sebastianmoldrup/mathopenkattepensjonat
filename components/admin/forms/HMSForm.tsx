'use client'

import { useState, useTransition } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, ShieldCheck, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HmsLog {
  id: string
  røykvarslere: boolean
  brannslukker: boolean
  slokkeutstyr_kontrollert: boolean
  branninstruks: boolean
  evakueringsplan: boolean
  slokkeutstyr_dato: string | null
  beredskapsplan: boolean
  transportutstyr: boolean
  midlertidig_plassering: boolean
  ansvarsfordeling: boolean
  fast_veterinær: boolean
  akuttveterinær: boolean
  telefon_tilgjengelig: boolean
  førstehjelpsutstyr: boolean
  førstehjelpsutstyr_dato: string | null
  rutine_strømbrudd: boolean
  alternativ_oppvarming: boolean
  rutine_vannmangel: boolean
  ventilasjon_kontroll: boolean
  varme_kulde_tiltak: boolean
  isolering_rutine: boolean
  isolat_redskaper: boolean
  håndhygiene: boolean
  verneutstyr: boolean
  smitteavfall: boolean
  avvik_registreres: boolean
  tiltak_iverksettes: boolean
  hendelser_evalueres: boolean
  rutiner_oppdateres: boolean
  godkjent_navn: string | null
  godkjent_dato: string | null
  created_at: string
}

type Fields = Record<string, boolean | string | null>

function emptyFields(): Fields {
  return {
    røykvarslere: false,
    brannslukker: false,
    slokkeutstyr_kontrollert: false,
    branninstruks: false,
    evakueringsplan: false,
    slokkeutstyr_dato: null,
    beredskapsplan: false,
    transportutstyr: false,
    midlertidig_plassering: false,
    ansvarsfordeling: false,
    fast_veterinær: false,
    akuttveterinær: false,
    telefon_tilgjengelig: false,
    førstehjelpsutstyr: false,
    førstehjelpsutstyr_dato: null,
    rutine_strømbrudd: false,
    alternativ_oppvarming: false,
    rutine_vannmangel: false,
    ventilasjon_kontroll: false,
    varme_kulde_tiltak: false,
    isolering_rutine: false,
    isolat_redskaper: false,
    håndhygiene: false,
    verneutstyr: false,
    smitteavfall: false,
    avvik_registreres: false,
    tiltak_iverksettes: false,
    hendelser_evalueres: false,
    rutiner_oppdateres: false,
    godkjent_navn: null,
    godkjent_dato: null,
  }
}

function fromExisting(log: HmsLog): Fields {
  const { id: _id, created_at: _c, ...rest } = log as any
  return rest
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function FormSection({
  title,
  children,
  completedCount,
  totalCount,
}: {
  title: string
  children: React.ReactNode
  completedCount: number
  totalCount: number
}) {
  const allDone = completedCount === totalCount
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div
        className={cn(
          'flex items-center justify-between border-b px-5 py-3',
          allDone ? 'bg-green-50' : 'bg-muted/40'
        )}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-medium',
              allDone ? 'text-green-700' : 'text-muted-foreground'
            )}
          >
            {completedCount}/{totalCount}
          </span>
          {allDone && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </div>
      </div>
      <div className="space-y-2 px-4 py-4">{children}</div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface HMSFormProps {
  existing: HmsLog | null
  history: HmsLog[]
}

export function HMSForm({ existing, history }: HMSFormProps) {
  const [fields, setFields] = useState<Fields>(
    existing ? fromExisting(existing) : emptyFields()
  )
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  function toggle(key: string) {
    setFields((p) => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  function setText(key: string, val: string) {
    setFields((p) => ({ ...p, [key]: val || null }))
    setSaved(false)
  }

  function bool(key: string) {
    return !!fields[key]
  }
  function text(key: string) {
    return (fields[key] as string) ?? ''
  }

  // Count helpers per section
  const brannKeys = [
    'røykvarslere',
    'brannslukker',
    'slokkeutstyr_kontrollert',
    'branninstruks',
    'evakueringsplan',
  ]
  const beredskapKeys = [
    'beredskapsplan',
    'transportutstyr',
    'midlertidig_plassering',
    'ansvarsfordeling',
  ]
  const vetKeys = [
    'fast_veterinær',
    'akuttveterinær',
    'telefon_tilgjengelig',
    'førstehjelpsutstyr',
  ]
  const tekniskKeys = [
    'rutine_strømbrudd',
    'alternativ_oppvarming',
    'rutine_vannmangel',
    'ventilasjon_kontroll',
    'varme_kulde_tiltak',
  ]
  const smitteKeys = [
    'isolering_rutine',
    'isolat_redskaper',
    'håndhygiene',
    'verneutstyr',
    'smitteavfall',
  ]
  const avvikKeys = [
    'avvik_registreres',
    'tiltak_iverksettes',
    'hendelser_evalueres',
    'rutiner_oppdateres',
  ]

  const allKeys = [
    ...brannKeys,
    ...beredskapKeys,
    ...vetKeys,
    ...tekniskKeys,
    ...smitteKeys,
    ...avvikKeys,
  ]
  const totalChecked = allKeys.filter((k) => bool(k)).length
  const totalItems = allKeys.length
  const count = (keys: string[]) => keys.filter((k) => bool(k)).length

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const supabase = createClient()
      const { error: err } = await supabase.rpc('admin_upsert_hms_log', {
        p_data: fields,
      })
      if (err) {
        setError('Kunne ikke lagre HMS-skjema. Prøv igjen.')
      } else {
        setSaved(true)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="space-y-3 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Samlet status</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalChecked} av {totalItems} punkter bekreftet
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-1.5 text-xs"
              >
                <History className="h-3.5 w-3.5" />
                Historikk ({history.length})
              </Button>
            )}
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(totalChecked / totalItems) * 100}%` }}
          />
        </div>
        {existing && (
          <p className="text-xs text-muted-foreground">
            Sist oppdatert:{' '}
            {new Date(existing.created_at).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="divide-y overflow-hidden rounded-xl border bg-card">
          <div className="bg-muted/40 px-5 py-3">
            <p className="text-sm font-semibold">
              Tidligere HMS-registreringer
            </p>
          </div>
          {history.map((log) => {
            const logAllKeys = [
              ...brannKeys,
              ...beredskapKeys,
              ...vetKeys,
              ...tekniskKeys,
              ...smitteKeys,
              ...avvikKeys,
            ]
            const logChecked = logAllKeys.filter(
              (k) => !!(log as any)[k]
            ).length
            return (
              <div
                key={log.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {new Date(log.created_at).toLocaleDateString('nb-NO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {log.godkjent_navn && (
                    <p className="text-xs text-muted-foreground">
                      Signert av {log.godkjent_navn}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {logChecked}/{logAllKeys.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setFields(fromExisting(log))
                      setShowHistory(false)
                      setSaved(false)
                    }}
                  >
                    Last inn
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 1. Brannvern */}
      <FormSection
        title="🔥 1. Brannvern"
        completedCount={count(brannKeys)}
        totalCount={brannKeys.length}
      >
        <CheckRow
          checked={bool('røykvarslere')}
          label="Røykvarslere installert og fungerende"
          onChange={() => toggle('røykvarslere')}
        />
        <CheckRow
          checked={bool('brannslukker')}
          label="Brannslukningsapparat tilgjengelig"
          onChange={() => toggle('brannslukker')}
        />
        <CheckRow
          checked={bool('slokkeutstyr_kontrollert')}
          label="Slokkeutstyr kontrollert"
          onChange={() => toggle('slokkeutstyr_kontrollert')}
        />
        <div className="pl-3">
          <Label className="text-xs text-muted-foreground">
            Dato for kontroll
          </Label>
          <Input
            value={text('slokkeutstyr_dato')}
            onChange={(e) => setText('slokkeutstyr_dato', e.target.value)}
            placeholder="DD.MM.ÅÅÅÅ"
            className="mt-1 h-8 max-w-[160px] text-sm"
          />
        </div>
        <CheckRow
          checked={bool('branninstruks')}
          label="Branninstruks synlig for ansatte"
          onChange={() => toggle('branninstruks')}
        />
        <CheckRow
          checked={bool('evakueringsplan')}
          label="Evakueringsplan tilgjengelig"
          onChange={() => toggle('evakueringsplan')}
        />
      </FormSection>

      {/* 2. Beredskapsplan */}
      <FormSection
        title="🚨 2. Nød- og beredskapsplan"
        completedCount={count(beredskapKeys)}
        totalCount={beredskapKeys.length}
      >
        <CheckRow
          checked={bool('beredskapsplan')}
          label="Skriftlig beredskapsplan tilgjengelig"
          onChange={() => toggle('beredskapsplan')}
        />
        <CheckRow
          checked={bool('transportutstyr')}
          label="Transportutstyr tilgjengelig (bur / bager)"
          onChange={() => toggle('transportutstyr')}
        />
        <CheckRow
          checked={bool('midlertidig_plassering')}
          label="Avtale / plan for midlertidig plassering av katter"
          onChange={() => toggle('midlertidig_plassering')}
        />
        <CheckRow
          checked={bool('ansvarsfordeling')}
          label="Ansvarsfordeling ved nødsituasjon definert"
          onChange={() => toggle('ansvarsfordeling')}
        />
      </FormSection>

      {/* 3. Veterinær */}
      <FormSection
        title="🩺 3. Veterinær og helsemessig beredskap"
        completedCount={count(vetKeys)}
        totalCount={vetKeys.length}
      >
        <CheckRow
          checked={bool('fast_veterinær')}
          label="Fast veterinær kontaktet og registrert"
          onChange={() => toggle('fast_veterinær')}
        />
        <CheckRow
          checked={bool('akuttveterinær')}
          label="Akuttveterinær tilgjengelig utenom åpningstid"
          onChange={() => toggle('akuttveterinær')}
        />
        <CheckRow
          checked={bool('telefon_tilgjengelig')}
          label="Telefonnummer lett tilgjengelig"
          onChange={() => toggle('telefon_tilgjengelig')}
        />
        <CheckRow
          checked={bool('førstehjelpsutstyr')}
          label="Førstehjelpsutstyr for katt tilgjengelig og kontrollert"
          onChange={() => toggle('førstehjelpsutstyr')}
        />
        <div className="pl-3">
          <Label className="text-xs text-muted-foreground">
            Dato for kontroll
          </Label>
          <Input
            value={text('førstehjelpsutstyr_dato')}
            onChange={(e) => setText('førstehjelpsutstyr_dato', e.target.value)}
            placeholder="DD.MM.ÅÅÅÅ"
            className="mt-1 h-8 max-w-[160px] text-sm"
          />
        </div>
      </FormSection>

      {/* 4. Teknisk */}
      <FormSection
        title="⚡ 4. Strøm-, vann- og teknisk svikt"
        completedCount={count(tekniskKeys)}
        totalCount={tekniskKeys.length}
      >
        <CheckRow
          checked={bool('rutine_strømbrudd')}
          label="Rutine for strømbrudd"
          onChange={() => toggle('rutine_strømbrudd')}
        />
        <CheckRow
          checked={bool('alternativ_oppvarming')}
          label="Alternativ oppvarming ved strømbrudd"
          onChange={() => toggle('alternativ_oppvarming')}
        />
        <CheckRow
          checked={bool('rutine_vannmangel')}
          label="Rutine for vannmangel"
          onChange={() => toggle('rutine_vannmangel')}
        />
        <CheckRow
          checked={bool('ventilasjon_kontroll')}
          label="Kontroll av ventilasjon og temperatur"
          onChange={() => toggle('ventilasjon_kontroll')}
        />
        <CheckRow
          checked={bool('varme_kulde_tiltak')}
          label="Tiltak for varme / kulde definert"
          onChange={() => toggle('varme_kulde_tiltak')}
        />
      </FormSection>

      {/* 5. Smittevern */}
      <FormSection
        title="☣️ 5. Smittevern og hygiene"
        completedCount={count(smitteKeys)}
        totalCount={smitteKeys.length}
      >
        <CheckRow
          checked={bool('isolering_rutine')}
          label="Rutine for isolering av syke katter"
          onChange={() => toggle('isolering_rutine')}
        />
        <CheckRow
          checked={bool('isolat_redskaper')}
          label="Egne redskaper til isolat"
          onChange={() => toggle('isolat_redskaper')}
        />
        <CheckRow
          checked={bool('håndhygiene')}
          label="Rutiner for håndhygiene"
          onChange={() => toggle('håndhygiene')}
        />
        <CheckRow
          checked={bool('verneutstyr')}
          label="Rutine for bruk av verneutstyr"
          onChange={() => toggle('verneutstyr')}
        />
        <CheckRow
          checked={bool('smitteavfall')}
          label="Avfall og smitteavfall håndteres forsvarlig"
          onChange={() => toggle('smitteavfall')}
        />
      </FormSection>

      {/* 6. Avvik */}
      <FormSection
        title="📋 6. Avvik og oppfølging"
        completedCount={count(avvikKeys)}
        totalCount={avvikKeys.length}
      >
        <CheckRow
          checked={bool('avvik_registreres')}
          label="Avvik registreres skriftlig"
          onChange={() => toggle('avvik_registreres')}
        />
        <CheckRow
          checked={bool('tiltak_iverksettes')}
          label="Tiltak iverksettes"
          onChange={() => toggle('tiltak_iverksettes')}
        />
        <CheckRow
          checked={bool('hendelser_evalueres')}
          label="Hendelser evalueres"
          onChange={() => toggle('hendelser_evalueres')}
        />
        <CheckRow
          checked={bool('rutiner_oppdateres')}
          label="Rutiner oppdateres ved behov"
          onChange={() => toggle('rutiner_oppdateres')}
        />
      </FormSection>

      {/* Godkjenning */}
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">✍️ Godkjenning</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Jeg bekrefter at HMS- og beredskapsrutinene er kjent og tilgjengelige
          for ansatte.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Navn</Label>
            <Input
              value={text('godkjent_navn')}
              onChange={(e) => setText('godkjent_navn', e.target.value)}
              placeholder="Fullt navn"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Dato</Label>
            <Input
              value={text('godkjent_dato')}
              onChange={(e) => setText('godkjent_dato', e.target.value)}
              placeholder="DD.MM.ÅÅÅÅ"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Emergency contacts — always visible */}
      <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50">
        <div className="border-b border-red-200 bg-red-100 px-5 py-3">
          <p className="text-sm font-semibold text-red-800">
            📞 Viktige kontaktopplysninger
          </p>
        </div>
        <div className="divide-y divide-red-100 px-5 py-3">
          {[
            ['Veterinær (Dyreklinikken Bergen Vest AS)', '55 51 59 00'],
            ['Akuttveterinær', '820 90 060'],
            ['Brann', '110'],
            ['Ambulanse', '113'],
            ['Politi', '112'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 text-sm">
              <span className="text-red-700">{label}</span>
              <a
                href={`tel:${value.replace(/\s/g, '')}`}
                className="font-bold text-red-900 hover:underline"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" /> HMS-skjema lagret
        </p>
      )}

      <Button
        onClick={handleSave}
        disabled={isPending}
        size="lg"
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lagrer...
          </>
        ) : (
          'Lagre HMS-registrering'
        )}
      </Button>
    </div>
  )
}
