import { Suspense } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import {
  adminGetBookingLabelData,
  adminMarkLabelPrinted,
} from '@/lib/admin/actions'
import { BookingLabel } from '@/components/admin/print/BookingLabel'
import { PrintTrigger } from '@/components/admin/print/PrintTrigger'
import { PrintToolbar } from '@/components/admin/print/PrintToolbar'

async function LabelContent({ bookingId }: { bookingId: string }) {
  await connection()

  const data = await adminGetBookingLabelData(bookingId)
  if (!data) notFound()

  await adminMarkLabelPrinted(bookingId)

  return (
    <>
      <PrintToolbar
        title={`${data.owner.first_name} ${data.owner.last_name} — ${data.cats.map((c) => c.name).join(', ')}`}
      />

      <div className="print-container">
        <BookingLabel data={data} />
      </div>

      <PrintTrigger />
    </>
  )
}

export default function PrintLabelPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  return (
    <Suspense fallback={<div style={{ padding: '20px' }}>Laster label...</div>}>
      <LabelContentWrapper params={params} />
    </Suspense>
  )
}

async function LabelContentWrapper({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  return <LabelContent bookingId={bookingId} />
}
