import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function UserBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Mine bookinger
        </h1>
        <p className="text-sm text-muted-foreground">
          Oversikt over dine bookinger hos oss.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card py-20 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <span className="text-2xl">🐾</span>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Bookingsystem under arbeid</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Vi jobber med et nytt bookingsystem. Ta kontakt med oss direkte for
            å reservere plass eller få hjelp med en eksisterende booking.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="sm" className="gap-2">
            <Link href="mailto:post@mathopenkattepensjonat.no">
              <Mail className="h-4 w-4" />
              post@mathopenkattepensjonat.no
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// import { getUserBookingsWithCats } from '@/lib/userBookings/actions'
// import { BookingTabs } from '@/components/userBookings/BookingTabs'
// import { UserBooking } from '@/lib/userBookings/utils'
// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { PawPrint } from 'lucide-react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
//
// export default async function userBookingsPage() {
//   const supabase = await createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//
//   if (!user) redirect('/login')
//
//   const bookings = await getUserBookingsWithCats()
//
//   // Split into upcoming (pending + confirmed) and history (completed + cancelled)
//   const upcoming: UserBooking[] = bookings.filter(
//     (b) => b.status === 'pending' || b.status === 'confirmed'
//   )
//
//   const history: UserBooking[] = bookings.filter(
//     (b) => b.status === 'completed' || b.status === 'cancelled'
//   )
//
//   // Sort upcoming by check-in ascending (soonest first)
//   upcoming.sort((a, b) => a.date_from.localeCompare(b.date_from))
//
//   // Sort history by check-in descending (most recent first)
//   history.sort((a, b) => b.date_from.localeCompare(a.date_from))
//
//   return (
//     <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
//       {/* Header */}
//       <div className="space-y-1">
//         <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
//           Mine bookinger
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Oversikt over dine bookinger hos oss.
//         </p>
//       </div>
//
//       {/* Empty state — no bookings at all */}
//       {bookings.length === 0 ? (
//         <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card py-20 text-center">
//           <div className="rounded-full bg-muted p-4">
//             <PawPrint className="h-8 w-8 text-muted-foreground" />
//           </div>
//           <div className="space-y-1">
//             <p className="font-semibold">Ingen userBookings ennå</p>
//             <p className="max-w-xs text-sm text-muted-foreground">
//               Du har ikke gjort noen userBookings ennå. Book et opphold for
//               katten din i dag!
//             </p>
//           </div>
//           <Button asChild>
//             <Link href="/booking">Book nå</Link>
//           </Button>
//         </div>
//       ) : (
//         <BookingTabs upcoming={upcoming} history={history} />
//       )}
//     </div>
//   )
// }
