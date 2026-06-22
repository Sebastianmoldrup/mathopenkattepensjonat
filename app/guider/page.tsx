import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guider og tips om kattepensjonat i Bergen | Mathopen',
  description:
    'Nyttige guider fra Mathopen Kattepensjonat i Bergen – om forberedelse, priser, p-piller og kattepensjonat nær Askøy.',
}

const GUIDES = [
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
  {
    title: 'P-piller til katt – hva koster det og når er det nødvendig?',
    description:
      'Alt du trenger å vite om p-piller til katt, inkludert hva som gjelder ved opphold hos oss.',
    href: '/guider/p-piller-katt',
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
          Nyttige tips og råd fra Mathopen Kattepensjonat i Bergen
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
