'use client'

import { useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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
  adminUpdateBookingDetails,
  adminDeleteBooking,
} from '@/lib/admin/actions'
import {
  adminGetHealthLogs,
  adminGetCatBehaviorNotes,
} from '@/lib/admin/formActions'
import { HealthLog } from '@/lib/admin/formTypes'
import { HealthLogForm } from './forms/HealthLogForm'
import { BookingPDFButton } from './BookingPDFButton'
import {
  Loader2,
  CalendarDays,
  BedDouble,
  Banknote,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Heart,
  Edit2,
  Trash2,
  Pill,
  AlertTriangle,
  ChevronRight,
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

const CAGE_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'standard_split', label: 'Standard x2 (splitt)' },
  { value: 'senior_comfort', label: 'Senior & Komfort' },
  { value: 'suite', label: 'Suite' },
]

const ALL_STATUSES: AdminBookingStatus[] = [
  'pending',
  'waitlist',
  'confirmed',
  'completed',
  'cancelled',
]

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
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([])
  const [behaviorNotes, setBehaviorNotes] = useState<CatBehaviorNote[]>([])
  const [logsLoaded, setLogsLoaded] = useState(false)

  const [editMode, setEditMode] = useState(false)
  const [editDateFrom, setEditDateFrom] = useState('')
  const [editDateTo, setEditDateTo] = useState('')
  const [editCageType, setEditCageType] = useState('')
  const [editPrice, setEditPrice] = useState(0)
  const [editOutdoor, setEditOutdoor] = useState(false)
  const [editInstructions, setEditInstructions] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedCat, setSelectedCat] = useState<CatBehaviorNote | null>(null)
  const [catSheetOpen, setCatSheetOpen] = useState(false)

  useEffect(() => {
    if (booking && open && !logsLoaded) {
      setNotes(booking.admin_notes ?? '')
      Promise.all([
        adminGetHealthLogs(booking.id),
        adminGetCatBehaviorNotes(booking.id),
      ]).then(([health, behavior]) => {
        setHealthLogs(health)
        setBehaviorNotes(behavior)
        setLogsLoaded(true)
      })
    }
    if (!open) {
      setLogsLoaded(false)
      setHealthLogs([])
      setBehaviorNotes([])
      setMessage(null)
      setEditMode(false)
      setConfirmDelete(false)
      setCatSheetOpen(false)
      setSelectedCat(null)
    }
  }, [booking, open, logsLoaded])

  if (!booking) return null

  const nights = nightsBetween(booking.date_from, booking.date_to)
  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (splitt)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)

  function openEditMode() {
    setEditDateFrom(booking!.date_from)
    setEditDateTo(booking!.date_to)
    setEditCageType(
      booking!.cage_count === 2 ? 'standard_split' : booking!.cage_type
    )
    setEditPrice(booking!.price)
    setEditOutdoor(booking!.wants_outdoor_cage)
    setEditInstructions(booking!.special_instructions ?? '')
    setEditMode(true)
  }

  function handleStatusChange(status: AdminBookingStatus) {
    if (status === booking!.status) return
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

  function handleSaveDetails() {
    setActiveAction('details')
    setMessage(null)
    const isStandardSplit = editCageType === 'standard_split'
    startTransition(async () => {
      const result = await adminUpdateBookingDetails(
        booking!.id,
        {
          date_from: editDateFrom,
          date_to: editDateTo,
          cage_type: isStandardSplit ? 'standard' : editCageType,
          cage_count: isStandardSplit ? 2 : 1,
          price: editPrice,
          wants_outdoor_cage: editOutdoor,
          special_instructions: editInstructions || null,
        },
        booking!
      )
      setMessage(
        result.success
          ? { type: 'success', text: 'Booking oppdatert.' }
          : { type: 'error', text: result.error ?? 'Noe gikk galt.' }
      )
      setActiveAction(null)
      if (result.success) setEditMode(false)
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
    <>
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
            <DialogDescription className="sr-only">
              Detaljer og administrasjon av booking
            </DialogDescription>
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

            {/* ── DETALJER ─────────────────────────────────────────────── */}
            <TabsContent value="detaljer" className="space-y-5 pt-2">
              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((s) => {
                    const isActive = booking.status === s
                    return (
                      <Button
                        key={s}
                        size="sm"
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(s)}
                        disabled={isPending || isActive}
                        className={cn('gap-1.5', isActive && STATUS_COLORS[s])}
                      >
                        {activeAction === s && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {STATUS_LABELS[s]}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Edit button */}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openEditMode}
                  disabled={isPending || editMode}
                  className="gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Rediger booking
                </Button>
              </div>

              {/* Edit mode */}
              {editMode && (
                <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Rediger bookingdetaljer</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Innsjekk</Label>
                      <Input
                        type="date"
                        className="h-8 text-sm"
                        value={editDateFrom}
                        onChange={(e) => setEditDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Utsjekk</Label>
                      <Input
                        type="date"
                        className="h-8 text-sm"
                        value={editDateTo}
                        onChange={(e) => setEditDateTo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Burtype</Label>
                      <Select
                        value={editCageType}
                        onValueChange={setEditCageType}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CAGE_TYPE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Pris (kr)</Label>
                      <Input
                        type="number"
                        className="h-8 text-sm"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-outdoor"
                      checked={editOutdoor}
                      onChange={(e) => setEditOutdoor(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label
                      htmlFor="edit-outdoor"
                      className="cursor-pointer text-sm"
                    >
                      Ønsker utebur
                    </Label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Spesielle instruksjoner</Label>
                    <Textarea
                      value={editInstructions}
                      onChange={(e) => setEditInstructions(e.target.value)}
                      placeholder="Spesielle instruksjoner..."
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveDetails}
                      disabled={isPending}
                      className="gap-1.5"
                    >
                      {activeAction === 'details' && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      Lagre endringer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditMode(false)}
                      disabled={isPending}
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              )}

              {/* Cat photos — simple display */}
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
                      {cat.age && (
                        <p className="text-center text-xs text-muted-foreground">
                          {cat.age.includes('år') || cat.age.includes('måneder')
                            ? cat.age
                            : cat.age + ' år'}
                        </p>
                      )}
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

              {booking.special_instructions && !editMode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                  <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" />
                  {booking.special_instructions}
                </div>
              )}

              {booking.wants_outdoor_cage && !editMode && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
                  🌿 Ønsker utebur
                </div>
              )}

              {booking.waitlist_requested && !editMode && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-sm text-purple-800">
                  📋 Ønsker venteliste
                </div>
              )}

              {/* Cats with behavior indicators */}
              {logsLoaded && behaviorNotes.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Katter ({booking.cats?.length ?? 0})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {behaviorNotes.map((note) => {
                        const hasMedication = note.gets_medication
                        const hasWarning =
                          note.has_stress_issues ||
                          note.aggression_risk === 'yes' ||
                          note.aggression_risk === 'unknown'

                        return (
                          <button
                            key={note.cat_id}
                            onClick={() => {
                              setSelectedCat(note)
                              setCatSheetOpen(true)
                            }}
                            className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                              {booking.cats?.find((c) => c.id === note.cat_id)
                                ?.image_url ? (
                                <Image
                                  src={
                                    booking.cats.find(
                                      (c) => c.id === note.cat_id
                                    )!.image_url!
                                  }
                                  alt={note.cat_name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-sm">
                                  🐱
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">
                                {note.cat_name}
                              </p>
                              <div className="mt-1 flex items-center gap-1.5">
                                {hasMedication && (
                                  <span className="flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                    <Pill className="h-2.5 w-2.5" />
                                    Medisin
                                  </span>
                                )}
                                {hasWarning && (
                                  <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                    Advarsel
                                  </span>
                                )}
                                {!hasMedication && !hasWarning && (
                                  <span className="text-[10px] text-muted-foreground">
                                    Ingen advarsler
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </button>
                        )
                      })}
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

            {/* ── HELSE ──────────────────────────────────────────────────── */}
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

      {/* Cat behavior sheet */}
      <Sheet open={catSheetOpen} onOpenChange={setCatSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <span className="text-lg">🐱</span>
              {selectedCat?.cat_name}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Atferd og informasjon om katten
            </SheetDescription>
          </SheetHeader>

          {selectedCat && (
            <div className="space-y-4">
              <BehaviorItem
                label="Medisinering"
                value={selectedCat.gets_medication ? 'Ja' : 'Nei'}
                detail={selectedCat.medication_details}
                highlight={selectedCat.gets_medication}
              />
              <BehaviorItem
                label="Erfaring med katter"
                value={selectedCat.has_cat_experience ? 'Ja' : 'Nei'}
              />
              <BehaviorItem
                label="Går godt med andre katter"
                value={
                  ALONG_LABELS[selectedCat.gets_along_with_cats] ??
                  selectedCat.gets_along_with_cats
                }
                highlight={selectedCat.gets_along_with_cats === 'no'}
              />
              <BehaviorItem
                label="Stressutfordringer"
                value={selectedCat.has_stress_issues ? 'Ja' : 'Nei'}
                detail={selectedCat.stress_details}
                highlight={selectedCat.has_stress_issues}
              />
              <BehaviorItem
                label="Aggresjonsrisiko"
                value={
                  RISK_LABELS[selectedCat.aggression_risk] ??
                  selectedCat.aggression_risk
                }
                detail={selectedCat.aggression_details}
                highlight={
                  selectedCat.aggression_risk === 'yes' ||
                  selectedCat.aggression_risk === 'unknown'
                }
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
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
