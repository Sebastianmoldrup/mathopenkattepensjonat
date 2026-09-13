'use client'

import { useState } from 'react'
import { formatDateNO, parseDateStr } from '@/lib/booking/pricing'
import {
  formatRange,
  generateSlots,
  getOpeningHoursForDate,
} from '@/lib/booking/hours'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface TimeSelectionProps {
  dateFrom: string
  dateTo: string
  checkinTime: string | null
  checkoutTime: string | null
  timeNotes: string
  onCheckinTimeChange: (time: string | null) => void
  onCheckoutTimeChange: (time: string | null) => void
  onNotesChange: (notes: string) => void
  onNext: () => void
  onBack: () => void
}

function SlotGrid({
  label,
  date,
  selected,
  noneSelected,
  onSelectSlot,
  onToggleNone,
}: {
  label: string
  date: Date
  selected: string | null
  noneSelected: boolean
  onSelectSlot: (slot: string) => void
  onToggleNone: () => void
}) {
  const range = getOpeningHoursForDate(date)

  if (!range) {
    // Shouldn't happen -- low-season Saturdays are already blocked as
    // check-in/check-out days -- but a slot grid needs to degrade
    // gracefully rather than render empty if it ever does.
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {label} · {formatDateNO(date)}
        </p>
        <p className="text-sm text-muted-foreground">Stengt denne dagen.</p>
      </div>
    )
  }

  const slots = generateSlots(range)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {label} · {formatDateNO(date)}{' '}
        <span className="font-normal text-muted-foreground">
          ({formatRange(range)})
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              selected === slot
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted/50'
            )}
          >
            {slot}
          </button>
        ))}
        <button
          type="button"
          onClick={onToggleNone}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-sm transition-colors',
            noneSelected
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-dashed border-border text-muted-foreground hover:bg-muted/50'
          )}
        >
          Ingen av disse passer
        </button>
      </div>
    </div>
  )
}

export function TimeSelection({
  dateFrom,
  dateTo,
  checkinTime,
  checkoutTime,
  timeNotes,
  onCheckinTimeChange,
  onCheckoutTimeChange,
  onNotesChange,
  onNext,
  onBack,
}: TimeSelectionProps) {
  const dateFromDate = parseDateStr(dateFrom)
  const dateToDate = parseDateStr(dateTo)
  // "Ingen av disse passer" is a real, required choice now (not just a UI
  // nudge) -- tracked locally rather than persisted, since checkin/
  // checkoutTime staying null already means the same thing in the DB either
  // way; this only exists so we can tell "explicitly said none work" apart
  // from "hasn't answered yet" for the required-field check below.
  const [checkinNone, setCheckinNone] = useState(false)
  const [checkoutNone, setCheckoutNone] = useState(false)

  function selectCheckinSlot(slot: string) {
    setCheckinNone(false)
    onCheckinTimeChange(checkinTime === slot ? null : slot)
  }

  function toggleCheckinNone() {
    onCheckinTimeChange(null)
    setCheckinNone((v) => !v)
  }

  function selectCheckoutSlot(slot: string) {
    setCheckoutNone(false)
    onCheckoutTimeChange(checkoutTime === slot ? null : slot)
  }

  function toggleCheckoutNone() {
    onCheckoutTimeChange(null)
    setCheckoutNone((v) => !v)
  }

  const checkinAnswered = checkinTime !== null || checkinNone
  const checkoutAnswered = checkoutTime !== null || checkoutNone
  const canProceed = checkinAnswered && checkoutAnswered

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Leverings- og hentetidspunkt
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Levering/henting utenom åpningstid kan avtales ved forespørsel, men
          vi kan ikke alltid imøtekomme ønsket.
        </p>
      </div>

      <SlotGrid
        label="Innsjekk"
        date={dateFromDate}
        selected={checkinTime}
        noneSelected={checkinNone}
        onSelectSlot={selectCheckinSlot}
        onToggleNone={toggleCheckinNone}
      />

      <SlotGrid
        label="Utsjekk"
        date={dateToDate}
        selected={checkoutTime}
        noneSelected={checkoutNone}
        onSelectSlot={selectCheckoutSlot}
        onToggleNone={toggleCheckoutNone}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Kommentar om tidspunkt{' '}
          {(checkinNone || checkoutNone) && (
            <span className="font-normal text-amber-600">
              — fortell oss gjerne når som passer bedre
            </span>
          )}
        </label>
        <Textarea
          value={timeNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="F.eks. ønsket klokkeslett utenom listen over, eller annen info..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button onClick={onNext} size="lg" disabled={!canProceed}>
          Neste
        </Button>
      </div>
    </div>
  )
}
