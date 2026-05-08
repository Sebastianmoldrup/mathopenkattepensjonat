'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cat, BookingWithCats } from '@/lib/booking/types'
import {
  AuthedWizardState,
  AUTHED_DEFAULTS,
  authedStorage,
} from '@/lib/booking/wizardStorage'
import { CatSelection } from './CatSelection'
import { DateRangeSelection } from './DateRangeSelection'
import { CageSelection } from './CageSelection'
import { BookingSummary } from './BookingSummary'
import { StepIndicator } from './StepIndicator'

const STEPS = [
  { key: 'cats', label: 'Katter' },
  { key: 'dates', label: 'Periode' },
  { key: 'cage', label: 'Burtype' },
  { key: 'summary', label: 'Oppsummering' },
] as const

interface Props {
  userId: string
  userEmail: string
  userFirstName: string
  cats: Cat[]
  bookings: BookingWithCats[]
}

export function AuthedBookingWizard({
  userId,
  userEmail,
  userFirstName,
  cats: initialCats,
  bookings,
}: Props) {
  const router = useRouter()
  const [cats, setCats] = useState<Cat[]>(initialCats)
  const [state, setState] = useState<AuthedWizardState>(authedStorage.load())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = authedStorage.load()

    // Validate saved cat IDs against actual cats
    if (saved.selectedCatIds.length > 0) {
      const validIds = initialCats.map((c) => c.id)
      saved.selectedCatIds = saved.selectedCatIds.filter((id) =>
        validIds.includes(id)
      )
    }

    setState(saved)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) authedStorage.save(state)
  }, [state, hydrated])

  function update(partial: Partial<AuthedWizardState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function goTo(step: AuthedWizardState['step']) {
    update({ step })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleConfirmed() {
    authedStorage.clear()
    setState({ ...AUTHED_DEFAULTS })
    router.push('/booking/bekreftet')
  }

  if (!hydrated) return null

  const selectedCats = cats.filter((c) => state.selectedCatIds.includes(c.id))
  const numCats = state.selectedCatIds.length || 1
  const currentIndex = STEPS.findIndex((s) => s.key === state.step)

  // Check if current cageType is still valid for selected cat count
  // 2x standard split only valid for 3 cats, suite valid for 1-3, standard/senior valid for 1-2
  // A cage is compatible if it appears in the options list for the selected cat count
  // For 3 cats: suite and standard (2x split) are valid
  // For 1-2 cats: standard, senior_comfort, suite are valid
  function isCageCompatible(cageType: string | null, count: number): boolean {
    if (!cageType) return false
    if (cageType === 'suite') return true
    if (count === 3) return cageType === 'standard' // only standard (2x) for 3 cats
    return cageType === 'standard' || cageType === 'senior_comfort' // 1-2 cats
  }

  const prefilledCageValid = isCageCompatible(state.cageType, numCats)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-0 py-6 sm:space-y-8 sm:px-4 sm:py-8">
      <StepIndicator steps={[...STEPS]} currentIndex={currentIndex} />

      <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
        {/* Step 1: Velg katter */}
        {state.step === 'cats' && (
          <CatSelection
            cats={cats}
            catCount={null}
            selectedCatIds={state.selectedCatIds}
            showBack={false}
            onChange={(ids) => update({ selectedCatIds: ids })}
            onCatsUpdated={(updated) => setCats(updated)}
            onNext={() => {
              goTo('dates')
            }}
            onBack={() => goTo('dates')}
          />
        )}

        {/* Step 2: Periode */}
        {state.step === 'dates' && (
          <DateRangeSelection
            numCats={numCats}
            selectedCatIds={state.selectedCatIds}
            selectedCats={selectedCats}
            bookings={bookings}
            dateFrom={state.dateFrom}
            dateTo={state.dateTo}
            onChange={(from, to) =>
              update({ dateFrom: from, dateTo: to, cageType: null })
            }
            onNext={() => goTo('cage')}
            onBack={() => goTo('cats')}
          />
        )}

        {/* Step 3: Burtype */}
        {state.step === 'cage' && state.dateFrom && state.dateTo && (
          <CageSelection
            numCats={numCats}
            dateFrom={state.dateFrom}
            dateTo={state.dateTo}
            selectedCageType={prefilledCageValid ? state.cageType : null}
            onSelect={(type, count) =>
              update({ cageType: type, cageCount: count })
            }
            onNext={() => goTo('summary')}
            onBack={() => goTo('dates')}
          />
        )}

        {/* Step 4: Oppsummering */}
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
              cageCount={state.cageCount}
              numCats={numCats}
              specialInstructions={state.specialInstructions}
              bookings={bookings}
              wantsOutdoorCage={state.wantsOutdoorCage}
              waitlistRequested={state.waitlistRequested}
              onInstructionsChange={(v) => update({ specialInstructions: v })}
              onOutdoorCageChange={(v) => update({ wantsOutdoorCage: v })}
              onWaitlistChange={(v) => update({ waitlistRequested: v })}
              onBack={() => goTo('cage')}
              onConfirmed={handleConfirmed}
              userEmail={userEmail}
              userFirstName={userFirstName}
            />
          )}
      </div>
    </div>
  )
}
