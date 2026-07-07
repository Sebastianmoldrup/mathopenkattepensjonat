import MasonryGallery from '@/components/MasonryGallery'
import { buildingImages } from '@/lib/hooks/getBuildingImages'
import { catImages } from '@/lib/hooks/getCatImages'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galleri',
  description:
    'Se bilder av Mathopen Kattepensjonat i Bergen – kattegård, rom og fellesarealer, samt katter som har hatt opphold hos oss.',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-foreground">
          Bilder fra Mathopen Kattepensjonat
        </h1>

        <p className="mb-4 text-center text-lg text-muted-foreground">
          Et innblikk i pensjonatet og kattene som har hatt opphold hos oss –
          fra den romslige kattegården og de lyse fellesarealene, til katter
          som koser seg i sine egne rom.
        </p>

        <nav
          aria-label="Snarveier til bildeseksjoner"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          <a
            href="#pensjonatet"
            className="text-foreground underline underline-offset-4 hover:no-underline"
          >
            Se pensjonatet
          </a>
          <a
            href="#kattene"
            className="text-foreground underline underline-offset-4 hover:no-underline"
          >
            Se kattene
          </a>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl space-y-16">
        <section id="pensjonatet" className="scroll-mt-32">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
              Pensjonatet
            </h2>
            <p className="text-muted-foreground">
              Kattegården, fellesarealene og romtypene på Mathopen
              Kattepensjonat.
            </p>
          </div>
          <MasonryGallery images={buildingImages} />
        </section>

        <hr className="border-border" />

        <section id="kattene" className="scroll-mt-32">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
              Kattene
            </h2>
            <p className="text-muted-foreground">
              Noen av kattene som har hatt opphold hos oss på Mathopen
              Kattepensjonat.
            </p>
          </div>
          <MasonryGallery images={catImages} />
        </section>
      </div>
    </main>
  )
}
