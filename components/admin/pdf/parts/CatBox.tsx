import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelCat } from '@/lib/admin/actions'
import { colors, fontSizes } from '../utils/styles'

const PHOTO_SIZE = 65

const styles = StyleSheet.create({
  // flex:1 = equal width in row; no alignSelf so default stretch makes both cards equal height
  container: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
    padding: 7,
    flexDirection: 'column',
    gap: 3,
  },
  header: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
  },
  // Wrapper clips the image to the fixed box — objectFit alone doesn't clip in react-pdf
  photoClip: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 4,
    overflow: 'hidden',
    flexShrink: 0,
    border: `0.5px solid ${colors.border}`,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    objectFit: 'cover',
  },
  photoPlaceholder: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 4,
    border: `0.5px solid ${colors.border}`,
    backgroundColor: '#e8ddd1',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  catName: {
    fontSize: fontSizes.catName,
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  divider: {
    borderBottom: `0.5px solid ${colors.border}`,
    marginBottom: 3,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 1,
  },
  field: {
    marginBottom: 1,
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
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
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

export function CatBox({ cat }: { cat: BookingLabelCat }) {
  const idChip = cat.id_chip && cat.id_chip !== '' ? cat.id_chip : '-'
  const insurance = cat.insurance_number && cat.insurance_number !== '' ? cat.insurance_number : '-'
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        </View>
      </View>
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
  )
}
