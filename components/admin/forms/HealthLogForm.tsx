'use client'

import { useState, useTransition } from 'react'
import { HealthLog } from '@/lib/admin/formTypes'
import { AdminBooking, AdminCat } from '@/lib/admin/utils'
import { adminInsertHealthLog } from '@/lib/admin/formActions'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/admin/DatePicker'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HealthLogFormProps {
  booking: AdminBooking
  existingLogs: HealthLog[]
  onSaved: () => void
}

type Fields = Record<string, boolean | string | null>

function emptyFields(bookingId: string, catId: string): Fields {
  return { booking_id: bookingId, cat_id: catId }
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
        checked ? 'border-amber-200 bg-amber-50' : 'hover:bg-muted/40'
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0"
      />
      <span>{label}</span>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

export function HealthLogForm({
  booking,
  existingLogs,
  onSaved,
}: HealthLogFormProps) {
  const cats = booking.cats ?? []
  const [selectedCat, setSelectedCat] = useState<AdminCat | null>(
    cats[0] ?? null
  )
  const [fields, setFields] = useState<Fields>(
    emptyFields(booking.id, cats[0]?.id ?? '')
  )
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function selectCat(cat: AdminCat) {
    setSelectedCat(cat)
    setFields(emptyFields(booking.id, cat.id))
    setShowForm(true)
  }

  function toggle(key: string) {
    setFields((p) => ({ ...p, [key]: !p[key] }))
  }

  function bool(key: string) {
    return !!fields[key]
  }
  function text(key: string) {
    return (fields[key] as string) ?? ''
  }
  function setText(key: string, val: string) {
    setFields((p) => ({ ...p, [key]: val || null }))
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await adminInsertHealthLog(fields)
      if (result.success) {
        setFields(emptyFields(booking.id, selectedCat?.id ?? ''))
        setShowForm(false)
        onSaved()
      } else {
        setError(result.error ?? 'Noe gikk galt.')
      }
    })
  }

  const logsForSelectedCat = existingLogs.filter(
    (l) => l.cat_id === selectedCat?.id
  )

  return (
    <div className="space-y-5">
      {/* Cat selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Velg katt
        </p>
        <div className="flex flex-wrap gap-2">
          {cats.map((cat) => {
            const catLogs = existingLogs.filter((l) => l.cat_id === cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => selectCat(cat)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                  selectedCat?.id === cat.id
                    ? 'border-primary bg-primary/10 font-medium'
                    : 'hover:bg-muted/40'
                )}
              >
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs">
                      🐱
                    </span>
                  )}
                </div>
                {cat.name}
                {catLogs.length > 0 && (
                  <Badge
                    variant="outline"
                    className="h-4 border-amber-300 px-1 text-[10px] text-amber-700"
                  >
                    {catLogs.length}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Existing logs for selected cat */}
      {logsForSelectedCat.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tidligere loggede avvik for {selectedCat?.name}
          </p>
          {logsForSelectedCat.map((log) => (
            <div
              key={log.id}
              className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span className="font-medium text-amber-800">
                  {new Date(log.created_at).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {log.avvik_beskrivelse && (
                <p className="text-xs text-amber-700">
                  {log.avvik_beskrivelse}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New log button */}
      {!showForm && (
        <Button
          variant="outline"
          onClick={() => {
            setShowForm(true)
            setFields(emptyFields(booking.id, selectedCat?.id ?? ''))
          }}
          className="w-full gap-2"
          disabled={!selectedCat}
        >
          <Plus className="h-4 w-4" />
          Registrer nytt avvik for {selectedCat?.name ?? 'valgt katt'}
        </Button>
      )}

      {/* Full form */}
      {showForm && selectedCat && (
        <div className="space-y-5 rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Nytt avvik – {selectedCat.name}</p>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Avbryt
            </button>
          </div>

          <Section title="1. Årsak til registrering">
            {[
              ['årsak_daglig_tilsyn', 'Daglig tilsyn'],
              ['årsak_atferd', 'Endring i atferd'],
              ['årsak_mistanke_sykdom', 'Mistanke om sykdom'],
              ['årsak_skade', 'Skade'],
              ['årsak_medisinering', 'Medisinering'],
              ['årsak_annet', 'Annet avvik'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="2. Observasjoner – Allmenntilstand">
            {[
              ['obs_normal', 'Normal'],
              ['obs_slapp', 'Slapp / apatisk'],
              ['obs_urolig', 'Urolig / stresset'],
              ['obs_aggressiv', 'Aggressiv / sky'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="Appetitt og drikke">
            {[
              ['obs_spiser_normalt', 'Spiser normalt'],
              ['obs_spiser_mindre', 'Spiser mindre'],
              ['obs_spiser_ikke', 'Spiser ikke'],
              ['obs_drikker_normalt', 'Drikker normalt'],
              ['obs_drikker_avvik', 'Drikker mindre / mer'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="Avføring / urin">
            {[
              ['obs_avføring_normal', 'Normal'],
              ['obs_diare', 'Diaré'],
              ['obs_forstoppelse', 'Forstoppelse'],
              ['obs_blod', 'Blod i avføring / urin'],
              ['obs_urin_avvik', 'Urinerer ikke normalt'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="Fysiske tegn">
            {[
              ['obs_oppkast', 'Oppkast'],
              ['obs_halthet', 'Halthet'],
              ['obs_sår', 'Sår / skade'],
              ['obs_øre_øye_nese', 'Øre / øye / neseflod'],
              ['obs_pels_hud', 'Hud- / pelsforandringer'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Annet</Label>
              <Input
                value={text('obs_annet_beskrivelse')}
                onChange={(e) =>
                  setText('obs_annet_beskrivelse', e.target.value)
                }
                className="h-8 text-sm"
              />
            </div>
          </Section>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              3. Beskrivelse av avvik / sykdom
            </Label>
            <Textarea
              value={text('avvik_beskrivelse')}
              onChange={(e) => setText('avvik_beskrivelse', e.target.value)}
              placeholder="Beskriv hva, når og hvordan..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <Section title="4. Tiltak iverksatt">
            {[
              ['tiltak_ekstra_obs', 'Ekstra observasjon'],
              ['tiltak_isolert', 'Isolert fra andre katter'],
              ['tiltak_rengjøring', 'Rengjøring / desinfeksjon utført'],
              ['tiltak_medisin', 'Medisin gitt'],
              ['tiltak_veterinær', 'Veterinær kontaktet'],
              ['tiltak_eier_kontaktet', 'Eier kontaktet'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Beskriv tiltak</Label>
              <Textarea
                value={text('tiltak_beskrivelse')}
                onChange={(e) => setText('tiltak_beskrivelse', e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          </Section>

          <Section title="5. Veterinær">
            {[
              ['vet_ikke_nødvendig', 'Ikke vurdert nødvendig'],
              ['vet_telefon', 'Rådført per telefon'],
              ['vet_undersøkt', 'Undersøkt av veterinær'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Veterinær / klinikk</Label>
                <Input
                  value={text('vet_navn_klinikk')}
                  onChange={(e) => setText('vet_navn_klinikk', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dato</Label>
                <DatePicker
                  value={text('vet_dato') || null}
                  onChange={(val) => setText('vet_dato', val ?? '')}
                  className="w-full"
                />
              </div>
            </div>
          </Section>

          <Section title="6. Informasjon til eier">
            {[
              ['eier_informert_samme_dag', 'Eier informert samme dag'],
              ['eier_informert_senere', 'Eier informert senere'],
              ['eier_oppfølging_avtalt', 'Avtale om videre oppfølging inngått'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="7. Oppfølging">
            {[
              ['oppfølging_avsluttet', 'Avvik avsluttet'],
              ['oppfølging_fortsetter', 'Skal følges opp videre'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Plan for oppfølging</Label>
              <Textarea
                value={text('oppfølging_plan')}
                onChange={(e) => setText('oppfølging_plan', e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          </Section>

          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-semibold">✍️ Signatur</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Navn</Label>
                <Input
                  value={text('signatur_navn')}
                  onChange={(e) => setText('signatur_navn', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dato</Label>
                <DatePicker
                  value={text('signatur_dato') || null}
                  onChange={(val) => setText('signatur_dato', val ?? '')}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lagrer...
              </>
            ) : (
              'Lagre helselogg'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
