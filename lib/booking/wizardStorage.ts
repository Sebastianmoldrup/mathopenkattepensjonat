export const GUEST_KEY = 'booking_guest'
export const AUTHED_KEY = 'booking_authed'

export interface GuestWizardState {
  step: 'count' | 'dates' | 'cage' | 'summary'
  catCount: number
  dateFrom: string | null
  dateTo: string | null
  cageType: import('./types').CageType | null
  cageCount: number
}

export interface AuthedWizardState {
  step: 'cats' | 'dates' | 'cage' | 'summary'
  selectedCatIds: string[]
  dateFrom: string | null
  dateTo: string | null
  cageType: import('./types').CageType | null
  cageCount: number
  specialInstructions: string
  wantsOutdoorCage: boolean
  waitlistRequested: boolean
}

export const GUEST_DEFAULTS: GuestWizardState = {
  step: 'count',
  catCount: 1,
  dateFrom: null,
  dateTo: null,
  cageType: null,
  cageCount: 1,
}

export const AUTHED_DEFAULTS: AuthedWizardState = {
  step: 'cats',
  selectedCatIds: [],
  dateFrom: null,
  dateTo: null,
  cageType: null,
  cageCount: 1,
  specialInstructions: '',
  wantsOutdoorCage: false,
  waitlistRequested: false,
}

function safeGet<T>(key: string, defaults: T): T {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) } as T
  } catch {
    return defaults
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function safeClear(key: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(key)
  } catch {}
}

export const guestStorage = {
  load: (): GuestWizardState => safeGet(GUEST_KEY, GUEST_DEFAULTS),
  save: (s: GuestWizardState) => safeSet(GUEST_KEY, s),
  clear: () => safeClear(GUEST_KEY),
}

export const authedStorage = {
  load: (): AuthedWizardState => safeGet(AUTHED_KEY, AUTHED_DEFAULTS),
  save: (s: AuthedWizardState) => safeSet(AUTHED_KEY, s),
  clear: () => safeClear(AUTHED_KEY),

  // Hydrate authed state from guest state after login
  // Preserves dates and cage, resets cats
  fromGuest: (guest: GuestWizardState): AuthedWizardState => ({
    ...AUTHED_DEFAULTS,
    dateFrom: guest.dateFrom,
    dateTo: guest.dateTo,
    cageType: guest.cageType,
    cageCount: guest.cageCount,
  }),
}

export function clearAllWizardState() {
  safeClear(GUEST_KEY)
  safeClear(AUTHED_KEY)
}
