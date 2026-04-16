import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { HMSContent } from '@/components/admin/HMSContent'
import { Loader2 } from 'lucide-react'

async function HMSData() {
  const supabase = await createClient()

  const { data: historyData } = await supabase.rpc('admin_get_all_hms_logs')

  return <HMSContent history={historyData ?? []} />
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
            Opprett nye HMS-registreringer og se tidligere lagrede.
          </p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <HMSData />
      </Suspense>
    </div>
  )
}
