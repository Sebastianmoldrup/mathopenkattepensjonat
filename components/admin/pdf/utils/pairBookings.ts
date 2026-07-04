export function pairBookings<T>(items: T[]): [T, T | null][] {
  const pairs: [T, T | null][] = []
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i], items[i + 1] ?? null])
  }
  return pairs
}
