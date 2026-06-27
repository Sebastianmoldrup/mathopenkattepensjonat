import { renderToBuffer } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import { adminGetDailyLabelData, getIsAdmin } from '@/lib/admin/actions'
import { LabelDocument } from '@/components/admin/pdf/LabelDocument'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) return new Response('Unauthorized', { status: 401 })

  const { date } = await params
  const bookings = await adminGetDailyLabelData(date)
  if (!bookings.length) return new Response('Not found', { status: 404 })

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(LabelDocument, { bookings }) as unknown as ReactElement<DocumentProps>
  )

  const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' })

  return new Response(blob, {
    headers: {
      'Content-Disposition': `attachment; filename="innsjekk-${date}.pdf"`,
    },
  })
}
