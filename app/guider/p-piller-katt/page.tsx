import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'P-piller til katt – hva det koster og når det er nødvendig | Mathopen',
  description:
    'Hva er p-piller til katt, når trenger katten det, og hva koster det? Vi forklarer alt du trenger å vite, inkludert hva som gjelder ved opphold på kattepensjonat.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / P-piller til katt
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          P-piller til katt – hva det koster og når det er nødvendig
        </h1>
        <p className="text-lg text-muted-foreground">
          P-piller til katt er et hormonelt prevensjonsmiddel som hindrer
          løpetid. Her forklarer vi hva det er, når det er aktuelt, og hva som
          gjelder ved opphold på kattepensjonat.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva er p-piller til katt?
          </h2>
          <p className="text-muted-foreground">
            P-piller til katt (katteprevensjon) er hormonpreparater som
            midlertidig stopper eller utsetter løpetid hos hunnkatter. De
            brukes vanligvis av eiere som ikke vil sterilisere katten
            permanent, eller i situasjoner der det er upraktisk at katten er i
            løpetid – som ved reiser eller opphold på pensjonat.
          </p>
          <p className="mt-3 text-muted-foreground">
            Det finnes ulike typer og preparater. De vanligste i Norge skrives
            ut av veterinær og gis som pille eller injeksjon.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Når er p-piller nødvendig på kattepensjonat?
          </h2>
          <p className="text-muted-foreground">
            Hunnkatter kan komme i løpetid fra 4–10 måneders alder, og
            løpetiden kan inntreffe uventet under et opphold. En katt i løpetid
            kan bli urolig, rope mye og stresse både seg selv og andre katter i
            nærheten.
          </p>
          <p className="mt-3 text-muted-foreground">
            Hos Mathopen Kattepensjonat er sterilisering anbefalt for
            hunnkatter, men ikke et krav. Dersom en usterilisert hunnkatt
            kommer i løpetid under oppholdet, anbefaler vi at eieren har tatt
            med p-piller – slik at vi kan gi dem ved behov.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva koster p-piller til katt?
          </h2>
          <p className="text-muted-foreground">
            Prisen varierer avhengig av preparat og veterinær. Hos de fleste
            dyreklinikker i Bergen koster en konsultasjon + utskriving av resept
            typisk mellom 300–600 kr. Selve pillene koster i tillegg noen
            titalls kroner per pille.
          </p>
          <p className="mt-3 text-muted-foreground">
            Hos oss på Mathopen Kattepensjonat tar vi{' '}
            <strong className="text-foreground">
              ikke ekstra betalt for å gi p-piller
            </strong>{' '}
            – men pillene må medbringes av eier. Se fullstendig prisoversikt på
            vår{' '}
            <Link
              href="/priser"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              prisside
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva bør jeg gjøre?
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                Kontakt veterinær i forkant
              </strong>{' '}
              – Ta katten til vet for å diskutere om p-piller er riktig for din
              katt. Ikke alle preparater passer alle katter, og langvarig bruk
              kan ha bivirkninger.
            </li>
            <li>
              <strong className="text-foreground">Ha pillene klare</strong> –
              Hvis katten er usterilisert og du er usikker, er det trygt å ha
              p-piller med i kofferten selv om de kanskje ikke trengs.
            </li>
            <li>
              <strong className="text-foreground">Informer oss</strong> – Gi
              beskjed ved innsjekk hvis katten er usterilisert, og legg pillene
              til side med doseringsanvisning dersom vi trenger dem.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Sterilisering – det enkleste alternativet
          </h2>
          <p className="text-muted-foreground">
            Det enkleste på lang sikt er å sterilisere hunnkatten. Det
            eliminerer risikoen for løpetid, reduserer atferdsproblemer og har
            helsefordeler for katten. Vi anbefaler å rådføre seg med veterinær
            om timing – gjerne etter første, men ikke for lenge etter.
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/guider/forberede-katt-til-pensjonat">
            <Button size="lg" variant="outline">
              Sjekkliste for pensjonatsopphold
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
