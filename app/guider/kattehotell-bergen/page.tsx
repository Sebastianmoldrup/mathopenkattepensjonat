import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kattehotell i Bergen – Mathopen Kattepensjonat i Bergen vest',
  description:
    'Leter du etter kattehotell eller kattepass i Bergen? Mathopen Kattepensjonat holder til i Mathopen, Bergen vest – moderne, trygt og med plass til alle raser og aldre.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Kattehotell i Bergen
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Kattehotell i Bergen – trygt og moderne kattepass
        </h1>
        <p className="text-lg text-muted-foreground">
          Mathopen Kattepensjonat er Bergens nyeste og mest moderne tilbud
          innen kattehotell og kattepass. Vi holder til i Bergen vest og tar
          imot katter fra hele bergensregionen.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Kattehotell og kattepensjonat i Bergen – hva finnes?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Begrepene «kattehotell» og «kattepensjonat» brukes om hverandre i
            Bergen og resten av Norge. Begge betyr et sted der katten bor,
            spiser og passes av erfarne katteelskere mens du er borte – det er
            ingen praktisk forskjell.
          </p>
          <p className="text-muted-foreground">
            Mathopen Kattepensjonat er et nybygg fra 2026 med moderne
            fasiliteter, balansert ventilasjon og individuelle rom for alle
            katter. Vi følger alle Mattilsynets krav og retningslinjer.
          </p>

        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Mathopen Kattepensjonat – Bergen vest
          </h2>
          <p className="mb-3 text-muted-foreground">
            Vi holder til på Storingavika 2, 5174 Mathopen – like ved
            busstoppet Storingavika i Bergen vest. Det er god parkering rett
            utenfor, og vi er enkelt tilgjengelig fra store deler av Bergen
            samt Askøy og Sotra.
          </p>
          <p className="mb-3 text-muted-foreground">
            Pensjonatet er drevet av Anja Breivik Møldrup og Martin Grindheim
            Johannessen. Anja har drevet med kattepass siden 2018 og har bred
            erfaring med katter i alle aldre og med ulike behov.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              20 individuelle rom – standard, senior &amp; comfort og suite
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Romslig kattegård med klatrestativ og skjulesteder
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Daglige Snapchat-oppdateringer til eier
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Veterinæravtale med EMPET Bergen Vest Dyreklinikk
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Medisinering uten ekstra kostnad
            </li>
          </ul>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Kattepass i Bergen – hva er forskjellen?
          </h2>
          <p className="mb-3 text-muted-foreground">
            «Kattepass» er et bredere begrep som dekker alt fra at naboen
            stikker innom, til et fullt pensjonatsopphold. Når folk søker etter
            «kattepass i Bergen», leter de gjerne etter akkurat det vi tilbyr:
            et trygt, profesjonelt alternativ der katten er i gode hender hele
            døgnet.
          </p>
          <p className="text-muted-foreground">
            Vi tilbyr også faste kattepassavtaler med rabatt for kunder som
            bruker oss regelmessig – for eksempel de med offshorerotasjon eller
            reisejobb. Les mer i guiden{' '}
            <Link
              href="/guider/fast-kattepass"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              fast kattepass for offshore og reisejobb
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hvem bor hos oss?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Vi tar imot katter fra alle deler av Bergen og omegn – fra Fyllingsdalen
            og Laksevåg til Askøy og Sotra. Det er ingen begrensning på rase
            eller alder, og vi har erfaring med katter som trenger ekstra
            oppfølging, medisin eller tett kontakt med personale.
          </p>
          <p className="text-muted-foreground">
            Er katten din sjenert eller stresset av nye omgivelser? Det er
            helt normalt, og vi er vant til å ta imot katter som trenger litt
            ekstra tid til å falle til ro.
          </p>

        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Praktisk informasjon
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="mb-1 font-medium text-foreground">Adresse</p>
              <p>Storingavika 2, 5174 Mathopen – stor parkeringsplass utenfor</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-foreground">
                Inn- og utsjekktider
              </p>
              <p>Mandag–fredag og søndag: 17:30–19:30</p>
              <p>Lørdag: stengt</p>
              <p>Andre tidspunkt etter avtale</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-foreground">Priser</p>
              <p>
                Lavsesong fra 220 kr/dag, høysesong fra 250 kr/dag. Se
                fullstendig prisliste på{' '}
                <Link
                  href="/priser"
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  prissiden
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/kontakt">
            <Button size="lg" variant="outline">
              Ta kontakt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
