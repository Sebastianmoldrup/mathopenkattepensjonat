// import { BookingWizard } from '@/components/booking/BookingWizard'
//
// export default function BookingPage() {
//   return <BookingWizard />
// }

import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <span className="text-3xl">🐾</span>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-slate-900">
        Booking under arbeid
      </h1>
      <p className="mb-2 text-lg text-slate-600">
        Vi jobber med et nytt bookingsystem for å gjøre prosessen enklere for
        deg som kunde.
      </p>
      <p className="mb-10 text-slate-500">
        I mellomtiden kan du ta kontakt med oss på mail for booking forespørsel.
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link href="mailto:post@mathopenkattepensjonat.no">
          <Mail className="h-4 w-4" />
          post@mathopenkattepensjonat.no
        </Link>
      </Button>
    </div>
  )
}
