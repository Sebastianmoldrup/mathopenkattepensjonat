import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Rom og fasiliteter – Kattepensjonat i Bergen | Mathopen',
  description:
    'Se våre romtyper hos Mathopen Kattepensjonat i Bergen – standard, senior & comfort og suite. Store, trygge og komfortable rom fra 220 kr/døgn.',
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
