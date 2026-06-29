import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hva er et kattepensjonat? Slik fungerer det – Mathopen i Bergen',
  description:
    'Et kattepensjonat er et profesjonelt omsorgstilbud for katter mens du er borte. Vi forklarer hva som skiller det fra hjemmepass, hva som er inkludert og hva du kan forvente.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Hva er et kattepensjonat?
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Hva er et kattepensjonat?
        </h1>
        <p className="text-lg text-muted-foreground">
          Et kattepensjonat er et omsorgstilbud der katten bor og blir
          ivaretatt mens du er på reise. Tenk på det som et hotell for katter –
          med egne rom, faste rutiner og folk med erfaring og ekte kjærlighet
          til katter som er tilgjengelige hele dagen.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva skiller kattepensjonat fra hjemmepass?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Hjemmepass betyr at noen – en nabo, venn eller profesjonell
            kattepassser – stikker innom hjemmet ditt for å mate og sjekke på
            katten. Det kan fungere godt, men har noen klare ulemper:
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Katten er alene store deler av døgnet
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Ingen kontinuerlig overvåkning – om noe skjer, oppdages det
              kanskje ikke før neste besøk
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Ingen veterinæravtale ved sykdom eller skade
            </li>
          </ul>
          <p className="text-muted-foreground">
            På et kattepensjonat er personalet tilgjengelig gjennom hele dagen.
            Katten har selskap, faste rutiner og noen som raskt merker om noe
            er galt.
          </p>

        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Kattehotell og kattepensjonat – er det det samme?
          </h2>
          <p className="text-muted-foreground">
            Ja, i praksis brukes ordene om hverandre. «Kattehotell» er gjerne
            et mer moderne uttrykk, mens «kattepensjonat» er det tradisjonelle.
            Begge betyr et sted der katten bor, spiser og passes av erfarne
            katteelskere mens du er borte. Det finnes ingen formell forskjell i norsk
            lovgivning.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva tilbyr et godt kattepensjonat?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Et seriøst kattepensjonat skal tilby mer enn bare et sted å sove.
            Hos Mathopen Kattepensjonat er dette inkludert i hvert opphold:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Eget rom med seng, dokasse og mat- og vannskål
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Tilgang til romslig kattegård og fellesarealer på dagtid
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Daglige Snapchat-oppdateringer til eier
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Medisinering uten ekstra kostnad
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Veterinæravtale med EMPET Bergen Vest Dyreklinikk
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Tilsyn og oppfølging av personale gjennom hele dagen
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Les mer om{' '}
            <Link
              href="/rom-og-fasiliteter"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              rom og fasiliteter
            </Link>{' '}
            eller{' '}
            <Link
              href="/informasjon"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              hvordan vi tar vare på katten din
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hvilke krav stilles til katten?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Alle kattepensjonat i Norge som følger Mattilsynets retningslinjer
            stiller krav til vaksinasjon. Hos oss gjelder følgende:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Vaksinert innen siste 12 måneder – vaksinasjonskort medbringes
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Vaksinen må være satt minst 14 dager før innsjekk
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Hannkatter over 6 måneder må være kastrert
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Kravene er der for å beskytte alle kattene som bor hos oss. Les
            mer i guiden{' '}
            <Link
              href="/guider/forberede-katt-til-pensjonat"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              slik forbereder du katten til pensjonat
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Slik foregår et opphold hos oss
          </h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-medium text-foreground">1.</span>
              <span>
                <span className="font-medium text-foreground">Bestilling</span>{' '}
                – bruk bookingsystemet vårt eller ta kontakt. Vi bekrefter
                oppholdet manuelt.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-medium text-foreground">2.</span>
              <span>
                <span className="font-medium text-foreground">Innsjekk</span>{' '}
                – du leverer katten i innsjekksvinduet (man–fre og søn
                17:30–19:30). Vi tar imot, sjekker vaksinasjonskort og
                noterer alt vi trenger å vite.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-medium text-foreground">3.</span>
              <span>
                <span className="font-medium text-foreground">Oppholdet</span>{' '}
                – katten får sitt eget rom, tilgang til kattegård og daglig
                oppfølging. Du mottar bilder og videoer på Snapchat.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-medium text-foreground">4.</span>
              <span>
                <span className="font-medium text-foreground">Utsjekk</span>{' '}
                – du henter katten i samme tidsvindu. Vi forteller deg
                hvordan oppholdet har gått.
              </span>
            </li>
          </ol>

        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/guider/utforsk-pensjonatet">
            <Button size="lg" variant="outline">
              Utforsk pensjonatet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
