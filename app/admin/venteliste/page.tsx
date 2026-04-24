import { Suspense } from 'react'
import { adminGetWaitlist } from '@/lib/admin/actions'
import { WaitlistContent } from '@/components/admin/WaitlistContent'
import { Loader2 } from 'lucide-react'

async function WaitlistData() {
  const entries = await adminGetWaitlist()
  return <WaitlistContent entries={entries} />
}

export default function VentelistePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Venteliste</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kunder som ønsker plass i en bestemt periode.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-48 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <WaitlistData />
      </Suspense>
    </div>
  )
}
