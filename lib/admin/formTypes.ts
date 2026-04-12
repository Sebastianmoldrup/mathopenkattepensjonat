// ─── Daily Routine ────────────────────────────────────────────────────────────

export type RoutinePeriod = 'morgen' | 'dag_kveld'

export interface DailyRoutine {
  id: string
  date: string
  period: RoutinePeriod
  visuell_sjekk: boolean
  atferd_kontroll: boolean
  medisiner_gitt: boolean
  pelsstell: boolean
  aktivisering: boolean
  kattedo_sjekk: boolean
  kattedo_tømt: boolean
  rengjøring_bur: boolean
  vann_gitt: boolean
  fôr_gitt: boolean
  temperatur_ventilasjon: boolean
  medisinering_notater: string | null
  avvik_beskrivelse: string | null
  tiltak_iverksatt: boolean
  veterinær_kontaktet: boolean
  gulv_rengjort: boolean
  bur_rengjort: boolean
  kattesand_skiftet: boolean
  skåler_rengjort: boolean
  avfall_tømt: boolean
  bekreftet_navn: string | null
  klokkeslett: string | null
  updated_at: string
}

export type DailyRoutineFields = Omit<
  DailyRoutine,
  'id' | 'date' | 'period' | 'updated_at'
>

export function emptyRoutine(): DailyRoutineFields {
  return {
    visuell_sjekk: false,
    atferd_kontroll: false,
    medisiner_gitt: false,
    pelsstell: false,
    aktivisering: false,
    kattedo_sjekk: false,
    kattedo_tømt: false,
    rengjøring_bur: false,
    vann_gitt: false,
    fôr_gitt: false,
    temperatur_ventilasjon: false,
    medisinering_notater: null,
    avvik_beskrivelse: null,
    tiltak_iverksatt: false,
    veterinær_kontaktet: false,
    gulv_rengjort: false,
    bur_rengjort: false,
    kattesand_skiftet: false,
    skåler_rengjort: false,
    avfall_tømt: false,
    bekreftet_navn: null,
    klokkeslett: null,
  }
}

// ─── Checkin / Checkout ───────────────────────────────────────────────────────

export interface CheckinLog {
  id: string
  booking_id: string
  inn_eier_identifisert: boolean
  inn_kontakt_registrert: boolean
  inn_nødkontakt_registrert: boolean
  inn_vaksinasjon_kontrollert: boolean
  inn_helseopplysninger_mottatt: boolean
  inn_medisiner_mottatt: boolean
  inn_fôr_avklart: boolean
  inn_avtale_signert: boolean
  inn_frisk: boolean
  inn_ingen_sår: boolean
  inn_øyne_nese_pels: boolean
  inn_normal_atferd: boolean
  inn_avvik_observert: boolean
  inn_bur_rengjort: boolean
  inn_overflater_desinfisert: boolean
  inn_kattedo_rengjort: boolean
  inn_ren_kattesand: boolean
  inn_skåler_vasket: boolean
  inn_rene_tepper: boolean
  inn_signatur: string | null
  inn_dato_klokkeslett: string | null
  inn_completed_at: string | null
  ut_rom_tomt: boolean
  ut_kattedo_tømt: boolean
  ut_kattedo_rengjort: boolean
  ut_skåler_vasket: boolean
  ut_tepper_vask: boolean
  ut_bur_rengjort: boolean
  ut_overflater_desinfisert: boolean
  ut_utstyr_klart: boolean
  ut_frisk: boolean
  ut_normal_appetitt: boolean
  ut_ingen_skader: boolean
  ut_behandlinger_beskrivelse: string | null
  ut_eier_informert: boolean
  ut_avvik_forklart: boolean
  ut_medisiner_levert: boolean
  ut_avvik_merknader: string | null
  ut_signatur: string | null
  ut_dato_klokkeslett: string | null
  ut_completed_at: string | null
  updated_at: string
}

export function emptyCheckinLog(bookingId: string): Partial<CheckinLog> {
  return { booking_id: bookingId }
}

// ─── Health Log ───────────────────────────────────────────────────────────────

export interface HealthLog {
  id: string
  booking_id: string
  cat_id: string
  årsak_daglig_tilsyn: boolean
  årsak_atferd: boolean
  årsak_mistanke_sykdom: boolean
  årsak_skade: boolean
  årsak_medisinering: boolean
  årsak_annet: boolean
  obs_normal: boolean
  obs_slapp: boolean
  obs_urolig: boolean
  obs_aggressiv: boolean
  obs_spiser_normalt: boolean
  obs_spiser_mindre: boolean
  obs_spiser_ikke: boolean
  obs_drikker_normalt: boolean
  obs_drikker_avvik: boolean
  obs_avføring_normal: boolean
  obs_diare: boolean
  obs_forstoppelse: boolean
  obs_blod: boolean
  obs_urin_avvik: boolean
  obs_oppkast: boolean
  obs_halthet: boolean
  obs_sår: boolean
  obs_øre_øye_nese: boolean
  obs_pels_hud: boolean
  obs_annet_beskrivelse: string | null
  avvik_beskrivelse: string | null
  tiltak_ekstra_obs: boolean
  tiltak_isolert: boolean
  tiltak_rengjøring: boolean
  tiltak_medisin: boolean
  tiltak_veterinær: boolean
  tiltak_eier_kontaktet: boolean
  tiltak_beskrivelse: string | null
  vet_ikke_nødvendig: boolean
  vet_telefon: boolean
  vet_undersøkt: boolean
  vet_navn_klinikk: string | null
  vet_dato: string | null
  eier_informert_samme_dag: boolean
  eier_informert_senere: boolean
  eier_oppfølging_avtalt: boolean
  oppfølging_avsluttet: boolean
  oppfølging_fortsetter: boolean
  oppfølging_plan: string | null
  signatur_navn: string | null
  signatur_dato: string | null
  created_at: string
}
