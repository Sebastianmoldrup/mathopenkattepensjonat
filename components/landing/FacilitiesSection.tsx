import { Button } from '@/components/ui/button'
import { MapPin, Shield, House } from 'lucide-react'
import Image from 'next/image'

export function FacilitiesSection() {
  return (
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
              {[
                'Brannalarm, videoovervåkning og innbruddsalarm',
                'Følger alle Mattilsynets krav og retningslinjer',
                'Ekstra oppfølging for katter som trenger det',
                'Kvalitetsfôr inkludert, mulighet for eget fôr',
                'Nybygg fra 2026 med balansert ventilasjon og varmepumpe for å sikre et stabilt og godt inneklima',
                'Hvert enkelt bur har spesialtilpasset avtrekksventilasjon montert over hvert toalettområde',
              ].map((item) => (
                <li key={item} className="flex items-start">
                  <span className="mr-2 text-slate-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
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
              alt="Katt som sover trygt på pensjonatet"
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
  )
}
