# Mathopen Kattepensjonat

Booking- og administrasjonssystem for Mathopen Kattepensjonat AS.

---

## Tech Stack

| Lag            | Teknologi                                                    |
| -------------- | ------------------------------------------------------------ |
| Frontend       | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend        | Supabase (PostgreSQL, Auth, Storage, RLS)                    |
| E-post         | Resend                                                       |
| Deploy         | Vercel                                                       |
| Pakkebehandler | pnpm                                                         |

---

## Miljøvariabler

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

Sett i `.env.local` lokalt og i Vercel under **Settings → Environment Variables** for både Production og Preview.

---

## Prosjektstruktur

```
app/
  (public)/           — Offentlige sider (hjem, kontakt, booking)
  admin/              — Adminpanel (beskyttet via proxy.ts)
    page.tsx          — Oversikt med stats og varsler
    bookinger/        — Bookingadministrasjon
    avbestillinger/   — Gebyroppfølging
    kalender/         — Beleggsoversikt
    sjekkliste/       — Daglige rutiner
    hms/              — HMS-registreringer
    dokumentasjon/    — §5 PDF-eksport
    guide/            — Intern brukerveiledning

components/
  admin/              — Adminkomponenter (tabeller, dialoger, skjemaer)
  booking/            — Bookingveiviser (4 steg)
  landing/            — Landingssidekomponenter
  ui/                 — shadcn/ui basiskomponenter
  userBookings/       — Brukerens bookingside

lib/
  admin/              — Server actions og typer for admin
  booking/            — Tilgjengelighet, prising, avbestilling, typer
  email/              — Resend e-postsending og templater
  supabase/           — Browser- og server-klienter
  userBookings/       — Kundens avbestilling med gebyrberegning
```

---

## Funksjonalitet

### Kundeflyt

- Registrering og innlogging via Supabase Auth
- Legg til opptil 3 katter med bilde og helseopplysninger
- 4-stegs bookingveiviser: Katter → Datoer → Bur → Oppsummering
- Avbestilling med automatisk gebyrberegning
- E-postbekreftelse ved booking og avbestilling

### Avbestillingspolicy

| Sesong    | Gebyrfri frist        | Etter frist          |
| --------- | --------------------- | -------------------- |
| Lavsesong | 24 timer før innsjekk | 50 % av oppholdspris |
| Høysesong | 7 dager før innsjekk  | 50 % av oppholdspris |

### Adminpanel

- Bookingadministrasjon med søk, filtrering og sortering
- Innsjekk/utsjekk-registrering med signatur
- Helseavvik og veterinærlogg per katt
- Daglige sjekklister (morgen + dag/kveld)
- HMS-registreringer med historikk
- Avbestillingsoversikt med gebyroppfølging og Vipps-påminnelse
- §5 PDF-dokumentasjon per booking og årseksport
- Inntektsgraf per år

---

## Bur og kapasitet

| Burtype        | Antall | Maks katter |
| -------------- | ------ | ----------- |
| Standard       | 14     | 2           |
| Senior Comfort | 3      | 2           |
| Suite          | 3      | 3           |

Åpningsdato: **1. juli 2026**

---

## Priser

|          | Lavsesong | Høysesong |
| -------- | --------- | --------- |
| 1 katt   | 220 kr    | 250 kr    |
| 2 katter | 320 kr    | 350 kr    |
| 3 katter | 400 kr    | 450 kr    |

Høysesong: 15. juni–15. august, 20. desember–2. januar, påske

---

## Kontakt

- **E-post:** <post@mathopenkattepensjonat.no>
- **Telefon:** 473 22 279
- **Adresse:** Storingavika 2, 5174 Mathopen
- **Vipps bedrift:** 46867
