import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kattepensjonat nær Askøy – Mathopen Kattepensjonat i Bergen',
  description:
    'Bor du på Askøy og trenger kattepensjonat? Mathopen Kattepensjonat ligger like over Askøybroen i Bergen vest – kort kjøretur, god parkering og trygt opphold for katten din.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Kattepensjonat nær Askøy
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Kattepensjonat nær Askøy
        </h1>
        <p className="text-lg text-muted-foreground">
          Bor du på Askøy og leter etter et godt kattepensjonat? Mathopen
          Kattepensjonat ligger bare noen minutter over Askøybroen – i Mathopen,
          Bergen vest.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Kort kjøretur fra Askøy
          </h2>
          <p className="text-muted-foreground">
            Fra Askøy sentrum er det ca. 10–15 minutters kjøring til oss via
            Askøybroen og inn mot Mathopen i Bergen vest. Vi holder til på
            Storingavika 2, 5174 Mathopen – rett ved busstoppet Storingavika og
            med stor parkeringsplass utenfor pensjonatet.
          </p>
          <p className="mt-4 text-muted-foreground">
            Dette gjør oss til et naturlig valg for katteiere på Askøy,
            Kleppestø, Strusshamn, Florvåg og resten av øya – spesielt for dem
            som er på vei til Flesland flyplass og ønsker å levere katten
            underveis.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva vi tilbyr
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              Store, individuelle rom – standard, senior &amp; comfort og suite
            </li>
            <li>Romslig kattegård åpen hele dagen</li>
            <li>Tett individuell oppfølging og daglige oppdateringer</li>
            <li>Vaksinekrav og trygge rutiner for alle gjester</li>
            <li>Veterinæravtale med EMPET Bergen Vest Dyreklinikk</li>
            <li>Medisinering uten ekstra kostnad</li>
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
            Priser
          </h2>
          <p className="text-muted-foreground">
            Lavsesong fra 220 kr/døgn og høysesong fra 250 kr/døgn for én katt.
            Har du to katter fra samme husstand kan de bo på samme rom.
          </p>
          <p className="mt-3 text-muted-foreground">
            Se fullstendig prisoversikt, avbestillingsregler og høysesongdatoer
            på vår{' '}
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
            Henting og levering
          </h2>
          <p className="text-muted-foreground">
            Foretrekker du at vi henter eller leverer katten? Vi tilbyr henting
            og levering mot et tillegg. Ta kontakt for å avtale dette ved
            bestilling.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Finn oss
          </h2>
          <p className="text-muted-foreground">
            Storingavika 2, 5174 Mathopen
            <br />
            Ta Askøybroen og følg veien mot Bergen vest / Laksevåg. Vi er
            skiltet fra Storingavika.
          </p>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">Inn- og utsjekktider:</strong>{' '}
            Man–fre og søndag 17:30–19:30. Lørdag stengt. Andre tidspunkt etter
            avtale.
          </p>
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
