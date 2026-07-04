import { Document, Page, View } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { LabelPage } from './LabelPage'
import { pairBookings } from './utils/pairBookings'

interface LabelDocumentProps {
  bookings: BookingLabelData[]
}

export function LabelDocument({ bookings }: LabelDocumentProps) {
  const pairs = pairBookings(bookings)

  return (
    <Document>
      {pairs.map(([top, bottom], i) => (
        <Page key={i} size="A4" orientation="portrait">
          <LabelPage data={top} />
          {bottom && (
            <View style={{ borderTop: '0.5px dashed #c9b99a' }}>
              <LabelPage data={bottom} />
            </View>
          )}
        </Page>
      ))}
    </Document>
  )
}
