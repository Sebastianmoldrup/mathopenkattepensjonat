import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { HMSForm } from '@/components/admin/forms/HMSForm'
import { PrintButton } from '@/components/admin/PrintButton'
import { Loader2 } from 'lucide-react'

async function HMSContent() {
  const supabase = await createClient()

  const { data: latestData } = await supabase.rpc('admin_get_latest_hms_log')
  const latest = latestData?.[0] ?? null

  const { data: historyData } = await supabase
    .from('hms_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const history = (historyData ?? []).slice(1) // exclude latest from history

  return <HMSForm existing={latest} history={history} />
}

export default function HMSPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            HMS & Beredskap
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digital registrering av HMS- og beredskapsrutiner. Lagres med dato
            og signatur.
          </p>
        </div>
        <PrintButton />
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <HMSContent />
      </Suspense>
    </div>
  )
}
