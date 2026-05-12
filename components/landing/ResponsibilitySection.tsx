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

  const fade = (delay = '') =>
    `transition-all duration-700 ${delay} ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`

  return (
    <section className="px-4 py-20">
      <div ref={ref} className="mx-auto max-w-4xl">
        <h2
          className={`mb-10 text-center text-3xl font-bold text-slate-900 ${fade()}`}
        >
          Ansvar og forsikring
        </h2>

        {/* Top: image + first two paragraphs side by side */}
        <div
          className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${fade()}`}
        >
          <div className="flex shrink-0 justify-center">
            <Image
              src="/illustration/handover-cat-no-bg.webp"
              alt="Overlevering av katt"
              width={300}
              height={300}
              className="w-[180px] md:w-[240px]"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="space-y-4">
            <p className="leading-relaxed text-slate-700">
              Vi behandler alle katter med samme omsorg og oppmerksomhet som vi
              ville gitt våre egne. Kattens helse og velferd er vår høyeste
              prioritet under hele oppholdet.
            </p>
            <p className="leading-relaxed text-slate-700">
              Vi har rutiner for daglig oppfølging, tidlig oppdagelse av sykdom
              og rask veterinærkontakt ved behov. Likevel kan vi ikke garantere
              at en katt ikke blir syk eller skadet — dette gjelder på pensjonat
              som hjemme.
            </p>
          </div>
        </div>

        {/* Bottom: two paragraphs full width */}
        <div className={`mt-8 space-y-4 ${fade('delay-150')}`}>
          <p className="leading-relaxed text-slate-700">
            Mathopen Kattepensjonat kan ikke holdes økonomisk ansvarlig for
            sykdom, skade eller dødsfall som oppstår under oppholdet. Vi
            anbefaler alle katteeiere å ha forsikring på katten sin.
          </p>
          <p className="leading-relaxed text-slate-700">
            Vi er ikke ansvarlige for skader eller tap som skyldes tredjepart.
            Våre lokaler ligger på privat område og er tilgangskontrollert —
            uvedkommende har ikke adgang uten vår godkjenning og
            tilstedeværelse.
          </p>
        </div>
      </div>
    </section>
  )
}
