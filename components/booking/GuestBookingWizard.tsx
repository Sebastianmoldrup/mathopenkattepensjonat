'use client'

import { useEffect, useState } from 'react'
import { BookingWithCats } from '@/lib/booking/types'
import {
  GuestWizardState,
  guestStorage,
  authedStorage,
} from '@/lib/booking/wizardStorage'
import { CatCountStep } from './CatCountStep'
import { DateRangeSelection } from './DateRangeSelection'
import { CageSelection } from './CageSelection'
import { GuestBookingSummary } from './GuestBookingSummary'
import { StepIndicator } from './StepIndicator'

const STEPS = [
  { key: 'count', label: 'Antall' },
  { key: 'dates', label: 'Periode' },
  { key: 'cage', label: 'Burtype' },
  { key: 'summary', label: 'Oppsummering' },
] as const

interface Props {
  bookings: BookingWithCats[]
  onAuthenticated: () => void
}

export function GuestBookingWizard({ bookings, onAuthenticated }: Props) {
  const [state, setState] = useState<GuestWizardState>(guestStorage.load())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(guestStorage.load())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) guestStorage.save(state)
  }, [state, hydrated])

  function update(partial: Partial<GuestWizardState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function goTo(step: GuestWizardState['step']) {
    update({ step })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Called when user logs in from the summary auth dialog
  // Transfer guest state (dates + cage) to authed state and hand off
  function handleLoginSuccess() {
    const authedState = authedStorage.fromGuest(state)
    authedStorage.save(authedState)
    guestStorage.clear()
    onAuthenticated()
  }

  if (!hydrated) return null

  const currentIndex = STEPS.findIndex((s) => s.key === state.step)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-0 py-6 sm:space-y-8 sm:px-4 sm:py-8">
      <StepIndicator steps={[...STEPS]} currentIndex={currentIndex} />

      <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
        {state.step === 'count' && (
          <CatCountStep
            onSelect={(count) => {
              update({ catCount: count, cageType: null })
              goTo('dates')
            }}
          />
        )}

        {state.step === 'dates' && (
          <DateRangeSelection
            numCats={state.catCount}
            selectedCatIds={[]}
            selectedCats={[]}
            bookings={bookings}
            dateFrom={state.dateFrom}
            dateTo={state.dateTo}
            onChange={(from, to) =>
              update({ dateFrom: from, dateTo: to, cageType: null })
            }
            onNext={() => goTo('cage')}
            onBack={() => goTo('count')}
          />
        )}

        {state.step === 'cage' && state.dateFrom && state.dateTo && (
          <CageSelection
            numCats={state.catCount}
            dateFrom={state.dateFrom}
            dateTo={state.dateTo}
            selectedCageType={state.cageType}
            onSelect={(type, count) =>
              update({ cageType: type, cageCount: count })
            }
            onNext={() => goTo('summary')}
            onBack={() => goTo('dates')}
          />
        )}

        {state.step === 'summary' &&
          state.dateFrom &&
          state.dateTo &&
          state.cageType && (
            <GuestBookingSummary
              catCount={state.catCount}
              dateFrom={state.dateFrom}
              dateTo={state.dateTo}
              cageType={state.cageType}
              cageCount={state.cageCount}
              onBack={() => goTo('cage')}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
      </div>
    </div>
  )
}
