import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ContactCTA() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">
          Klar for å bestille?
        </h2>
        <p className="mb-8 text-lg text-slate-600">
          Du er hjertelig velkommen til å komme på besøk for å se lokalet før du
          bestiller opphold. Kattepensjonatet åpner imidlertid først 1. juli.
        </p>

        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill nå</Button>
          </Link>
          <Link href="/kontakt">
            <Button size="lg" variant="outline">
              Kontakt oss
            </Button>
          </Link>
        </div>

        <div className="space-y-2 text-slate-600">
          <p>📧 post@mathopenkattepensjonat.no</p>
          <p>📞 473 22 279</p>
          <p className="text-sm">Telefontid: kl. 11:00–12:00 og 17:00–20:00</p>
        </div>
      </div>
    </section>
  )
}
