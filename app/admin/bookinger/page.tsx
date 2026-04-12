import { Suspense } from 'react'
import { adminGetAllBookings } from '@/lib/admin/actions'
import { BookingsTable } from '@/components/admin/BookingsTable'
import { Loader2 } from 'lucide-react'

async function BookingsContent() {
  const bookings = await adminGetAllBookings()
  return <BookingsTable bookings={bookings} />
}

export default function AdminBookingerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookinger</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrer alle bookinger, oppdater status og legg til notater.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <BookingsContent />
      </Suspense>
    </div>
  )
}
