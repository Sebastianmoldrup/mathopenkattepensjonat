'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

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

export function PricingSection() {
  const { ref, visible } = useVisible()

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2
          className={`mb-10 text-center text-3xl font-bold text-slate-900 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Priser
        </h2>
        <div
          ref={ref}
          className={`transition-all delay-100 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Priser */}
                <div>
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        label: 'Lavsesong',
                        prices: [
                          { label: '1 katt', price: '220 kr' },
                          { label: '2 katter', price: '320 kr' },
                          { label: '3 katter', price: '400 kr' },
                        ],
                      },
                      {
                        label: 'Høysesong',
                        prices: [
                          { label: '1 katt', price: '250 kr' },
                          { label: '2 katter', price: '350 kr' },
                          { label: '3 katter', price: '450 kr' },
                        ],
                      },
                    ].map(({ label, prices }, i) => (
                      <div
                        key={label}
                        style={{ transitionDelay: `${150 + i * 100}ms` }}
                        className={`rounded-lg border border-slate-200 p-5 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                      >
                        <p className="mb-4 text-sm font-medium text-slate-500">
                          {label}
                        </p>
                        <div className="space-y-2 text-sm text-slate-700">
                          {prices.map(({ label, price }) => (
                            <div key={label} className="flex justify-between">
                              <span>{label}</span>
                              <span className="font-semibold text-slate-900">
                                {price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mb-6 text-sm text-slate-600">
                    Priser er per døgn, minstebeløp tilsvarer 2 døgn
                  </p>
                  <div className="space-y-3">
                    {['Gratis medisinering', 'Rabatt ved langtidsopphold'].map(
                      (item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Inn- og utsjekk */}
                <div>
                  <h4 className="mb-4 font-semibold text-slate-900">
                    Inn- og utsjekk
                  </h4>
                  <div className="space-y-4 text-slate-700">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Mandag–fredag og søndag
                      </p>
                      <p className="text-sm text-slate-600">Kl. 17:30–19:30</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Lørdag
                      </p>
                      <p className="text-sm text-slate-600">Stengt</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Sommersesong
                      </p>
                      <p className="text-sm text-slate-600">
                        Åpent for levering og henting på lørdager
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      Andre tidspunkt kun etter avtale
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
