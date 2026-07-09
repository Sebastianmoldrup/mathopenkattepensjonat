import {
  BookOpen,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  BedDouble,
  Users,
  XCircle,
  Grid3X3,
  User,
} from 'lucide-react'

interface GuideItemProps {
  icon: React.ReactNode
  title: string
  where: string
  children: React.ReactNode
}

function GuideItem({ icon, title, where, children }: GuideItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border bg-card px-4 py-3.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{where}</p>
        </div>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}

function GuideSection({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
          {title}
        </p>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default function GuidePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kort forklaring på hva hver side gjør og hvordan du bruker den.
          Rekkefølgen matcher menyen til venstre.
        </p>
      </div>

      <GuideSection>
        <GuideItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="Oversikt"
          where="/admin"
        >
          Startsiden. Viser ventende bookinger, inntekt og en graf over
          bookinger/inntekt per måned. Sjekk denne først hver dag.
        </GuideItem>
      </GuideSection>

      <GuideSection title="I dag">
        <GuideItem
          icon={<BedDouble className="h-5 w-5" />}
          title="Burstatus"
          where="/admin/burstatus"
        >
          Dagens burliste: hvem sjekker inn, hvem sjekker ut, og hvilke bur
          som bytter beboer akkurat i dag. Kryss av hver hendelse etter hvert
          som du har gjort den fysisk, så vet du hva som gjenstår. Bla mellom
          dager med pilene øverst.
        </GuideItem>
        <GuideItem
          icon={<LogIn className="h-5 w-5" />}
          title="Innsjekk / Utsjekk"
          where="/admin/innsjekk"
        >
          Samme dagsvisning som Burstatus, men med de fulle sjekklistene:
          dokumentasjon fra eier, helsesjekk av katten og burklargjøring.
          Velg dato øverst, finn katten i lista, og fyll ut sjekklisten når
          den ankommer eller hentes.
        </GuideItem>
        <GuideItem
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Daglige rutiner"
          where="/admin/sjekkliste"
        >
          To sjekklister per dag — morgen og dag/kveld — for tilsyn, mat,
          kattedo og renhold. Fyll inn etter hvert tilsyn. Historikk for
          siste 30 dager vises under, til bruk hvis Mattilsynet spør.
        </GuideItem>
      </GuideSection>

      <GuideSection title="Bookinger">
        <GuideItem
          icon={<BookOpen className="h-5 w-5" />}
          title="Bookinger"
          where="/admin/bookinger"
        >
          Full liste over alle bookinger. Åpne en for å bekrefte eller
          avvise den, legge til interne notater, fylle inn innsjekk/utsjekk
          for akkurat den bookingen, eller registrere et helseavvik.
          E-post til kunden sendes automatisk når du endrer status.
        </GuideItem>
        <GuideItem icon={<Users className="h-5 w-5" />} title="Brukere" where="/admin/brukere">
          Liste over alle registrerte kunder og kattene deres. Bruk søk og
          filter for å finne noen med ufullstendig profil eller uten
          registrerte katter.
        </GuideItem>
        <GuideItem
          icon={<XCircle className="h-5 w-5" />}
          title="Avbestillinger"
          where="/admin/avbestillinger"
        >
          Oversikt over avbestilte bookinger — om det påløper gebyr og om
          det er betalt. Marker gebyr som betalt eller send en purring
          direkte herfra.
        </GuideItem>
        <GuideItem
          icon={<Grid3X3 className="h-5 w-5" />}
          title="Burplassering"
          where="/admin/burplassering"
        >
          Planleggingsverktøy for å bestemme hvor en katt skal bo før den
          ankommer. Dra bekreftede bookinger uten fast bur inn i et ledig
          bur i oversikten.
        </GuideItem>
      </GuideSection>

      <GuideSection title="Dokumentasjon">
        <GuideItem
          icon={<ShieldCheck className="h-5 w-5" />}
          title="HMS & Beredskap"
          where="/admin/hms"
        >
          Skjema for brannvern, beredskapsplan og smittevern. Fyll ut og
          lagre jevnlig (f.eks. månedlig) — hver lagring blir en ny
          registrering med dato og signatur i historikken under.
        </GuideItem>
        <GuideItem
          icon={<FileText className="h-5 w-5" />}
          title="Dokumentasjon"
          where="/admin/dokumentasjon"
        >
          Lovpålagt §5-dokumentasjon som PDF. Enkeltbooking-PDF lastes ned
          fra bookingen selv (i Bookinger); årseksport samler alle
          bookinger for et valgt år i én PDF. Oppbevares i minst 3 år.
        </GuideItem>
      </GuideSection>

      <GuideSection>
        <GuideItem icon={<User className="h-5 w-5" />} title="Min profil" where="/admin/profil">
          Dine egne kontaktopplysninger som ansatt/admin.
        </GuideItem>
      </GuideSection>
    </div>
  )
}
