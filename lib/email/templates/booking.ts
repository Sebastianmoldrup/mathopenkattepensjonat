import {
  AdminBooking,
  CAGE_LABELS,
  formatDateNO,
  nightsBetween,
} from '@/lib/admin/utils'

function baseTemplate(content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      ${content}
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #888; font-size: 13px;">
        Med vennlig hilsen,<br />
        <strong>Mathopen Kattepensjonat</strong> 🐾
      </p>
    </div>
  `
}

function bookingDetailsBlock(booking: AdminBooking): string {
  const nights = nightsBetween(booking.date_from, booking.date_to)
  const cageLabel =
    booking.cage_count === 2
      ? '2× Standard (split)'
      : (CAGE_LABELS[booking.cage_type] ?? booking.cage_type)

  return `
    <div style="background: #f9f6f2; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 14px; width: 140px;">Innsjekk</td>
          <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${formatDateNO(booking.date_from)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 14px;">Utsjekk</td>
          <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${formatDateNO(booking.date_to)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 14px;">Netter</td>
          <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${nights} ${nights === 1 ? 'natt' : 'netter'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 14px;">Burtype</td>
          <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${cageLabel}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 14px;">Antall katter</td>
          <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${booking.num_cats}</td>
        </tr>
        <tr style="border-top: 1px solid #ddd;">
          <td style="padding: 10px 0 6px; color: #666; font-size: 14px;">Totalpris</td>
          <td style="padding: 10px 0 6px; font-weight: bold; font-size: 16px; color: #2C3E50;">
            ${booking.price.toLocaleString('nb-NO')} kr
          </td>
        </tr>
      </table>
    </div>
  `
}

export function bookingConfirmedTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? booking.user_email

  return baseTemplate(`
    <h2 style="color: #2C3E50;">Hei ${firstName}! 🐾</h2>

    <p>
      Vi er glade for å bekrefte at bookingen din hos
      <strong>Mathopen Kattepensjonat</strong> er bekreftet.
    </p>

    <h3 style="color: #2C3E50; margin-bottom: 8px;">Bookingdetaljer</h3>
    ${bookingDetailsBlock(booking)}

    <p>
      <strong>Betaling</strong> skjer ved innsjekk.
      Vi ser frem til å ta imot deg og katten din!
    </p>

    ${
      booking.special_instructions
        ? `
      <p style="background: #fff8e1; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 14px;">
        <strong>Spesielle instruksjoner registrert:</strong><br />
        ${booking.special_instructions}
      </p>
    `
        : ''
    }

    <p>
      Har du spørsmål? Ta gjerne kontakt med oss.
    </p>
  `)
}

export function bookingCancelledTemplate(booking: AdminBooking): string {
  const firstName = booking.user_first_name ?? booking.user_email

  return baseTemplate(`
    <h2 style="color: #2C3E50;">Hei ${firstName},</h2>

    <p>
      Vi bekrefter hermed at din booking hos
      <strong>Mathopen Kattepensjonat</strong> er avbestilt.
    </p>

    <h3 style="color: #2C3E50; margin-bottom: 8px;">Avbestilt booking</h3>
    ${bookingDetailsBlock(booking)}

    <p style="background: #fef2f2; border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 4px; font-size: 14px;">
      <strong>Avbestillingspolicy:</strong><br />
      Lavsesong: Avbestilling senest 24 timer før ankomst uten gebyr.<br />
      Høysesong: Avbestilling senest 7 dager før ankomst uten gebyr.<br />
      Ved senere avbestilling belastes 50 % av oppholdets pris.
    </p>

    <p>
      Har du spørsmål angående avbestillingen, ta kontakt med oss per e-post.
    </p>
  `)
}
