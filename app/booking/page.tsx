import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUpcomingBookings, getUserCats } from '@/lib/booking/actions'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { Loader2 } from 'lucide-react'

// Raises the server-action timeout for this route (incl. createCatAndReturn,
// called from the wizard's "legg til katt" step) past the platform default
// -- a customer on a slow upload connection could otherwise have the whole
// request killed mid-upload with a raw platform error instead of one of
// our own messages. Only takes effect up to whatever the hosting plan
// allows; see the 2026-10-18 FIXLOG entry.
export const maxDuration = 60

async function BookingLoader() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [bookings, cats, profile] = await Promise.all([
    getUpcomingBookings(),
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

export default function BookingPage() {
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
