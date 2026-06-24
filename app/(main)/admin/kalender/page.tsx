import { Suspense } from 'react'
import { adminGetOccupancyData } from '@/lib/admin/actions'
import { OccupancyCalendar } from '@/components/admin/OccupancyCalendar'
import { Loader2 } from 'lucide-react'

async function KalenderContent() {
  const bookings = await adminGetOccupancyData()
  return <OccupancyCalendar bookings={bookings} />
}

export default function KalenderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oversikt over burbelegg per dag. Klikk på en dato for å se bookingene.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <KalenderContent />
      </Suspense>
    </div>
  )
}
