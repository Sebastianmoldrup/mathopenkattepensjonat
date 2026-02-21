import CatMasonry from '@/components/CatMasonry'

const Page = () => {
  return (
    <main className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto mb-12 max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-foreground">
          Et innblikk i hvordan kattene har hatt det hos oss under kattepass i
          eget hjem
        </h1>

        <p className="mb-12 text-center text-lg text-muted-foreground">
          Bildene som vises under er tatt hjemme hos oss da vi drev med
          kattepass i eget hjem. De gir et innblikk i hvordan kattene hadde det
          hos oss under sitt opphold.
        </p>

        <p className="mb-12 text-center text-lg text-muted-foreground">
          Bildene er ikke tatt i kattepensjonatet, da dette først åpner sommeren
          2026.
        </p>
      </div>
      <CatMasonry />
    </main>
  )
}

export default Page
