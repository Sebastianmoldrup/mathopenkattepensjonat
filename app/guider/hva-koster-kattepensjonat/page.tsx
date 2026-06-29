import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hva koster det å ha katt på kattepensjonat? – Priser og hva som er inkludert',
  description:
    'Se hva kattepensjonat koster i 2026 – lavsesong fra 220 kr/dag, høysesong fra 250 kr/dag. Vi forklarer hva som er inkludert, og hva som påvirker prisen.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Hva koster kattepensjonat?
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Hva koster det å ha katt på kattepensjonat?
        </h1>
        <p className="text-lg text-muted-foreground">
          Prisen på kattepensjonat varierer etter sesong, romtype og antall
          katter. Her får du en oversikt over hva du kan forvente å betale, og
          hva som faktisk er inkludert i prisen.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Priser ved Mathopen Kattepensjonat
          </h2>
          <p className="mb-4 text-muted-foreground">
            Vi priser per dag – både inn- og utsjekksdag teller.
            Minimumsoppholdet er 2 dager.
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Sesong
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Pris per dag
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">
                    Lavsesong
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Fra 220 kr
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">
                    Høysesong
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Fra 250 kr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Se fullstendig prisoversikt med avbestillingsregler og alle
            høysesongdatoer på vår{' '}
            <Link
              href="/priser"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              prisside
            </Link>
            .
          </p>

        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva er inkludert i prisen?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Prisen dekker et fullverdig opphold. Det er ingen skjulte tillegg
            for basisomsorgen:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Eget rom med seng, dokasse og mat- og vannskål
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Kvalitetsfôr – eller eget fôr om katten har spesielle behov
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Tilgang til romslig kattegård og fellesarealer på dagtid
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Tett individuell oppfølging og daglige Snapchat-oppdateringer
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Medisinering uten ekstra kostnad – bare ta med medisinen
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              Veterinæravtale med EMPET Bergen Vest Dyreklinikk ved behov
            </li>
          </ul>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva er høysesong, og hvordan påvirker det prisen?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Høysesong er perioder med størst etterspørsel og gjelder for alle
            kattepensjonat, ikke bare oss:
          </p>
          <ul className="space-y-1 text-muted-foreground">
            <li>Sommer: 15. juni – 15. august</li>
            <li>Jul og nyttår: 20. desember – 2. januar</li>
            <li>Påskeuken: palmesøndag til og med 2. påskedag</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            I høysesong koster oppholdet litt mer fordi kapasiteten fylles
            raskt. Vi anbefaler å bestille tidlig, særlig for fellesferien.
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Hva koster det for to katter?
          </h2>
          <p className="text-muted-foreground">
            Har du to katter fra samme husstand, kan de bo på samme rom – det
            er både roligere for kattene og gunstigere for deg. En suite tar
            opptil tre katter fra samme husstand. Se nøyaktige priser for
            flere katter på{' '}
            <Link
              href="/priser"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              prissiden
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Avbestilling og minimumsopphold
          </h2>
          <p className="mb-3 text-muted-foreground">
            Minimumsoppholdet er 2 dager – både innsjekks- og
            utsjekksdagen teller.
          </p>
          <p className="text-muted-foreground">
            For avbestilling gjelder ulike regler i lav- og høysesong. I
            lavsesong er avbestilling gratis inntil 24 timer før innsjekk. I
            høysesong må avbestilling skje minst 7 dager i forveien for å
            unngå gebyr. Full oversikt finner du på{' '}
            <Link
              href="/priser"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              prissiden
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Er kattepensjonat dyrt sammenlignet med alternativer?
          </h2>
          <p className="mb-3 text-muted-foreground">
            Et kattepensjonat koster mer enn å la naboen stikke innom, men du
            får til gjengjeld profesjonell omsorg, faste rutiner, tilsyn hele
            dagen og en avtale med veterinær om noe skulle skje.
          </p>
          <p className="text-muted-foreground">
            For mange er det prisen verdt – spesielt for katter som trenger
            medisin, ekstra oppfølging, eller bare er tryggere med stabile
            omgivelser fremfor fremmede hjemme.
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/priser">
            <Button size="lg" variant="outline">
              Se fullstendig prisliste
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
