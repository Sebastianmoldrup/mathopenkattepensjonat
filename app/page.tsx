import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Star, Shield, Camera } from "lucide-react";
import Image from "next/image";

type CardContent = {
  img: string;
  title: string;
  desc: string;
};

const CURRENT_YEAR = new Date().getFullYear();

const CARD_CONTENT: CardContent[] = [
  {
    img: "experienced",
    title: "Erfaren Omsorg",
    desc: "Anja har drevet kattepass siden 2018 med bred erfaring i katteatferd og stell. Fosterhjem for Kattens Vern.",
  },
  {
    img: "facility",
    title: "Romslige fasiliteter",
    desc: "Bur større enn Mattilsynets krav, åpen kattegård hele dagen, veggmonterte kloremøbler og aktivitetsområder.",
  },
  {
    img: "updates",
    title: "Oppdateringer underveis",
    desc: "Følg kattens opphold på vår egen Snapchat-kanal. Få oppdateringer både under besøket og etterpå.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-200">
            Kattepensjonat i Bergen
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Mathopen Kattepensjonat
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Det trygge hjemmet når du er borte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
              <Calendar className="mr-2 h-5 w-5" />
              Bestill opphold
            </Button>
            <Button size="lg" variant="outline">
              <MapPin className="mr-2 h-5 w-5" />
              Storingavika 2, 5174 Mathopen
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 place-content-center gap-8">
            {CARD_CONTENT.map(({ img, title, desc }, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-lg transition-shadow max-w-[348px]"
              >
                <CardContent className="flex flex-col justify-end items-center pt-6 h-full">
                  <Image
                    src={`${"/illustration/" + img + ".webp"}`}
                    alt="hei"
                    width={150}
                    height={150}
                    className="rounded-lg mb-4 h-[150px] w-fit"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-slate-600">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Om oss
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col-reverse items-center gap-8 md:flex-row">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Vi er Anja og Martin – et par i 30-årene som bor i hjertet av
              Mathopen. Begge er utdannede ingeniører, men vi har også en stor
              felles lidenskap: å skape et trygt, rolig og omsorgsfullt sted for
              katter.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Martin ble en del av driften i 2022, og har siden funnet stor
              glede i å gi kattene et godt opphold. Behovet for kattepass i
              fellesferien har alltid vært større enn kapasiteten vår, og derfor
              bestemte vi oss for å etablere et fullverdig – og litt luksuriøst
              – kattepensjonat.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Målet vårt er å skape et lite paradis for kattene, der de får
              masse tilsyn, omsorg og oppmerksomhet.
            </p>
          </div>
          <Image
            src="/img/om-oss.png"
            alt="hei"
            width={600}
            height={600}
            className="w-[150px] md:w-[600px]"
          />
        </div>
      </section>

      {/* Location & Facilities */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Fasiliteter og beliggenhet
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-slate-700" />
                Beliggenhet
              </h3>
              <p className="text-slate-700 mb-4">
                <strong>Adresse:</strong> Storingavika 2, 5174 Mathopen
              </p>
              <p className="text-slate-600 mb-4">
                Vi holder til like ved busstoppet Storingavika, noe som gjør
                levering enkel for reisende. I tillegg tilbyr vi henting og
                levering mot et tillegg.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-slate-700" />
                Sikkerhet og trivsel
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-2">•</span>
                  <span>Brannalarm, videoovervåkning og innbruddsalarm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-2">•</span>
                  <span>Følger alle Mattilsynets krav og retningslinjer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-2">•</span>
                  <span>Ekstra oppfølging for katter som trenger det</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-2">•</span>
                  <span>Kvalitetsfôr inkludert, mulighet for eget fôr</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-8 bg-slate-50 rounded-lg border-l-4 border-slate-300">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              Ansvar og forsikring
            </h4>
            <p className="text-slate-700 leading-relaxed mb-4">
              Mathopen Kattepensjonat kan ikke holdes økonomisk ansvarlig for
              skader eller sykdom som fører til at katten blir syk, skadet, får
              varige mén eller dør før, under eller etter oppholdet. Det
              anbefales generelt å ha forsikring på katten.
            </p>
            <p className="text-slate-600 text-sm">
              Pensjonatet tar heller ikke ansvar for skader eller tap som
              skyldes tredjepart. Våre lokaler ligger på privat område, og
              uvedkommende har ikke adgang uten godkjenning og tilstedeværelse
              fra oss. Brudd på dette kan medføre erstatningsansvar for
              eventuelle skader eller tap.
            </p>
          </div>

          <div className="mt-12 p-8 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Et trygt og stimulerende miljø
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Hver katt får sitt eget rom med seng, dokasse samt mat- og
              vannskåler. På dagtid står døren til rommet åpen, slik at de kan
              bevege seg fritt i fellesområdene og luftegårdene. Disse områdene
              er romslige og utformet med mange rolige skjulesteder, slik at
              kattene kan trekke seg tilbake når de ønsker det.
            </p>
            <p className="text-slate-600">
              Vi anbefaler å ta med et teppe, en seng eller et annet trygt
              objekt med kattens egen lukt – dette kan gjøre overgangen til nye
              omgivelser enklere.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Priser
          </h2>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-2">
                      Per døgn per katt
                    </p>
                    <p className="text-4xl font-bold text-slate-900">250,-</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Minstebeløp tilsvarer 2 døgn
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-slate-400 mr-2">•</span>
                      <span className="text-slate-700">
                        Katt nr. 2: kr 100,- (samme rom)
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-400 mr-2">•</span>
                      <span className="text-slate-700">
                        Gratis medisinering
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-400 mr-2">•</span>
                      <span className="text-slate-700">
                        Rabatt ved langtidsopphold
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Inn- og utsjekk
                  </h4>
                  <p className="text-slate-700 mb-4">
                    <strong>Mandag–fredag og søndag:</strong>
                    <br />
                    Kl. 17:00–20:00
                  </p>
                  <p className="text-slate-700 mb-4">
                    <strong>Lørdag:</strong> Stengt
                  </p>
                  <p className="text-sm text-slate-600">
                    Andre tidspunkt kun etter avtale
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Klar for å bestille?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Du er hjertelig velkommen til å komme på besøk for å se lokalene før
            du bestiller opphold.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
              Bestill nå
            </Button>
            <Button size="lg" variant="outline">
              Kontakt oss
            </Button>
          </div>

          <div className="space-y-2 text-slate-600">
            <p>📧 mathopenkattepensjonat@hotmail.com</p>
            <p>📞 473 22 279</p>
            <p className="text-sm">
              Telefontid: kl. 11:00–12:00 og 17:00–20:00
            </p>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-600">
            Vi gleder oss til å ta imot katten din! 🐾
          </p>
        </div>
      </section>

      {/* Developer Credit */}
      <section className="py-6 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-slate-600">
            © {CURRENT_YEAR} Utviklet av{" "}
            <a
              href="https://sebastianmoldrup.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-slate-400 transition-colors"
            >
              Sebastian Møldrup
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
