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
        Booking kommer snart
      </h1>
      <p className="mb-2 text-lg text-slate-600">
        Vi jobber med et nytt bookingsystem og åpner for bestillinger 1. juli
        2026.
      </p>
      <p className="mb-10 text-slate-500">
        I mellomtiden kan du ta kontakt med oss direkte for å reservere plass
        til katten din.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="mailto:post@mathopenkattepensjonat.no">
            <Mail className="h-4 w-4" />
            post@mathopenkattepensjonat.no
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link href="tel:+4747322279">
            <Phone className="h-4 w-4" />
            473 22 279
          </Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Telefontid: kl. 11:00–12:00 og 17:00–20:00
      </p>
    </div>
  )
}
