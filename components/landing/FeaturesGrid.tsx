'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const FEATURES = [
  {
    img: 'petting-no-bg',
    title: 'Erfaren omsorg',
    desc: 'Anja har drevet kattepass siden 2018 med bred erfaring i katteatferd og stell.',
  },
  {
    img: 'playing-no-bg',
    title: 'Romslige fasiliteter',
    desc: 'Romslige bur, kattegård åpen hele dagen, veggmonterte kattemøbler og gode aktivitetsområder',
  },
  {
    img: 'phone-cat-playing-no-bg',
    title: 'Oppdateringer underveis',
    desc: 'Følg kattens opphold på vår egen Snapchat-kanal og facebook-side, med jevnlige oppdateringer og bilder.',
  },
]

function FeatureCard({
  img,
  title,
  desc,
  index,
}: {
  img: string
  title: string
  desc: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
    >
      <Card className="max-w-[348px] border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="flex h-full flex-col items-center justify-end pt-6">
          <Image
            src={`/illustration/${img}.webp`}
            alt={title}
            width={150}
            height={150}
            className="mb-4 h-[150px] w-fit rounded-lg"
            style={{ width: 'auto' }}
          />
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="text-slate-600">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function FeaturesGrid() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid place-content-center gap-8 md:grid-cols-3">
          {FEATURES.map(({ img, title, desc }, index) => (
            <FeatureCard
              key={index}
              img={img}
              title={title}
              desc={desc}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
