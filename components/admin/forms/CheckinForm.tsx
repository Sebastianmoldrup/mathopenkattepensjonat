'use client'

import { useState, useTransition } from 'react'
import { CheckinLog } from '@/lib/admin/formTypes'
import { AdminBooking } from '@/lib/admin/utils'
import { adminUpsertCheckinLog } from '@/lib/admin/formActions'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatePicker } from '@/components/admin/DatePicker'
import { Loader2, CheckCircle2, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateNO } from '@/lib/admin/utils'

interface CheckinFormProps {
  booking: AdminBooking
  existing: CheckinLog | null
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

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

export function CheckinForm({ booking, existing }: CheckinFormProps) {
  const init = existing ?? ({} as Partial<CheckinLog>)
  const [fields, setFields] = useState<Record<string, boolean | string | null>>(
    init as any
  )
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(key: string) {
    setFields((p) => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  function setText(key: string, value: string) {
    setFields((p) => ({ ...p, [key]: value || null }))
    setSaved(false)
  }

  function bool(key: string) {
    return !!fields[key]
  }
  function text(key: string) {
    return (fields[key] as string) ?? ''
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await adminUpsertCheckinLog(booking.id, fields)
      if (result.success) setSaved(true)
      else setError(result.error ?? 'Noe gikk galt.')
    })
  }

  const customerName =
    `${booking.user_first_name ?? ''} ${booking.user_last_name ?? ''}`.trim()
  const catNames = booking.cats?.map((c) => c.name).join(', ') ?? '—'

  return (
    <div className="space-y-4">
      {/* Pre-filled booking info */}
      <div className="space-y-1 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Eier</span>
          <span className="font-medium">
            {customerName || booking.user_email}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Katt(er)</span>
          <span className="font-medium">{catNames}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Innsjekk</span>
          <span className="font-medium">{formatDateNO(booking.date_from)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Utsjekk</span>
          <span className="font-medium">{formatDateNO(booking.date_to)}</span>
        </div>
      </div>

      <Tabs defaultValue="innsjekk">
        <TabsList className="w-full">
          <TabsTrigger value="innsjekk" className="flex-1 gap-1.5">
            <LogIn className="h-3.5 w-3.5" /> Innsjekk
            {existing?.inn_completed_at && (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="utsjekk" className="flex-1 gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> Utsjekk
            {existing?.ut_completed_at && (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── INNSJEKK ──────────────────────────────────────────────────────── */}
        <TabsContent value="innsjekk" className="space-y-5 pt-4">
          <Section title="📋 Dokumentasjon og informasjon">
            {[
              ['inn_eier_identifisert', 'Eier identifisert'],
              ['inn_kontakt_registrert', 'Kontaktinformasjon registrert'],
              ['inn_nødkontakt_registrert', 'Nødkontakt registrert'],
              ['inn_vaksinasjon_kontrollert', 'Gyldig vaksinasjon kontrollert'],
              ['inn_helseopplysninger_mottatt', 'Helseopplysninger mottatt'],
              [
                'inn_medisiner_mottatt',
                'Eventuelle medisiner mottatt og merket',
              ],
              ['inn_fôr_avklart', 'Fôr / spesialbehov avklart'],
              ['inn_avtale_signert', 'Innsjekkavtale signert'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="🐾 Helse- og atferdssjekk">
            {[
              ['inn_frisk', 'Katten fremstår frisk'],
              ['inn_ingen_sår', 'Ingen synlige sår eller skader'],
              ['inn_øyne_nese_pels', 'Øyne, nese og pels uten unormale funn'],
              ['inn_normal_atferd', 'Normal atferd'],
              ['inn_avvik_observert', 'Avvik observert'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <Section title="🏠 Klargjøring av bur (før katten settes inn)">
            {[
              ['inn_bur_rengjort', 'Bur / rom rengjort'],
              ['inn_overflater_desinfisert', 'Overflater desinfisert'],
              ['inn_kattedo_rengjort', 'Kattedo rengjort og desinfisert'],
              ['inn_ren_kattesand', 'Ren kattesand lagt i kattedo'],
              ['inn_skåler_vasket', 'Mat- og vannskåler vasket'],
              ['inn_rene_tepper', 'Rene tepper / liggeunderlag lagt inn'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Dato for innsjekk</Label>
              <DatePicker
                value={text('inn_dato_klokkeslett') || null}
                onChange={(val) => setText('inn_dato_klokkeslett', val ?? '')}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Signatur</Label>
              <Input
                value={text('inn_signatur')}
                onChange={(e) => setText('inn_signatur', e.target.value)}
                placeholder="Navn"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              setFields((p) => ({
                ...p,
                inn_completed_at: new Date().toISOString(),
              }))
              handleSave()
            }}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lagrer...
              </>
            ) : (
              'Lagre innsjekk'
            )}
          </Button>
        </TabsContent>

        {/* ── UTSJEKK ──────────────────────────────────────────────────────── */}
        <TabsContent value="utsjekk" className="space-y-5 pt-4">
          <Section title="🐾 Kattens status ved utsjekk">
            {[
              ['ut_frisk', 'Katten fremstår frisk'],
              ['ut_normal_appetitt', 'Normal appetitt under opphold'],
              ['ut_ingen_skader', 'Ingen skader oppstått'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Eventuelle behandlinger gitt</Label>
              <Textarea
                value={text('ut_behandlinger_beskrivelse')}
                onChange={(e) =>
                  setText('ut_behandlinger_beskrivelse', e.target.value)
                }
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          </Section>

          <Section title="📢 Informasjon til eier">
            {[
              ['ut_eier_informert', 'Eier informert om oppholdet'],
              ['ut_avvik_forklart', 'Eventuelle avvik forklart'],
              ['ut_medisiner_levert', 'Medisiner levert tilbake'],
            ].map(([key, label]) => (
              <CheckRow
                key={key}
                checked={bool(key)}
                label={label}
                onChange={() => toggle(key)}
              />
            ))}
          </Section>

          <div className="space-y-1">
            <Label className="text-xs">Avvik / merknader</Label>
            <Textarea
              value={text('ut_avvik_merknader')}
              onChange={(e) => setText('ut_avvik_merknader', e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Dato for utsjekk</Label>
              <DatePicker
                value={text('ut_dato_klokkeslett') || null}
                onChange={(val) => setText('ut_dato_klokkeslett', val ?? '')}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Signatur</Label>
              <Input
                value={text('ut_signatur')}
                onChange={(e) => setText('ut_signatur', e.target.value)}
                placeholder="Navn"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              setFields((p) => ({
                ...p,
                ut_completed_at: new Date().toISOString(),
              }))
              handleSave()
            }}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lagrer...
              </>
            ) : (
              'Lagre utsjekk'
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Lagret
        </p>
      )}
    </div>
  )
}
