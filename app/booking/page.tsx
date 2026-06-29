import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUpcomingYearBookings, getUserCats } from '@/lib/booking/actions'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { Loader2 } from 'lucide-react'

async function BookingLoader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [bookings, cats, profile] = await Promise.all([
    getUpcomingYearBookings(),
    user ? getUserCats(user.id) : Promise.resolve([]),
    user
      ? supabase
          .from('users')
          .select('first_name, last_name, phone, address')
          .eq('id', user.id)
          .single()
      : Promise.resolve({ data: null }),
  ])

  const userProfile = profile.data

  const isProfileComplete =
    !user ||
    (userProfile?.first_name?.trim() &&
      userProfile?.last_name?.trim() &&
      userProfile?.phone?.trim() &&
      userProfile?.address?.trim())

  return (
    <BookingWizard
      initialUserId={user?.id ?? null}
      initialUserEmail={user?.email ?? ''}
      initialUserFirstName={userProfile?.first_name ?? ''}
      initialCats={cats}
      initialBookings={bookings}
      isProfileComplete={!!isProfileComplete}
    />
  )
}

export default async function BookingPage() {
  await connection()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BookingLoader />
    </Suspense>
  )
}
