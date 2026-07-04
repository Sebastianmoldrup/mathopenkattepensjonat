import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { OwnerBox } from '../parts/OwnerBox'
import { colors, fontSizes } from '../utils/styles'

const PHOTO_W = 65
const PHOTO_H = 65

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 7,
  },
  // Single unified card — photo + info together
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  // Clip wrapper prevents objectFit:cover overflow in react-pdf
  photoClip: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 4,
    overflow: 'hidden',
    flexShrink: 0,
    border: `0.5px solid ${colors.border}`,
  },
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
    objectFit: 'cover',
  },
  photoPlaceholder: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 4,
    border: `0.5px solid ${colors.border}`,
    backgroundColor: '#e8ddd1',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    gap: 3,
  },
  catName: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  divider: {
    borderBottom: `0.5px solid ${colors.border}`,
    marginBottom: 4,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 1,
  },
  field: {
    marginBottom: 2,
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
    marginTop: 0.5,
  },
  pill: {
    backgroundColor: colors.accent,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  pillText: {
    fontSize: fontSizes.label,
    color: colors.dark,
    fontWeight: 'bold',
  },
})

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

export function SingleCatLabel({ data }: { data: BookingLabelData }) {
  const cat = data.cats[0]
  if (!cat) return null

  const idChip = cat.id_chip && cat.id_chip !== '' ? cat.id_chip : '-'
  const insurance = cat.insurance_number && cat.insurance_number !== '' ? cat.insurance_number : '-'

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        {cat.image_url ? (
          <View style={styles.photoClip}>
            <Image src={cat.image_url} style={styles.photo} />
          </View>
        ) : (
          <View style={styles.photoPlaceholder} />
        )}
        <View style={styles.info}>
          <Text style={styles.catName}>{cat.name}</Text>
          <View style={styles.divider} />
          <View style={styles.inlineRow}>
            {cat.breed && <Field label="Rase" value={cat.breed} />}
            {cat.age != null && <Field label="Alder" value={`${cat.age}`} />}
          </View>
          <Field label="ID-chip" value={idChip} />
          <Field label="Forsikring" value={insurance} />
          {cat.gets_medication && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                Medisinering{cat.medication_details ? `: ${cat.medication_details}` : ''}
              </Text>
            </View>
          )}
          {cat.diet && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>Diett: {cat.diet}</Text>
            </View>
          )}
          {cat.medical_notes && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>Merknader: {cat.medical_notes}</Text>
            </View>
          )}
        </View>
      </View>
      <OwnerBox data={data} />
    </View>
  )
}
