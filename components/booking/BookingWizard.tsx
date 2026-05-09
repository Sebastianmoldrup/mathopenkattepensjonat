'use client'

import { useState } from 'react'
import { Cat, BookingWithCats } from '@/lib/booking/types'
import { GuestBookingWizard } from './GuestBookingWizard'
import { AuthedBookingWizard } from './AuthedBookingWizard'

type Props = {
  initialUserId: string | null
  initialUserEmail: string
  initialUserFirstName: string
  initialCats: Cat[]
  initialBookings: BookingWithCats[]
}

export function BookingWizard({
  initialUserId,
  initialUserEmail,
  initialUserFirstName,
  initialCats,
  initialBookings,
}: Props) {
  const [userId] = useState(initialUserId)
  const [bookings] = useState(initialBookings)
  const [cats] = useState(initialCats)

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
