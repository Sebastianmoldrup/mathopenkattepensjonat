import { Suspense } from 'react'
import { adminGetDailyRoutines } from '@/lib/admin/formActions'
import { DailyRoutineForm } from '@/components/admin/forms/DailyRoutineForm'
import { DailyRoutine } from '@/lib/admin/formTypes'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isRoutineComplete(r: DailyRoutine): boolean {
  return (
    r.visuell_sjekk &&
    r.atferd_kontroll &&
    r.vann_gitt &&
    r.fôr_gitt &&
    r.kattedo_sjekk &&
    r.temperatur_ventilasjon &&
    r.aktivisering
  )
}

async function SjekklisteContent() {
  const today = localDateStr(new Date())
  const thirtyDaysAgo = localDateStr(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  )

  const routines = await adminGetDailyRoutines(thirtyDaysAgo, today)

  const todayMorgen =
    routines.find((r) => r.date === today && r.period === 'morgen') ?? null
  const todayDagKveld =
    routines.find((r) => r.date === today && r.period === 'dag_kveld') ?? null

  const pastDates = [
    ...new Set(routines.filter((r) => r.date !== today).map((r) => r.date)),
  ].slice(0, 14)

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <DailyRoutineForm date={today} period="morgen" existing={todayMorgen} />
        <DailyRoutineForm
          date={today}
          period="dag_kveld"
          existing={todayDagKveld}
        />
      </div>

      {pastDates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold">
            Historikk (siste 30 dager)
          </h2>
          <div className="divide-y overflow-hidden rounded-xl border">
            {pastDates.map((date) => {
              const morgen = routines.find(
                (r) => r.date === date && r.period === 'morgen'
              )
              const dagKveld = routines.find(
                (r) => r.date === date && r.period === 'dag_kveld'
              )
              const morgenOk = morgen ? isRoutineComplete(morgen) : false
              const dagKveldOk = dagKveld ? isRoutineComplete(dagKveld) : false
              const bothDone = morgenOk && dagKveldOk

              return (
                <div
                  key={date}
                  className="flex items-center justify-between bg-card px-4 py-3 hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    {bothDone ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <p className="text-sm font-medium">
                      {new Date(date + 'T12:00:00').toLocaleDateString(
                        'nb-NO',
                        {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-full border px-2 py-0.5',
                        morgenOk
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      )}
                    >
                      {morgenOk ? '✓' : '○'} Morgen
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-full border px-2 py-0.5',
                        dagKveldOk
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      )}
                    >
                      {dagKveldOk ? '✓' : '○'} Dag/Kveld
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default function SjekklistePage() {
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
        <SjekklisteContent />
      </Suspense>
    </div>
  )
}
