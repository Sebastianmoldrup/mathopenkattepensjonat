'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { BulkBookingEntry } from '@/lib/admin/docTypes'
import { CAGE_LABELS } from '@/lib/admin/utils'

const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#333',
    padding: 36,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#c8b49a',
    borderBottomStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  headerSub: { fontSize: 8, color: '#888' },
  headerRight: { textAlign: 'right' },
  headerCount: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#c8b49a' },
  headerCountLabel: { fontSize: 7.5, color: '#aaa' },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f0eb',
    padding: '5 6',
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '5 6',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ebe4',
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#fafaf9',
  },
  // Columns — widths
  colDate: { width: 70 },
  colOwner: { width: 110 },
  colCats: { width: 110 },
  colCage: { width: 80 },
  colPrice: { width: 65, textAlign: 'right' },
  colStatus: { width: 60, textAlign: 'center' },
  // Text styles
  th: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#666' },
  td: { fontSize: 8, color: '#333' },
  tdSub: { fontSize: 7, color: '#999', marginTop: 1 },
  // Status badge
  statusConfirmed: {
    color: '#166534',
    backgroundColor: '#dcfce7',
    padding: '1 4',
    borderRadius: 3,
  },
  statusCompleted: {
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    padding: '1 4',
    borderRadius: 3,
  },
  // Summary
  summary: {
    marginTop: 16,
    padding: '10 12',
    backgroundColor: '#f9f6f2',
    border: '1 solid #e8e0d8',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2C3E50',
  },
  summaryLabel: { fontSize: 7, color: '#888', marginTop: 2 },
  // Legal
  legal: {
    marginTop: 12,
    fontSize: 7,
    color: '#aaa',
    lineHeight: 1.6,
    borderTopWidth: 1,
    borderTopColor: '#e8e0d8',
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: '#bbb' },
})

function formatDate(s: string): string {
  const [y, m, d] = s.split('-')
  return `${d}.${m}.${y}`
}

function nights(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 864e5)
}

interface BulkPDFProps {
  entries: BulkBookingEntry[]
  year: number
}

export function BulkBookingPDFDocument({ entries, year }: BulkPDFProps) {
  const totalRevenue = entries.reduce((s, e) => s + e.booking.price, 0)
  const totalNights = entries.reduce(
    (s, e) => s + nights(e.booking.date_from, e.booking.date_to),
    0
  )
  const generatedAt = new Date().toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header */}
        <View style={S.header}>
          <View style={S.headerLeft}>
            <Text style={S.headerTitle}>
              Bookingregister {year} — §5 Dokumentasjon
            </Text>
            <Text style={S.headerSub}>
              Mathopen Kattepensjonat AS · Storingavika 2, 5174 Mathopen ·
              Generert: {generatedAt}
            </Text>
          </View>
          <View style={S.headerRight}>
            <Text style={S.headerCount}>{entries.length}</Text>
            <Text style={S.headerCountLabel}>bookinger</Text>
          </View>
        </View>

        {/* Table header */}
        <View style={S.tableHeader}>
          <Text style={[S.th, S.colDate]}>Dato inn/ut</Text>
          <Text style={[S.th, S.colOwner]}>Eier</Text>
          <Text style={[S.th, S.colCats]}>Katter</Text>
          <Text style={[S.th, S.colCage]}>Bur</Text>
          <Text style={[S.th, S.colPrice]}>Pris</Text>
          <Text style={[S.th, S.colStatus]}>Status</Text>
        </View>

        {/* Table rows */}
        {entries.map((entry, i) => {
          const { booking, owner, cats } = entry
          const ownerName =
            `${owner.first_name ?? ''} ${owner.last_name ?? ''}`.trim() ||
            owner.email
          const cageLabel =
            booking.cage_count === 2
              ? '2× Std'
              : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)
          const catNames = (cats ?? []).map((c) => c.name).join(', ') || '—'
          const catChips = (cats ?? [])
            .filter((c) => c.id_chip)
            .map((c) => `${c.name}: ${c.id_chip}`)
            .join(', ')
          const n = nights(booking.date_from, booking.date_to)

          return (
            <View
              key={booking.id}
              style={[S.tableRow, i % 2 !== 0 ? S.tableRowAlt : {}]}
              wrap={false}
            >
              <View style={S.colDate}>
                <Text style={S.td}>{formatDate(booking.date_from)}</Text>
                <Text style={S.tdSub}>
                  {formatDate(booking.date_to)} ({n}n)
                </Text>
              </View>
              <View style={S.colOwner}>
                <Text style={S.td}>{ownerName}</Text>
                <Text style={S.tdSub}>{owner.phone ?? owner.email}</Text>
              </View>
              <View style={S.colCats}>
                <Text style={S.td}>{catNames}</Text>
                {catChips ? (
                  <Text style={S.tdSub}>Chip: {catChips}</Text>
                ) : null}
              </View>
              <View style={S.colCage}>
                <Text style={S.td}>{cageLabel}</Text>
                <Text style={S.tdSub}>
                  {booking.num_cats} katt{booking.num_cats !== 1 ? 'er' : ''}
                </Text>
              </View>
              <View style={S.colPrice}>
                <Text style={S.td}>
                  {booking.price.toLocaleString('nb-NO')} kr
                </Text>
              </View>
              <View style={S.colStatus}>
                <Text
                  style={[
                    S.td,
                    booking.status === 'completed'
                      ? S.statusCompleted
                      : S.statusConfirmed,
                  ]}
                >
                  {booking.status === 'completed' ? 'Gjennomf.' : 'Bekreftet'}
                </Text>
              </View>
            </View>
          )
        })}

        {/* Summary */}
        <View style={S.summary}>
          <View style={S.summaryItem}>
            <Text style={S.summaryValue}>{entries.length}</Text>
            <Text style={S.summaryLabel}>Totalt bookinger</Text>
          </View>
          <View style={S.summaryItem}>
            <Text style={S.summaryValue}>{totalNights}</Text>
            <Text style={S.summaryLabel}>Totalt netter</Text>
          </View>
          <View style={S.summaryItem}>
            <Text style={S.summaryValue}>
              {totalRevenue.toLocaleString('nb-NO')} kr
            </Text>
            <Text style={S.summaryLabel}>Total inntekt</Text>
          </View>
        </View>

        {/* Legal */}
        <Text style={S.legal}>
          Dette registeret er utarbeidet i henhold til Forskrift om hold av dyr
          i dyrepensjonat §5 (Dokumentasjon). Dokumentasjonen skal oppbevares i
          minimum 3 år og fremlegges for Mattilsynet på forespørsel. Kun
          bekreftede og gjennomførte bookinger er inkludert. Mathopen
          Kattepensjonat AS · post@mathopenkattepensjonat.no
        </Text>

        {/* Page footer */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>
            Mathopen Kattepensjonat AS — Konfidensielt — {year}
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
