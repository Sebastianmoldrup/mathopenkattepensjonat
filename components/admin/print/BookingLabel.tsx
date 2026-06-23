import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import type { BookingLabelData, BookingLabelCat } from '@/lib/admin/actions'

function CatCard({ cat }: { cat: BookingLabelCat }) {
  return (
    <div className="cat-card">
      <div className="cat-header">
        <div className="cat-icon">🐱</div>
        <span className="cat-title">{cat.name}</span>
      </div>

      <div className="cat-body">
        <div className="cat-image-wrapper">
          {cat.image_url ? (
            <Image
              src={cat.image_url}
              alt={cat.name}
              fill
              className="cat-image"
              sizes="120px"
            />
          ) : (
            <div className="cat-image-placeholder">🐱</div>
          )}
        </div>

        <div className="cat-info">
          {cat.id_chip && (
            <div className="info-row">
              <span className="info-icon">📋</span>
              <div>
                <span className="info-label">ID-CHIP</span>
                <span className="info-value">{cat.id_chip}</span>
              </div>
            </div>
          )}

          {cat.insurance_number && (
            <div className="info-row">
              <span className="info-icon">🛡️</span>
              <div>
                <span className="info-label">FORSIKRING</span>
                <span className="info-value">{cat.insurance_number}</span>
              </div>
            </div>
          )}

          <div className="info-row">
            <span className="info-icon">💊</span>
            <div>
              <span className="info-label">MEDISINERING</span>
              <span className="info-value">
                {cat.gets_medication
                  ? (cat.medication_details ?? 'Ja')
                  : 'Ingen'}
              </span>
            </div>
          </div>

          <div className="info-row">
            <span className="info-icon">⭐</span>
            <div>
              <span className="info-label">SPESIALFÔR</span>
              <span className="info-value">{cat.diet ?? 'Ingen'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingLabel({ data }: { data: BookingLabelData }) {
  const { booking, owner, cats } = data
  const ownerName =
    [owner.first_name, owner.last_name].filter(Boolean).join(' ') || '—'
  const dateFrom = format(parseISO(booking.date_from), 'd. MMM yyyy', {
    locale: nb,
  })
  const dateTo = format(parseISO(booking.date_to), 'd. MMM yyyy', {
    locale: nb,
  })

  return (
    <div className="label-page">
      {/* Header */}
      <div className="label-header">
        <span className="label-header-title">MATHOPEN KATTEPENSJONAT</span>
        <span className="label-header-dates">
          Innsjekk: {dateFrom} — Utsjekk: {dateTo}
        </span>
      </div>

      {/* Katter */}
      <div className={`cats-grid cats-${Math.min(cats.length, 3)}`}>
        {cats.slice(0, 3).map((cat, i) => (
          <CatCard key={i} cat={cat} />
        ))}
      </div>

      {/* Eierinformasjon */}
      <div className="owner-section">
        <div className="owner-header">
          <span className="owner-icon">👤</span>
          <span className="owner-title">EIERINFORMASJON</span>
        </div>

        <div className="owner-grid">
          <div className="owner-row">
            <span className="info-icon">👤</span>
            <div>
              <span className="info-label">EIERS NAVN</span>
              <span className="info-value">{ownerName}</span>
            </div>
          </div>

          <div className="owner-row">
            <span className="info-icon">📞</span>
            <div>
              <span className="info-label">KONTAKTINFORMASJON</span>
              <span className="info-value">{owner.phone ?? '—'}</span>
            </div>
          </div>

          <div className="owner-row">
            <span className="info-icon">📞</span>
            <div>
              <span className="info-label">NØDKONTAKT</span>
              <span className="info-value">
                {owner.emergency_contact ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
