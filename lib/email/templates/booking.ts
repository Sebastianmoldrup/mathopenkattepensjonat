import {
  AdminBooking,
  CAGE_LABELS,
  formatDateNO,
  nightsBetween,
} from '@/lib/admin/utils'

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

        <p style="margin:0 0 8px;"><strong>💉 Helsekrav</strong></p>
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
      <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:4px;font-size:14px;margin:24px 0;line-height:1.7;">
        <p style="margin:0 0 8px;font-weight:bold;color:#991b1b;">⚠️ Avbestillingsgebyr gjelder</p>
        <p style="margin:0 0 12px;color:#444;">
          Avbestillingen ble gjort etter fristen for gebyrfri avbestilling.
          I henhold til våre betingelser belastes <strong>${feeAmount.toLocaleString('nb-NO')} kr</strong>
          (50 % av oppholdets pris).
        </p>
        <div style="background:#fff;border:1px solid #fca5a5;border-radius:6px;padding:12px 16px;margin-bottom:8px;">
          <p style="margin:0 0 6px;font-weight:bold;color:#333;font-size:14px;">💸 Betaling via Vipps</p>
          <p style="margin:0 0 4px;color:#444;font-size:14px;">Vipps bedriftsnummer: <strong style="font-size:16px;">46867</strong></p>
          <p style="margin:0 0 10px;color:#666;font-size:13px;">Merk betalingen med ditt navn og «avbestillingsgebyr».</p>
          <a href="vipps://payment?phone=46867"
             style="display:inline-block;background:#ff5b24;color:#ffffff;font-weight:bold;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none;">
            Betal med Vipps
          </a>
          <p style="margin:8px 0 0;font-weight:bold;color:#991b1b;font-size:13px;">Betalingsfrist: 14 dager fra denne e-posten.</p>
        </div>
        <p style="margin:0;color:#666;font-size:13px;">
          Har du spørsmål, ta kontakt på
          <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
        </p>
      </div>
    `
        : `
      <div style="background:#f0fdf4;border-left:4px solid #4ade80;padding:14px 20px;border-radius:4px;font-size:14px;margin:24px 0;">
        <p style="margin:0;color:#166534;">✅ Avbestillingen er gebyrfri. Du belastes ingenting.</p>
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
      <p style="margin:0;color:#166534;">✅ Du belastes ingenting. Avlysningen er kostnadsfri for deg.</p>
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

    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:4px;font-size:14px;margin:24px 0;line-height:1.7;">
      <p style="margin:0 0 8px;font-weight:bold;color:#991b1b;">Utestående beløp: ${feeAmount.toLocaleString('nb-NO')} kr</p>
      <div style="background:#fff;border:1px solid #fca5a5;border-radius:6px;padding:12px 16px;margin-bottom:8px;">
        <p style="margin:0 0 6px;font-weight:bold;color:#333;font-size:14px;">💸 Betaling via Vipps</p>
        <p style="margin:0 0 4px;color:#444;font-size:14px;">Vipps bedriftsnummer: <strong style="font-size:16px;">46867</strong></p>
        <p style="margin:0 0 10px;color:#666;font-size:13px;">Merk betalingen med ditt navn og «avbestillingsgebyr».</p>
        <a href="vipps://payment?phone=46867"
           style="display:inline-block;background:#ff5b24;color:#ffffff;font-weight:bold;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none;">
          Betal med Vipps
        </a>
        <p style="margin:8px 0 0;font-weight:bold;color:#991b1b;font-size:13px;">Betalingsfrist: 14 dager fra opprinnelig avbestillingsbekreftelse.</p>
      </div>
      <p style="margin:0;color:#666;font-size:13px;">
        Vennligst betal så snart som mulig. Har du spørsmål, ta kontakt på
        <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      </p>
    </div>

    <p style="font-size:14px;color:#555;">
      Ta kontakt på
      <a href="mailto:post@mathopenkattepensjonat.no" style="color:#c8b49a;">post@mathopenkattepensjonat.no</a>
      eller ring oss på <a href="tel:+4747322279" style="color:#c8b49a;">+47 473 22 279</a>
    </p>
  `)
}
