'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { BookingDocumentation } from '@/lib/admin/docTypes'
import { BookingPDFDocument } from './BookingPDFDocument'
import { adminGetBookingDocumentation } from '@/lib/admin/docActions'

interface BookingPDFButtonProps {
  bookingId: string
  ownerName: string
  dateFrom: string
}

export function BookingPDFButton({
  bookingId,
  ownerName,
  dateFrom,
}: BookingPDFButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setLoading(true)
    setError(null)

    try {
      const doc = await adminGetBookingDocumentation(bookingId)
      if (!doc) throw new Error('Kunne ikke hente bookingdata')

      const blob = await pdf(<BookingPDFDocument doc={doc} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const [y, m, d] = dateFrom.split('-')
      a.href = url
      a.download = `booking_${ownerName.replace(/\s+/g, '_')}_${d}-${m}-${y}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError('Kunne ikke generere PDF')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={loading}
        className="gap-1.5"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Genererer...
          </>
        ) : (
          <>
            <FileDown className="h-3.5 w-3.5" />
            Last ned PDF
          </>
        )}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
