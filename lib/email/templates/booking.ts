import {
  AdminBooking,
  CAGE_LABELS,
  formatDateNO,
  nightsBetween,
} from '@/lib/admin/utils'

// ─── Social / review links ─────────────────────────────────────────────────────
// TODO: replace with the real page URLs once available.
const GOOGLE_REVIEW_URL = 'https://g.page/r/CaOJDBFt8hKoEBM/review'
const FACEBOOK_URL =
  'https://www.facebook.com/people/Mathopen-kattepensjonat/61586273038973/'
const INSTAGRAM_URL = 'https://www.instagram.com/mathopenkattepensjonat/'

// QR codes: upload a .webp with the exact same filename to the `logo` storage
// bucket to replace the placeholder image.
const GOOGLE_REVIEW_QR_URL =
  'https://cccacsaixeqraulymlwo.supabase.co/storage/v1/object/public/qr-codes/google-review-qr.webp'
const SNAPCHAT_QR_URL =
  'https://cccacsaixeqraulymlwo.supabase.co/storage/v1/object/public/qr-codes/snapchat-qr-code.webp'

// ─── Base template ────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f0eb;">
  <div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;max-width:600px;margin:0 auto;background:#ffffff;">

    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:#c8b49a;padding:24px 32px;">
      <!-- Top row: logo + name/tagline -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
        <tr>
          <td style="vertical-align:middle;width:108px;">
            <img
              src="https://cccacsaixeqraulymlwo.supabase.co/storage/v1/object/public/logo/logo.webp"
              alt="Mathopen Kattepensjonat"
              width="100"
              height="100"
              style="display:block;border-radius:12px;object-fit:cover;"
            />
          </td>
          <td style="vertical-align:middle;padding-left:18px;">
            <p style="margin:0 0 4px;font-size:17px;font-weight:bold;color:#fff;">Mathopen Kattepensjonat AS</p>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);font-style:italic;">Det trygge hjemmet mens du er bortreist</p>
          </td>
        </tr>
      </table>
      <!-- Bottom row: contact info -->
      <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.25);padding-top:14px;margin-top:14px;">
        <tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">📞 <a href="tel:+4747322279" style="color:#fff;text-decoration:none;">+47 473 22 279</a></td></tr>
        <tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">🏠 Storingavika 2, 5174 Mathopen</td></tr>
        <tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">🌐 <a href="https://mathopenkattepensjonat.no" style="color:#fff;text-decoration:none;">mathopenkattepensjonat.no</a></td></tr>
        <tr><td style="padding:2px 0;font-size:12px;color:rgba(255,255,255,0.9);">✉️ <a href="mailto:post@mathopenkattepensjonat.no" style="color:#fff;text-decoration:none;">post@mathopenkattepensjonat.no</a></td></tr>
      </table>
    </div>

  </div>
</body>
</html>`
}

// ─── Booking details block ────────────────────────────────────────────────────

function bookingDetailsBlock(booking: AdminBooking): string {
  const nights = nightsBetween(booking.date_from, booking.date_to)
  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (split)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)

  return `
    <div style="background:#f9f6f2;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e8e0d8;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Bookingdetaljer</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:5px 0;color:#666;font-size:14px;width:140px;">Innsjekk</td>
          <td style="padding:5px 0;font-weight:bold;font-size:14px;">${formatDateNO(booking.date_from)}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:14px;">Utsjekk</td>
          <td style="padding:5px 0;font-weight:bold;font-size:14px;">${formatDateNO(booking.date_to)}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:14px;">Varighet</td>
          <td style="padding:5px 0;font-weight:bold;font-size:14px;">${nights} ${nights === 1 ? 'natt' : 'netter'}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:14px;">Burtype</td>
          <td style="padding:5px 0;font-weight:bold;font-size:14px;">${cageLabel}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:14px;">Antall katter</td>
          <td style="padding:5px 0;font-weight:bold;font-size:14px;">${booking.num_cats}</td>
        </tr>
        <tr style="border-top:1px solid #ddd;">
          <td style="padding:10px 0 4px;color:#666;font-size:14px;">Totalpris</td>
          <td style="padding:10px 0 4px;font-weight:bold;font-size:16px;color:#2C3E50;">
            ${booking.price.toLocaleString('nb-NO')} kr
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;font-size:15px;font-weight:bold;color:#2C3E50;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px 16px;">
        💳 Betaling skjer ved innsjekk.
      </p>
    </div>
  `
}

// ─── Confirmed template ───────────────────────────────────────────────────────

export function bookingConfirmedTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? 'der'

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName}! 🐾</h2>

    <p style="font-size:15px;">
      Vi har nå registrert og bekreftet bookingen din hos <strong>Mathopen Kattepensjonat</strong>.
      Vi gleder oss til å ta imot katten(e) dine! Hos oss kan du reise bort med ro i hjertet,
      trygg på at katten(e) dine blir godt ivaretatt med masse kjærlighet, omsorg og oppmerksomhet.
    </p>

    ${bookingDetailsBlock(booking)}

    ${
      booking.special_instructions
        ? `
      <div style="background:#fff8e1;border-left:3px solid #f59e0b;padding:12px 16px;border-radius:4px;font-size:14px;margin-bottom:24px;">
        <strong>Spesielle instruksjoner registrert:</strong><br />
        ${booking.special_instructions}
      </div>
    `
        : ''
    }

    <!-- Important info -->
    <div style="border:1px solid #e8e0d8;border-radius:8px;overflow:hidden;margin-bottom:24px;">

      <div style="background:#f9f6f2;padding:12px 20px;border-bottom:1px solid #e8e0d8;">
        <p style="margin:0;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Viktige betingelser</p>
      </div>

      <div style="padding:16px 20px;font-size:14px;line-height:1.7;">

        <p style="margin:0 0 8px;"><strong>🐾 Helsekrav</strong></p>
        <ul style="margin:0 0 16px;padding-left:20px;color:#444;">
          <li>Vaksinasjon må være gjennomført innen de siste 12 månedene og minst 14 dager før innsjekk</li>
          <li>Vaksinasjonskort medbringes og oppbevares hos oss i hele oppholdet</li>
          <li>Vi anbefaler ormekur i forkant av oppholdet</li>
          <li>Hannkatter over 6 måneder skal være kastrerte</li>
          <li>Sterilisering av hunnkatter er anbefalt, men ikke et krav</li>
        </ul>

        <p style="margin:0 0 8px;"><strong>❌ Avbestilling</strong></p>
        <ul style="margin:0 0 8px;padding-left:20px;color:#444;">
          <li>Lavsesong: senest 24 timer før ankomst uten gebyr</li>
          <li>Høysesong: senest 7 dager før ankomst uten gebyr</li>
          <li>Deretter betales 50 % av oppholdets pris</li>
        </ul>
        <p style="margin:0;font-size:13px;color:#666;">
          Avbestilling via nettside eller e-post:
          <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
        </p>

      </div>
    </div>

    <p style="font-size:14px;color:#555;">
      Har du spørsmål? Ta gjerne kontakt — vi hjelper deg gjerne! 😊
    </p>
  `)
}

// ─── Cancelled by customer template ──────────────────────────────────────────

export function bookingCancelledTemplate(
  booking: AdminBooking,
  feeAmount?: number // 0 = no fee, >0 = fee applies
): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'
  const dateFrom = formatDateNO(booking.date_from)
  const dateTo = formatDateNO(booking.date_to)
  const hasFee = feeAmount !== undefined && feeAmount > 0

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName},</h2>

    <p style="font-size:15px;">
      Vi bekrefter at bookingen for <strong>${catNames}</strong>
      (${dateFrom} – ${dateTo}) hos <strong>Mathopen Kattepensjonat</strong> er avbestilt.
    </p>

    ${
      hasFee
        ? `
      <div style="background:#f9f6f2;border:1px solid #e8e0d8;border-radius:8px;padding:20px;font-size:14px;margin:24px 0;line-height:1.7;">
        <p style="margin:0 0 6px;font-weight:bold;color:#2C3E50;">Avbestillingsgebyr</p>
        <p style="margin:0 0 14px;color:#555;font-size:13px;">
          Avbestillingen ble gjort etter fristen for gebyrfri avbestilling.
          I henhold til våre betingelser gjelder et gebyr på 50 % av oppholdets pris.
        </p>
        <div style="background:#2C3E50;border-radius:8px;padding:14px 20px;margin:0 0 16px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;">Beløp å betale</p>
          <p style="margin:4px 0 0;color:#fff;font-size:28px;font-weight:bold;">${feeAmount.toLocaleString('nb-NO')} kr</p>
          <p style="margin:2px 0 0;color:rgba(255,255,255,0.6);font-size:12px;">50 % av oppholdets pris</p>
        </div>
        <div style="background:#fff;border:1px solid #e8e0d8;border-radius:6px;padding:16px;text-align:center;">
          <p style="margin:0 0 4px;font-weight:bold;color:#333;font-size:14px;">💸 Betal via Vipps</p>
          <p style="margin:0 0 12px;color:#666;font-size:13px;">Merk betalingen med ditt navn og «avbestillingsgebyr».</p>
          <div style="background:#ff5b24;border-radius:10px;padding:12px 20px;display:inline-block;">
            <p style="margin:0;color:#fff;font-size:11px;opacity:0.85;">Vipps bedriftsnummer</p>
            <p style="margin:4px 0 0;color:#fff;font-size:30px;font-weight:bold;letter-spacing:2px;">58823</p>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:11px;">Søk opp nummeret i Vipps-appen</p>
          </div>
          <p style="margin:10px 0 0;color:#666;font-size:13px;">⏰ Betalingsfrist: 14 dager fra denne e-posten.</p>
        </div>
        <p style="margin:12px 0 0;color:#888;font-size:13px;">
          Spørsmål? Ta kontakt på
          <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
        </p>
      </div>
    `
        : `
      <div style="background:#f9f6f2;border:1px solid #e8e0d8;border-radius:8px;padding:14px 20px;font-size:14px;margin:24px 0;">
        <p style="margin:0;color:#555;">✅ Avbestillingen er gebyrfri. Du belastes ingenting.</p>
      </div>
    `
    }

    <p style="font-size:14px;color:#555;">
      Har du spørsmål? Ta gjerne kontakt med oss på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
    </p>
  `)
}

// ─── Cancelled by admin template (no fee) ────────────────────────────────────

export function bookingCancelledByAdminTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'
  const dateFrom = formatDateNO(booking.date_from)
  const dateTo = formatDateNO(booking.date_to)

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName},</h2>

    <p style="font-size:15px;">
      Vi beklager å informere om at bookingen for <strong>${catNames}</strong>
      (${dateFrom} – ${dateTo}) hos <strong>Mathopen Kattepensjonat</strong>
      dessverre må avlyses fra vår side.
    </p>

    <div style="background:#f0fdf4;border-left:4px solid #4ade80;padding:14px 20px;border-radius:4px;font-size:14px;margin:24px 0;">
      <p style="margin:0;color:#166534;">✅ Du belastes ingenting. Avbestilling er kostnadsfri for deg.</p>
    </div>

    <p style="font-size:14px;color:#555;">
      Vi beklager ulempen dette medfører. Ta gjerne kontakt med oss om du ønsker å booke en ny periode eller har spørsmål.
    </p>
    <p style="font-size:14px;color:#555;">
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
    </p>
  `)
}

// ─── Fee reminder template ────────────────────────────────────────────────────

export function cancellationFeeReminderTemplate(
  booking: AdminBooking,
  feeAmount: number
): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'
  const dateFrom = formatDateNO(booking.date_from)
  const dateTo = formatDateNO(booking.date_to)

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName},</h2>

    <p style="font-size:15px;">
      Dette er en påminnelse om utestående avbestillingsgebyr for bookingen
      for <strong>${catNames}</strong> (${dateFrom} – ${dateTo}).
    </p>

    <div style="background:#f9f6f2;border:1px solid #e8e0d8;border-radius:8px;padding:20px;font-size:14px;margin:24px 0;line-height:1.7;">
      <p style="margin:0 0 6px;font-weight:bold;color:#2C3E50;">Utestående avbestillingsgebyr</p>
      <p style="margin:0 0 14px;color:#555;font-size:13px;">Vi minner om at følgende beløp fortsatt ikke er betalt.</p>
      <div style="background:#2C3E50;border-radius:8px;padding:14px 20px;margin:0 0 16px;text-align:center;">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;">Beløp å betale</p>
        <p style="margin:4px 0 0;color:#fff;font-size:28px;font-weight:bold;">${feeAmount.toLocaleString('nb-NO')} kr</p>
      </div>
      <div style="background:#fff;border:1px solid #e8e0d8;border-radius:6px;padding:16px;text-align:center;">
        <p style="margin:0 0 4px;font-weight:bold;color:#333;font-size:14px;">💸 Betal via Vipps</p>
        <p style="margin:0 0 12px;color:#666;font-size:13px;">Merk betalingen med ditt navn og «avbestillingsgebyr».</p>
        <div style="background:#ff5b24;border-radius:10px;padding:12px 20px;display:inline-block;">
          <p style="margin:0;color:#fff;font-size:11px;opacity:0.85;">Vipps bedriftsnummer</p>
          <p style="margin:4px 0 0;color:#fff;font-size:30px;font-weight:bold;letter-spacing:2px;">58823</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:11px;">Søk opp nummeret i Vipps-appen</p>
        </div>
        <p style="margin:10px 0 0;color:#666;font-size:13px;">⏰ Betalingsfrist: 14 dager fra opprinnelig avbestillingsbekreftelse.</p>
      </div>
      <p style="margin:12px 0 0;color:#888;font-size:13px;">
        Spørsmål? Ta kontakt på
        <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
        eller ring <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>
      </p>
    </div>

    <p style="font-size:14px;color:#555;">
      Ta kontakt på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring oss på <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>
    </p>
  `)
}

export function bookingRequestReceivedTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? 'der'

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName}! 🐾</h2>

    <p style="font-size:15px;">
      Vi har mottatt bookingforespørselen din hos <strong>Mathopen Kattepensjonat</strong>
      og vil behandle den så snart som mulig.
    </p>

    <div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:14px 20px;border-radius:4px;font-size:14px;margin:0 0 24px;line-height:1.7;">
      <p style="margin:0;font-weight:bold;color:#92400e;">Merk: Dette er ikke en bekreftet booking</p>
      <p style="margin:6px 0 0;color:#78350f;">
        Du vil motta en ny e-post fra oss når forespørselen er godkjent og bookingen er bekreftet.
      </p>
    </div>

    ${bookingDetailsBlock(booking)}

    <p style="font-size:14px;color:#555;">
      Har du spørsmål? Ta gjerne kontakt med oss på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a> 😊
    </p>
  `)
}

export function bookingUpdatedTemplate(
  booking: AdminBooking,
  changes: {
    dateChanged: boolean
    priceChanged: boolean
    oldDateFrom?: string
    oldDateTo?: string
    oldPrice?: number
  }
): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'

  const changesHtml = `
    <div style="background:#f9f6f2;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e8e0d8;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Endringer i din booking</p>
      <table style="width:100%;border-collapse:collapse;">
        ${
          changes.dateChanged
            ? `
        <tr>
          <td style="padding:6px 0;color:#666;font-size:14px;width:140px;">Tidligere datoer</td>
          <td style="padding:6px 0;font-size:14px;text-decoration:line-through;color:#999;">
            ${formatDateNO(changes.oldDateFrom!)} – ${formatDateNO(changes.oldDateTo!)}
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666;font-size:14px;">Nye datoer</td>
          <td style="padding:6px 0;font-weight:bold;font-size:14px;color:#166534;">
            ${formatDateNO(booking.date_from)} – ${formatDateNO(booking.date_to)}
          </td>
        </tr>
        `
            : ''
        }
        ${
          changes.priceChanged
            ? `
        <tr style="${changes.dateChanged ? 'border-top:1px solid #e8e0d8;' : ''}">
          <td style="padding:6px 0;color:#666;font-size:14px;">Tidligere pris</td>
          <td style="padding:6px 0;font-size:14px;text-decoration:line-through;color:#999;">
            ${changes.oldPrice!.toLocaleString('nb-NO')} kr
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666;font-size:14px;">Ny pris</td>
          <td style="padding:6px 0;font-weight:bold;font-size:14px;color:#166534;">
            ${booking.price.toLocaleString('nb-NO')} kr
          </td>
        </tr>
        `
            : ''
        }
      </table>
    </div>
  `

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName},</h2>

    <p style="font-size:15px;">
      Vi informerer om at din booking for <strong>${catNames}</strong>
      hos <strong>Mathopen Kattepensjonat</strong> er oppdatert.
    </p>

    ${changesHtml}

    ${bookingDetailsBlock(booking)}

    <p style="font-size:14px;color:#555;">
      Har du spørsmål til endringene? Ta gjerne kontakt med oss på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>
    </p>
  `)
}

export function bookingWaitlistTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;">Hei ${firstName},</h2>

    <p style="font-size:15px;">
      Vi har satt bookingen din for <strong>${catNames}</strong>
      hos <strong>Mathopen Kattepensjonat</strong> på venteliste.
    </p>

    <div style="background:#f9f6f2;border-left:4px solid #a855f7;padding:14px 20px;border-radius:4px;font-size:14px;margin:24px 0;line-height:1.7;">
      <p style="margin:0;font-weight:bold;color:#581c87;">Du er satt på venteliste</p>
      <p style="margin:8px 0 0;color:#6b21a8;">
        Vi vil ta kontakt dersom det blir ledig plass.
      </p>
    </div>

    ${bookingDetailsBlock(booking)}

    <p style="font-size:14px;color:#555;">
      Spørsmål? Ta kontakt på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>
    </p>
  `)
}

// ─── Completed template ───────────────────────────────────────────────────────

export function bookingCompletedTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? 'der'
  const cats = booking.cats ?? []
  const catNames =
    cats.length > 0 ? cats.map((c) => c.name).join(', ') : 'katten din'

  return baseTemplate(`
    <h2 style="color:#2C3E50;margin-top:0;text-transform:capitalize;">Hei ${firstName}! 🐾</h2>

    <p style="font-size:15px;">
      Nå er oppholdet for <strong>${catNames}</strong> hos
      <strong>Mathopen Kattepensjonat</strong> avsluttet. Tusen takk for tilliten!
    </p>

    ${bookingDetailsBlock(booking)}

    <!-- Review request -->
    <div style="border:1px solid #e8e0d8;border-radius:8px;overflow:hidden;margin:24px 0;">
      <div style="background:#f9f6f2;padding:12px 20px;border-bottom:1px solid #e8e0d8;">
        <p style="margin:0;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">
          Del opplevelsen din
        </p>
      </div>
      <div style="padding:20px;text-align:center;">
        <p style="margin:0 0 16px;font-size:14px;color:#444;">
          Vi setter utrolig stor pris på en vurdering på Google — det betyr
          mye for oss og hjelper andre å finne frem til oss.
        </p>
        <img
          src="${GOOGLE_REVIEW_QR_URL}"
          alt="QR-kode for Google-vurdering"
          width="160"
          height="160"
          style="display:block;margin:0 auto 16px;border-radius:8px;"
        />
        <a
          href="${GOOGLE_REVIEW_URL}"
          style="display:inline-block;background:#2C3E50;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 24px;border-radius:6px;"
        >
          ⭐ Skriv en vurdering på Google
        </a>
      </div>
    </div>

    <!-- Social follow -->
    <div style="border:1px solid #e8e0d8;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#f9f6f2;padding:12px 20px;border-bottom:1px solid #e8e0d8;">
        <p style="margin:0;font-size:13px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.5px;">
          Følg oss for oppdateringer
        </p>
      </div>
      <div style="padding:20px;">
        <p style="margin:0 0 16px;font-size:14px;color:#444;">
          Vi legger jevnlig ut bilder og oppdateringer fra kattepensjonatet på
          Facebook, Instagram og Snapchat.
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-size:14px;">
              📘 <a href="${FACEBOOK_URL}" style="color:#c8b49a;font-weight:bold;">Følg oss på Facebook</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;">
              📷 <a href="${INSTAGRAM_URL}" style="color:#c8b49a;font-weight:bold;">Følg oss på Instagram</a>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:16px;">
          <img
            src="${SNAPCHAT_QR_URL}"
            alt="QR-kode for Snapchat"
            width="160"
            height="200"
            style="display:block;margin:0 auto 8px;border-radius:8px;object-fit:cover;"
          />
          <p style="margin:0;font-size:13px;color:#666;">👻 Legg oss til på Snapchat</p>
        </div>
      </div>
    </div>

    <p style="font-size:14px;color:#555;">
      Vi håper å se dere igjen snart! Har du spørsmål? Ta gjerne kontakt på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a> 😊
    </p>
  `)
}
