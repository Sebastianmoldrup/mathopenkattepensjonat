import { View, StyleSheet } from '@react-pdf/renderer'
import { BookingLabelData } from '@/lib/admin/actions'
import { CatBox } from '../parts/CatBox'
import { OwnerBox } from '../parts/OwnerBox'

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  cell: {
    width: '48%',
    alignSelf: 'flex-start',
  },
})

export function ThreeCatLabel({ data }: { data: BookingLabelData }) {
  return (
    <View style={styles.root}>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <CatBox cat={data.cats[0]} />
        </View>
        <View style={styles.cell}>
          <CatBox cat={data.cats[1]} />
        </View>
        <View style={styles.cell}>
          <CatBox cat={data.cats[2]} />
        </View>
        <View style={styles.cell}>
          <OwnerBox data={data} />
        </View>
      </View>
    </View>
  )
}
