# Mathopen Kattepensjonat

> A simple, modern booking system for **Mathopen Kattepensjonat** — where customers can easily book stays for their cats while the owner manages bookings efficiently.

---

## Features

- Cat stay booking flow
- Step-based booking UI
- Form validation
- Booking overview
- Supabase backend
- Responsive design
- Progressive Web App support _(planned)_

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Framework          | [Next.js](https://nextjs.org/)      |
| Language           | TypeScript                          |
| Database & Backend | [Supabase](https://supabase.com/)   |
| UI Components      | [shadcn/ui](https://ui.shadcn.com/) |
| Styling            | Tailwind CSS                        |

---

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── registrering/
│   │   ├── registrering-bekreftet/
│   │   ├── glemt-passord/
│   │   ├── endre-passord/
│   │   ├── confirm/
│   │   └── error/
│   ├── booking/
│   │   └── steps/        # Step-based booking flow
│   └── minside/
│       └── minekatter/
│           ├── [id]/     # Dynamic cat profile page
│           └── legg-til/ # Add new cat
├── components/           # Reusable UI components
├── lib/                  # Helper functions and utilities
└── types/                # TypeScript type definitions
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mathopenkattepensjonat.git
cd mathopenkattepensjonat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development

This project uses:

- Step-based booking components for a guided user experience
- Modular React components for reusability and maintainability
- Supabase for data storage and real-time APIs

## Commit Convention

This project is adopting this convention going forward.
Older commits may not follow this format.

```
feat: (describe what was added)
fix: (describe the problem that was fixed)
refactor: (describe the refactor)
chore: (describe the chore)
doc: (documentation)
perf: (describe what was optimized)
```

---

## Roadmap

- [ ] Payment integration (Vipps / card)
- [ ] Admin dashboard
- [ ] Booking confirmation emails
- [ ] Calendar availability system
- [ ] Full PWA support

---

## License

Private project for **Mathopen Kattepensjonat**. All rights reserved.
