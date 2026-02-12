import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-700">Personvern</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Personvernerklæring
          </h1>
          <p className="text-lg text-slate-600">
            Slik behandler vi dine personopplysninger hos Mathopen
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
              1. Behandlingsansvarlig
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Mathopen Kattepensjonat v/ Anja Breivik Møldrup og Martin
              Grindheim Johannessen, Storingavika 2, 5174 Mathopen, er
              behandlingsansvarlig for personopplysninger som samles inn via vår
              nettside og i forbindelse med bestilling av opphold.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              2. Hvilke opplysninger vi behandler
            </h2>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Om katteeier:
            </h3>
            <ul className="space-y-2 text-slate-700 mb-6">
              <li>• E-postadresse</li>
              <li>• Fornavn og etternavn</li>
              <li>• Adresse</li>
              <li>• Telefonnummer</li>
              <li>• Nødkontakt</li>
              <li>• Eventuelle merknader</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Om katten:
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Navn, kjønn, rase og alder</li>
              <li>• Kastrerings-/steriliseringsstatus</li>
              <li>• ID-chip (15 siffer)</li>
              <li>• Forsikringsnummer</li>
              <li>• Siste vaksinasjonsdato</li>
              <li>• Opplysninger om ormekur og flåttbehandling</li>
              <li>• Medisinske opplysninger</li>
              <li>• Fôrbehov og adferdsmerknader</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              3. Formål med behandlingen
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Opplysningene behandles for å administrere og gjennomføre bestilte
              opphold, ivareta kattens helse og sikkerhet, samt kommunisere med
              eier før, under og etter opphold.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Behandlingsgrunnlaget er at behandlingen er nødvendig for å
              oppfylle en avtale, jf. GDPR artikkel 6 nr. 1 bokstav b.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              4. Lagringstid
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Personopplysninger lagres så lenge det er nødvendig for å oppfylle
              formålet de ble samlet inn for.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li>• Brukerkonto lagres så lenge den er aktiv</li>
              <li>
                • Konto kan slettes via Min Side eller ved forespørsel.
                Lovpålagte opplysninger kan likevel bli lagret i henhold til
                bokføringsloven.
              </li>
              <li>• Regnskapsdata lagres i 5 år etter bokføringsloven</li>
              <li>
                • Helseopplysninger om katt lagres kun så lenge de er relevante
                for fremtidige opphold
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              5. Deling av opplysninger
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Vi deler ikke personopplysninger med uvedkommende. Opplysninger
              lagres hos vår tekniske leverandør Supabase, som behandler data på
              våre vegne i henhold til databehandleravtale.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              6. Informasjonssikkerhet
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Vi benytter tekniske og organisatoriske tiltak for å beskytte
              personopplysninger, herunder kryptert forbindelse (HTTPS),
              tilgangskontroll og sikker lagring i database.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              7. Dine rettigheter
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Du har rett til innsyn, retting, sletting og begrensning av
              behandling. Du kan også klage til Datatilsynet dersom du mener vi
              behandler opplysninger i strid med regelverket.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Henvendelser kan sendes til: post@mathopenkattepensjonat.no
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              8. Bilder og publisering
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Under opphold kan vi ta bilder og videoer av kattene som deles på
              våre sosiale medier og nettside som en del av vår markedsføring og
              dokumentasjon av hverdagen hos oss.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Ved bestilling av opphold samtykker eier til slik publisering, med
              mindre det gis skriftlig beskjed om reservasjon før eller ved
              innsjekk.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Dersom eier ikke ønsker at bilder eller videoer deles, må dette
              meddeles skriftlig på forhånd eller senest ved levering/innsjekk.
              Reservasjon kan sendes til post@mathopenkattepensjonat.no. Vi kan
              ikke garantere fjerning av materiale som allerede er publisert.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
