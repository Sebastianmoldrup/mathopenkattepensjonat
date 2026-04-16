'use client'

import { useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AdminBooking,
  AdminBookingStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  CAGE_LABELS,
  formatDateNO,
  nightsBetween,
} from '@/lib/admin/utils'
import {
  adminUpdateBookingStatus,
  adminUpdateBookingNotes,
} from '@/lib/admin/actions'
import { adminGetCheckinLog, adminGetHealthLogs } from '@/lib/admin/formActions'
import { CheckinLog, HealthLog } from '@/lib/admin/formTypes'
import { CheckinForm } from './forms/CheckinForm'
import { HealthLogForm } from './forms/HealthLogForm'
import { BookingPDFButton } from './BookingPDFButton'
import {
  CheckCircle2,
  XCircle,
  Flag,
  Loader2,
  CalendarDays,
  BedDouble,
  Banknote,
  User,
  Phone,
  MapPin,
  AlertCircle,
  LogIn,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingDetailDialogProps {
  booking: AdminBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailDialogProps) {
  const [notes, setNotes] = useState(booking?.admin_notes ?? '')
  const [isPending, startTransition] = useTransition()
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [checkinLog, setCheckinLog] = useState<CheckinLog | null>(null)
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([])
  const [logsLoaded, setLogsLoaded] = useState(false)

  useEffect(() => {
    if (booking && open && !logsLoaded) {
      setNotes(booking.admin_notes ?? '')
      Promise.all([
        adminGetCheckinLog(booking.id),
        adminGetHealthLogs(booking.id),
      ]).then(([checkin, health]) => {
        setCheckinLog(checkin)
        setHealthLogs(health)
        setLogsLoaded(true)
      })
    }
    if (!open) {
      setLogsLoaded(false)
      setCheckinLog(null)
      setHealthLogs([])
      setMessage(null)
    }
  }, [booking, open, logsLoaded])

  if (!booking) return null

  const nights = nightsBetween(booking.date_from, booking.date_to)
  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (split)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)

  function handleStatusChange(status: AdminBookingStatus) {
    setActiveAction(status)
    setMessage(null)
    startTransition(async () => {
      const result = await adminUpdateBookingStatus(
        booking!.id,
        status,
        booking!
      )
      setMessage(
        result.success
          ? {
              type: 'success',
              text: `Status oppdatert til "${STATUS_LABELS[status]}"`,
            }
          : { type: 'error', text: result.error ?? 'Noe gikk galt.' }
      )
      setActiveAction(null)
    })
  }

  function handleSaveNotes() {
    setActiveAction('notes')
    setMessage(null)
    startTransition(async () => {
      const result = await adminUpdateBookingNotes(booking!.id, notes)
      setMessage(
        result.success
          ? { type: 'success', text: 'Notat lagret.' }
          : { type: 'error', text: result.error ?? 'Noe gikk galt.' }
      )
      setActiveAction(null)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex flex-wrap items-center gap-3">
            Booking
            <Badge
              variant="outline"
              className={cn('text-xs', STATUS_COLORS[booking.status])}
            >
              {STATUS_LABELS[booking.status]}
            </Badge>
            <div className="ml-auto">
              <BookingPDFButton
                bookingId={booking.id}
                ownerName={
                  `${booking.user_first_name ?? ''} ${booking.user_last_name ?? ''}`.trim() ||
                  booking.user_email
                }
                dateFrom={booking.date_from}
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        {message && (
          <p
            className={cn(
              'rounded-md border px-3 py-2 text-sm',
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-destructive/20 bg-destructive/10 text-destructive'
            )}
          >
            {message.text}
          </p>
        )}

        <Tabs defaultValue="detaljer">
          <TabsList className="w-full">
            <TabsTrigger value="detaljer" className="flex-1">
              Detaljer
            </TabsTrigger>
            <TabsTrigger value="innsjekk" className="flex-1 gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              Inn/Ut
              {checkinLog?.inn_completed_at && (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="helse" className="flex-1 gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              Helse
              {healthLogs.length > 0 && (
                <Badge
                  variant="outline"
                  className="h-4 border-amber-300 px-1 text-[10px] text-amber-700"
                >
                  {healthLogs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── DETALJER ─────────────────────────────────────────────────── */}
          <TabsContent value="detaljer" className="space-y-5 pt-2">
            {/* Status actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Handlinger
              </p>
              <div className="flex flex-wrap gap-2">
                {booking.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {activeAction === 'confirmed' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    Bekreft
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('completed')}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {activeAction === 'completed' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Flag className="h-3.5 w-3.5" />
                    )}
                    Gjennomført
                  </Button>
                )}
                {(booking.status === 'pending' ||
                  booking.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {activeAction === 'cancelled' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Avbestill
                  </Button>
                )}
              </div>
            </div>

            {/* Cat photos */}
            {booking.cats && booking.cats.length > 0 && (
              <div className="flex gap-3">
                {booking.cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl">
                          🐱
                        </span>
                      )}
                    </div>
                    <p className="text-center text-xs font-medium">
                      {cat.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Two column layout for details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Bookingdetaljer
                </p>
                <div className="space-y-2 text-sm">
                  <Row
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Innsjekk"
                    value={formatDateNO(booking.date_from)}
                  />
                  <Row
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Utsjekk"
                    value={formatDateNO(booking.date_to)}
                  />
                  <Row
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Netter"
                    value={`${nights} ${nights === 1 ? 'natt' : 'netter'}`}
                  />
                  <Row
                    icon={<BedDouble className="h-4 w-4" />}
                    label="Burtype"
                    value={cageLabel}
                  />
                  <Row
                    icon={<Banknote className="h-4 w-4" />}
                    label="Pris"
                    value={`${booking.price.toLocaleString('nb-NO')} kr`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Kunde
                </p>
                <div className="space-y-2 text-sm">
                  <Row
                    icon={<User className="h-4 w-4" />}
                    label="Navn"
                    value={
                      `${booking.user_first_name ?? ''} ${booking.user_last_name ?? ''}`.trim() ||
                      '—'
                    }
                  />
                  <Row
                    icon={<User className="h-4 w-4" />}
                    label="E-post"
                    value={booking.user_email}
                  />
                  <Row
                    icon={<Phone className="h-4 w-4" />}
                    label="Telefon"
                    value={booking.user_phone ?? '—'}
                  />
                  <Row
                    icon={<MapPin className="h-4 w-4" />}
                    label="Adresse"
                    value={booking.user_address ?? '—'}
                  />
                  <Row
                    icon={<AlertCircle className="h-4 w-4" />}
                    label="Nødkontakt"
                    value={booking.user_emergency_contact ?? '—'}
                  />
                </div>
              </div>
            </div>

            {booking.special_instructions && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" />
                {booking.special_instructions}
              </div>
            )}

            {/* Cats */}
            {booking.cats && booking.cats.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Katter ({booking.cats.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {booking.cats.map((cat) => (
                      <div
                        key={cat.id}
                        className="space-y-1.5 rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                            {cat.image_url ? (
                              <Image
                                src={cat.image_url}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-sm">
                                🐱
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{cat.name}</p>
                            {cat.breed && (
                              <p className="text-xs text-muted-foreground">
                                {cat.breed}
                              </p>
                            )}
                          </div>
                        </div>
                        {cat.medical_notes && (
                          <p className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
                            <strong>Medisinsk:</strong> {cat.medical_notes}
                          </p>
                        )}
                        {cat.diet && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Diett:</strong> {cat.diet}
                          </p>
                        )}
                        {cat.behavior_notes && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Adferd:</strong> {cat.behavior_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Admin notes */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Interne notater
              </p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Legg til interne notater..."
                rows={3}
                className="resize-none text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveNotes}
                disabled={isPending}
                className="w-full"
              >
                {activeAction === 'notes' ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  'Lagre notat'
                )}
              </Button>
            </div>
          </TabsContent>

          {/* ── INNSJEKK/UTSJEKK ─────────────────────────────────────────── */}
          <TabsContent value="innsjekk" className="pt-2">
            {logsLoaded ? (
              <CheckinForm booking={booking} existing={checkinLog} />
            ) : (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </TabsContent>

          {/* ── HELSE ────────────────────────────────────────────────────── */}
          <TabsContent value="helse" className="pt-2">
            {logsLoaded ? (
              <HealthLogForm
                booking={booking}
                existingLogs={healthLogs}
                onSaved={() =>
                  adminGetHealthLogs(booking.id).then(setHealthLogs)
                }
              />
            ) : (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <span className="w-20 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <span className="break-all text-xs font-medium">{value}</span>
    </div>
  )
}
