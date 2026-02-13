import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Om oss
        </h1>
        <p className="mt-3 text-muted-foreground">
          Et trygt og omsorgsfullt kattepensjonat i hjertet av Mathopen
        </p>
      </div>

      {/* Hero section */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <Image
          src="/img/om-oss.webp"
          alt="Mathopen Kattepensjonat"
          width={800}
          height={800}
          className="w-full rounded-2xl object-cover"
          priority
        />

        <div className="space-y-5 text-muted-foreground">
          <p>
            Vi er{" "}
            <strong className="text-foreground">Anja Breivik Møldrup</strong> og{" "}
            <strong className="text-foreground">
              Martin Grindheim Johannessen
            </strong>{" "}
            – et par i 30-årene som bor i Mathopen og driver Mathopen
            Kattepensjonat.
          </p>

          <p>
            Begge er utdannede ingeniører, men deler en sterk lidenskap for å
            skape et rolig, trygt og omsorgsfullt sted for katter – et sted hvor
            hver katt blir sett og ivaretatt.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        <div className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Erfaring og omsorg
          </h2>
          <p className="text-muted-foreground">
            Anja har hatt katt som en naturlig del av livet siden barndommen. Da
            hennes egen katt gikk bort i 2018, ønsket hun fortsatt å ha katter
            rundt seg – og startet med kattepass i eget hjem.
          </p>
          <p className="mt-4 text-muted-foreground">
            Med over syv års erfaring innen kattepass har hun utviklet en trygg
            og omsorgsfull tilnærming til katter i alle livsfaser, med særlig
            forståelse for stress, adferd og individuelle behov.
          </p>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-start gap-6 md:items-center rounded-2xl bg-background p-6 shadow-sm">
          <Image
            src="/img/var-arbeider.webp"
            alt="Vår arbeider"
            width={100}
            height={20}
            className="rounded-2xl object-cover"
          />
          <div className="">
            <h2 className="mb-3 text-lg font-semibold text-foreground md:col-span-2">
              Sammen om driften
            </h2>

            <p className="text-muted-foreground">
              Martin ble en del av driften i 2022, og har siden hatt stor glede
              av å bidra til at kattene får et trygt og godt opphold. Sammen
              sørger vi for struktur, tilsyn og en rolig hverdag for alle
              gjester.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Omsorg og trygghet når du er bortreist
          </h2>
          <p className="text-muted-foreground">
            Behovet for kattepass i fellesferien har alltid vært større enn
            kapasiteten vår. Derfor bestemte vi oss for å etablere et fullverdig
            og komfortabelt kattepensjonat.
          </p>
          <p className="mt-4 text-muted-foreground">
            Målet vårt er å skape et trygt og godt sted for kattene - et sted
            der kattene kan føle seg trygge og ivaretatt
          </p>
        </div>
      </section>
    </div>
  );
}
