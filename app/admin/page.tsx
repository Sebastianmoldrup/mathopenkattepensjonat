import { Suspense } from 'react'
import { connection } from 'next/server'
import { adminGetAllBookings, adminGetRevenueStats } from '@/lib/admin/actions'
import { StatsCards } from '@/components/admin/StatsCards'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { DashboardAlerts } from '@/components/admin/DashboardAlerts'
import { createClient } from '@/lib/supabase/server'
import { Loader2 } from 'lucide-react'

function LoadingCard() {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border bg-card p-6">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function AdminStats() {
  await connection()

  const today = localDateStr(new Date())
  const supabase = await createClient()

  const [bookings, revenueStats, hmsData, routineData] = await Promise.all([
    adminGetAllBookings(),
    adminGetRevenueStats(),
    // Latest HMS log
    supabase.rpc('admin_get_latest_hms_log').then((r) => r.data?.[0] ?? null),
    // Today's daily routines
    supabase
      .rpc('admin_get_daily_routines', {
        p_from: today,
        p_to: today,
      })
      .then((r) => r.data ?? []),
  ])

  const pending = bookings.filter((b) => b.status === 'pending').length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.price, 0)

  const todayMorgen = (routineData as any[]).find(
    (r: any) => r.period === 'morgen'
  )
  const todayDagKveld = (routineData as any[]).find(
    (r: any) => r.period === 'dag_kveld'
  )

  return (
    <>
      <StatsCards
        pending={pending}
        confirmed={confirmed}
        totalRevenue={totalRevenue}
        totalBookings={bookings.length}
      />
      <DashboardAlerts
        lastHms={hmsData ? (hmsData as any).created_at : null}
        todayMorgen={!!todayMorgen}
        todayDagKveld={!!todayDagKveld}
        pendingCount={pending}
      />
      <RevenueChart data={revenueStats} />
    </>
  )
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Oversikt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velkommen til administrasjonspanelet.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
            <LoadingCard />
            <LoadingCard />
          </div>
        }
      >
        <AdminStats />
      </Suspense>
    </div>
  )
}
