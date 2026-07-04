'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import {
  AlertTriangle,
  CalendarIcon,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DailyRoutineForm } from '@/components/admin/forms/DailyRoutineForm'
import { adminGetDailyRoutines } from '@/lib/admin/formActions'
import {
  DailyRoutine,
  DailyRoutineFields,
  RoutinePeriod,
  isRoutineComplete,
} from '@/lib/admin/formTypes'
import { cn } from '@/lib/utils'

interface SjekklisteClientProps {
  initialDate: string
  initialMorgen: DailyRoutine | null
  initialDagKveld: DailyRoutine | null
  initialFetchError: boolean
  history: DailyRoutine[]
  today: string
  thirtyDaysAgo: string
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function SjekklisteClient({
  initialDate,
  initialMorgen,
  initialDagKveld,
  initialFetchError,
  history: initialHistory,
  today,
  thirtyDaysAgo,
}: SjekklisteClientProps) {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [morgen, setMorgen] = useState(initialMorgen)
  const [dagKveld, setDagKveld] = useState(initialDagKveld)
  const [fetchError, setFetchError] = useState(initialFetchError)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState(initialHistory)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [dirty, setDirty] = useState({ morgen: false, dagKveld: false })
  const [pendingDate, setPendingDate] = useState<string | null>(null)
  const requestRef = useRef(0)

  const isDirty = dirty.morgen || dirty.dagKveld
  const isToday = selectedDate === today
  const selectedDateObj = parseISO(selectedDate)

  async function loadDate(newDate: string) {
    const token = ++requestRef.current
    setIsLoading(true)
    const result = await adminGetDailyRoutines(newDate, newDate)
    if (token !== requestRef.current) return // a newer request superseded this one
    setIsLoading(false)
    if (result.error) {
      setFetchError(true)
      return
    }
    setMorgen(result.data.find((r) => r.period === 'morgen') ?? null)
    setDagKveld(result.data.find((r) => r.period === 'dag_kveld') ?? null)
  }

  function performSwitch(newDate: string) {
    setSelectedDate(newDate)
    setMorgen(null)
    setDagKveld(null)
    setDirty({ morgen: false, dagKveld: false })
    setFetchError(false)
    router.push('/admin/sjekkliste?dato=' + newDate, { scroll: false })
    loadDate(newDate)
  }

  function goToDate(newDate: string) {
    if (newDate === selectedDate) return
    if (isDirty) {
      setPendingDate(newDate)
      return
    }
    performSwitch(newDate)
  }

  function confirmSwitch() {
    if (!pendingDate) return
    const target = pendingDate
    setPendingDate(null)
    performSwitch(target)
  }

  function navigateDay(direction: -1 | 1) {
    const d = parseISO(selectedDate)
    d.setDate(d.getDate() + direction)
    goToDate(localDateStr(d))
  }

  function retry() {
    setFetchError(false)
    loadDate(selectedDate)
  }

  function handleSaved(period: RoutinePeriod, fields: DailyRoutineFields) {
    // Historikk only ever shows strictly-past dates within the 30-day window
    if (selectedDate < thirtyDaysAgo || selectedDate >= today) return
    setHistory((prev) => {
      const idx = prev.findIndex(
        (r) => r.date === selectedDate && r.period === period
      )
      const updatedRow: DailyRoutine = {
        ...fields,
        id: idx >= 0 ? prev[idx].id : `${selectedDate}-${period}`,
        date: selectedDate,
        period,
        updated_at: new Date().toISOString(),
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = updatedRow
        return next
      }
      return [...prev, updatedRow]
    })
  }

  const pastDates = [
    ...new Set(history.filter((r) => r.date !== today).map((r) => r.date)),
  ].slice(0, 14)

  return (
    <div className="space-y-8">
      {/* Date navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
        <div>
          <p className="text-sm font-semibold capitalize">
            {format(selectedDateObj, 'EEEE d. MMMM yyyy', { locale: nb })}
          </p>
          {isToday && (
            <p className="text-xs text-muted-foreground">I dag</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateDay(-1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            ‹ Forrige
          </button>

          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                className="h-9 min-w-[150px] justify-start gap-2 px-3 text-left text-sm font-normal"
              >
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{format(selectedDateObj, 'dd.MM.yyyy')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <Calendar
                mode="single"
                selected={selectedDateObj}
                onSelect={(d) => {
                  if (!d) return
                  setPickerOpen(false)
                  goToDate(localDateStr(d))
                }}
                locale={nb}
              />
            </PopoverContent>
          </Popover>

          <button
            type="button"
            onClick={() => goToDate(today)}
            disabled={isLoading || isToday}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            I dag
          </button>
          <button
            type="button"
            onClick={() => navigateDay(1)}
            disabled={isLoading}
            className="rounded-md border border-border/40 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            Neste ›
          </button>
        </div>
      </div>

      {/* Forms / loading / error */}
      {fetchError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <p className="text-sm text-red-800">
            Kunne ikke hente data for denne datoen. Prøv igjen.
          </p>
          <Button variant="outline" size="sm" onClick={retry}>
            Prøv på nytt
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <DailyRoutineForm
            key={selectedDate + '-morgen'}
            date={selectedDate}
            period="morgen"
            existing={morgen}
            onDirtyChange={(d) =>
              setDirty((prev) => ({ ...prev, morgen: d }))
            }
            onSaved={(fields) => handleSaved('morgen', fields)}
          />
          <DailyRoutineForm
            key={selectedDate + '-dag_kveld'}
            date={selectedDate}
            period="dag_kveld"
            existing={dagKveld}
            onDirtyChange={(d) =>
              setDirty((prev) => ({ ...prev, dagKveld: d }))
            }
            onSaved={(fields) => handleSaved('dag_kveld', fields)}
          />
        </div>
      )}

      {/* History */}
      {pastDates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold">
            Historikk (siste 30 dager)
          </h2>
          <div className="divide-y overflow-hidden rounded-xl border">
            {pastDates.map((date) => {
              const morgenRow = history.find(
                (r) => r.date === date && r.period === 'morgen'
              )
              const dagKveldRow = history.find(
                (r) => r.date === date && r.period === 'dag_kveld'
              )
              const morgenOk = morgenRow ? isRoutineComplete(morgenRow) : false
              const dagKveldOk = dagKveldRow
                ? isRoutineComplete(dagKveldRow)
                : false
              const bothDone = morgenOk && dagKveldOk
              const isSelected = date === selectedDate

              return (
                <button
                  type="button"
                  key={date}
                  onClick={() => goToDate(date)}
                  className={cn(
                    'flex w-full items-center justify-between bg-card px-4 py-3 text-left transition-colors hover:bg-muted/20',
                    isSelected && 'ring-2 ring-inset ring-primary/40'
                  )}
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
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Unsaved changes confirm dialog */}
      <Dialog
        open={pendingDate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDate(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ulagrede endringer</DialogTitle>
            <DialogDescription>
              Du har ulagrede endringer i morgen- og/eller dag/kveld-rutinen
              for{' '}
              {format(selectedDateObj, 'd. MMMM', { locale: nb })}. Hvis du
              bytter dato nå, går endringene tapt.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button
              variant="destructive"
              onClick={confirmSwitch}
              className="flex-1"
            >
              Bytt dato likevel
            </Button>
            <Button variant="outline" onClick={() => setPendingDate(null)}>
              Bli værende
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
