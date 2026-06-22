import Image from 'next/image'
import catEating from '@/public/illustration/cat-eating.webp'
import phoneDisplay from '@/public/illustration/phone-display.webp'
import petting from '@/public/illustration/petting.webp'
import handoverCat from '@/public/illustration/handover-cat.webp'
import surveillance from '@/public/illustration/surveillance-v2.webp'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informasjon – Kattepensjonat i Bergen | Mathopen',
  description:
    'Hos Mathopen Kattepensjonat i Bergen får katten din eget rom, daglige oppdateringer og tett individuell oppfølging. Les mer om hvordan vi tar vare på katten din.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Informasjon
        </h1>
        <p className="mt-3 text-muted-foreground">
          Praktisk informasjon om opphold, trivsel og trygghet hos oss
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-16">
        {/* Miljø */}
        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src={catEating}
            alt="Katt spiser"
            className="rounded-2xl"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="space-y-4 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">
              Et trygt og stimulerende miljø
            </h2>
            <p>
              Kattene får sitt eget rom med seng, dokasse samt mat- og
              vannskåler. Vi anbefaler å ta med et teppe, en seng eller et annet
              trygt objekt med kattens egen lukt – dette kan gjøre overgangen
              til nye omgivelser enklere.
            </p>
            <p>
              Hos oss er det ikke krav om at kattene må sove i bur om natten,
              med mindre eier ønsker det, katten ikke går godt sammen med andre,
              eller det foreligger andre spesielle hensyn.
            </p>
            <p>
              På dagtid står døren til rommet åpen, slik at de kan bevege seg
              fritt i fellesområdene og luftegårdene. Disse områdene er romslige
              og utformet med mange rolige skjulesteder.
            </p>
            <p>
              Pensjonatet har en romslig og innholdsrik kattegård som er åpen
              hele dagen, samt veggmonterte kloremøbler og aktivitetsområder.
            </p>
          </div>
        </section>

        {/* Oppdateringer */}
        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src={phoneDisplay}
            alt="Oppdateringer"
            className="rounded-2xl md:order-2"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="space-y-4 text-muted-foreground md:order-1">
            <h2 className="text-xl font-semibold text-foreground">
              Oppdateringer og bilder under oppholdet
            </h2>
            <p>
              Under oppholdet tar vi bilder og videoer av kattene, som deles på
              Facebook, Snapchat og vår nettside.
            </p>
            <p>
              Eiere får mulighet til å følge kattenes hverdag gjennom vår egen
              Snapchat-kanal – både under oppholdet og i etterkant dersom det er
              ønskelig.
            </p>
            <p>
              Innholdet gir et hyggelig innblikk i lek, hvile og daglig omsorg i
              trygge omgivelser.
            </p>
          </div>
        </section>

        {/* Helse og trivsel */}
        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src={petting}
            alt="Omsorg"
            className="rounded-2xl"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="space-y-4 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">
              Helse, trivsel og individuell oppfølging
            </h2>
            <p>
              Alle katter får kvalitetsfôr hos oss, men eiere kan gjerne ta med
              eget fôr. Det gis ingen prisreduksjon ved medbringing av eget fôr.
            </p>
            <p>
              Vi vet at alle katter er ulike og kan reagere forskjellig på å
              være på pensjonat. Med vår erfaring følger vi nøye opp hver enkelt
              katt.
            </p>
            <p>
              Skulle en katt bli syk, trist eller slutte å spise, tar vi den inn
              i hjemmet vårt for ekstra ro, nærhet og oppfølging.
            </p>
            <p>
              Når en katt besøker oss for første gang, følger vi ekstra nøye med
              under den første utforskningen.
            </p>
            <p>
              Du er hjertelig velkommen til å komme på besøk før du bestiller
              opphold.
            </p>
          </div>
        </section>

        {/* Beliggenhet */}
        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src={handoverCat}
            alt="Levering"
            className="rounded-2xl md:order-2"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="space-y-4 text-muted-foreground md:order-1">
            <h2 className="text-xl font-semibold text-foreground">
              Beliggenhet, henting og levering
            </h2>
            <p>
              Vi holder til like ved busstoppet Storingavika, noe som gjør
              levering enkelt for reisende.
            </p>
            <p>
              Vi har også en stor parkeringsplass rett utenfor kattepensjonatet.
            </p>
            <p>
              I tillegg tilbyr vi henting og levering mot et tillegg i prisen.
            </p>
          </div>
        </section>

        {/* Sikkerhet */}
        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src={surveillance}
            alt="Sikkerhet"
            className="rounded-2xl"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="space-y-4 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Sikkerhet</h2>
            <p>
              For å sikre et trygt miljø har vi installert brannalarm,
              videoovervåkning og innbruddsalarm.
            </p>
            <p>
              Vi følger alle gjeldende krav og retningslinjer fra Mattilsynet.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
