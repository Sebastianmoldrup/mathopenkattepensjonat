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
        // Resize to thumbnail and re-encode as baseline JPEG — full-res phone
        // photos (3–4 MB) embedded as base64 crash the browser with OOM.
        // 200px covers the 65pt PDF display size at ~2× print density.
        const image = await Jimp.read(buffer)
        image.cover({ w: 200, h: 200 })
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
