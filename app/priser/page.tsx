import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { Button } from '@/components/ui/button'
import { OPENING_HOURS, formatRange } from '@/lib/booking/hours'
import { getActivePricing } from '@/lib/booking/pricing'
import type { Metadata } from 'next'

// generateMetadata (not a static `metadata` object) so this is evaluated
// per-request like the page body below, not frozen at whatever price was
// active the last time the server process started -- otherwise the meta
// description could silently show a stale price after a scheduled price
// change takes effect without a fresh deploy.
export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const pricing = getActivePricing()
  return {
    title: 'Priser – Kattepensjonat i Bergen | Mathopen',
    description: `Se priser for kattepensjonat i Bergen – lavsesong fra ${pricing.standard.low[1]} kr/døgn, høysesong fra ${pricing.standard.high[1]} kr/døgn. Les om vaksinekrav, avbestilling og betingelser hos Mathopen Kattepensjonat.`,
  }
}

// getActivePricing() reads the current time (which version is active
// "now") -- Next.js forbids that during static generation unless the
// render is explicitly marked dynamic first (connection()) AND isolated
// inside a <Suspense> boundary, so only this price-dependent fragment
// defers to request time while the rest of the page still prerenders
// statically (same split already used for app/admin/innsjekk's dynamic
// content).
async function PricingCards() {
  await connection()
  // Single source of truth (lib/booking/types.ts PRICING_VERSIONS) --
  // standard and senior_comfort share the same 1/2-cat prices today, so
  // "standard" is shown here as the representative number; 3 cats always
  // means a suite (standard/senior_comfort only hold up to 2).
  const pricing = getActivePricing()
  return (
    <>
      {/* Low season */}
      <div className="rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Lavsesong
        </h2>

        <div className="mb-6 space-y-3 text-lg">
          <div className="flex justify-between font-medium">
            <span>1 katt</span>
            <span>{pricing.standard.low[1]} kr / døgn</span>
          </div>
          <div className="flex justify-between">
            <span>2 katter</span>
            <span>{pricing.standard.low[2]} kr / døgn</span>
          </div>
          <div className="flex justify-between">
            <span>3 katter</span>
            <span>{pricing.suite.low[3]} kr / døgn</span>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
          <p>Minstebeløp tilsvarer 2 døgn</p>
          <p>Ordinær pris per katt dersom de må bo på hvert sitt rom</p>
          <p>Avbestilling senest 24t før ankomst</p>
          <p>Deretter betales 50 % av oppholdet</p>
        </div>
      </div>

      {/* High season */}
      <div className="rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Høysesong
        </h2>

        <div className="mb-6 space-y-3 text-lg">
          <div className="flex justify-between font-medium">
            <span>1 katt</span>
            <span>{pricing.standard.high[1]} kr / døgn</span>
          </div>
          <div className="flex justify-between">
            <span>2 katter</span>
            <span>{pricing.standard.high[2]} kr / døgn</span>
          </div>
          <div className="flex justify-between">
            <span>3 katter</span>
            <span>{pricing.suite.high[3]} kr / døgn</span>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
          <p>Minstebeløp tilsvarer 2 døgn</p>
          <p>Avbestilling senest 7 dager før ankomst</p>
          <p>Deretter betales 50 % av oppholdet</p>
        </div>
      </div>
    </>
  )
}

function PricingCardsFallback() {
  return (
    <>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl bg-background p-6 shadow-sm">
          <div className="mb-6 h-6 w-28 animate-pulse rounded bg-muted" />
          <div className="mb-6 space-y-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-6 animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Priser & betingelser
        </h1>
        <p className="mt-3 text-muted-foreground">
          Alt du trenger å vite om priser, bestilling og opphold hos oss
        </p>
      </div>

      {/* Price overvieew */}
      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Suspense fallback={<PricingCardsFallback />}>
          <PricingCards />
        </Suspense>
      </section>

      {/* Long stay */}
      <section className="mx-auto mt-12 max-w-5xl rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Langtidsopphold
        </h2>

        <p className="mb-2 text-muted-foreground">
          Langtidsopphold over 20 dager: Ta kontakt for pristilbud. Gjelder ikke
          i høysesong.
        </p>
      </section>

      {/* Medication */}
      <section className="mx-auto mt-12 max-w-5xl rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Medisinering
        </h2>

        <p className="text-muted-foreground">
          Vi tar ikke ekstra betalt for medisinering eller p-piller.
          Medisin/p-piller må medbringes.
        </p>
      </section>

      {/* Booking */}
      <section className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <Image
          src="/illustration/booking.webp"
          alt="Bestilling"
          width={500}
          height={350}
          className="w-full rounded-2xl object-cover"
        />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Bestilling av opphold
          </h2>

          <p className="text-muted-foreground">
            Bestilling gjøres helst gjennom vårt bookingsystem. Alternativt kan
            du ta kontakt med oss.
          </p>

          <p className="text-muted-foreground">
            Det bestilte oppholdet må betales i sin helhet, selv om levering
            skjer senere eller henting tidligere enn avtalt.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/booking">
              <Button size="lg">Book nå</Button>
            </Link>

            <div className="text-sm text-muted-foreground">
              <p>📧 post@mathopenkattepensjonat.no</p>
              <p>📞 473 22 279</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation */}
      <section className="mx-auto mt-16 max-w-5xl rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Avbestilling
        </h2>

        <p className="mb-2 text-muted-foreground">
          Vi ønsker å være fleksible, men trenger forutsigbarhet for å sikre god
          drift.
        </p>

        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          <li>Lavsesong: senest 24t før ankomst</li>
          <li>Høysesong: senest 7 dager før ankomst</li>
          <li>Deretter betales 50 % av oppholdet</li>
        </ul>

        <p className="mt-3 text-muted-foreground">
          Avbestilling skal gjøres per e-post:
          <br />
          📧 post@mathopenkattepensjonat.no
        </p>
      </section>

      {/* High season dates */}
      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Høysesongdatoer
        </h2>

        <ul className="space-y-1 text-muted-foreground">
          <li>Sommer: 15. juni – 15. august</li>
          <li>Jul: 20. desember – 2. januar</li>
          <li>Påske: Fredag før palmesøndag – 2. påskedag</li>
        </ul>
      </section>

      {/* Check in and check out */}
      <section className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <Image
          src="/illustration/handover-v2.webp"
          alt="Inn- og utsjekk"
          width={500}
          height={350}
          className="w-full rounded-2xl object-cover"
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Inn- og utsjekk
          </h2>

          <p className="text-muted-foreground">
            For å planlegge dagen optimalt ber vi om at inn- og utsjekktid
            oppgis ved bestilling.
          </p>

          <div className="text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Lavsesong</p>
            <p>Man–fre: {formatRange(OPENING_HOURS.low.weekday)}</p>
            <p>Lørdag: Stengt</p>
            <p>Søndag: {formatRange(OPENING_HOURS.low.sunday)}</p>
          </div>

          <div className="text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">
              Høysesong (åpent alle dager)
            </p>
            <p>Man–fre: {formatRange(OPENING_HOURS.high.weekday)}</p>
            <p>
              Lør–søn:{' '}
              {formatRange(OPENING_HOURS.high.saturday ?? OPENING_HOURS.high.sunday)}
            </p>
          </div>

          <p className="text-muted-foreground">Andre tidspunkt: Kun etter avtale</p>
        </div>
      </section>

      {/* Closed days */}
      <section className="mx-auto mt-16 max-w-5xl rounded-2xl bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Stengt for inn- og utsjekk
        </h2>

        <ul className="space-y-1 text-muted-foreground">
          <li>17. mai</li>
          <li>Julaften</li>
          <li>1. juledag</li>
          <li>Nyttårsaften</li>
        </ul>
      </section>

      {/* ===================== */}
      {/* Terms */}
      {/* ===================== */}
      <section className="mx-auto mt-20 max-w-5xl space-y-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Betingelser
        </h2>

        {/* Vaccine */}
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src="/illustration/vaccine.webp"
            alt="Vaksinasjon av katt"
            width={500}
            height={350}
            className="w-full rounded-2xl object-cover"
          />

          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">Vaksine</h3>

            <p>
              For å sikre et trygt miljø for alle våre gjester, må alle katter
              som oppholder seg hos oss være vaksinert.
            </p>

            <ul className="list-inside list-disc space-y-1">
              <li>Vaksinen må være gitt innenfor de siste 12 månedene</li>
              <li>Katten må være vaksinert minst 14 dager før innsjekk</li>
            </ul>

            <p>
              Selv om ingen vaksine gir fullstendig beskyttelse, vil en
              vaksinert katt få betydelig mildere symptomer ved sykdom som
              katteinfluensa eller kattepest.
            </p>

            <p>
              Vaksinasjonskort skal tas med og oppbevares hos oss gjennom hele
              oppholdet.
            </p>

            <p>
              Vi anbefaler også at katten får ormekur i forkant av oppholdet.
            </p>
          </div>
        </div>

        {/* Castration / sterilization */}
        <div className="space-y-4 rounded-2xl bg-background p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">
            Kastrering og sterilisering
          </h3>

          <div className="space-y-3 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Hannkatter:</span>{' '}
              Hannkatter eldre enn 6 måneder skal være kastrerte.
            </p>

            <p>
              <span className="font-medium text-foreground">Hunnkatter:</span>{' '}
              Sterilisering er anbefalt, men ikke et krav.
            </p>

            <p>
              Hunnkatter kan komme i løpetid fra 4–10 måneders alder. For
              usteriliserte hunnkatter som får løpetid under oppholdet,
              anbefales p-piller for å unngå stress for både egen katt og andre
              gjester.
            </p>
          </div>
        </div>

        {/* Sickness */}
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src="/illustration/veterinary.webp"
            alt="Veterinærhjelp"
            width={500}
            height={350}
            className="w-full rounded-2xl object-cover"
          />

          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">
              Sykdom og veterinærhjelp
            </h3>

            <p>
              Ved mistanke om sykdom under oppholdet tar vi katten med til
              veterinær for undersøkelse og behandling ved behov. Dersom
              situasjonen tillater det, kontakter vi eier før katten tas med til
              veterinær. Vi forbeholder oss likevel retten til å kontakte
              veterinær umiddelbart dersom vi vurderer det som nødvendig av
              hensyn til kattens helse og velferd.
            </p>

            <p>
              Vi har avtale med EMPET Bergen Vest Dyreklinikk, som benyttes ved
              behov for veterinærhjelp.
            </p>

            <p>
              Dersom katten trenger daglig medisinering under oppholdet, gis
              dette uten ekstra kostnad.
            </p>

            <p>
              Har katten en kjent sykdom, skade eller behov for spesielle hensyn
              før oppholdet, ber vi om at dette oppgis i kattens profil under
              «Dine katter» på nettsiden og informere om ved levering.
              Eventuelle viktige opplysninger eller begrensninger knyttet til
              behandling må også informeres om der.
            </p>

            <p>Vi anbefaler alle eiere å ha forsikring på katten(e) sine.</p>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* Responsibility */}
      {/* ===================== */}
      <section className="mx-auto mt-20 max-w-5xl space-y-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Ansvar
        </h2>

        {/* Risk */}
        <div className="space-y-4 rounded-2xl bg-background p-6 text-muted-foreground shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Risiko</h3>

          <p>
            Katter oppholder seg hos oss på eiers egen risiko. Selv om vi har
            gode rutiner for å forebygge skader og oppdage sykdom tidlig, kan
            ingen garantere at en katt ikke blir syk eller skadet – verken
            hjemme eller på pensjonat.
          </p>

          <p>
            Mathopen Kattepensjonat kan derfor ikke holdes ansvarlig for sykdom
            eller skade som oppstår under oppholdet.
          </p>
        </div>

        {/* Owner items */}
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <Image
            src="/illustration/belongings.webp"
            alt="Private eiendeler"
            width={500}
            height={350}
            className="w-full rounded-2xl object-cover"
          />

          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">
              Private eiendeler
            </h3>

            <p>
              Katteeier er selv ansvarlig for eiendeler katten har med seg. Vi
              kan dessverre ikke holdes ansvarlige for tap eller skade på disse.
            </p>

            <p>
              Medbrakte tepper og lignende blir som hovedregel ikke vasket hos
              oss.
            </p>

            <p>Gjenglemte gjenstander oppbevares og kan hentes etter avtale.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
