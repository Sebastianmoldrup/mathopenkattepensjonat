'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { adminGetCheckinCheckoutLog } from '@/lib/admin/actions'
import { nb } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  LogIn,
  LogOut,
  Phone,
  Mail,
  BedDouble,
  AlertTriangle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ClipboardList,
  Printer,
} from 'lucide-react'
import {
  adminGetCheckinCheckoutByDate,
  adminUpsertCheckin,
  adminUpsertCheckout,
  CheckinCheckoutEntry,
} from '@/lib/admin/actions'
import { CAGE_LABELS } from '@/lib/admin/utils'
import { cn } from '@/lib/utils'

type Props = {
  initialEntries: CheckinCheckoutEntry[]
  initialDate: string
}

function localStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}

const CHECKIN_GROUPS = [
  {
    title: 'Eier og dokumentasjon',
    items: [
      {
        key: 'inn_vaksinasjonskort_mottatt',
        label: 'Vaksinasjonskort mottatt',
      },
      { key: 'inn_eier_identifisert', label: 'Eier identifisert' },
      { key: 'inn_kontakt_registrert', label: 'Kontaktinfo registrert' },
      { key: 'inn_nødkontakt_registrert', label: 'Nødkontakt registrert' },
      { key: 'inn_vaksinasjon_kontrollert', label: 'Vaksinasjon kontrollert' },
      {
        key: 'inn_helseopplysninger_mottatt',
        label: 'Helseopplysninger mottatt',
      },
      { key: 'inn_medisiner_mottatt', label: 'Medisiner mottatt' },
      { key: 'inn_fôr_avklart', label: 'Fôr avklart' },
      { key: 'inn_avtale_signert', label: 'Avtale signert' },
    ],
  },
  {
    title: 'Kattens tilstand',
    items: [
      { key: 'inn_frisk', label: 'Katten er frisk' },
      { key: 'inn_ingen_sår', label: 'Ingen sår eller skader' },
      { key: 'inn_øyne_nese_pels', label: 'Øyne, nese og pels OK' },
      { key: 'inn_normal_atferd', label: 'Normal atferd' },
      { key: 'inn_avvik_observert', label: 'Avvik observert' },
    ],
  },
  {
    title: 'Bur og utstyr',
    items: [
      { key: 'inn_bur_rengjort', label: 'Bur rengjort' },
      { key: 'inn_overflater_desinfisert', label: 'Overflater desinfisert' },
      { key: 'inn_kattedo_rengjort', label: 'Kattedo rengjort' },
      { key: 'inn_ren_kattesand', label: 'Ren kattesand' },
      { key: 'inn_skåler_vasket', label: 'Skåler vasket' },
      { key: 'inn_rene_tepper', label: 'Rene tepper' },
    ],
  },
]

const CHECKOUT_GROUPS = [
  {
    title: 'Kattens tilstand',
    items: [
      { key: 'ut_frisk', label: 'Katten er frisk ved utsjekk' },
      { key: 'ut_normal_appetitt', label: 'Normal appetitt under oppholdet' },
      { key: 'ut_ingen_skader', label: 'Ingen skader' },
    ],
  },
  {
    title: 'Eier og informasjon',
    items: [
      { key: 'ut_eier_informert', label: 'Eier informert om oppholdet' },
      { key: 'ut_avvik_forklart', label: 'Eventuelle avvik forklart' },
      { key: 'ut_medisiner_levert', label: 'Medisiner levert tilbake' },
    ],
  },
  {
    title: 'Rengjøring og utstyr',
    items: [
      { key: 'ut_rom_tomt', label: 'Rom tomt for kattens eiendeler' },
      { key: 'ut_kattedo_tømt', label: 'Kattedo tømt' },
      { key: 'ut_kattedo_rengjort', label: 'Kattedo rengjort' },
      { key: 'ut_skåler_vasket', label: 'Skåler vasket' },
      { key: 'ut_tepper_vask', label: 'Tepper til vask' },
      { key: 'ut_bur_rengjort', label: 'Bur rengjort' },
      { key: 'ut_overflater_desinfisert', label: 'Overflater desinfisert' },
      { key: 'ut_utstyr_klart', label: 'Utstyr klart til neste katt' },
    ],
  },
]

export default function CheckinCheckoutClient({
  initialEntries,
  initialDate,
}: Props) {
  const router = useRouter()
  const [date, setDate] = useState(initialDate)
  const [entries, setEntries] = useState(initialEntries)
  const [isLoading, setIsLoading] = useState(false)

  const [dialogEntry, setDialogEntry] = useState<CheckinCheckoutEntry | null>(
    null
  )
  const [dialogType, setDialogType] = useState<'checkin' | 'checkout' | null>(
    null
  )
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const checkins = entries.filter((e) => e.event_type === 'checkin')
  const checkouts = entries.filter((e) => e.event_type === 'checkout')

  function handleLabelPrinted(bookingId: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.booking_id === bookingId ? { ...e, label_printed: true } : e
      )
    )
  }

  function handleDateChange(newDate: string) {
    setDate(newDate)
    router.push('/admin/innsjekk?dato=' + newDate, { scroll: false })
    setIsLoading(true)
    adminGetCheckinCheckoutByDate(newDate).then((newEntries) => {
      setEntries(newEntries)
      setIsLoading(false)
    })
  }

  function navigateDay(direction: -1 | 1) {
    const d = parseISO(date)
    d.setDate(d.getDate() + direction)
    handleDateChange(localStr(d))
  }

  async function openChecklist(
    entry: CheckinCheckoutEntry,
    type: 'checkin' | 'checkout'
  ) {
    setDialogEntry(entry)
    setDialogType(type)
    setConfirmOpen(false)

    const groups = type === 'checkin' ? CHECKIN_GROUPS : CHECKOUT_GROUPS
    const initial: Record<string, boolean> = {}
    groups.forEach((group) =>
      group.items.forEach((item) => {
        initial[item.key] = false
      })
    )

    // Hent eksisterende verdier
    const log = await adminGetCheckinCheckoutLog(entry.booking_id)
    if (log) {
      groups.forEach((group) =>
        group.items.forEach((item) => {
          if (item.key in log && log[item.key] !== null) {
            initial[item.key] = log[item.key] as boolean
          }
        })
      )
    }

    setChecklist(initial)
  }

  async function handleSave() {
    if (!dialogEntry || !dialogType) return
    setSaving(true)
    try {
      const result =
        dialogType === 'checkin'
          ? await adminUpsertCheckin(dialogEntry.booking_id, checklist)
          : await adminUpsertCheckout(dialogEntry.booking_id, checklist)
      if (result.success) {
        const newEntries = await adminGetCheckinCheckoutByDate(date)
        setEntries(newEntries)
        setDialogEntry(null)
        setDialogType(null)
        setConfirmOpen(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const dateLabel = format(parseISO(date), 'EEEE d. MMMM yyyy', { locale: nb })
  const isToday = date === localStr(new Date())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold capitalize">{dateLabel}</h1>
          {isToday && (
            <span className="text-xs text-muted-foreground">I dag</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDay(-1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            ‹ Forrige
          </button>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="h-8 w-40 text-xs"
          />
          <button
            onClick={() => handleDateChange(localStr(new Date()))}
            disabled={isLoading || isToday}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            I dag
          </button>
          <button
            onClick={() => navigateDay(1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            Neste ›
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Laster...
        </div>
      )}

      <Tabs defaultValue="checkin">
        <TabsList className="w-full">
          <TabsTrigger value="checkin" className="flex-1 gap-2">
            <LogIn className="h-3.5 w-3.5" />
            Innsjekk
            {checkins.length > 0 && (
              <Badge
                variant="outline"
                className="h-4 border-green-300 px-1.5 text-[10px] text-green-700"
              >
                {checkins.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="checkout" className="flex-1 gap-2">
            <LogOut className="h-3.5 w-3.5" />
            Utsjekk
            {checkouts.length > 0 && (
              <Badge
                variant="outline"
                className="h-4 border-blue-300 px-1.5 text-[10px] text-blue-700"
              >
                {checkouts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-4">
          <div className="space-y-4">
            {/* Batch print-knapp */}
            {checkins.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5"
                onClick={() => { window.location.href = `/api/admin/pdf/daily/${date}` }}
              >
                <Printer className="h-3.5 w-3.5" />
                Last ned alle labels for i dag ({checkins.length})
              </Button>
            )}

            {checkins.length === 0 ? (
              <EmptyState label="Ingen innsjekk denne dagen" />
            ) : (
              <>
                {checkins.filter((e) => !e.is_checked_in).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ikke sjekket inn (
                      {checkins.filter((e) => !e.is_checked_in).length})
                    </p>
                    {checkins
                      .filter((e) => !e.is_checked_in)
                      .map((entry) => (
                        <EntryCard
                          key={entry.booking_id}
                          entry={entry}
                          type="checkin"
                          onOpenChecklist={() =>
                            openChecklist(entry, 'checkin')
                          }
                          onLabelPrinted={() =>
                            handleLabelPrinted(entry.booking_id)
                          }
                        />
                      ))}
                  </div>
                )}
                {checkins.filter((e) => e.is_checked_in).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-green-600">
                      Sjekket inn (
                      {checkins.filter((e) => e.is_checked_in).length})
                    </p>
                    {checkins
                      .filter((e) => e.is_checked_in)
                      .map((entry) => (
                        <EntryCard
                          key={entry.booking_id}
                          entry={entry}
                          type="checkin"
                          onOpenChecklist={() =>
                            openChecklist(entry, 'checkin')
                          }
                          onLabelPrinted={() =>
                            handleLabelPrinted(entry.booking_id)
                          }
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="mt-4">
          <div className="space-y-4">
            {checkouts.length === 0 ? (
              <EmptyState label="Ingen utsjekk denne dagen" />
            ) : (
              <>
                {checkouts.filter((e) => !e.is_checked_out).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ikke sjekket ut (
                      {checkouts.filter((e) => !e.is_checked_out).length})
                    </p>
                    {checkouts
                      .filter((e) => !e.is_checked_out)
                      .map((entry) => (
                        <EntryCard
                          key={entry.booking_id}
                          entry={entry}
                          type="checkout"
                          onOpenChecklist={() =>
                            openChecklist(entry, 'checkout')
                          }
                          onLabelPrinted={() =>
                            handleLabelPrinted(entry.booking_id)
                          }
                        />
                      ))}
                  </div>
                )}
                {checkouts.filter((e) => e.is_checked_out).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                      Sjekket ut (
                      {checkouts.filter((e) => e.is_checked_out).length})
                    </p>
                    {checkouts
                      .filter((e) => e.is_checked_out)
                      .map((entry) => (
                        <EntryCard
                          key={entry.booking_id}
                          entry={entry}
                          type="checkout"
                          onOpenChecklist={() =>
                            openChecklist(entry, 'checkout')
                          }
                          onLabelPrinted={() =>
                            handleLabelPrinted(entry.booking_id)
                          }
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Checklist Dialog */}
      <Dialog
        open={!!dialogEntry && !confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogEntry(null)
            setDialogType(null)
          }
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {dialogType === 'checkin'
                ? 'Innsjekk-sjekkliste'
                : 'Utsjekk-sjekkliste'}
            </DialogTitle>
            <DialogDescription>
              {dialogEntry?.owner_first} {dialogEntry?.owner_last} —{' '}
              {dialogEntry?.cat_names}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {(dialogType === 'checkin' ? CHECKIN_GROUPS : CHECKOUT_GROUPS).map(
              (group, gi) => (
                <div key={gi} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  {group.items.map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.key] ?? false}
                        onChange={(e) =>
                          setChecklist((prev) => ({
                            ...prev,
                            [item.key]: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              )
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => setConfirmOpen(true)} className="flex-1">
              {dialogType === 'checkin'
                ? 'Fullfør innsjekk'
                : 'Fullfør utsjekk'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDialogEntry(null)
                setDialogType(null)
              }}
            >
              Avbryt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Bekreft {dialogType === 'checkin' ? 'innsjekk' : 'utsjekk'}
            </DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil fullføre{' '}
              {dialogType === 'checkin' ? 'innsjekk' : 'utsjekk'} for{' '}
              {dialogEntry?.owner_first} {dialogEntry?.owner_last}? Dette lagres
              med tidspunkt og ditt brukernavn.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-1.5"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Bekreft
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
            >
              Tilbake
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EntryCard({
  entry,
  type,
  onOpenChecklist,
  onLabelPrinted,
}: {
  entry: CheckinCheckoutEntry
  type: 'checkin' | 'checkout'
  onOpenChecklist: () => void
  onLabelPrinted: () => void
}) {
  // const cageLabel =
  //   entry.cage_count === 2
  //     ? '2x Standard (splitt)'
  //     : (CAGE_LABELS[entry.cage_type] ?? entry.cage_type)

  const ownerName =
    ((entry.owner_first ?? '') + ' ' + (entry.owner_last ?? '')).trim() || '—'

  const periodLabel =
    format(parseISO(entry.date_from), 'd. MMM', { locale: nb }) +
    ' – ' +
    format(parseISO(entry.date_to), 'd. MMM yyyy', { locale: nb })

  const isCompleted =
    type === 'checkin' ? entry.is_checked_in : entry.is_checked_out
  const completedAt =
    type === 'checkin' ? entry.checked_in_at : entry.checked_out_at
  const mailtoHref = 'mailto:' + entry.owner_email
  const telHref = entry.owner_phone ? 'tel:' + entry.owner_phone : null

  const router = useRouter()

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border p-4',
        isCompleted ? 'opacity-60' : '',
        type === 'checkin'
          ? 'border-green-200 bg-green-50/30'
          : 'border-blue-200 bg-blue-50/30'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            <p className="text-sm font-medium">{ownerName}</p>
          </div>
          <p className="text-xs text-muted-foreground">{periodLabel}</p>
          {isCompleted && completedAt && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fullført{' '}
              {format(parseISO(completedAt), 'd. MMM HH:mm', { locale: nb })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              isCompleted
                ? 'border-green-300 bg-green-100 text-green-800'
                : type === 'checkin'
                  ? 'border-green-300 bg-green-100 text-green-800'
                  : 'border-blue-300 bg-blue-100 text-blue-800'
            )}
          >
            {isCompleted
              ? type === 'checkin'
                ? 'Sjekket inn'
                : 'Sjekket ut'
              : type === 'checkin'
                ? 'Innsjekk'
                : 'Utsjekk'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {entry.num_cats} {entry.num_cats === 1 ? 'katt' : 'katter'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        {entry.cage_assignments.length === 0 ? (
          <div className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>Ingen burtildeling — må tildeles i burplassering</span>
          </div>
        ) : entry.cage_assignments.length === 1 ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{entry.cage_assignments[0].cage_label}</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BedDouble className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-xs font-medium">Burbytte</span>
            </div>
            {entry.cage_assignments.map((ca, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 pl-5 text-xs text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {ca.cage_label}
                </span>
                <span>
                  {format(parseISO(ca.date_from), 'd. MMM', { locale: nb })}
                  {' – '}
                  {format(parseISO(ca.date_to), 'd. MMM', { locale: nb })}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          <a
            href={mailtoHref}
            className="truncate transition-colors hover:text-foreground"
          >
            {entry.owner_email}
          </a>
        </div>
        {telHref && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <a
              href={telHref}
              className="transition-colors hover:text-foreground"
            >
              {entry.owner_phone}
            </a>
          </div>
        )}
        {entry.wants_outdoor_cage && (
          <div className="flex items-center gap-1.5 text-blue-700">
            <span>🌿 Ønsker utebur</span>
          </div>
        )}
      </div>

      {entry.cat_names && (
        <p className="text-xs text-muted-foreground">
          {'🐱 ' + entry.cat_names}
        </p>
      )}

      {entry.special_instructions && (
        <div className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>{entry.special_instructions}</span>
        </div>
      )}

      {entry.admin_notes && (
        <div className="rounded-md border border-border/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {'📝 ' + entry.admin_notes}
        </div>
      )}

      <Button
        size="sm"
        onClick={onOpenChecklist}
        className={cn(
          'w-full gap-1.5',
          isCompleted
            ? 'border-border/40 bg-muted/40 text-muted-foreground hover:bg-muted'
            : type === 'checkin'
              ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
              : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
        )}
        variant="outline"
      >
        <ClipboardList className="h-3.5 w-3.5" />
        {isCompleted
          ? 'Se sjekkliste'
          : type === 'checkin'
            ? 'Start innsjekk'
            : 'Start utsjekk'}
      </Button>

      <Button
        size="sm"
        variant="outline"
        className={cn(
          'w-full gap-1.5',
          entry.label_printed
            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            : 'border-border/40 text-muted-foreground hover:bg-muted'
        )}
        onClick={() => {
          window.location.href = `/api/admin/pdf/booking/${entry.booking_id}`
          onLabelPrinted()
        }}
      >
        <Printer className="h-3.5 w-3.5" />
        {entry.label_printed ? '✓ Label skrevet ut' : 'Skriv ut label'}
      </Button>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <span className="text-3xl">📅</span>
      {label}
    </div>
  )
}
