'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Shield, Heart, House } from 'lucide-react'
import Image from 'next/image'

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
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

export function FacilitiesSection() {
  const { ref: topRef, visible: topVisible } = useVisible()
  const { ref: bottomRef, visible: bottomVisible } = useVisible()

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center text-3xl font-bold text-slate-900">
          Fasiliteter og beliggenhet
        </h2>

        {/* Top grid — location + security + wellbeing */}
        <div ref={topRef} className="grid gap-8 md:grid-cols-3">
          {/* Beliggenhet */}
          <div
            className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all duration-700 ${topVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-slate-200 p-2">
                <MapPin className="h-4 w-4 text-slate-700" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Beliggenhet
              </h3>
            </div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Storingavika 2, 5174 Mathopen
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Like ved busstoppet Storingavika i Mathopen. Vi tilbyr henting og
              levering mot et tillegg.
            </p>
          </div>

          {/* Sikkerhet */}
          <div
            className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all delay-100 duration-700 ${topVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-slate-200 p-2">
                <Shield className="h-4 w-4 text-slate-700" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Sikkerhet
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'Brannalarm, videoovervåkning og innbruddsalarm',
                'Følger alle Mattilsynets krav og retningslinjer',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Trivsel */}
          <div
            className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all delay-200 duration-700 ${topVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-rose-100 p-2">
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Trivsel
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'Ekstra oppfølging for katter som trenger det',
                'Kvalitetsfôr inkludert, mulighet for eget fôr',
                'Nybygg fra 2026 med balansert ventilasjon og varmepumpe',
                'Spesialtilpasset avtrekksventilasjon over hvert toalettområde',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom — stimulating environment */}
        <div
          ref={bottomRef}
          className={`mt-10 rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all duration-700 ${bottomVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <h3 className="mb-6 text-xl font-semibold text-slate-900">
            Et trygt og stimulerende miljø
          </h3>
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1 space-y-4">
              <p className="leading-relaxed text-slate-700">
                Hvert rom har egen seng, dokasse samt mat- og vannskåler. På
                dagtid står døren til rommet åpen, slik at de kan bevege seg
                fritt i fellesområdene og luftegårdene. Disse områdene er
                romslige og utformet med mange rolige skjulesteder, slik at
                kattene kan trekke seg tilbake når de ønsker det.
              </p>
              <p className="leading-relaxed text-slate-600">
                Vi anbefaler å ta med et teppe, en seng eller et annet trygt
                objekt med kattens egen lukt – dette kan gjøre overgangen til
                nye omgivelser enklere.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button className="gap-2" disabled>
                  <House className="h-4 w-4" />
                  Utforsk pensjonatet
                </Button>
                <span className="text-sm text-muted-foreground">
                  Kommer snart
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <Image
                src="/illustration/cat-sleeping-no-bg.webp"
                alt="Katt som sover trygt på pensjonatet"
                width={300}
                height={300}
                className="w-[200px] md:w-[260px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
