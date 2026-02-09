import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Informasjon
        </h1>
        <p className="mt-3 text-muted-foreground">
          Praktisk informasjon om opphold, trivsel og trygghet hos oss
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        <InfoRow
          image="/illustration/cat-eating.webp"
          alt="Katt spiser"
          title="Et trygt og stimulerende miljø"
        >
          <p>
            Kattene får sitt eget rom med seng, dokasse samt mat- og vannskåler.
            Vi anbefaler å ta med et teppe, en seng eller et annet trygt objekt
            med kattens egen lukt – dette kan gjøre overgangen til nye
            omgivelser enklere.
          </p>

          <p>
            Hos oss er det ikke krav om at kattene må sove i bur om natten, med
            mindre eier ønsker det, katten ikke går godt sammen med andre, eller
            det foreligger andre spesielle hensyn.
          </p>

          <p>
            På dagtid står døren til rommet åpen, slik at de kan bevege seg
            fritt i fellesområdene og luftegårdene. Disse områdene er romslige
            og utformet med mange rolige skjulesteder.
          </p>

          <p>
            Pensjonatet har en romslig og innholdsrik kattegård som er åpen hele
            dagen, samt veggmonterte kloremøbler og aktivitetsområder.
          </p>
        </InfoRow>

        <InfoRow
          image="/illustration/phone-display.webp"
          alt="Oppdateringer"
          title="Oppdateringer og bilder under oppholdet"
          reverse
        >
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
        </InfoRow>

        <InfoRow
          image="/illustration/petting.webp"
          alt="Omsorg"
          title="Helse, trivsel og individuell oppfølging"
        >
          <p>
            Alle katter får kvalitetsfôr hos oss, men eiere kan gjerne ta med
            eget fôr. Det gis ingen prisreduksjon ved medbringing av eget fôr.
          </p>
          <p>
            Vi vet at alle katter er ulike og kan reagere forskjellig på å være
            på pensjonat. Med vår erfaring følger vi nøye opp hver enkelt katt.
          </p>

          <p>
            Skulle en katt bli syk, trist eller slutte å spise, tar vi den inn i
            hjemmet vårt for ekstra ro, nærhet og oppfølging.
          </p>

          <p>
            Når en katt besøker oss for første gang, følger vi ekstra nøye med
            under den første utforskningen.
          </p>

          <p>
            Du er hjertelig velkommen til å komme på besøk før du bestiller
            opphold.
          </p>
        </InfoRow>

        <InfoRow
          image="/illustration/handover-cat.webp"
          alt="Levering"
          title="Beliggenhet, henting og levering"
          reverse
        >
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
        </InfoRow>

        <InfoRow
          image="/illustration/surveillance-v2.webp"
          alt="Sikkerhet"
          title="Sikkerhet"
        >
          <p>
            For å sikre et trygt miljø har vi installert brannalarm,
            videoovervåkning og innbruddsalarm.
          </p>

          <p>
            Vi følger alle gjeldende krav og retningslinjer fra Mattilsynet.
          </p>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({
  image,
  alt,
  title,
  reverse,
  children,
}: {
  image: string;
  alt: string;
  title: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center ${
        reverse ? "md:[grid-template-columns:1fr_220px]" : ""
      }`}
    >
      <div className={`flex justify-center ${reverse ? "md:order-2" : ""}`}>
        <Image
          src={image}
          alt={alt}
          width={260}
          height={200}
          className="rounded-xl object-contain"
        />
      </div>

      <div className="space-y-3 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {children}
      </div>
    </section>
  );
}
