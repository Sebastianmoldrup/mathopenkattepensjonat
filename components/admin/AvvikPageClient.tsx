'use client'

import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminBooking, IncidentOverview } from '@/lib/admin/utils'
import { BookingsTable } from './BookingsTable'
import { IncidentsOverview } from './IncidentsOverview'

interface AvvikPageClientProps {
  bookings: AdminBooking[]
  incidents: IncidentOverview[]
}

export function AvvikPageClient({ bookings, incidents }: AvvikPageClientProps) {
  // Only confirmed stays can have an avvik logged against them -- a
  // pending/waitlist booking hasn't actually happened yet. The overview
  // tab still gets the full, unfiltered list: it needs every booking to
  // look up context for an already-logged avvik, even one whose booking
  // has since moved on to e.g. "completed".
  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed'),
    [bookings]
  )

  return (
    <Tabs defaultValue="registrer">
      <TabsList>
        <TabsTrigger value="registrer">Registrer avvik</TabsTrigger>
        <TabsTrigger value="oversikt">
          Alle avvik{incidents.length > 0 ? ` (${incidents.length})` : ''}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="registrer" className="pt-4">
        <BookingsTable bookings={confirmedBookings} mode="incidents" />
      </TabsContent>
      <TabsContent value="oversikt" className="pt-4">
        <IncidentsOverview incidents={incidents} bookings={bookings} />
      </TabsContent>
    </Tabs>
  )
}
