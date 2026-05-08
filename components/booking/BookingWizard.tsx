'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Cat, BookingWithCats } from '@/lib/booking/types'
import { getUpcomingYearBookings } from '@/lib/booking/actions'
import { authedStorage } from '@/lib/booking/wizardStorage'
import { GuestBookingWizard } from './GuestBookingWizard'
import { AuthedBookingWizard } from './AuthedBookingWizard'
import { Loader2 } from 'lucide-react'

export function BookingWizard() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userFirstName, setUserFirstName] = useState('')
  const [cats, setCats] = useState<Cat[]>([])
  const [bookings, setBookings] = useState<BookingWithCats[]>([])

  async function loadAuthedData() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const [profileResult, catsResult, upcoming] = await Promise.all([
      supabase.from('users').select('first_name').eq('id', user.id).single(),
      supabase
        .from('cats')
        .select('id, name, breed, gender, age, image_url, owner_id')
        .eq('owner_id', user.id),
      getUpcomingYearBookings(),
    ])

    setUserId(user.id)
    setUserEmail(user.email ?? '')
    setUserFirstName(profileResult.data?.first_name ?? '')
    setCats(catsResult.data ?? [])
    setBookings(upcoming)
    return user
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await loadAuthedData()
      } else {
        const upcoming = await getUpcomingYearBookings()
        setBookings(upcoming)
      }

      setLoading(false)
    }

    init()
  }, [])

  // Called by GuestBookingWizard after user logs in
  // Authed state has already been hydrated from guest state by GuestBookingWizard
  async function handleAuthenticated() {
    setLoading(true)
    await loadAuthedData()
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (userId) {
    return (
      <AuthedBookingWizard
        userId={userId}
        userEmail={userEmail}
        userFirstName={userFirstName}
        cats={cats}
        bookings={bookings}
      />
    )
  }

  return (
    <GuestBookingWizard
      bookings={bookings}
      onAuthenticated={handleAuthenticated}
    />
  )
}
