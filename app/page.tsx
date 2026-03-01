import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  MapPin,
  Heart,
  House,
  Star,
  Shield,
  Camera,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import BookingUnderDevelopment from '@/features/BookingUnderDevelopment'

type CardContent = {
  img: string
  title: string
  desc: string
}

const CURRENT_YEAR = new Date().getFullYear()

const CARD_CONTENT: CardContent[] = [
  {
    img: 'petting-no-bg',
    title: 'Erfaren omsorg',
    desc: 'Anja har drevet kattepass siden 2018 med bred erfaring i katteatferd og stell.',
  },
  {
    img: 'playing-no-bg',
    title: 'Romslige fasiliteter',
    desc: 'Romslige bur, kattegård åpen hele dagen, veggmonterte kattemøbler og gode aktivitetsområder',
  },
  {
    img: 'phone-cat-playing-no-bg',
    title: 'Oppdateringer underveis',
    desc: 'Følg kattens opphold på vår egen Snapchat-kanal og facebook-side, med jevnlige oppdateringer og bilder.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-white px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-200">
            Kattepensjonat i Bergen
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Mathopen Kattepensjonat
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-600">
            Det trygge hjemmet når du er bortreist
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              {' '}
              <Button size="lg" className="">
                <Calendar className="mr-2 h-5 w-5" />
                Bestill opphold
              </Button>
            </Link>
            <Link
              href="https://maps.app.goo.gl/AdkUWXNkv9DGmobE6"
              target="_blank"
            >
              <Button size="lg" variant="outline">
                <MapPin className="mr-2 h-5 w-5" />
                Storingavika 2, 5174 Mathopen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Temporary booking under development */}
      <BookingUnderDevelopment />

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid place-content-center gap-8 md:grid-cols-3">
            {CARD_CONTENT.map(({ img, title, desc }, index) => (
              <Card
                key={index}
                className="max-w-[348px] border-slate-200 transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col items-center justify-end pt-6">
                  <Image
                    src={`${'/illustration/' + img + '.webp'}`}
                    alt="hei"
                    width={150}
                    height={150}
                    className="mb-4 h-[150px] w-fit rounded-lg"
                  />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
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
      <section className="bg-white px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
          Om oss
        </h2>
        <div className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-8 md:flex-row">
          <div className="prose prose-slate max-w-none">
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Vi er Anja Breivik Møldrup og Martin Grindheim Johannessen – et
              par i 30-årene som bor i Mathopen og driver Mathopen
              Kattepensjonat.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Anja har drevet med kattepass siden 2018, og har gjennom flere år
              opparbeidet seg solid erfaring. Vi har et sterkt fokus på hver
              enkelt katt – deres personlighet, trivsel og individuelle behov.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              Behovet for kattepass i fellesferien har over tid vært større enn
              kapasiteten vår. Derfor bygger vi kattepensjonatet for å møte den
              økende etterspørselen etter trygge og gode løsninger for
              kattepass. Vi ønsker å skape et rolig og trygt sted der hver katt
              blir sett, og får et opphold tilpasset sin personlighet, trivsel
              og behov.
            </p>
          </div>
          <Image
            src="/img/om-oss.webp"
            alt="hei"
            width={600}
            height={600}
            className="h-auto w-[150px] rounded-lg md:w-[400px]"
          />
        </div>
      </section>

      {/* Our partners */}
      <section className="flex flex-col items-center gap-8 px-4 py-16">
        <h2 className="text-3xl font-semibold">Vi samarbeider med</h2>
        <div className="flex flex-wrap items-center justify-center gap-12">
          <Image
            src="/partners/buddy.webp"
            alt="buddy"
            width={150}
            height={150}
            className=""
          />
          <Image
            src="/partners/no-bg-dyreklinikken.webp"
            alt="buddy"
            width={150}
            height={150}
            className=""
          />
        </div>
      </section>

      {/* Location & Facilities */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Fasiliteter og beliggenhet
          </h2>

          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <MapPin className="mr-2 h-5 w-5 text-slate-700" />
                Beliggenhet
              </h3>
              <p className="mb-4 text-slate-700">
                <strong>Adresse:</strong> Storingavika 2, 5174 Mathopen
              </p>
              <p className="mb-4 text-slate-600">
                Vi holder til like ved busstoppet Storingavika i Mathopen. I
                tillegg tilbyr vi henting og levering mot et tillegg.
              </p>
            </div>

            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <Shield className="mr-2 h-5 w-5 text-slate-700" />
                Sikkerhet og trivsel
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>Brannalarm, videoovervåkning og innbruddsalarm</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>Følger alle Mattilsynets krav og retningslinjer</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>Ekstra oppfølging for katter som trenger det</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>Kvalitetsfôr inkludert, mulighet for eget fôr</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>
                    Nybygg fra 2026 med balansert ventilasjon og varmepumpe for
                    å sikre et stabilt og godt inneklima
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>
                    Hvert enkelt bur har spesialtilpasset avtrekksventilasjon
                    montert over hvert toalettområde
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-sm rounded-lg bg-background p-8 md:max-w-4xl md:flex-row-reverse">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Et trygt og stimulerende miljø
            </h3>
            <div className="grid place-items-center md:grid-cols-2">
              <Image
                src="/illustration/cat-sleeping-no-bg.webp"
                alt=""
                width={150}
                height={150}
                className="w-[300px] md:col-start-2 md:row-start-1"
              />

              <div className="md:col-start-1 md:row-start-1">
                <p className="mb-4 leading-relaxed text-slate-700">
                  Hvert rom har egen seng, dokasse samt mat- og vannskåler. På
                  dagtid står døren til rommet åpen, slik at de kan bevege seg
                  fritt i fellesområdene og luftegårdene. Disse områdene er
                  romslige og utformet med mange rolige skjulesteder, slik at
                  kattene kan trekke seg tilbake når de ønsker det.
                </p>
                <p className="text-slate-600">
                  Vi anbefaler å ta med et teppe, en seng eller et annet trygt
                  objekt med kattens egen lukt – dette kan gjøre overgangen til
                  nye omgivelser enklere.
                </p>
              </div>
            </div>
            <Button className="mr-2 p-6" disabled>
              <House className="h-4 w-4 text-white" /> Utforsk pensjonatet
            </Button>
            <span className="text-muted-foreground">Kommer snart.</span>
          </div>
        </div>
      </section>

      {/* Responsibility and insurance */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Ansvar og forsikring
          </h2>

          <div className="grid place-items-center md:grid-cols-2">
            <Image
              src="/illustration/handover-cat-no-bg.webp"
              alt=""
              width={150}
              height={150}
              className="w-[300px]"
            />

            <div className="mx-auto max-w-sm md:max-w-4xl">
              <p className="mb-4 leading-relaxed text-slate-700">
                Mathopen Kattepensjonat kan ikke holdes økonomisk ansvarlig for
                skader eller sykdom som fører til at katten blir syk, skadet,
                får varige mén eller dør, under eller etter oppholdet. Det
                anbefales generelt å ha forsikring på katten.
              </p>
              <p className="text-sm text-slate-600">
                Pensjonatet tar heller ikke ansvar for skader eller tap som
                skyldes tredjepart. Våre lokaler ligger på privat område, og
                uvedkommende har ikke adgang uten godkjenning og tilstedeværelse
                fra oss. Brudd på dette kan medføre erstatningsansvar for
                eventuelle skader eller tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
            Priser
          </h2>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* PRISER */}
                <div>
                  {/* Sesongpriser */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    {/* Lavsesong */}
                    <div className="rounded-lg border border-slate-200 p-5">
                      <p className="mb-4 text-sm font-medium text-slate-500">
                        Lavsesong
                      </p>

                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span>1 katt</span>
                          <span className="font-semibold text-slate-900">
                            220 kr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 katter</span>
                          <span className="font-semibold text-slate-900">
                            320 kr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 katter</span>
                          <span className="font-semibold text-slate-900">
                            400 kr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Høysesong */}
                    <div className="rounded-lg border border-slate-200 p-5">
                      <p className="mb-4 text-sm font-medium text-slate-500">
                        Høysesong
                      </p>

                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span>1 katt</span>
                          <span className="font-semibold text-slate-900">
                            250 kr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 katter</span>
                          <span className="font-semibold text-slate-900">
                            350 kr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 katter</span>
                          <span className="font-semibold text-slate-900">
                            450 kr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6 text-sm text-slate-600">
                    Priser er per døgn, minstebeløp tilsvarer 2 døgn
                  </p>

                  {/* Tillegg */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="mr-2 text-slate-400">•</span>
                      <span className="text-slate-700">
                        Gratis medisinering
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 text-slate-400">•</span>
                      <span className="text-slate-700">
                        Rabatt ved langtidsopphold
                      </span>
                    </div>
                  </div>
                </div>

                {/* INN- OG UTSJEKK */}
                <div>
                  <h4 className="mb-4 font-semibold text-slate-900">
                    Inn- og utsjekk
                  </h4>
                  <p className="mb-4 text-slate-700">
                    <strong>Mandag–fredag og søndag:</strong>
                    <br />
                    Kl. 17:00–20:00
                  </p>
                  <p className="mb-4 text-slate-700">
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
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Klar for å bestille?
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Du er hjertelig velkommen til å komme på besøk for å se lokalet før
            du bestiller opphold. Kattpensjonatet åpner imidlertid først 1.
            juli.
          </p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              <Button size="lg" className="">
                Bestill nå
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button size="lg" variant="outline">
                Kontakt oss
              </Button>
            </Link>
          </div>

          <div className="space-y-2 text-slate-600">
            <p>📧 post@mathopenkattepensjonat.no</p>
            <p>📞 473 22 279</p>
            <p className="text-sm">
              Telefontid: kl. 11:00–12:00 og 17:00–20:00
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
