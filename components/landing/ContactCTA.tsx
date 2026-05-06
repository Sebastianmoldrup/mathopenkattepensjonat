'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-4 py-20">
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <h2
          className={`mb-6 text-3xl font-bold text-slate-900 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Klar for å bestille?
        </h2>
        <p
          className={`mb-8 text-lg text-slate-600 transition-all delay-100 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Du er hjertelig velkommen til å komme på besøk for å se lokalet før du
          bestiller opphold. Kattepensjonatet åpner imidlertid først 1. juli.
        </p>
        <div
          className={`mb-10 flex flex-col justify-center gap-4 transition-all delay-200 duration-700 sm:flex-row ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <Link href="/booking">
            <Button size="lg" className="group gap-2">
              Bestill nå
            </Button>
          </Link>
          <Link href="/kontakt">
            <Button size="lg" variant="outline">
              Kontakt oss
            </Button>
          </Link>
        </div>
        <div
          className={`space-y-2 text-slate-600 transition-all delay-300 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <p>
            📧{' '}
            <a
              href="mailto:post@mathopenkattepensjonat.no"
              className="underline underline-offset-4 transition-colors hover:text-slate-900"
            >
              post@mathopenkattepensjonat.no
            </a>
          </p>
          <p>
            📞{' '}
            <a
              href="tel:+4747322279"
              className="underline underline-offset-4 transition-colors hover:text-slate-900"
            >
              473 22 279
            </a>
          </p>
          <p className="text-sm text-slate-500">
            Telefontid: kl. 11:00–12:00 og 17:00–20:00
          </p>
        </div>
      </div>
    </section>
  )
}
