import { Jimp } from 'jimp'
import { BookingLabelData } from './actions'

export async function resolveImagesToBase64(
  bookings: BookingLabelData[]
): Promise<BookingLabelData[]> {
  const urls = new Set<string>()
  for (const booking of bookings) {
    for (const cat of booking.cats) {
      if (cat.image_url) urls.add(cat.image_url)
    }
  }

  const base64Map = new Map<string, string>()
  await Promise.all(
    Array.from(urls).map(async (url) => {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          console.error(`[pdfUtils] fetch failed for ${url}: ${res.status}`)
          return
        }
        const buffer = Buffer.from(await res.arrayBuffer())
        // Re-encode via jimp — normalises progressive JPEGs and non-standard
        // JPEG variants that react-pdf's parser rejects ("Unknown version")
        const image = await Jimp.read(buffer)
        const normalized = await image.getBuffer('image/jpeg')
        base64Map.set(url, `data:image/jpeg;base64,${normalized.toString('base64')}`)
      } catch (err) {
        console.error(`[pdfUtils] failed to process ${url}:`, err)
      }
    })
  )

  return bookings.map((booking) => ({
    ...booking,
    cats: booking.cats.map((cat) => ({
      ...cat,
      image_url: cat.image_url
        ? (base64Map.get(cat.image_url) ?? cat.image_url)
        : null,
    })),
  }))
}
