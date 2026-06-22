import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fast kattepass i Bergen – for offshore og reisejobb | Mathopen',
  description:
    'Jobber du offshore eller har reisejobb? Mathopen Kattepensjonat tilbyr fast kattepass-avtale i Bergen med rabatt for faste kunder. Stabil og forutsigbar løsning hele året.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Fast kattepass
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Fast kattepass i Bergen – for deg som er mye borte
        </h1>
        <p className="text-lg text-muted-foreground">
          Jobber du offshore, har reisejobb eller er jevnlig bortreist? Mathopen
          Kattepensjonat tilbyr en fast og forutsigbar kattepass-løsning i
          Bergen – med rabatt for deg som bruker oss regelmessig.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva er fast kattepass?
          </h2>
          <p className="text-muted-foreground">
            Fast kattepass betyr at vi inngår en løpende avtale om at katten
            din får plass hos oss hver gang du reiser – uten at du trenger å
            sjekke tilgjengelighet og bestille fra scratch hver gang. Vi setter
            av kapasitet til deg og sørger for at katten alltid har et trygt
            sted å være.
          </p>
          <p className="mt-3 text-muted-foreground">
            Løsningen passer spesielt godt for deg som har et fast rotasjonsmønster
            – for eksempel 2 uker ute og 2 uker hjemme – men fungerer like bra
            for deg med en mer variabel reiserytme.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Perfekt for offshoreskift og reisejobb
          </h2>
          <p className="text-muted-foreground">
            Bergen er et av Norges viktigste offshoresentre, og vi vet at mange
            her i regionen lever med faste rotasjoner – Equinor, Aker,
            Schlumberger og andre. En 2/4- eller 3/3-rotasjon betyr at katten
            trenger pass annenhver eller tredje uke, og det er akkurat den typen
            forutsigbare behov vi er godt rigget for.
          </p>
          <p className="mt-3 text-muted-foreground">
            Det gjelder også for deg med reisejobb, langvarige jobbreiser eller
            annen situasjon der du periodevis er borte fra hjemmet.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Rabatt for faste kunder
          </h2>
          <p className="text-muted-foreground">
            Bruker du oss regelmessig – for eksempel hver eller annenhver måned –
            tilbyr vi rabatt i lavsesong. Vi verdsetter faste kunder og ønsker å
            legge til rette for en stabil løsning som fungerer for deg gjennom
            hele året.
          </p>
          <p className="mt-3 text-muted-foreground">
            Ordinære priser finner du på vår{' '}
            <Link
              href="/priser"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              prisside
            </Link>
            . Ta kontakt for å avtale vilkår for en fast ordning.
          </p>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
              Merk
            </p>
            <p className="text-sm text-blue-700">
              Rabatten gjelder i lavsesong. I høysesong (sommer, jul, påske)
              gjelder ordinære priser for alle kunder.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva er inkludert i oppholdet?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Alle katter hos oss får det samme gode tilbudet uavhengig av
            avtaletype:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Eget rom med seng, dokasse og mat- og vannskål</li>
            <li>Tilgang til romslig kattegård og fellesarealer på dagtid</li>
            <li>Daglige bilder og videooppdateringer på Snapchat</li>
            <li>Tett individuell oppfølging – vi merker raskt hvis noe er galt</li>
            <li>
              Medisinering uten ekstra kostnad (medisin medbringes av eier)
            </li>
            <li>
              Veterinæravtale med EMPET Bergen Vest Dyreklinikk ved behov
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Les mer om{' '}
            <Link
              href="/informasjon"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              hvordan vi tar vare på katten din
            </Link>{' '}
            eller se{' '}
            <Link
              href="/rom-og-fasiliteter"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              rom og fasiliteter
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Daglige Snapchat-oppdateringer
          </h2>
          <p className="text-muted-foreground">
            Vi vet at det kan være vanskelig å reise fra kjæledyret, spesielt
            når du er offshore og kanskje ikke alltid har god nettilgang. Derfor
            legger vi daglig ut bilder og korte videosnutter av kattene på vår
            Snapchat-kanal, som du kan se når det passer deg.
          </p>
          <p className="mt-3 text-muted-foreground">
            Mange av de faste kundene våre sier at oppdateringene er det de
            setter aller mest pris på – det gjør det mye lettere å konsentrere
            seg om jobben når man vet at katten har det bra hjemme.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Praktisk informasjon
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="mb-1 font-medium text-foreground">Adresse</p>
              <p>Storingavika 2, 5174 Mathopen – med stor parkeringsplass</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-foreground">
                Inn- og utsjekktider
              </p>
              <p>Mandag–fredag og søndag: 17:30–19:30</p>
              <p>Lørdag: Stengt</p>
              <p>Andre tidspunkt: Kun etter avtale</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-foreground">
                Fleksibilitet for offshoreskift
              </p>
              <p>
                Har du avgang tidlig om morgenen eller kommer tilbake sent? Vi
                forsøker å finne løsninger som passer rotasjonsmønsteret ditt.
                Ta kontakt og fortell oss om situasjonen din, så finner vi noe
                som fungerer.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Krav til katten
          </h2>
          <p className="mb-3 text-muted-foreground">
            Samme betingelser gjelder for alle katter hos oss:
          </p>
          <ul className="space-y-1 text-muted-foreground">
            <li>Vaksinert innen siste 12 måneder (minst 14 dager før innsjekk)</li>
            <li>Hannkatter over 6 måneder må være kastrert</li>
            <li>Vaksinasjonskort medbringes</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
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

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Slik kommer du i gang
          </h2>
          <ol className="space-y-3 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Ta kontakt</span>{' '}
              – Send oss en e-post og fortell om rotasjonsmønsteret ditt og
              kattens behov.
            </li>
            <li>
              <span className="font-medium text-foreground">
                2. Avtal vilkår
              </span>{' '}
              – Vi går gjennom prismodell og rabatt basert på frekvens og sesong.
            </li>
            <li>
              <span className="font-medium text-foreground">
                3. Kom gjerne på besøk
              </span>{' '}
              – Ønsker du å se pensjonatet og la katten bli kjent med stedet før
              første opphold, er du hjertelig velkommen til en omvisning.
            </li>
            <li>
              <span className="font-medium text-foreground">
                4. Bestill første opphold
              </span>{' '}
              – Bruk bookingsystemet vårt eller kontakt oss direkte.
            </li>
          </ol>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/kontakt">
            <Button size="lg">Ta kontakt for fast avtale</Button>
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
