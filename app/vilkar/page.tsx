import { Badge } from '@/components/ui/badge'

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-white px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-700">Vilkår</Badge>
          <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
            Vilkår for opphold
          </h1>
          <p className="text-lg text-slate-600">
            Retningslinjer og betingelser for opphold hos Mathopen
            Kattepensjonat.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* 1 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              1. Generelt
            </h2>
            <p className="leading-relaxed text-slate-700">
              Disse vilkårene gjelder for alle opphold hos Mathopen
              Kattepensjonat. Ved bestilling av opphold bekrefter eier at
              vilkårene er lest og akseptert.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              2. Vaksinasjon og helsekrav
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li>• Katten må være vaksinert innen de siste 12 månedene.</li>
              <li>• Vaksine må være gitt minst 14 dager før innsjekk.</li>
              <li>
                • Vaksinasjonskort skal medbringes og oppbevares hos oss under
                oppholdet.
              </li>
              <li>
                • Katten skal være fri for smittsomme sykdommer ved innsjekk.
              </li>
              <li>• Vi anbefaler ormekur før opphold.</li>
              <li>• Hannkatter over 6 måneder skal være kastrerte.</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              3. Veterinær og sykdom
            </h2>
            <p className="mb-4 leading-relaxed text-slate-700">
              Ved mistanke om sykdom eller skade kan katten bringes til
              veterinær. Eier dekker alle kostnader knyttet til veterinærbesøk,
              behandling og medisiner.
            </p>
            <p className="leading-relaxed text-slate-700">
              Dersom situasjonen tillater det, vil eier bli kontaktet før katten
              tas til veterinær.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              4. Ansvar og risiko
            </h2>
            <p className="mb-4 leading-relaxed text-slate-700">
              Katten oppholder seg hos oss på eiers egen risiko. Selv om vi har
              gode rutiner for å forebygge skader og sykdom, kan ingen garantere
              at en katt ikke blir syk eller skadet.
            </p>
            <p className="leading-relaxed text-slate-700">
              Mathopen Kattepensjonat kan ikke holdes ansvarlig for sykdom,
              skade eller dødsfall som oppstår under oppholdet, med mindre dette
              skyldes grov uaktsomhet fra vår side.
            </p>
            <p className="mt-4 leading-relaxed text-slate-700">
              Vi anbefaler alle eiere å ha gyldig forsikring.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              5. Betaling
            </h2>
            <p className="leading-relaxed text-slate-700">
              Oppholdet betales i henhold til bestilling. Minstebeløp tilsvarer
              2 døgn. Oppholdet må betales i sin helhet selv om levering skjer
              senere eller henting tidligere enn avtalt.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              6. Avbestilling
            </h2>
            <p className="mb-2 leading-relaxed text-slate-700">
              Lavsesong: Avbestilling senest 24 timer før ankomst.
            </p>
            <p className="mb-2 leading-relaxed text-slate-700">
              Høysesong: Avbestilling senest 7 dager før ankomst.
            </p>
            <p className="leading-relaxed text-slate-700">
              Ved senere avbestilling belastes 50 % av oppholdets pris.
              Avbestilling skal skje skriftlig per e-post.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              7. Inn- og utsjekk
            </h2>
            <p className="leading-relaxed text-slate-700">
              Ordinære tider:
              <br />
              Man–fre og søndag: 17:00–19:00
              <br />
              Lørdag: Stengt
            </p>
            <p className="mt-4 leading-relaxed text-slate-700">
              Andre tidspunkt kun etter avtale.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              8. Sosialt opphold og fasiliteter
            </h2>
            <p className="leading-relaxed text-slate-700">
              Katter som trives i sosialt miljø kan oppholde seg fritt i
              fellesområdene dersom eier bekrefter at katten fungerer godt
              sammen med andre. Katten får eget rom med seng, dokasse samt mat-
              og vannskåler.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              9. Private eiendeler
            </h2>
            <p className="leading-relaxed text-slate-700">
              Katteeier er selv ansvarlig for eiendeler katten har med seg.
              Mathopen Kattepensjonat kan ikke holdes ansvarlig for tap eller
              skade på medbrakte eiendeler.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              10. Endringer i vilkårene
            </h2>
            <p className="leading-relaxed text-slate-700">
              Mathopen Kattepensjonat forbeholder seg retten til å oppdatere
              vilkårene ved behov. Gjeldende versjon vil alltid være
              tilgjengelig på nettsiden.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page
