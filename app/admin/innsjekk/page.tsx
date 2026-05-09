import { Suspense } from 'react'
import { connection } from 'next/server'
import { adminGetCheckinCheckoutByDate } from '@/lib/admin/actions'
import CheckinCheckoutClient from '@/components/admin/CheckinCheckoutClient'

function localStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}

async function CheckinCheckoutLoader({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  await connection()
  const params = await searchParams
  const date = params.dato ?? localStr(new Date())
  const entries = await adminGetCheckinCheckoutByDate(date)
  return <CheckinCheckoutClient initialEntries={entries} initialDate={date} />
}

export default function InnsjekKPage({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  return (
    <div className="p-6">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Laster...</div>
        }
      >
        <CheckinCheckoutLoader searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
