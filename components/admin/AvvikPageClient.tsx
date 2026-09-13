'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminBooking, IncidentOverview } from '@/lib/admin/utils'
import { BookingsTable } from './BookingsTable'
import { IncidentsOverview } from './IncidentsOverview'

interface AvvikPageClientProps {
  bookings: AdminBooking[]
  incidents: IncidentOverview[]
}

export function AvvikPageClient({ bookings, incidents }: AvvikPageClientProps) {
  return (
    <Tabs defaultValue="registrer">
      <TabsList>
        <TabsTrigger value="registrer">Registrer avvik</TabsTrigger>
        <TabsTrigger value="oversikt">
          Alle avvik{incidents.length > 0 ? ` (${incidents.length})` : ''}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="registrer" className="pt-4">
        <BookingsTable bookings={bookings} mode="incidents" />
      </TabsContent>
      <TabsContent value="oversikt" className="pt-4">
        <IncidentsOverview incidents={incidents} />
      </TabsContent>
    </Tabs>
  )
}
