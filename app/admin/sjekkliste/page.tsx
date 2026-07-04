import { Suspense } from 'react'
import { connection } from 'next/server'
import { adminGetDailyRoutines } from '@/lib/admin/formActions'
import { SjekklisteClient } from '@/components/admin/SjekklisteClient'
import { Loader2 } from 'lucide-react'

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function resolveDate(raw: string | undefined, fallback: string): string {
  if (!raw || !ISO_DATE_RE.test(raw)) return fallback
  const d = new Date(raw + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? fallback : raw
}

async function SjekklisteContent({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  await connection()
  const params = await searchParams
  const today = localDateStr(new Date())
  const thirtyDaysAgo = localDateStr(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  )
  const selectedDate = resolveDate(params.dato, today)

  const [selectedResult, historyResult] = await Promise.all([
    adminGetDailyRoutines(selectedDate, selectedDate),
    adminGetDailyRoutines(thirtyDaysAgo, today),
  ])

  const initialMorgen =
    selectedResult.data.find((r) => r.period === 'morgen') ?? null
  const initialDagKveld =
    selectedResult.data.find((r) => r.period === 'dag_kveld') ?? null

  return (
    <SjekklisteClient
      initialDate={selectedDate}
      initialMorgen={initialMorgen}
      initialDagKveld={initialDagKveld}
      initialFetchError={selectedResult.error}
      history={historyResult.data}
      today={today}
      thirtyDaysAgo={thirtyDaysAgo}
    />
  )
}

export default function SjekklistePage({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Daglige rutiner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fyll inn morgen- og kveldrutiner. Historikk vises under for
          Mattilsynet.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <SjekklisteContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
