import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slik forbereder du katten til pensjonat – sjekkliste | Mathopen',
  description:
    'Praktisk sjekkliste for deg som skal levere katten på kattepensjonat. Vi går gjennom vaksine, hva du bør ta med, og hvordan du gjør overgangen enklest mulig.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Slik forbereder du katten til pensjonat
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Slik forbereder du katten til pensjonat
        </h1>
        <p className="text-lg text-muted-foreground">
          En god forberedelse gjør oppholdet tryggere og mer komfortabelt for
          katten din. Her er en praktisk sjekkliste med alt du bør tenke på før
          innsjekk.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            1. Sjekk at vaksinen er i orden
          </h2>
          <p className="text-muted-foreground">
            Alle katter som oppholder seg på Mathopen Kattepensjonat må være
            vaksinert. Dette gjelder typisk mot katteinfluensa og kattepest.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Vaksinen må være gitt innenfor de siste 12 månedene</li>
            <li>
              Katten må ha blitt vaksinert minst 14 dager før innsjekk – ikke
              vent til siste uke
            </li>
            <li>Ta med vaksinasjonskortet – det oppbevares hos oss</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Vi anbefaler også ormekur i god tid før oppholdet.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            2. Ta med kjente lukter og trygge gjenstander
          </h2>
          <p className="text-muted-foreground">
            Katter er svært luktavhengige og kan bli stresset i ukjente
            omgivelser. Det enkleste du kan gjøre er å ta med noe som lukter
            hjemmefra.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Et teppe eller en seng katten har sovet i</li>
            <li>En leke katten er glad i</li>
            <li>Gjerne en brukt t-skjorte eller genser med eierens duft</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Hos oss er det ikke krav om at kattene sover i bur om natten, og de
            har tilgang til fellesarealer og kattegård på dagtid – noe som gjør
            overgangen lettere.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            3. Informer om fôr og rutiner
          </h2>
          <p className="text-muted-foreground">
            Vi serverer kvalitetsfôr, men tar gjerne imot eget fôr hvis katten
            har en spesifikk diett eller er kresne. Brå bytte av mat kan gi
            mageproblemer, spesielt i kombinasjon med reisestress.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Oppgi fôrtype og mengde ved innsjekk</li>
            <li>Ta med nok fôr til hele oppholdet hvis katten spiser spesielt</li>
            <li>Gi beskjed om fôr-allergier eller -sensitiviteter</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            4. Medisinering og helseopplysninger
          </h2>
          <p className="text-muted-foreground">
            Har katten din behov for daglig medisinering? Vi gir medisin uten
            ekstra kostnad – men du må ta med nok medisin til hele oppholdet.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Ta med medisin og doseringsanvisning</li>
            <li>
              P-piller medbringes av eier ved behov – vi tar ikke ekstra betalt
              for å gi dem
            </li>
            <li>
              Oppgi kjente sykdommer, skader eller spesielle behov i kattens
              profil på nettsiden
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Les mer om{' '}
            <Link
              href="/guider/p-piller-katt"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              p-piller til katt
            </Link>{' '}
            hvis det er aktuelt.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            5. Tilpass transportburet
          </h2>
          <p className="text-muted-foreground">
            En stresset tur i transportbur kan sette tonen for hele oppholdet.
            Legg buret fremme hjemme noen dager i forkant, med et teppe inni, så
            katten kan bli vant til det som et trygt sted.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>La buret stå åpent hjemme noen dager før avreise</li>
            <li>Legg noe mykt og kjent inni</li>
            <li>Ikke mat katten rett før turen hvis den er reisesyk</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            6. Husk hannkatter og sterilisering
          </h2>
          <p className="text-muted-foreground">
            Hannkatter eldre enn 6 måneder skal være kastrerte for å oppholde
            seg hos oss. For hunnkatter er sterilisering anbefalt, men ikke et
            krav. Kommer en usterilisert hunnkatt i løpetid under oppholdet,
            anbefaler vi p-piller for å redusere stress.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Kom gjerne på besøk i forkant
          </h2>
          <p className="text-muted-foreground">
            Er det første gang katten din skal på pensjonat? Du er hjertelig
            velkommen til å komme på en omvisning hos oss på forhånd – det gir
            deg trygghet, og katten kan bli litt kjent med lukten av stedet før
            oppholdet starter.
          </p>
          <p className="mt-3 text-muted-foreground">
            Ta kontakt for å avtale et passende tidspunkt.
          </p>
        </section>

        <div className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Rask sjekkliste
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ Vaksinert innen siste 12 måneder, minst 14 dager før innsjekk</li>
            <li>✓ Vaksinasjonskort medbringes</li>
            <li>✓ Hannkatt over 6 mnd: kastrert</li>
            <li>✓ Kjent gjenstand/teppe med hjemmelukt</li>
            <li>✓ Spesialfôr medbringes ved behov</li>
            <li>✓ Medisin medbringes med doseringsanvisning</li>
            <li>✓ Helseopplysninger oppgitt i kattens profil</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/priser">
            <Button size="lg" variant="outline">
              Se priser og betingelser
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
