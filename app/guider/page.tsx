import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guider og tips om kattepensjonat i Bergen | Mathopen',
  description:
    'Nyttige guider fra Mathopen Kattepensjonat i Bergen – priser, hva et kattepensjonat er, kattehotell i Bergen, og mer.',
}

const GUIDES = [
  {
    title: 'Utforsk pensjonatet',
    description:
      'Se bilder av kattegård, fellesarealer og individuelle rom – standard, senior & comfort og suite.',
    href: '/guider/utforsk-pensjonatet',
  },
  {
    title: 'Hva koster kattepensjonat?',
    description:
      'Oversikt over priser i lav- og høysesong, hva som er inkludert, og hva som påvirker totalkostnaden.',
    href: '/guider/hva-koster-kattepensjonat',
  },
  {
    title: 'Hva er et kattepensjonat?',
    description:
      'Vi forklarer hva et kattepensjonat er, hva som skiller det fra hjemmepass, og hva du kan forvente av et godt opphold.',
    href: '/guider/hva-er-kattepensjonat',
  },
  {
    title: 'Kattehotell i Bergen',
    description:
      'Leter du etter kattehotell eller kattepass i Bergen? Mathopen holder til i Bergen vest og tar imot katter fra hele regionen.',
    href: '/guider/kattehotell-bergen',
  },
  {
    title: 'Hvor lenge kan en katt være på kattepensjonat?',
    description:
      'Minimumsoppholdet er 2 dager – det er ingen øvre grense. Les om korte helgeopphold og lengre ferieopphold.',
    href: '/guider/hvor-lenge-kan-katt-vaere-paa-kattepensjonat',
  },
  {
    title: 'Slik forbereder du katten til pensjonat',
    description:
      'Sjekkliste med alt du bør tenke på: vaksine, hva du tar med, medisinering og transportbur-tips.',
    href: '/guider/forberede-katt-til-pensjonat',
  },
  {
    title: 'Fast kattepass – for offshore og reisejobb',
    description:
      'Jobber du offshore eller har reisejobb? Les om vår faste kattepass-avtale med rabatt for regelmessige kunder.',
    href: '/guider/fast-kattepass',
  },
  {
    title: 'Kattepensjonat nær Askøy',
    description:
      'Bor du på Askøy? Mathopen Kattepensjonat ligger bare noen minutter over Askøybroen i Bergen vest.',
    href: '/guider/kattepensjonat-askoy',
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Guider
        </h1>
        <p className="mt-3 text-muted-foreground">
          Nyttig informasjon, tips og råd fra Mathopen Kattepensjonat i Bergen
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group rounded-2xl bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="mb-2 text-base font-semibold text-foreground group-hover:underline">
              {guide.title}
            </h2>
            <p className="text-sm text-muted-foreground">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
