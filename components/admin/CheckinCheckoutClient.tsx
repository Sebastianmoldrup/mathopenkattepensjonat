'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  LogIn,
  LogOut,
  Phone,
  Mail,
  BedDouble,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  adminGetCheckinCheckoutByDate,
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

export default function CheckinCheckoutClient({
  initialEntries,
  initialDate,
}: Props) {
  const router = useRouter()
  const [date, setDate] = useState(initialDate)
  const [entries, setEntries] = useState(initialEntries)
  const [isPending, startTransition] = useTransition()

  const checkins = entries.filter((e) => e.event_type === 'checkin')
  const checkouts = entries.filter((e) => e.event_type === 'checkout')

  function handleDateChange(newDate: string) {
    setDate(newDate)
    router.push('/admin/innsjekk?dato=' + newDate, { scroll: false })
    startTransition(async () => {
      const newEntries = await adminGetCheckinCheckoutByDate(newDate)
      setEntries(newEntries)
    })
  }

  function navigateDay(direction: -1 | 1) {
    const d = parseISO(date)
    d.setDate(d.getDate() + direction)
    handleDateChange(localStr(d))
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
            disabled={isPending}
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
            disabled={isPending || isToday}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            I dag
          </button>
          <button
            onClick={() => navigateDay(1)}
            disabled={isPending}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            Neste ›
          </button>
        </div>
      </div>

      {isPending && (
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
            <ChecklistAccordion type="checkin" />
            {checkins.length === 0 ? (
              <EmptyState label="Ingen innsjekk denne dagen" />
            ) : (
              <div className="space-y-3">
                {checkins.map((entry) => (
                  <EntryCard
                    key={entry.booking_id}
                    entry={entry}
                    type="checkin"
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="mt-4">
          <div className="space-y-4">
            <ChecklistAccordion type="checkout" />
            {checkouts.length === 0 ? (
              <EmptyState label="Ingen utsjekk denne dagen" />
            ) : (
              <div className="space-y-3">
                {checkouts.map((entry) => (
                  <EntryCard
                    key={entry.booking_id}
                    entry={entry}
                    type="checkout"
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EntryCard({
  entry,
  type,
}: {
  entry: CheckinCheckoutEntry
  type: 'checkin' | 'checkout'
}) {
  const cageLabel =
    entry.cage_count === 2
      ? '2x Standard (splitt)'
      : (CAGE_LABELS[entry.cage_type] ?? entry.cage_type)

  const ownerName =
    ((entry.owner_first ?? '') + ' ' + (entry.owner_last ?? '')).trim() || '—'

  const periodLabel =
    format(parseISO(entry.date_from), 'd. MMM', { locale: nb }) +
    ' – ' +
    format(parseISO(entry.date_to), 'd. MMM yyyy', { locale: nb })

  const mailtoHref = 'mailto:' + entry.owner_email
  const telHref = entry.owner_phone ? 'tel:' + entry.owner_phone : null

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border p-4',
        type === 'checkin'
          ? 'border-green-200 bg-green-50/30'
          : 'border-blue-200 bg-blue-50/30'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{ownerName}</p>
          <p className="text-xs text-muted-foreground">{periodLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              type === 'checkin'
                ? 'border-green-300 bg-green-100 text-green-800'
                : 'border-blue-300 bg-blue-100 text-blue-800'
            )}
          >
            {type === 'checkin' ? 'Innsjekk' : 'Utsjekk'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {entry.num_cats} {entry.num_cats === 1 ? 'katt' : 'katter'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <BedDouble className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{cageLabel}</span>
        </div>
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

function ChecklistAccordion({ type }: { type: 'checkin' | 'checkout' }) {
  const [open, setOpen] = useState(false)

  const checkinItems = [
    'Sjekk at vaksinasjonskort er gyldig (innen 12 mnd, minst 14 dager før innsjekk)',
    'Ta i mot og oppbevar vaksinasjonskort for hver katt',
    'Registrer eventuell medisinering og instruksjoner',
    'Sjekk at hannkatter over 6 mnd er kastrert',
    'Gjennomgå spesielle instruksjoner fra eier',
    'Tildel bur og registrer i system (skal være gjort)',
  ]

  const checkoutItems = [
    'Hent frem vaksinasjonskort og gi tilbake til eier',
    'Sjekk at riktig katt leveres til riktig eier',
    'Gjennomgå helselogg — informer eier om eventuelle avvik',
    'Sjekk at bur er tomt og klart for rengjøring',
    'Registrer betaling',
    'Oppdater bookingstatus til Gjennomført',
  ]

  const items = type === 'checkin' ? checkinItems : checkoutItems
  const label =
    type === 'checkin' ? 'Innsjekk-huskeliste' : 'Utsjekk-huskeliste'

  return (
    <div className="overflow-hidden rounded-lg border border-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/40"
      >
        <span className="flex items-center gap-2">
          <span>{type === 'checkin' ? '📋' : '✅'}</span>
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div className="border-t border-border/40 bg-muted/20 px-4 py-3">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-[9px] font-medium text-foreground">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
