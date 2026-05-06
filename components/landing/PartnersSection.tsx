'use client'

import { useEffect, useRef, useState } from 'react'
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

export function PartnersSection() {
  const { ref: headerRef, visible: headerVisible } = useVisible()
  const { ref: partnersRef, visible: partnersVisible } = useVisible()
  const { ref: suppliersRef, visible: suppliersVisible } = useVisible()

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-14 text-center transition-all duration-700 ${headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-slate-900">
            Samarbeidspartnere & leverandører
          </h2>
        </div>

        {/* Partners */}
        <div ref={partnersRef}>
          <div
            className={`mb-6 flex items-center gap-4 transition-all duration-700 ${partnersVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Vi samarbeider med
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="mb-16 flex flex-wrap justify-center gap-4">
            {[
              {
                src: '/partners/buddy.webp',
                alt: 'Buddy',
                width: 180,
                height: 60,
              },
              {
                src: '/partners/no-bg-dyreklinikken.webp',
                alt: 'Dyreklinikken',
                width: 140,
                height: 100,
              },
            ].map(({ src, alt, width, height }, i) => (
              <div
                key={alt}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`group flex h-40 w-72 items-center justify-center rounded-2xl border border-slate-100 bg-white px-8 transition-all duration-500 hover:border-slate-200 hover:shadow-md ${partnersVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className="opacity-75 transition-opacity duration-200 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Suppliers */}
        <div ref={suppliersRef}>
          <div
            className={`mb-12 flex items-center gap-4 transition-all duration-700 ${suppliersVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Leverandører
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <p
            className={`mb-6 text-center text-sm text-slate-500 transition-all delay-100 duration-700 ${suppliersVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            Vi serverer kvalitetsfôr fra anerkjente merkevarer
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              <div
                key="monster"
                style={{ transitionDelay: '100ms' }}
                className={`group flex h-40 w-64 items-center justify-center rounded-xl border border-slate-100 bg-white p-4 transition-all duration-500 hover:border-slate-200 hover:shadow-sm ${suppliersVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                <Image
                  src="/partners/monster.webp"
                  alt="Monster"
                  width={160}
                  height={60}
                  className="opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
              </div>,
              <div
                key="orijen-acana"
                style={{ transitionDelay: '200ms' }}
                className={`group flex h-40 w-72 items-center justify-center gap-8 rounded-xl border border-slate-100 bg-white p-4 transition-all duration-500 hover:border-slate-200 hover:shadow-sm ${suppliersVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                <Image
                  src="/partners/orijen.jpeg"
                  alt="Orijen"
                  width={90}
                  height={70}
                  className="opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
                <Image
                  src="/partners/acana.jpeg"
                  alt="Acana"
                  width={90}
                  height={70}
                  className="opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
              </div>,
            ]}
          </div>
        </div>
      </div>
    </section>
  )
}
