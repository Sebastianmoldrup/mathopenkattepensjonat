import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const CAGE_TYPES = [
  {
    name: "standard",
    lowSeasonPrice: 220,
    highSeasonPrice: 250,
    img: "standard",
    perExtraCat: 100,
    list: [
      "Eget rom på L85, D90, H100",
      "seng, dokasse, mat- og vannskål",
      "Plass til 2 katter fra samme husstand",
    ],
  },
  {
    name: "senior & comfort",
    lowSeasonPrice: 220,
    highSeasonPrice: 250,
    img: "senior & comfort",
    perExtraCat: 100,
    list: [
      "Eget rom på L90, D100, H80",
      "seng, dokasse, mat- og vannskål",
      "Plass til 2 katter fra samme husstand",
      "Tilrettelagt for eldre katter og katter med helseutfordringer",
    ],
    highlight: true,
  },
  {
    name: "suite",
    lowSeasonPrice: 350,
    highSeasonPrice: 450,
    img: "suite",
    perExtraCat: 100,
    list: [
      "Eget rom på L85, D100, H240",
      "seng, dokasse, mat- og vannskål",
      "Plass til 3-4 katter fra samme husstand",
      "Ekstra stor plass og tilrettelegging for katter som trives best med mer privat plass",
    ],
    premium: true,
    obs: "Dette buret kan bookes av alle som har 1–3 katter. Prisen er 450 kr per døgn. ⚠️ Begrenset antall – bestill i god tid",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Rom og fasiliteter
        </h1>
        <p className="mt-3 text-muted-foreground">
          Komfortable og trygge omgivelser for din katt
        </p>
      </div>

      {/* Cage cards */}
      <section
        aria-labelledby="romtyper"
        className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
      >
        {CAGE_TYPES.map((cage) => (
          <article key={cage.name}>
            <Card
              className={`rounded-2xl shadow-sm h-full ${
                cage.premium
                  ? "border-primary"
                  : cage.highlight
                    ? "border-muted-foreground/30"
                    : ""
              }`}
            >
              <CardHeader className="mb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cage.name}</CardTitle>

                  {cage.premium && <Badge variant="default">Premium</Badge>}
                  {cage.highlight && (
                    <Badge variant="secondary">Tilrettelagt</Badge>
                  )}
                </div>

                <p className="text-2xl font-bold">
                  {cage.lowSeasonPrice} kr
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / døgn (lavsesong)
                  </span>
                </p>
              </CardHeader>

              <CardContent className="">
                <Image
                  src={`/illustration/${cage.img}.webp`}
                  alt={cage.name}
                  width={400}
                  height={300}
                  className="w-full rounded-lg object-contain max-w-36 max-h-56 mx-auto"
                />
                <span className="text-xs text-muted-foreground mt-2 block">
                  Bildet er kun en illustrasjon og viser ikke det faktiske
                  produktet
                </span>

                <ul className="space-y-2 text-sm text-muted-foreground my-6">
                  {cage.list.map((item) =>
                    item === "" ? null : (
                      <li key={item} className="flex gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-1 text-primary" />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="pt-4 border-t text-sm text-muted-foreground">
                  Ekstra katt: {cage.perExtraCat} kr
                </div>
              </CardContent>
            </Card>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-5xl space-y-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Våre romtyper
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            Hos Mathopen Kattepensjonat tilbyr vi tre ulike romtyper med
            forskjellig størrelse og tilrettelegging. Enten katten din er sosial
            og aktiv, senior med behov for ekstra tilrettelegging, eller trives
            best med mer privat plass, har vi et trygt og komfortabelt
            alternativ.
          </p>
        </div>

        <div className="rounded-2xl bg-background p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Kattenes trivsel og trygghet står alltid i fokus hos oss.
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            Hos oss er det ingen krav om at katter må sove i bur på natten,
            dersom eier ikke ønsker dette. Katter som går fint sammen med andre,
            får oppholde seg og sove fritt i felles område. Dette forutsetter at
            katten trives i sosialt miljø og fungerer godt sammen med de andre
            kattene.
          </p>
        </div>

        <div className="space-y-4 text-muted-foreground grid gap-x-6">
          <h2 className="text-xl font-semibold text-foreground lg:col-start-1">
            Fokus på kvalitet og inneklima
          </h2>
          <div className="lg:row-start-2">
            <p>
              Kattepensjonatet er nybygget i 2026 og oppført i henhold til
              gjeldende TEK17-krav. Anlegget er utstyrt med balansert
              ventilasjon og varmepumpe for å sikre et stabilt og helsemessig
              godt inneklima for kattene gjennom hele året.
              Ventilasjonsløsningen sørger for kontinuerlig tilførsel av frisk
              luft, optimal temperaturregulering og god fuktighetskontroll. I
              tillegg har hvert enkelt bur spesialtilpasset avtrekksventilasjon
              montert over hvert toalettområde. Dette bidrar til redusert lukt
              og behagelig miljø for kattene. Det er lagt stor vekt på romslige
              bur av høy kvalitet, utformet for å gi kattene god plass til
              bevegelse, hvile og naturlig atferd.
            </p>
            <p>
              Vi tilbyr også egne tilpassede løsninger for eldre katter og
              katter med helseutfordringer, som for eksempel artrose. Disse
              løsningene inkluderer trapp mellom etasjene og ekstra myke
              liggeplasser som reduserer belastning på ledd og muskulatur. Alle
              oppholdsarealer er utviklet med fokus på trygghet, ro og trivsel.
              Materialvalg og overflater er nøye utvalgt med tanke på hygiene,
              slitestyrke og enkel rengjøring, noe som bidrar til et trygt og
              sunt miljø for alle våre gjester.
            </p>
          </div>
          <Image
            src="/illustration/ventilation.webp"
            alt="Rom og fasiliteter"
            width={200}
            height={200}
            className="rounded-lg object-cover justify-self-center md:justify-self-start max-w-52 max-h-52 row-start-2 my-4 lg:col-start-2 lg:self-center"
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
