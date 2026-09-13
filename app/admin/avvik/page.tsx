import { Suspense } from 'react'
import { adminGetAllBookings } from '@/lib/admin/actions'
import { adminGetAllIncidents } from '@/lib/admin/formActions'
import { AvvikPageClient } from '@/components/admin/AvvikPageClient'
import { Loader2 } from 'lucide-react'

async function AvvikContent() {
  const [bookings, incidents] = await Promise.all([
    adminGetAllBookings(),
    adminGetAllIncidents(),
  ])
  return <AvvikPageClient bookings={bookings} incidents={incidents} />
}

export default function AdminAvvikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Avvik</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registrer avvik på en booking, eller se alle tidligere registrerte
          avvik.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <AvvikContent />
      </Suspense>
    </div>
  )
}
