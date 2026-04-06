'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserBooking,
  getCancellationEligibility,
  formatDateNO,
  STATUS_LABELS,
  STATUS_COLORS,
  CAGE_TYPE_LABELS,
} from '@/lib/userBookings/utils'
import { CancelBookingDialog } from './CancelBookingDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, BedDouble, PawPrint, Banknote, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: UserBooking
}

export function BookingCard({ booking }: BookingCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false)

  const eligibility = getCancellationEligibility(
    booking.status,
    booking.date_from
  )
  const nights = Math.round(
    (new Date(booking.date_to).getTime() -
      new Date(booking.date_from).getTime()) /
      864e5
  )

  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (split)'
      : (CAGE_TYPE_LABELS[booking.cage_type] ?? booking.cage_type)

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm">
        {/* Status bar */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2',
            booking.status === 'pending' &&
              'border-b border-amber-200 bg-amber-50',
            booking.status === 'confirmed' &&
              'border-b border-green-200 bg-green-50',
            booking.status === 'completed' && 'border-b border-border bg-muted',
            booking.status === 'cancelled' &&
              'border-b border-red-200 bg-red-50'
          )}
        >
          <Badge
            variant="outline"
            className={cn('text-xs font-medium', STATUS_COLORS[booking.status])}
          >
            {STATUS_LABELS[booking.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Bestilt{' '}
            {new Date(booking.created_at).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="space-y-4 p-4">
          {/* Main info grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Innsjekk
              </div>
              <p className="text-sm font-semibold">
                {formatDateNO(booking.date_from)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Utsjekk
              </div>
              <p className="text-sm font-semibold">
                {formatDateNO(booking.date_to)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BedDouble className="h-3.5 w-3.5" />
                Burtype
              </div>
              <p className="text-sm font-semibold">{cageLabel}</p>
              <p className="text-xs text-muted-foreground">
                {nights} {nights === 1 ? 'natt' : 'netter'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Banknote className="h-3.5 w-3.5" />
                Pris
              </div>
              <p className="text-sm font-semibold">
                {booking.price.toLocaleString('nb-NO')} kr
              </p>
              <p className="text-xs text-muted-foreground">
                Betales ved innsjekk
              </p>
            </div>
          </div>

          {/* Cats */}
          {booking.cats.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <PawPrint className="h-3.5 w-3.5" />
                {booking.cats.length === 1 ? 'Katt' : 'Katter'}
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"
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
                    <span className="text-sm font-medium">{cat.name}</span>
                    {cat.breed && (
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        · {cat.breed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancel button */}
          {eligibility.canCancel && (
            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelOpen(true)}
                className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
                Avbestill
              </Button>
            </div>
          )}
        </div>
      </div>

      <CancelBookingDialog
        bookingId={booking.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        eligibility={eligibility}
      />
    </>
  )
}
