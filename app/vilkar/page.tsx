import { Badge } from "@/components/ui/badge";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-700">Vilkår</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Vilkår for opphold
          </h1>
          <p className="text-lg text-slate-600">
            Retningslinjer og betingelser for opphold hos Mathopen
            Kattepensjonat.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* 1 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              1. Generelt
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Disse vilkårene gjelder for alle opphold hos Mathopen
              Kattepensjonat. Ved bestilling av opphold bekrefter eier at
              vilkårene er lest og akseptert.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
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
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              3. Veterinær og sykdom
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Ved mistanke om sykdom eller skade kan katten bringes til
              veterinær. Eier dekker alle kostnader knyttet til veterinærbesøk,
              behandling og medisiner.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Dersom situasjonen tillater det, vil eier bli kontaktet før katten
              tas til veterinær.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              4. Ansvar og risiko
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Katten oppholder seg hos oss på eiers egen risiko. Selv om vi har
              gode rutiner for å forebygge skader og sykdom, kan ingen garantere
              at en katt ikke blir syk eller skadet.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Mathopen Kattepensjonat kan ikke holdes ansvarlig for sykdom,
              skade eller dødsfall som oppstår under oppholdet, med mindre dette
              skyldes grov uaktsomhet fra vår side.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Vi anbefaler alle eiere å ha gyldig forsikring.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              5. Betaling
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Oppholdet betales i henhold til bestilling. Minstebeløp tilsvarer
              2 døgn. Oppholdet må betales i sin helhet selv om levering skjer
              senere eller henting tidligere enn avtalt.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              6. Avbestilling
            </h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              Lavsesong: Avbestilling senest 24 timer før ankomst.
            </p>
            <p className="text-slate-700 leading-relaxed mb-2">
              Høysesong: Avbestilling senest 7 dager før ankomst.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Ved senere avbestilling belastes 50 % av oppholdets pris.
              Avbestilling skal skje skriftlig per e-post.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              7. Inn- og utsjekk
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Ordinære tider:
              <br />
              Man–fre og søndag: 17:00–19:00
              <br />
              Lørdag: Stengt
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Andre tidspunkt kun etter avtale.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              8. Sosialt opphold og fasiliteter
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Katter som trives i sosialt miljø kan oppholde seg fritt i
              fellesområdene dersom eier bekrefter at katten fungerer godt
              sammen med andre. Katten får eget rom med seng, dokasse samt mat-
              og vannskåler.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              9. Private eiendeler
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Katteeier er selv ansvarlig for eiendeler katten har med seg.
              Mathopen Kattepensjonat kan ikke holdes ansvarlig for tap eller
              skade på medbrakte eiendeler.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              10. Endringer i vilkårene
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Mathopen Kattepensjonat forbeholder seg retten til å oppdatere
              vilkårene ved behov. Gjeldende versjon vil alltid være
              tilgjengelig på nettsiden.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
