'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Cat,
  CageType,
  BookingState,
  BookingStep,
  INITIAL_BOOKING_STATE,
  BookingWithCats,
} from '@/lib/booking/types'
import { getUpcomingYearBookings } from '@/lib/booking/actions'
import { CatBehaviorData } from '@/lib/booking/behaviorActions'
import { BookingGate } from './BookingGate'
import { CatSelection } from './CatSelection'
import { DateRangeSelection } from './DateRangeSelection'
import { CageSelection } from './CageSelection'
import { CatBehaviorStep } from './CatBehaviorStep'
import { BookingSummary } from './BookingSummary'
import { WaitlistSummary } from './WaitlistSummary'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

// ─── Step metadata ─────────────────────────────────────────────────────────────

const BOOKING_STEPS: { key: BookingStep; label: string }[] = [
  { key: 'cats', label: 'Katter' },
  { key: 'behavior', label: 'Atferd' },
  { key: 'dates', label: 'Datoer' },
  { key: 'cage', label: 'Bur' },
  { key: 'summary', label: 'Oppsummering' },
]

const WAITLIST_STEPS: { key: BookingStep; label: string }[] = [
  { key: 'cats', label: 'Katter' },
  { key: 'behavior', label: 'Atferd' },
  { key: 'dates', label: 'Datoer' },
  { key: 'waitlist-dates', label: 'Ønsket periode' },
  { key: 'waitlist-cage', label: 'Bur' },
  { key: 'waitlist-summary', label: 'Oppsummering' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingWizard() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [cats, setCats] = useState<Cat[]>([])
  const [bookings, setBookings] = useState<BookingWithCats[]>([])
  const [state, setState] = useState<BookingState>({
    ...INITIAL_BOOKING_STATE,
    step: 'cats',
  })
  const [cageCount, setCageCount] = useState<number>(1)
  const [behaviorData, setBehaviorData] = useState<CatBehaviorData[]>([])
  const [wantsOutdoorCage, setWantsOutdoorCage] = useState(false)
  const [isWaitlist, setIsWaitlist] = useState(false)

  const [waitlistDateFrom, setWaitlistDateFrom] = useState<Date | null>(null)
  const [waitlistDateTo, setWaitlistDateTo] = useState<Date | null>(null)
  const [waitlistCageType, setWaitlistCageType] = useState<CageType | null>(
    null
  )
  const [waitlistCageCount, setWaitlistCageCount] = useState<number>(1)

  const handleReady = useCallback(async (uid: string, userCats: Cat[]) => {
    setUserId(uid)
    setCats(userCats)
    const upcoming = await getUpcomingYearBookings()
    setBookings(upcoming)
  }, [])

  function updateState(partial: Partial<BookingState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function goTo(step: BookingStep) {
    updateState({ step })
  }

  function handleConfirmed() {
    setState(INITIAL_BOOKING_STATE)
    setCageCount(1)
    setBehaviorData([])
    setWantsOutdoorCage(false)
    setIsWaitlist(false)
    router.push('/minside')
  }

  function handleWaitlist() {
    setWaitlistDateFrom(null)
    setWaitlistDateTo(null)
    setWaitlistCageType(null)
    setWaitlistCageCount(1)
    setIsWaitlist(true)
    goTo('waitlist-dates')
  }

  function handleWaitlistFromCage() {
    // Transfer dates from normal flow to waitlist
    setWaitlistDateFrom(state.dateFrom)
    setWaitlistDateTo(state.dateTo)
    setWaitlistCageType(null)
    setWaitlistCageCount(1)
    setIsWaitlist(true)
    goTo('waitlist-cage')
  }

  const STEPS = isWaitlist ? WAITLIST_STEPS : BOOKING_STEPS
  const currentStepIndex = STEPS.findIndex((s) => s.key === state.step)
  const selectedCats = cats.filter((c) => state.selectedCatIds.includes(c.id))

  return (
    <div className="mx-auto w-full min-w-[300px] max-w-4xl space-y-6 px-0 py-6 sm:space-y-8 sm:px-4 sm:py-8">
      <BookingGate onReady={handleReady} />

      {userId && (
        <>
          {/* Step indicator */}
          <nav aria-label="Bookingsteg" className="px-3 sm:px-0">
            <ol className="flex w-full items-center">
              {STEPS.map((step, i) => {
                const isCompleted = i < currentStepIndex
                const isCurrent = i === currentStepIndex

                return (
                  <li
                    key={step.key}
                    className="flex min-w-0 flex-1 items-center last:flex-none"
                  >
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs',
                          isCompleted
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isCurrent
                              ? 'border-primary bg-background text-primary'
                              : 'border-muted-foreground/30 bg-background text-muted-foreground'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span
                        className={cn(
                          'whitespace-nowrap text-center text-[10px] font-medium leading-tight sm:text-xs',
                          isCurrent ? 'text-primary' : 'text-muted-foreground',
                          !isCurrent && 'invisible sm:visible'
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          'mx-1 mb-4 h-0.5 flex-1 transition-colors sm:mx-2',
                          i < currentStepIndex
                            ? 'bg-primary'
                            : 'bg-muted-foreground/20'
                        )}
                      />
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* Step content */}
          <div className="mx-0 rounded-xl border bg-card p-4 shadow-sm sm:mx-0 sm:rounded-2xl sm:p-6">
            {state.step === 'cats' && (
              <CatSelection
                cats={cats}
                selectedCatIds={state.selectedCatIds}
                onChange={(ids) =>
                  updateState({ selectedCatIds: ids, cageType: null })
                }
                onNext={() => goTo('behavior')}
              />
            )}

            {state.step === 'behavior' && (
              <CatBehaviorStep
                cats={selectedCats}
                behaviorData={behaviorData}
                onChange={setBehaviorData}
                wantsOutdoorCage={wantsOutdoorCage}
                onOutdoorCageChange={setWantsOutdoorCage}
                onNext={() => goTo('dates')}
                onBack={() => goTo('cats')}
              />
            )}

            {state.step === 'dates' && (
              <DateRangeSelection
                key="dates"
                numCats={state.selectedCatIds.length}
                selectedCatIds={state.selectedCatIds}
                selectedCats={selectedCats}
                bookings={bookings}
                dateFrom={state.dateFrom}
                dateTo={state.dateTo}
                onChange={(from, to) =>
                  updateState({ dateFrom: from, dateTo: to, cageType: null })
                }
                onNext={() => goTo('cage')}
                onBack={() => goTo('behavior')}
                onWaitlist={handleWaitlist}
              />
            )}

            {state.step === 'cage' && state.dateFrom && state.dateTo && (
              <CageSelection
                numCats={state.selectedCatIds.length}
                dateFrom={state.dateFrom}
                dateTo={state.dateTo}
                bookings={bookings}
                selectedCageType={state.cageType}
                onSelect={(type, count) => {
                  updateState({ cageType: type })
                  setCageCount(count)
                }}
                onNext={() => goTo('summary')}
                onBack={() => goTo('dates')}
                onWaitlist={handleWaitlistFromCage}
              />
            )}

            {state.step === 'summary' &&
              state.dateFrom &&
              state.dateTo &&
              state.cageType && (
                <BookingSummary
                  userId={userId}
                  selectedCats={selectedCats}
                  dateFrom={state.dateFrom}
                  dateTo={state.dateTo}
                  cageType={state.cageType}
                  cageCount={cageCount}
                  specialInstructions={state.specialInstructions}
                  bookings={bookings}
                  behaviorData={behaviorData}
                  wantsOutdoorCage={wantsOutdoorCage}
                  onInstructionsChange={(v) =>
                    updateState({ specialInstructions: v })
                  }
                  onBack={() => goTo('cage')}
                  onConfirmed={handleConfirmed}
                />
              )}

            {state.step === 'waitlist-dates' && (
              <DateRangeSelection
                key="waitlist-dates"
                numCats={state.selectedCatIds.length}
                selectedCatIds={[]}
                selectedCats={[]}
                bookings={[]}
                dateFrom={waitlistDateFrom}
                dateTo={waitlistDateTo}
                isWaitlist={true}
                onChange={(from, to) => {
                  setWaitlistDateFrom(from)
                  setWaitlistDateTo(to)
                }}
                onNext={() => goTo('waitlist-cage')}
                onBack={() => {
                  setIsWaitlist(false)
                  goTo('dates')
                }}
                onWaitlist={() => {}}
              />
            )}

            {state.step === 'waitlist-cage' &&
              waitlistDateFrom &&
              waitlistDateTo && (
                <CageSelection
                  numCats={state.selectedCatIds.length}
                  dateFrom={waitlistDateFrom}
                  dateTo={waitlistDateTo}
                  bookings={[]}
                  selectedCageType={waitlistCageType}
                  ignoreCapacity={true}
                  onSelect={(type, count) => {
                    setWaitlistCageType(type)
                    setWaitlistCageCount(count)
                  }}
                  onNext={() => goTo('waitlist-summary')}
                  onBack={() => goTo('waitlist-dates')}
                />
              )}

            {state.step === 'waitlist-summary' &&
              waitlistDateFrom &&
              waitlistDateTo &&
              waitlistCageType && (
                <WaitlistSummary
                  selectedCats={selectedCats}
                  dateFrom={waitlistDateFrom}
                  dateTo={waitlistDateTo}
                  cageType={waitlistCageType}
                  cageCount={waitlistCageCount}
                  behaviorData={behaviorData}
                  wantsOutdoorCage={wantsOutdoorCage}
                  specialInstructions={state.specialInstructions}
                  onInstructionsChange={(v) =>
                    updateState({ specialInstructions: v })
                  }
                  onBack={() => goTo('waitlist-cage')}
                  onConfirmed={handleConfirmed}
                />
              )}
          </div>
        </>
      )}
    </div>
  )
}
