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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  adminUpdateBookingCage,
  adminDeleteBooking,
} from '@/lib/admin/actions'
import {
  adminGetCheckinLog,
  adminGetHealthLogs,
  adminGetCatBehaviorNotes,
} from '@/lib/admin/formActions'
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
  Edit2,
  Trash2,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CatBehaviorNote {
  id: string
  cat_id: string
  cat_name: string
  gets_medication: boolean
  medication_details: string | null
  has_cat_experience: boolean
  gets_along_with_cats: string
  has_stress_issues: boolean
  stress_details: string | null
  aggression_risk: string
  aggression_details: string | null
}

interface BookingDetailDialogProps {
  booking: AdminBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

const ALONG_LABELS: Record<string, string> = {
  yes: 'Ja',
  no: 'Nei',
  unknown: 'Vet ikke',
}

const RISK_LABELS: Record<string, string> = {
  yes: 'Ja',
  no: 'Nei',
  unknown: 'Vet ikke',
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  onDeleted,
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
  const [behaviorNotes, setBehaviorNotes] = useState<CatBehaviorNote[]>([])
  const [logsLoaded, setLogsLoaded] = useState(false)

  // Cage editing state
  const [editingCage, setEditingCage] = useState(false)
  const [cageType, setCageType] = useState(booking?.cage_type ?? 'standard')
  const [cageCount, setCageCount] = useState(booking?.cage_count ?? 1)
  const [cagePrice, setCagePrice] = useState(String(booking?.price ?? 0))

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (booking && open && !logsLoaded) {
      setNotes(booking.admin_notes ?? '')
      Promise.all([
        adminGetCheckinLog(booking.id),
        adminGetHealthLogs(booking.id),
        adminGetCatBehaviorNotes(booking.id),
      ]).then(([checkin, health, behavior]) => {
        setCheckinLog(checkin)
        setHealthLogs(health)
        setBehaviorNotes(behavior)
        setLogsLoaded(true)
      })
    }
    if (!open) {
      setLogsLoaded(false)
      setCheckinLog(null)
      setHealthLogs([])
      setBehaviorNotes([])
      setMessage(null)
      setEditingCage(false)
      setConfirmDelete(false)
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

  function handleSaveCage() {
    setActiveAction('cage')
    setMessage(null)
    startTransition(async () => {
      const result = await adminUpdateBookingCage(
        booking!.id,
        cageType,
        cageCount,
        Number(cagePrice) || 0
      )
      setMessage(
        result.success
          ? { type: 'success', text: 'Bur oppdatert.' }
          : { type: 'error', text: result.error ?? 'Noe gikk galt.' }
      )
      if (result.success) {
        setEditingCage(false)
        onOpenChange(false) // ← lukk dialogen
        onDeleted?.() // ← trigger refresh i tabellen
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Noe gikk galt.' })
      }
      setActiveAction(null)
    })
  }

  function handleDelete() {
    setActiveAction('delete')
    startTransition(async () => {
      const result = await adminDeleteBooking(booking!.id)
      if (result.success) {
        onOpenChange(false)
        onDeleted?.()
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Noe gikk galt.' })
        setConfirmDelete(false)
      }
      setActiveAction(null)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-6">
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
            <TabsTrigger value="atferd" className="flex-1 gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Atferd
              {behaviorNotes.length > 0 && (
                <Badge
                  variant="outline"
                  className="h-4 border-blue-300 px-1 text-[10px] text-blue-700"
                >
                  {behaviorNotes.length}
                </Badge>
              )}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingCage(!editingCage)
                    setCageType(booking.cage_type)
                    setCageCount(booking.cage_count)
                    setCagePrice(String(booking.price))
                  }}
                  disabled={isPending}
                  className="ml-auto gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Rediger booking
                </Button>
              </div>
            </div>

            {/* Cage editor */}
            {editingCage && (
              <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                <p className="text-sm font-medium">Rediger bur og pris</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Burtype</Label>
                    <Select value={cageType} onValueChange={setCageType}>
                      <SelectTrigger className="h-9 w-full text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="senior_comfort">
                          Senior & Komfort
                        </SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Antall bur</Label>
                      <Select
                        value={String(cageCount)}
                        onValueChange={(v) => setCageCount(Number(v))}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Pris (kr)</Label>
                      <Input
                        type="number"
                        className="h-9 text-sm"
                        value={cagePrice}
                        onChange={(e) => setCagePrice(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveCage}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {activeAction === 'cage' && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Lagre endringer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingCage(false)}
                  >
                    Avbryt
                  </Button>
                </div>
              </div>
            )}

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
                    <div className="flex gap-2">
                      <p className="text-center text-xs font-medium">
                        {cat.name}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
                        {cat.age} år
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Two column layout */}
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

            {booking.wants_outdoor_cage && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
                🌿 Ønsker utebur
              </div>
            )}

            {/* Cats detail */}
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

            <Separator />

            {/* Delete */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Faresone
              </p>
              {!confirmDelete ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isPending}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Slett booking permanent
                </Button>
              ) : (
                <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">
                    Er du sikker?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bookingen og all tilhørende data slettes permanent og kan
                    ikke gjenopprettes.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="gap-1.5"
                    >
                      {activeAction === 'delete' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Ja, slett permanent
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isPending}
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── ATFERD ───────────────────────────────────────────────────── */}
          <TabsContent value="atferd" className="pt-2">
            {!logsLoaded ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : behaviorNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <ClipboardList className="h-8 w-8 opacity-30" />
                Ingen atferdsopplysninger registrert for denne bookingen
              </div>
            ) : (
              <div className="space-y-6">
                {behaviorNotes.map((note) => (
                  <div key={note.cat_id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm">
                        🐱
                      </div>
                      <h3 className="font-semibold">{note.cat_name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pl-9">
                      <BehaviorItem
                        label="Medisinering"
                        value={note.gets_medication ? 'Ja' : 'Nei'}
                        detail={note.medication_details}
                        highlight={note.gets_medication}
                      />
                      <BehaviorItem
                        label="Erfaring med katter"
                        value={note.has_cat_experience ? 'Ja' : 'Nei'}
                      />
                      <BehaviorItem
                        label="Går godt med andre katter"
                        value={
                          ALONG_LABELS[note.gets_along_with_cats] ??
                          note.gets_along_with_cats
                        }
                        highlight={note.gets_along_with_cats === 'no'}
                      />
                      <BehaviorItem
                        label="Stressutfordringer"
                        value={note.has_stress_issues ? 'Ja' : 'Nei'}
                        detail={note.stress_details}
                        highlight={note.has_stress_issues}
                      />
                      <BehaviorItem
                        label="Aggresjonsrisiko"
                        value={
                          RISK_LABELS[note.aggression_risk] ??
                          note.aggression_risk
                        }
                        detail={note.aggression_details}
                        highlight={
                          note.aggression_risk === 'yes' ||
                          note.aggression_risk === 'unknown'
                        }
                        className="col-span-2"
                      />
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            )}
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

function BehaviorItem({
  label,
  value,
  detail,
  highlight,
  className,
}: {
  label: string
  value: string
  detail?: string | null
  highlight?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'space-y-1 rounded-lg border bg-card p-3',
        highlight && 'border-amber-200 bg-amber-50',
        className
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-sm font-medium', highlight && 'text-amber-800')}>
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </div>
  )
}
