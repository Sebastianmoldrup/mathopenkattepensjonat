import { View, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { SingleCatLabel } from './variants/SingleCatLabel'
import { TwoCatLabel } from './variants/TwoCatLabel'
import { ThreeCatLabel } from './variants/ThreeCatLabel'
import { colors } from './utils/styles'

const styles = StyleSheet.create({
  halfPage: {
    height: '50%',
    padding: 14,
    backgroundColor: colors.bg,
    display: 'flex',
    flexDirection: 'column',
  },
})

interface LabelPageProps {
  data: BookingLabelData
}

export function LabelPage({ data }: LabelPageProps) {
  const catCount = data.cats.length

  return (
    <View style={styles.halfPage}>
      {catCount <= 1 && <SingleCatLabel data={data} />}
      {catCount === 2 && <TwoCatLabel data={data} />}
      {catCount >= 3 && <ThreeCatLabel data={data} />}
    </View>
  )
}
