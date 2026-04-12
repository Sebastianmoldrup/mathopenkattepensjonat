import { Suspense } from 'react'
import { adminGetAllBookings, adminGetRevenueStats } from '@/lib/admin/actions'
import { StatsCards } from '@/components/admin/StatsCards'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { Loader2 } from 'lucide-react'

function LoadingCard() {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border bg-card p-6">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}

async function AdminStats() {
  const [bookings, revenueStats] = await Promise.all([
    adminGetAllBookings(),
    adminGetRevenueStats(),
  ])

  const pending = bookings.filter((b) => b.status === 'pending').length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.price, 0)
  const cancellationRate =
    bookings.length > 0
      ? Math.round(
          (bookings.filter((b) => b.status === 'cancelled').length /
            bookings.length) *
            100
        )
      : 0

  return (
    <>
      <StatsCards
        pending={pending}
        confirmed={confirmed}
        totalRevenue={totalRevenue}
        cancellationRate={cancellationRate}
        totalBookings={bookings.length}
      />
      <RevenueChart data={revenueStats} />
    </>
  )
}

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Oversikt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velkommen til administrasjonspanelet.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
            <LoadingCard />
          </div>
        }
      >
        <AdminStats />
      </Suspense>
    </div>
  )
}
