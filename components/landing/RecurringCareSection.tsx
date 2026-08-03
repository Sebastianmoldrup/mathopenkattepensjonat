'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

export function RecurringCareSection() {
  const { ref, visible } = useVisible()

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div
          ref={ref}
          className={`text-center transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🐾</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            Fast og forutsigbar kattepass
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            For deg som er mye borte — offshore, reisejobb eller lignende
          </p>
        </div>

        <Card
          className={`mt-10 border-slate-200 transition-all delay-100 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <CardContent className="pt-6">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Jobber du{' '}
                  <span className="font-medium text-slate-800">offshore</span>
                  {', har en '}
                  <span className="font-medium text-slate-800">
                    reisejobb
                  </span>{' '}
                  eller er mye borte hjemmefra? Da vet vi hvor viktig det er å
                  kunne reise med ro i hjertet — trygg på at katten din har
                  det bra mens du er borte.
                </p>
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                    Rabatt for faste kunder
                  </p>
                  <p className="text-sm text-blue-700">
                    Bruker du oss regelmessig, for eksempel hver eller
                    annenhver måned, tilbyr vi rabatt i lavsesong. En stabil
                    og forutsigbar kattepass-løsning gjennom hele året.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-slate-700">
                  Høres dette interessant ut?
                </p>
                <Link
                  href="/guider/fast-kattepass"
                  className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-muted"
                >
                  <span>📖</span>
                  Les mer om fast kattepass
                </Link>
                <Link
                  href="/kontakt"
                  className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-muted"
                >
                  <span>✉️</span>
                  Ta kontakt for en fast avtale
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
