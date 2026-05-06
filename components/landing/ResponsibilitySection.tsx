'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export function ResponsibilitySection() {
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
      <div className="mx-auto max-w-4xl">
        <h2
          className={`mb-12 text-center text-3xl font-bold text-slate-900 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Ansvar og forsikring
        </h2>
        <div
          ref={ref}
          className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-14"
        >
          <div
            className={`shrink-0 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <Image
              src="/illustration/handover-cat-no-bg.webp"
              alt="Overlevering av katt"
              width={300}
              height={300}
              className="w-[200px] md:w-[260px]"
            />
          </div>
          <div
            className={`space-y-4 transition-all delay-150 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <p className="leading-relaxed text-slate-700">
              Mathopen Kattepensjonat kan ikke holdes økonomisk ansvarlig for
              skader eller sykdom som fører til at katten blir syk, skadet, får
              varige mén eller dør, under eller etter oppholdet. Det anbefales
              generelt å ha forsikring på katten.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Pensjonatet tar heller ikke ansvar for skader eller tap som
              skyldes tredjepart. Våre lokaler ligger på privat område, og
              uvedkommende har ikke adgang uten godkjenning og tilstedeværelse
              fra oss. Brudd på dette kan medføre erstatningsansvar for
              eventuelle skader eller tap.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
