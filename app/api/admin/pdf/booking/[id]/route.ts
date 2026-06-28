import { renderToBuffer } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import {
  adminGetBookingLabelData,
  adminMarkLabelPrinted,
  getIsAdmin,
} from '@/lib/admin/actions'
import { LabelDocument } from '@/components/admin/pdf/LabelDocument'
import { resolveImagesToBase64 } from '@/lib/admin/pdfUtils'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const booking = await adminGetBookingLabelData(id)
  if (!booking) return new Response('Not found', { status: 404 })

  await adminMarkLabelPrinted(id)

  const [resolved] = await resolveImagesToBase64([booking])

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(LabelDocument, { bookings: [resolved] }) as unknown as ReactElement<DocumentProps>
  )

  const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' })

  return new Response(blob, {
    headers: {
      'Content-Disposition': `attachment; filename="label-${id}.pdf"`,
    },
  })
}
