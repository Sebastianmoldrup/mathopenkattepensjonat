'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export function AboutSection() {
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
    <section className="bg-white px-8 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          Om oss
        </h2>
        <div
          ref={ref}
          className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16"
        >
          {/* Image */}
          <div
            className={`w-full shrink-0 transition-all delay-200 duration-700 md:w-[380px] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <div className="overflow-hidden rounded-2xl shadow-md">
              <Image
                src="/img/om-oss.webp"
                alt="Anja og Martin, eiere av Mathopen Kattepensjonat"
                width={760}
                height={760}
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm text-slate-500">
              Anja Breivik Møldrup & Martin Grindheim Johannessen
            </p>
          </div>

          {/* Text */}
          <div
            className={`flex-1 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <div className="space-y-5">
              <p className="text-lg leading-relaxed text-slate-700">
                Vi er Anja Breivik Møldrup og Martin Grindheim Johannessen – et
                par i 30-årene som bor i Mathopen og driver Mathopen
                Kattepensjonat.
              </p>
              <p className="text-lg leading-relaxed text-slate-700">
                Anja har drevet med kattepass siden 2018, og har gjennom flere
                år opparbeidet seg solid erfaring. Vi har et sterkt fokus på
                hver enkelt katt – deres personlighet, trivsel og individuelle
                behov.
              </p>
              <p className="text-lg leading-relaxed text-slate-700">
                Behovet for kattepass i fellesferien har over tid vært større
                enn kapasiteten vår. Derfor bygger vi kattepensjonatet for å
                møte den økende etterspørselen etter trygge og gode løsninger
                for kattepass. Vi ønsker å skape et rolig og trygt sted der hver
                katt blir sett, og får et opphold tilpasset sin personlighet,
                trivsel og behov.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
