import { View, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { CatBox } from '../parts/CatBox'
import { OwnerBox } from '../parts/OwnerBox'

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 7,
  },
  catsRow: {
    flexDirection: 'row',
    gap: 7,
    // default alignItems:stretch makes both cards equal height (tallest card sets the row height)
  },
})

export function TwoCatLabel({ data }: { data: BookingLabelData }) {
  return (
    <View style={styles.root}>
      <View style={styles.catsRow}>
        <CatBox cat={data.cats[0]} />
        <CatBox cat={data.cats[1]} />
      </View>
      <OwnerBox data={data} />
    </View>
  )
}
