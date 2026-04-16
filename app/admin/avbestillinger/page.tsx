import { Suspense } from 'react'
import { adminGetCancellations } from '@/lib/admin/actions'
import { AvbestillingerContent } from '@/components/admin/AvbestillingerContent'
import { Loader2 } from 'lucide-react'

async function CancellationsData() {
  const entries = await adminGetCancellations()
  return <AvbestillingerContent entries={entries} />
}

export default function AvbestillingerPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Avbestillinger
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oversikt over avbestilte bookinger, gebyrstatus og utestående
          betalinger.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-48 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <CancellationsData />
      </Suspense>
    </div>
  )
}
