'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  BookingState,
  BookingStep,
  Cat,
  BookingWithCats,
  INITIAL_BOOKING_STATE,
  SESSION_STORAGE_KEY,
} from '@/lib/booking/types'
import { getUpcomingYearBookings } from '@/lib/booking/actions'
import { CatCountStep } from './CatCountStep'
import { DateRangeSelection } from './DateRangeSelection'
import { CageSelection } from './CageSelection'
import { AuthGateStep } from './AuthGateStep'
import { CatSelection } from './CatSelection'
import { BookingSummary } from './BookingSummary'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'count', label: 'Antall' },
  { key: 'dates', label: 'Datoer' },
  { key: 'cage', label: 'Bur' },
  { key: 'auth', label: 'Innlogging' },
  { key: 'cats', label: 'Katter' },
  { key: 'summary', label: 'Oppsummering' },
]

// Steps shown in the progress indicator — differs based on auth state
const AUTHED_STEPS: BookingStep[] = ['cats', 'dates', 'cage', 'summary']
const GUEST_STEPS: BookingStep[] = ['count', 'dates', 'cage', 'cats', 'summary']

function loadState(): BookingState {
  if (typeof window === 'undefined') return INITIAL_BOOKING_STATE
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return INITIAL_BOOKING_STATE
    return { ...INITIAL_BOOKING_STATE, ...JSON.parse(raw) }
  } catch {
    return INITIAL_BOOKING_STATE
  }
}

function saveState(state: BookingState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function clearState() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {}
}

export function BookingWizard() {
  const router = useRouter()
  const [state, setState] = useState<BookingState>(INITIAL_BOOKING_STATE)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userFirstName, setUserFirstName] = useState<string | null>(null)
  const [cats, setCats] = useState<Cat[]>([])
  const [bookings, setBookings] = useState<BookingWithCats[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage and check auth on mount
  useEffect(() => {
    const saved = loadState()

    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        setUserEmail(user.email ?? '')
        // Fetch first name from users table
        const { data: profile } = await supabase
          .from('users')
          .select('first_name')
          .eq('id', user.id)
          .single()
        setUserFirstName(profile?.first_name ?? null)

        // Fetch cats
        const { data: userCats } = await supabase
          .from('cats')
          .select('id, name, breed, gender, age, image_url, owner_id')
          .eq('owner_id', user.id)
        setCats(userCats ?? [])

        // Fetch bookings
        const upcoming = await getUpcomingYearBookings()
        setBookings(upcoming)

        // Validate saved cat IDs against actual cats
        if (saved.selectedCatIds.length > 0 && userCats) {
          const validIds = userCats.map((c) => c.id)
          const filteredIds = saved.selectedCatIds.filter((id) =>
            validIds.includes(id)
          )
          saved.selectedCatIds = filteredIds
        }

        // If saved state was at auth step, move to cats since user is now logged in
        if (saved.step === 'auth') {
          saved.step = 'cats'
        }
        // Logged-in users skip count step entirely
        if (saved.step === 'count') {
          saved.step = 'cats'
        }
        // Reset catCount so authed flow allows free selection
        saved.catCount = null
      } else {
        // Not logged in — if state was past cage step, put them at auth
        if (saved.step === 'cats' || saved.step === 'summary') {
          saved.step = 'auth'
        }
      }

      setState(saved)
      setHydrated(true)
    }

    init()
  }, [])

  // Persist state to sessionStorage on every change
  useEffect(() => {
    if (hydrated) saveState(state)
  }, [state, hydrated])

  function updateState(partial: Partial<BookingState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function goTo(step: BookingStep) {
    updateState({ step })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthenticated = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)
    setUserEmail(user.email ?? '')

    const { data: profile } = await supabase
      .from('users')
      .select('first_name')
      .eq('id', user.id)
      .single()
    setUserFirstName(profile?.first_name ?? null)

    const { data: userCats } = await supabase
      .from('cats')
      .select('id, name, breed, gender, age, image_url, owner_id')
      .eq('owner_id', user.id)
    setCats(userCats ?? [])

    const upcoming = await getUpcomingYearBookings()
    setBookings(upcoming)

    updateState({ catCount: null })
    goTo('cats')
  }, [])

  function handleConfirmed() {
    router.push('/booking/bekreftet')
    clearState()
    setState(INITIAL_BOOKING_STATE)
  }

  if (!hydrated) return null

  const catSelectionBack =
    userId && !state.dateFrom
      ? undefined
      : () => {
          userId ? goTo('dates') : goTo('cage')
        }

  const selectedCats = cats.filter((c) => state.selectedCatIds.includes(c.id))

  // Determine visible step index (excluding auth when logged in)
  const visibleSteps = userId ? AUTHED_STEPS : GUEST_STEPS

  const currentVisibleIndex = visibleSteps.indexOf(state.step)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-0 py-6 sm:space-y-8 sm:px-4 sm:py-8">
      {/* Step indicator — progressive with pop-in animation */}
      <nav aria-label="Bookingsteg" className="px-3 sm:px-0">
        <ol className="flex w-full items-center">
          {visibleSteps.slice(0, currentVisibleIndex + 2).map((stepKey, i) => {
            const label = STEPS.find((s) => s.key === stepKey)?.label ?? ''
            const isCompleted = i < currentVisibleIndex
            const isCurrent = i === currentVisibleIndex
            const isNew = i === currentVisibleIndex + 1

            return (
              <li
                key={stepKey}
                className="flex min-w-0 flex-1 items-center last:flex-none"
                style={
                  isNew
                    ? {
                        animation:
                          'step-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                      }
                    : undefined
                }
              >
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold sm:h-8 sm:w-8 sm:text-xs',
                      'transition-colors duration-300',
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
                      'transition-colors duration-300',
                      isCurrent ? 'text-primary' : 'text-muted-foreground',
                      !isCurrent && 'invisible sm:visible'
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i <
                  Math.min(
                    currentVisibleIndex + 1,
                    visibleSteps.length - 1
                  ) && (
                  <div
                    className="mx-1 mb-4 h-0.5 flex-1 sm:mx-2"
                    style={{
                      background:
                        i < currentVisibleIndex
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--muted-foreground) / 0.2)',
                      transition: 'background 0.4s ease',
                    }}
                  />
                )}
              </li>
            )
          })}
        </ol>
        <style>{`
          @keyframes step-pop-in {
            0%   { opacity: 0; transform: scale(0.6) translateX(-6px); }
            100% { opacity: 1; transform: scale(1) translateX(0); }
          }
        `}</style>
      </nav>

      {/* Step content */}
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
        {state.step === 'count' && (
          <CatCountStep
            onSelect={(count) => {
              updateState({
                catCount: count,
                selectedCatIds: [],
                cageType: null,
              })
              goTo('dates')
            }}
          />
        )}

        {state.step === 'dates' &&
          (state.catCount !== null || state.selectedCatIds.length > 0) && (
            <DateRangeSelection
              numCats={(state.catCount ?? state.selectedCatIds.length) || 1}
              selectedCatIds={state.selectedCatIds}
              selectedCats={selectedCats}
              bookings={bookings}
              dateFrom={state.dateFrom}
              dateTo={state.dateTo}
              onChange={(from, to) =>
                updateState({ dateFrom: from, dateTo: to, cageType: null })
              }
              onNext={() => goTo('cage')}
              onBack={() => (userId ? goTo('cats') : goTo('count'))}
            />
          )}

        {state.step === 'cage' && state.dateFrom && state.dateTo && (
          <CageSelection
            numCats={(state.catCount ?? state.selectedCatIds.length) || 1}
            dateFrom={state.dateFrom}
            dateTo={state.dateTo}
            selectedCageType={state.cageType}
            onSelect={(type, count) =>
              updateState({ cageType: type, cageCount: count })
            }
            onNext={() => goTo(userId ? 'summary' : 'auth')}
            onBack={
              userId && !state.dateFrom
                ? undefined
                : () => (userId ? goTo('dates') : goTo('cage'))
            }
          />
        )}

        {state.step === 'auth' && (
          <AuthGateStep onAuthenticated={handleAuthenticated} />
        )}

        {state.step === 'cats' && userId && (
          <CatSelection
            cats={cats}
            catCount={null}
            selectedCatIds={state.selectedCatIds}
            onChange={(ids) => updateState({ selectedCatIds: ids })}
            onCatsUpdated={(updated) => setCats(updated)}
            onNext={() => {
              const count = state.selectedCatIds.length
              updateState({ catCount: count, cageType: null })
              goTo('dates')
            }}
            onBack={
              userId && !state.dateFrom
                ? undefined
                : () => (userId ? goTo('dates') : goTo('cage'))
            }
          />
        )}

        {state.step === 'summary' &&
          state.dateFrom &&
          state.dateTo &&
          state.cageType &&
          userId && (
            <BookingSummary
              userId={userId}
              selectedCats={selectedCats}
              dateFrom={state.dateFrom}
              dateTo={state.dateTo}
              cageType={state.cageType}
              cageCount={state.cageCount}
              numCats={(state.catCount ?? state.selectedCatIds.length) || 1}
              specialInstructions={state.specialInstructions}
              bookings={bookings}
              wantsOutdoorCage={state.wantsOutdoorCage}
              waitlistRequested={state.waitlistRequested}
              onInstructionsChange={(v) =>
                updateState({ specialInstructions: v })
              }
              onOutdoorCageChange={(v) => updateState({ wantsOutdoorCage: v })}
              onWaitlistChange={(v) => updateState({ waitlistRequested: v })}
              onBack={() => (userId ? goTo('cage') : goTo('cats'))}
              onConfirmed={handleConfirmed}
              userEmail={userEmail}
              userFirstName={userFirstName ?? ''}
            />
          )}
      </div>
    </div>
  )
}
