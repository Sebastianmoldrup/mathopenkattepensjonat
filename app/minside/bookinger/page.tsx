import {
  getUserBookingsWithCats,
  getUserWaitlistEntries,
} from '@/lib/userBookings/actions'
import { BookingTabs } from '@/components/userBookings/BookingTabs'
import { UserBooking } from '@/lib/userBookings/utils'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PawPrint } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function userBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [bookings, waitlist] = await Promise.all([
    getUserBookingsWithCats(),
    getUserWaitlistEntries(),
  ])

  const upcoming: UserBooking[] = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  )
  const history: UserBooking[] = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  )

  upcoming.sort((a, b) => a.date_from.localeCompare(b.date_from))
  history.sort((a, b) => b.date_from.localeCompare(a.date_from))

  const hasAnything = bookings.length > 0 || waitlist.length > 0

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Mine bookinger
        </h1>
        <p className="text-sm text-muted-foreground">
          Oversikt over dine bookinger og ventelisteregistreringer.
        </p>
      </div>

      {!hasAnything ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card py-20 text-center">
          <div className="rounded-full bg-muted p-4">
            <PawPrint className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Ingen bookinger ennå</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Du har ikke gjort noen bookinger ennå. Book et opphold for katten
              din i dag!
            </p>
          </div>
          <Button asChild>
            <Link href="/booking">Book nå</Link>
          </Button>
        </div>
      ) : (
        <BookingTabs
          upcoming={upcoming}
          history={history}
          waitlist={waitlist}
        />
      )}
    </div>
  )
}
