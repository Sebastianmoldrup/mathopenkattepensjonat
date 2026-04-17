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

export function FeaturesGrid() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid place-content-center gap-8 md:grid-cols-3">
          {FEATURES.map(({ img, title, desc }, index) => (
            <Card
              key={index}
              className="max-w-[348px] border-slate-200 transition-shadow hover:shadow-lg"
            >
              <CardContent className="flex h-full flex-col items-center justify-end pt-6">
                <Image
                  src={`/illustration/${img}.webp`}
                  alt={title}
                  width={150}
                  height={150}
                  className="mb-4 h-[150px] w-fit rounded-lg"
                />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="text-slate-600">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
