import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  Heart,
} from 'lucide-react'

interface GuideCardProps {
  icon: React.ReactNode
  title: string
  where: string
  what: string
  when: string
  tip: string
}

function GuideCard({ icon, title, where, what, when, tip }: GuideCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center gap-3 border-b bg-muted/30 px-5 py-4">
        <span className="text-muted-foreground">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{where}</p>
        </div>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hva er det
          </p>
          <p>{what}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Når bruker du det
          </p>
          <p>{when}</p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
          <span className="font-semibold">💡 Tips: </span>
          {tip}
        </div>
      </div>
    </div>
  )
}

export default function GuidePage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kort oversikt over hva hver del av adminpanelet gjør og når du bruker
          det.
        </p>
      </div>

      <div className="space-y-4">
        <GuideCard
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="Oversikt"
          where="/admin"
          what="Viser et øyeblikksbilde av driften — antall bookinger som venter på bekreftelse, totale bookinger, inntekt og avbestillingsrate. Grafen viser inntekt, bookinger og avbestillinger per måned."
          when="Start her hver dag for å se om det er noe som krever oppmerksomhet. Sjekk spesielt om det er bookinger som venter på bekreftelse."
          tip="Bruk årsvelgeren i grafen for å sammenligne inntekt år for år."
        />

        <GuideCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Bookinger"
          where="/admin/bookinger"
          what="Full liste over alle bookinger med søk, statusfiltrering og sortering. Klikk på en booking for å se alle detaljer, endre status, legge til interne notater, fylle inn innsjekk/utsjekk og registrere helseavvik."
          when="Bruk denne siden når en kunde har sendt en bookingforespørsel og du skal bekrefte den, eller når en katt ankommer eller forlater pensjonatet."
          tip="Når du bekrefter eller avbestiller en booking sendes det automatisk e-post til kunden. Du trenger ikke gjøre noe ekstra."
        />

        <GuideCard
          icon={<LogIn className="h-5 w-5" />}
          title="Innsjekk / Utsjekk (inne i booking)"
          where="/admin/bookinger → åpne booking → Inn/Ut-fanen"
          what="Et strukturert skjema for å dokumentere at katten er sjekket inn og ut korrekt. Dekker dokumentasjonskontroll, helsesjekk, burklargjøring og informasjon til eier."
          when="Fyll inn innsjekk-delen når katten ankommer. Fyll inn utsjekk-delen når katten hentes. Husk signatur og dato på begge."
          tip="Eierens navn, kattenes navn og datoer er forhåndsutfylt automatisk fra bookingen."
        />

        <GuideCard
          icon={<Heart className="h-5 w-5" />}
          title="Helse og avvik (inne i booking)"
          where="/admin/bookinger → åpne booking → Helse-fanen"
          what="Loggfører helseavvik, atferdsendringer, skader eller veterinærbesøk for en spesifikk katt under et opphold. Hvert avvik lagres separat og vises i §5-dokumentasjonen."
          when="Registrer et avvik så snart du observerer noe unormalt — ikke vent til utsjekk. Du kan logge flere avvik per katt per opphold."
          tip="Selv om avviket er lite bør det registreres her. Det beskytter deg juridisk og dokumenterer at du fulgte opp."
        />

        <GuideCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Kalender"
          where="/admin/kalender"
          what="Visuell månedsoversikt som viser hvor mange bur som er i bruk per dag. Fargen på dagene indikerer beleggsnivå — jo mørkere, jo mer opptatt. Klikk på en dag for å se hvilke bookinger som er aktive."
          when="Bruk kalenderen for å planlegge kapasitet, se om det er travle perioder og sjekke hvem som er innom på en bestemt dato."
          tip="Kun bekreftede og ventende bookinger vises. Avbestilte bookinger er ikke med i tellingen."
        />

        <GuideCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Daglige rutiner"
          where="/admin/sjekkliste"
          what="To daglige sjekklister — én for morgen og én for dag/kveld. Dekker tilsyn og helse, aktivitet, kattedo, mat og vann, miljø, medisinering og avvik. Dag/kveld-listen inkluderer også daglig renhold."
          when="Fyll inn morgenlisten etter første tilsyn, og dag/kveld-listen på slutten av arbeidsdagen. Historikk over siste 30 dager vises under for referanse til Mattilsynet."
          tip="Klokkeslett og navn er valgfritt men anbefales — spesielt hvis flere ansatte jobber på samme dag."
        />

        <GuideCard
          icon={<FileText className="h-5 w-5" />}
          title="Dokumentasjon"
          where="/admin/dokumentasjon"
          what="Genererer lovpålagt §5-dokumentasjon som PDF. Enkeltbooking-PDF lastes ned direkte fra en booking og inneholder alle §5-punkter på én side. Årseksport gir én PDF med alle bekreftede og gjennomførte bookinger for et valgt år."
          when="Last ned enkeltbooking-PDF ved behov for dokumentasjon på ett opphold. Lag årseksport en gang per år og lagre den sikkert — du er lovpålagt å oppbevare dette i 3 år."
          tip="Husk å fylle inn org.nr i koden før du bruker PDF-ene offisielt — det står [fyll inn] i bunnteksten."
        />

        <GuideCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="HMS & Beredskap"
          where="/admin/hms"
          what="Digitalt HMS-kontrollskjema som dekker brannvern, beredskapsplan, veterinærberedskap, teknisk svikt og smittevern. Hver lagring oppretter en ny registrering med dato og signatur — alle er bevart som historikk."
          when="Fyll ut og lagre et nytt HMS-skjema jevnlig — anbefalt månedlig eller kvartalsvis, eller når noe endres (nytt utstyr, ny rutine, ny ansatt)."
          tip="Navn og dato er påkrevd. Historikken vises under og kan klikkes på for å se alle avkrysninger fra en tidligere registrering."
        />
      </div>
    </div>
  )
}
