import sharp from 'sharp'
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
          console.error(`[pdfUtils] fetch failed for ${url}: ${res.status} ${res.statusText}`)
          return
        }
        const buffer = Buffer.from(await res.arrayBuffer())
        // Normalize to baseline JPEG — react-pdf's parser rejects progressive
        // JPEGs and other non-standard JPEG variants with "Unknown version"
        let outBuffer: Buffer
        try {
          outBuffer = await sharp(buffer).jpeg({ quality: 90, progressive: false }).toBuffer()
        } catch {
          outBuffer = buffer
        }
        base64Map.set(url, `data:image/jpeg;base64,${outBuffer.toString('base64')}`)
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
