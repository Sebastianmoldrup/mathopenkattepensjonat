import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function BookingBekreftetPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Takk for din bookingforespørsel!
      </h1>

      <p className="mb-2 text-base text-muted-foreground sm:text-lg">
        Vi har mottatt forespørselen din og vil behandle den så raskt som mulig.
      </p>

      <p className="mb-8 text-sm text-muted-foreground">
        Du vil motta en bekreftelse på e-post innen{' '}
        <strong>3 arbeidsdager</strong>. Sjekk gjerne spam-mappen hvis du ikke
        hører fra oss.
      </p>

      <div className="w-full rounded-xl border bg-card p-5 text-left">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Hva skjer videre?
        </p>
        <ol className="mt-3 space-y-2.5">
          {[
            'Vi gjennomgår forespørselen din og sjekker tilgjengelighet.',
            'Du mottar en bekreftelse eller tilbakemelding på e-post.',
            'Etter bekreftelse er plassen din reservert.',
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="flex-1">
          <Link href="/minside/bookinger">Se mine bookinger</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link href="/">Gå til hjemmesiden</Link>
        </Button>
      </div>
    </div>
  )
}
