'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { BookingDocumentation } from '@/lib/admin/docTypes'
import { CAGE_LABELS } from '@/lib/admin/utils'

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#333',
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    lineHeight: 1.35,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#c8b49a',
    borderBottomStyle: 'solid',
  },
  headerLeft: { flex: 1 },
  headerRight: { textAlign: 'right' },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  headerOrg: { fontSize: 8, color: '#888' },
  headerMeta: { fontSize: 7.5, color: '#bbb', marginTop: 2 },
  headerStatus: {
    fontSize: 8,
    color: '#888',
    marginBottom: 2,
  },
  headerPrice: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2C3E50',
  },
  headerNights: { fontSize: 7.5, color: '#aaa' },

  // ── Two-column body layout ───────────────────────────────────────────────────
  body: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  col: { flex: 1 },

  // ── Section ─────────────────────────────────────────────────────────────────
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    backgroundColor: '#c8b49a',
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 4,
  },
  sectionTitleAlert: {
    backgroundColor: '#92400e',
  },
  sectionTitleOk: {
    backgroundColor: '#166534',
  },

  // ── Data rows ───────────────────────────────────────────────────────────────
  row: { flexDirection: 'row', marginBottom: 2 },
  label: { width: 88, color: '#888', fontSize: 8 },
  value: { flex: 1, color: '#333', fontSize: 8 },
  valueBold: {
    flex: 1,
    color: '#2C3E50',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Cat card ─────────────────────────────────────────────────────────────────
  catCard: {
    backgroundColor: '#fafaf9',
    border: '1 solid #e8e0d8',
    borderRadius: 3,
    padding: '4 7',
    marginBottom: 4,
  },
  catName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2C3E50',
    marginBottom: 2,
  },

  // ── Check row ────────────────────────────────────────────────────────────────
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  checkBox: {
    width: 9,
    height: 9,
    border: '1 solid #ccc',
    borderRadius: 2,
    marginRight: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkFilled: { backgroundColor: '#4ade80', borderColor: '#16a34a' },
  checkMark: { fontSize: 6.5, color: '#fff' },
  checkLabel: { fontSize: 8, color: '#333', flex: 1 },

  // ── Health log ───────────────────────────────────────────────────────────────
  healthCard: {
    border: '1 solid #fde68a',
    borderRadius: 3,
    padding: '4 7',
    marginBottom: 4,
    backgroundColor: '#fffbeb',
  },
  healthTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#92400e',
    marginBottom: 2,
  },

  // ── Legal + footer ───────────────────────────────────────────────────────────
  legal: {
    marginTop: 8,
    padding: '5 8',
    backgroundColor: '#f9f6f2',
    border: '1 solid #e8e0d8',
    borderRadius: 3,
  },
  legalText: { fontSize: 7, color: '#aaa', lineHeight: 1.5 },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e8e0d8',
    borderTopStyle: 'solid',
    paddingTop: 4,
  },
  footerText: { fontSize: 6.5, color: '#bbb' },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string | null | undefined): string {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  if (!y || !m || !d) return s
  return `${d}.${m}.${y}`
}

function nights(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 864e5)
}

function genderNO(g: string | null): string {
  if (!g) return '—'
  const lower = g.toLowerCase()
  if (lower === 'male' || lower === 'hann') return 'Hann'
  if (lower === 'female' || lower === 'hunn') return 'Hunn'
  return g
}

function Check({ checked }: { checked: boolean }) {
  return (
    <View style={[S.checkBox, checked ? S.checkFilled : {}]}>
      {checked && <Text style={S.checkMark}>✓</Text>}
    </View>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <View style={S.row}>
      <Text style={S.label}>{label}</Text>
      <Text style={bold ? S.valueBold : S.value}>{value}</Text>
    </View>
  )
}

function SectionTitle({
  text,
  variant,
}: {
  text: string
  variant?: 'alert' | 'ok'
}) {
  const extra =
    variant === 'alert'
      ? S.sectionTitleAlert
      : variant === 'ok'
        ? S.sectionTitleOk
        : {}
  return <Text style={[S.sectionTitle, extra]}>{text}</Text>
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function BookingPDFDocument({ doc }: { doc: BookingDocumentation }) {
  const { booking, owner, cats, health_logs, checkin_log } = doc
  const n = nights(booking.date_from, booking.date_to)
  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (split)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)
  const ownerName =
    `${owner.first_name ?? ''} ${owner.last_name ?? ''}`.trim() || owner.email
  const hasHealthIssues = health_logs && health_logs.length > 0
  const generatedAt = new Date().toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={S.header}>
          <View style={S.headerLeft}>
            <Text style={S.headerTitle}>Bookingdokumentasjon — §5</Text>
            <Text style={S.headerOrg}>
              Mathopen Kattepensjonat AS · Storingavika 2, 5174 Mathopen
            </Text>
            <Text style={S.headerMeta}>
              Generert: {generatedAt} · ID: {booking.id}
            </Text>
          </View>
          <View style={S.headerRight}>
            <Text style={S.headerStatus}>
              {formatDate(booking.date_from)} → {formatDate(booking.date_to)}
            </Text>
            <Text style={S.headerPrice}>
              {booking.price.toLocaleString('nb-NO')} kr
            </Text>
            <Text style={S.headerNights}>
              {n} {n === 1 ? 'natt' : 'netter'} · {cageLabel}
            </Text>
          </View>
        </View>

        {/* ── Two-column body ─────────────────────────────────────────────── */}
        <View style={S.body}>
          {/* LEFT COLUMN */}
          <View style={S.col}>
            {/* §5a — Katter */}
            <View style={S.section}>
              <SectionTitle text="§5a — Dyreopplysninger" />
              {(cats ?? []).map((cat, i) => (
                <View key={i} style={S.catCard}>
                  <Text style={S.catName}>{cat.name}</Text>
                  <Row label="Art" value="Katt (Felis catus)" />
                  <Row label="Kjønn" value={genderNO(cat.gender)} />
                  {cat.breed && <Row label="Rase" value={cat.breed} />}
                  <Row
                    label="Chip-ID"
                    value={cat.id_chip ?? 'Ikke registrert'}
                  />
                  {cat.medical_notes && (
                    <Row label="Medisinsk" value={cat.medical_notes} />
                  )}
                  {cat.diet && <Row label="Diett" value={cat.diet} />}
                </View>
              ))}
            </View>

            {/* §5b — Datoer */}
            <View style={S.section}>
              <SectionTitle text="§5b — Ankomst og tilbakelevering" />
              <Row label="Ankomst" value={formatDate(booking.date_from)} bold />
              <Row
                label="Tilbakelevering"
                value={formatDate(booking.date_to)}
                bold
              />
              <Row
                label="Innsjekk sign."
                value={checkin_log?.inn_dato_klokkeslett ?? '—'}
              />
              <Row
                label="Utsjekk sign."
                value={checkin_log?.ut_dato_klokkeslett ?? '—'}
              />
              {checkin_log?.inn_signatur && (
                <Row label="Ansvarlig" value={checkin_log.inn_signatur} />
              )}
            </View>

            {/* §5c — Eier */}
            <View style={S.section}>
              <SectionTitle text="§5c — Eiers opplysninger" />
              <Row label="Navn" value={ownerName} bold />
              <Row label="Telefon" value={owner.phone ?? '—'} />
              <Row label="E-post" value={owner.email} />
              <Row label="Adresse" value={owner.address ?? '—'} />
              {owner.emergency_contact && (
                <Row label="Nødkontakt" value={owner.emergency_contact} />
              )}
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={S.col}>
            {/* §5e — Smittestatus */}
            <View style={S.section}>
              <SectionTitle
                text="§5e — Smittestatus ved innsjekk"
                variant={
                  checkin_log?.inn_vaksinasjon_kontrollert ? 'ok' : undefined
                }
              />
              <View style={S.checkRow}>
                <Check
                  checked={checkin_log?.inn_vaksinasjon_kontrollert ?? false}
                />
                <Text style={S.checkLabel}>Gyldig vaksinasjon kontrollert</Text>
              </View>
              <View style={S.checkRow}>
                <Check checked={!(checkin_log?.inn_avvik_observert ?? false)} />
                <Text style={S.checkLabel}>
                  Ingen tegn på smittsom sykdom ved ankomst
                </Text>
              </View>
              {checkin_log?.ut_avvik_merknader && (
                <Row
                  label="Merknad utsjekk"
                  value={checkin_log.ut_avvik_merknader}
                />
              )}
            </View>

            {/* §5f — Helse og veterinær */}
            <View style={S.section}>
              <SectionTitle
                text={
                  hasHealthIssues
                    ? `§5f — Avvik registrert (${health_logs!.length})`
                    : '§5f — Veterinær / helseavvik'
                }
                variant={hasHealthIssues ? 'alert' : 'ok'}
              />
              {hasHealthIssues ? (
                health_logs!.map((log, i) => {
                  const catName =
                    cats?.find((c) => c.id === log.cat_id)?.name ?? '—'
                  return (
                    <View key={i} style={S.healthCard}>
                      <Text style={S.healthTitle}>
                        {catName} ·{' '}
                        {new Date(log.created_at).toLocaleDateString('nb-NO')}
                      </Text>
                      {log.avvik_beskrivelse && (
                        <Row
                          label="Beskrivelse"
                          value={log.avvik_beskrivelse}
                        />
                      )}
                      {log.tiltak_beskrivelse && (
                        <Row label="Tiltak" value={log.tiltak_beskrivelse} />
                      )}
                      <Row
                        label="Veterinær"
                        value={
                          log.vet_undersøkt
                            ? `Ja — ${log.vet_navn_klinikk ?? ''}`
                            : 'Nei'
                        }
                      />
                    </View>
                  )
                })
              ) : (
                <View style={S.checkRow}>
                  <Check checked={true} />
                  <Text style={S.checkLabel}>
                    Ingen veterinærbehandling eller avvik under oppholdet
                  </Text>
                </View>
              )}
            </View>

            {/* Special instructions — only if present */}
            {booking.special_instructions && (
              <View style={S.section}>
                <SectionTitle text="Spesielle instruksjoner" />
                <Text style={{ fontSize: 8, color: '#555', lineHeight: 1.4 }}>
                  {booking.special_instructions}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Legal notice ────────────────────────────────────────────────── */}
        <View style={S.legal}>
          <Text style={S.legalText}>
            Utarbeidet iht. Forskrift om hold av dyr i dyrepensjonat §5
            (Dokumentasjon). Skal oppbevares i minimum 3 år og fremlegges for
            Mattilsynet på forespørsel. Mathopen Kattepensjonat AS · Org.nr:
            [fyll inn] · post@mathopenkattepensjonat.no
          </Text>
        </View>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>
            Mathopen Kattepensjonat AS — Konfidensielt
          </Text>
          <Text
            style={S.footerText}
            render={({ pageNumber, totalPages }) =>
              `Side ${pageNumber} av ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
