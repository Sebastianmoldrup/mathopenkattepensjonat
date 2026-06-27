import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { colors, fontSizes } from '../utils/styles'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
    padding: 7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionLabel: {
    fontSize: fontSizes.small,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 'bold',
  },
  dates: {
    flexDirection: 'row',
    gap: 10,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  dateLabel: {
    fontSize: fontSizes.label,
    color: colors.muted,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: fontSizes.value,
    color: colors.dark,
    fontWeight: 'bold',
  },
  divider: {
    borderBottom: `0.5px solid ${colors.border}`,
    marginBottom: 5,
  },
  fields: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  field: {
    minWidth: 80,
  },
  label: {
    fontSize: fontSizes.label,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: 'bold',
  },
  value: {
    fontSize: fontSizes.value,
    color: colors.dark,
    marginTop: 1,
  },
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

interface OwnerBoxProps {
  data: BookingLabelData
  compact?: boolean
}

export function OwnerBox({ data, compact = false }: OwnerBoxProps) {
  const ownerName = [data.owner.first_name, data.owner.last_name].filter(Boolean).join(' ')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Eierinformasjon</Text>
        <View style={styles.dates}>
          <View style={styles.dateGroup}>
            <Text style={styles.dateLabel}>Inn:</Text>
            <Text style={styles.dateValue}>{formatDate(data.booking.date_from)}</Text>
          </View>
          <View style={styles.dateGroup}>
            <Text style={styles.dateLabel}>Ut:</Text>
            <Text style={styles.dateValue}>{formatDate(data.booking.date_to)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.fields}>
        {ownerName && (
          <View style={styles.field}>
            <Text style={styles.label}>Navn</Text>
            <Text style={styles.value}>{ownerName}</Text>
          </View>
        )}
        {data.owner.phone && (
          <View style={styles.field}>
            <Text style={styles.label}>Kontakt</Text>
            <Text style={styles.value}>{data.owner.phone}</Text>
          </View>
        )}
        {data.owner.emergency_contact && (
          <View style={styles.field}>
            <Text style={styles.label}>Nødkontakt</Text>
            <Text style={styles.value}>{data.owner.emergency_contact}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
