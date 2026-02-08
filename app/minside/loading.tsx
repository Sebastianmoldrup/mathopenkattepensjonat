export default function Loading() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="h-8 w-32 rounded bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
        </div>

        <main className="rounded-2xl border bg-background p-4 shadow-sm md:p-6">
          <div className="space-y-4">
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
            <div className="h-10 w-full rounded bg-muted animate-pulse" />
            <div className="h-10 w-full rounded bg-muted animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  );
}
