'use client'

import { Cat, BookingWithCats } from '@/lib/booking/types'
import { GuestBookingWizard } from './GuestBookingWizard'
import { AuthedBookingWizard } from './AuthedBookingWizard'

type Props = {
  initialUserId: string | null
  initialUserEmail: string
  initialUserFirstName: string
  initialCats: Cat[]
  initialBookings: BookingWithCats[]
  isProfileComplete: boolean
}

export function BookingWizard({
  initialUserId,
  initialUserEmail,
  initialUserFirstName,
  initialCats,
  initialBookings,
  isProfileComplete,
}: Props) {
  const userId = initialUserId
  const bookings = initialBookings
  const cats = initialCats

  if (userId && !isProfileComplete) {
    return (
      <div className="my-10 rounded-2xl border bg-card p-6 text-center">
        <h2 className="text-xl font-semibold">Fullfør profilen din</h2>

        <p className="mt-2 text-muted-foreground">
          Du må legge til navn, telefonnummer og adresse før du kan sende en
          bookingforespørsel.
        </p>

        <button
          onClick={() => (window.location.href = '/minside/profil')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Gå til profil
        </button>
      </div>
    )
  }

  if (userId) {
    return (
      <AuthedBookingWizard
        userId={userId}
        userEmail={initialUserEmail}
        userFirstName={initialUserFirstName}
        cats={cats}
        bookings={bookings}
      />
    )
  }

  return (
    <GuestBookingWizard
      bookings={bookings}
      onAuthenticated={() => window.location.reload()}
    />
  )
}
