export type AdminBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export interface AdminBooking {
  id: string
  date_from: string
  date_to: string
  cage_type: string
  cage_count: number
  num_cats: number
  price: number
  status: AdminBookingStatus
  special_instructions: string | null
  admin_notes: string | null
  created_at: string
  user_id: string
  user_email: string
  user_first_name: string | null
  user_last_name: string | null
  user_phone: string | null
  user_address: string | null
  user_emergency_contact: string | null
  wants_outdoor_cage: boolean
  cats?: AdminCat[]
}

export interface AdminCat {
  id: string
  name: string
  breed: string | null
  image_url: string | null
  medical_notes: string | null
  diet: string | null
  behavior_notes: string | null
  age: string | null
}

export interface DailyChecklist {
  id: string
  date: string
  feeding_done: boolean
  medication_done: boolean
  litter_cleaned: boolean
  cage_inspection_done: boolean
  notes: string | null
  completed_by: string | null
  updated_at: string
}

export interface RevenueStats {
  month: string
  revenue: number
  booking_count: number
  cancellation_count: number
}

export const STATUS_LABELS: Record<AdminBookingStatus, string> = {
  pending: 'Venter',
  confirmed: 'Bekreftet',
  completed: 'Gjennomført',
  cancelled: 'Avbestilt',
}

export const STATUS_COLORS: Record<AdminBookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
}

export const CAGE_LABELS: Record<string, string> = {
  standard: 'Standard',
  senior_comfort: 'Senior & Komfort',
  suite: 'Suite',
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDateNO(s: string): string {
  return parseDateStr(s).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatMonthNO(s: string): string {
  const [y, m] = s.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })
}

export function nightsBetween(from: string, to: string): number {
  return Math.round(
    (parseDateStr(to).getTime() - parseDateStr(from).getTime()) / 864e5
  )
}
