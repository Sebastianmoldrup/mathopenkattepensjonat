import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { ImageCarousel } from './ImageCarousel'

export const metadata: Metadata = {
  title: 'Bilder av Mathopen Kattepensjonat – Se rom og fasiliteter i Bergen',
  description:
    'Utforsk Mathopen Kattepensjonat med bilder av kattegård, innvendig miljø og individuelle rom. Se hva katten din kan forvente under oppholdet i Bergen vest.',
}

const KATTEGARD: { src: string; alt: string }[] = [
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-01.webp', alt: 'Kattegård ved Mathopen Kattepensjonat – romslig uteområde for kattene' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-02.webp', alt: 'Skjermet kattegård med klatremuligheter og skjulesteder' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-03.webp', alt: 'Kattegård sett innenfra – trygt og stimulerende uterom' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-04.webp', alt: 'Katter i fri lek i kattegården på Mathopen Kattepensjonat' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-05.webp', alt: 'Leke- og klatreområde i kattegården' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-06.webp', alt: 'Skjermet uteområde med naturlig lys i Bergen vest' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-07.webp', alt: 'Kattegård med god plass og naturlig belysning' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-08.webp', alt: 'Rolig utegård med skjulesteder for katter som trenger ro' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-kattegård-09.webp', alt: 'Oversiktsbilde over uteområdet på Mathopen Kattepensjonat' },
]

const INNVENDIG: { src: string; alt: string }[] = [
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innvending-01.webp', alt: 'Innvendig oversikt over Mathopen Kattepensjonat' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innvendig-02.webp', alt: 'Fellesarealer inne på pensjonatet' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innvendig-03.webp', alt: 'Rent og luftig innvendig miljø på Mathopen Kattepensjonat' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innvendig-04.webp', alt: 'Korridorer og rom innvendig på pensjonatet' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innvendig-kattetårn.webp', alt: 'Kattetårn for klatring og stimulering på pensjonatet' },
]

const ROM: { src: string; alt: string }[] = [
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-standard-bur.webp', alt: 'Standard rom på Mathopen Kattepensjonat – plass til 1–2 katter' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-suite-og-senior.webp', alt: 'Suite og senior & comfort rom side om side' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innside-av-suite.webp', alt: 'Innside av suite-rommet – plass til opptil 3 katter fra samme husstand' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-utebur.webp', alt: 'Utebur tilknyttet Mathopen Kattepensjonat' },
  { src: '/utforsk-pensjonatet/mathopen-kattepensjonat-innside-av-utebur-.webp', alt: 'Innside av utebur – kattene får tilgang til frisk luft' },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/guider" className="hover:underline">
            Guider
          </Link>{' '}
          / Utforsk pensjonatet
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Utforsk Mathopen Kattepensjonat
        </h1>
        <p className="text-lg text-muted-foreground">
          Se deg rundt i et moderne og nybygget pensjonat – fra den romslige
          kattegården og de lyse fellesarealene til individuelle rom tilpasset
          kattens behov. Bygget nytt i 2026.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-10">
        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Kattegården
          </h2>
          <p className="mb-5 text-muted-foreground">
            En romslig og trygg kattegård er en sentral del av pensjonatet.
            Her finner kattene klatrestativ, skjulesteder og avslappende kroker
            – alt utformet for at de skal trives og ha det godt under oppholdet.
          </p>
          <ImageCarousel images={KATTEGARD} />
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Inne i pensjonatet
          </h2>
          <p className="mb-5 text-muted-foreground">
            Pensjonatet er bygget med balansert ventilasjon og
            spesialtilpasset avtrekk over hvert toalettområde. Fellesarealene
            gir kattene bevegelsesrom mellom rommene og kattegården på
            dagtid.
          </p>
          <ImageCarousel images={INNVENDIG} />
        </section>

        <section className="rounded-2xl bg-background p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Romtyper
          </h2>
          <p className="mb-5 text-muted-foreground">
            Vi tilbyr tre romtyper: standard (14 rom, 1–2 katter), senior
            &amp; comfort (3 rom, 1–2 katter) og suite (3 rom, opptil 3
            katter fra samme husstand). Hvert rom har egen seng, dokasse og
            mat- og vannskål.
          </p>
          <ImageCarousel images={ROM} />
          <p className="mt-5 text-sm text-muted-foreground">
            Les mer om romtypene og prisene på{' '}
            <Link
              href="/rom-og-fasiliteter"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              rom og fasiliteter
            </Link>
            .
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">Bestill opphold</Button>
          </Link>
          <Link href="/rom-og-fasiliteter">
            <Button size="lg" variant="outline">
              Se rom og priser
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
