import { Suspense } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import { adminGetDailyLabelData } from '@/lib/admin/actions'
import { BookingLabel } from '@/components/admin/print/BookingLabel'
import { PrintTrigger } from '@/components/admin/print/PrintTrigger'
import { PrintToolbar } from '@/components/admin/print/PrintToolbar'
import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'

async function DailyLabelsContent({ date }: { date: string }) {
  await connection()

  const labels = await adminGetDailyLabelData(date)
  if (!labels.length) notFound()

  const dateLabel = format(parseISO(date), 'd. MMMM yyyy', { locale: nb })

  return (
    <>
      <PrintToolbar
        title={`Innsjekk ${dateLabel} — ${labels.length} labels`}
      />

      <div className="print-container">
        {labels.map((data) => (
          <BookingLabel key={data.booking.id} data={data} />
        ))}
      </div>

      <PrintTrigger />
    </>
  )
}

async function DailyLabelsWrapper({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  return <DailyLabelsContent date={date} />
}

export default function PrintDailyLabelsPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  return (
    <Suspense fallback={<div style={{ padding: '20px' }}>Laster labels...</div>}>
      <DailyLabelsWrapper params={params} />
    </Suspense>
  )
}
