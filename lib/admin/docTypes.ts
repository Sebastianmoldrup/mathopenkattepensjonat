export interface DocCat {
  id?: string
  name: string
  breed: string | null
  gender: string | null
  id_chip: string | null
  medical_notes?: string | null
  diet?: string | null
}

export interface DocOwner {
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  address: string | null
  emergency_contact?: string | null
}

export interface DocBooking {
  id: string
  date_from: string
  date_to: string
  cage_type: string
  cage_count: number
  num_cats: number
  price: number
  status: string
  special_instructions?: string | null
  admin_notes?: string | null
  created_at: string
}

export interface DocHealthLog {
  id: string
  cat_id: string
  avvik_beskrivelse: string | null
  tiltak_beskrivelse: string | null
  vet_undersøkt: boolean
  vet_navn_klinikk: string | null
  vet_dato: string | null
  created_at: string
}

export interface DocCheckinLog {
  inn_vaksinasjon_kontrollert: boolean
  inn_dato_klokkeslett: string | null
  inn_signatur: string | null
  inn_avvik_observert: boolean
  ut_dato_klokkeslett: string | null
  ut_signatur: string | null
  ut_avvik_merknader: string | null
}

export interface BookingDocumentation {
  booking: DocBooking
  owner: DocOwner
  cats: DocCat[] | null
  health_logs: DocHealthLog[] | null
  checkin_log: DocCheckinLog | null
}

export interface BulkBookingEntry {
  booking: DocBooking
  owner: DocOwner
  cats: DocCat[] | null
}
