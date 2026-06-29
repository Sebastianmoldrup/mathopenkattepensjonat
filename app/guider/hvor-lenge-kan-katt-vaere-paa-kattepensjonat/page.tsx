import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hvor lenge kan en katt være på kattepensjonat? – Alt du trenger å vite',
  description:
    'Minimumsoppholdet er 2 dager. Det er ingen øvre grense – katter trives fint på pensjonat over lengre tid. Les om hva som skjer ved korte og lange opphold.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Hvor lenge kan en katt være på kattepensjonat?
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Hvor lenge kan en katt være på kattepensjonat?
        </h1>
        <p className="text-lg text-muted-foreground">
          Det korte svaret: minimumsoppholdet er 2 dager, og det er ingen øvre
          grense. De fleste katter tilpasser seg raskt og trives godt, enten
          det er en lang helg eller hele sommerferien.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Minimumsopphold: 2 dager
          </h2>
          <p className="mb-3 text-muted-foreground">
            Hos oss er minimumsoppholdet 2 dager. Vi priser per dag, og både
            innsjekks- og utsjekksdagen teller. Det betyr at en katt som
            sjekker inn fredag kveld og ut søndag kveld, faktureres for 3
            dager.
          </p>
          <p className="text-muted-foreground">
            Denne modellen gir mening fordi kattene alltid mottar full omsorg
            begge dagene – det er ingen halvdager hos oss.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Korte opphold – helg og langhelg
          </h2>
          <p className="mb-3 text-muted-foreground">
            Mange velger kattepensjonat for korte reiser – en langhelg, et
            bryllupsopphold eller et arrangement de ikke kan ta katten med på.
            Et opphold på 2–4 dager fungerer utmerket.
          </p>
          <p className="text-muted-foreground">
            Katter er territorielle og rutinefaste, og noen trenger litt tid
            til å bli komfortable med nye omgivelser. For svært korte opphold
            er det en fordel at katten har vært hos oss før, slik at omgivelsene
            er kjente.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Lange opphold – ferie og offshorerotasjon
          </h2>
          <p className="mb-3 text-muted-foreground">
            Det er ingen øvre grense for hvor lenge en katt kan være hos oss.
            Vi har gjester som bor her i 2–4 uker om sommeren, og katter
            tilknyttet faste kattepassavtaler som er innom jevnlig gjennom
            hele året.
          </p>
          <p className="text-muted-foreground">
            Lange opphold er gjerne lettere for katten enn man tror. Når de
            først har funnet rytmen i pensjonatet – faste mattider, tilgang
            til kattegård, sosial kontakt med personalet – er det mange som
            trives minst like godt som hjemme.
          </p>

        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Daglige oppdateringer – slik holder du kontakten
          </h2>
          <p className="mb-3 text-muted-foreground">
            Vi vet at det kan være vanskelig å reise fra katten, særlig over
            lengre tid. Derfor legger vi daglig ut bilder og videosnutter av
            kattene på vår Snapchat-kanal – som du kan se når det passer deg,
            enten du er på ferie i Syden eller offshore i Nordsjøen.
          </p>
          <p className="text-muted-foreground">
            Mange av de faste gjestene våre sier at oppdateringene er det de
            setter aller mest pris på. Det gjør det mye lettere å slappe av
            når man ser at katten har det bra.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Tips for første gangs opphold
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span>
                <span className="font-medium text-foreground">Ta med noe kjent</span>{' '}
                – et teppe, en seng eller en leke med kattens egen lukt gjør
                overgangen lettere.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span>
                <span className="font-medium text-foreground">Book i god tid</span>{' '}
                – særlig i høysesong fyller vi raskt opp. For sommerferien
                anbefaler vi å bestille minst 2–3 måneder i forveien.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span>
                <span className="font-medium text-foreground">Sjekk vaksinasjon</span>{' '}
                – katten må være vaksinert innen siste 12 måneder, og vaksinen
                må være satt minst 14 dager før innsjekk.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span>
                <span className="font-medium text-foreground">Fortell oss om kattens vaner</span>{' '}
                – er det noe vi bør vite om temperament, mat eller medisin, er
                det fint å gi oss beskjed ved innsjekk.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Les hele sjekklisten i guiden{' '}
            <Link
              href="/guider/forberede-katt-til-pensjonat"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              slik forbereder du katten til pensjonat
            </Link>
            .
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/priser">
            <Button size="lg" variant="outline">
              Se priser
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
