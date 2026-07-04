import { StyleSheet } from '@react-pdf/renderer'

export const colors = {
  bg: '#faf7f4',
  border: '#c9b99a',
  dark: '#3d2e1e',
  muted: '#7a6652',
  white: '#ffffff',
  cardBg: '#ffffff',
  accent: '#e8ddd1',
}

export const fontSizes = {
  label: 6,
  value: 8,
  catName: 10,
  small: 6,
}

export const shared = StyleSheet.create({
  halfPage: {
    width: '100%',
    height: '50%',
    padding: 12,
    backgroundColor: '#faf7f4',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    border: '1px solid #c9b99a',
    padding: 8,
  },
  labelText: {
    fontSize: 6,
    color: '#7a6652',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 8,
    color: '#3d2e1e',
    marginTop: 1,
  },
  catName: {
    fontSize: 10,
    color: '#3d2e1e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  field: {
    marginBottom: 3,
  },
  divider: {
    borderBottom: '0.5px solid #c9b99a',
    marginVertical: 3,
  },
  pill: {
    backgroundColor: '#e8ddd1',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 6,
    color: '#3d2e1e',
    fontWeight: 'bold',
  },
})
