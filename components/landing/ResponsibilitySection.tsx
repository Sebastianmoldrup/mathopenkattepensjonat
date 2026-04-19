import Image from 'next/image'

export function ResponsibilitySection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          Ansvar og forsikring
        </h2>
        <div className="grid place-items-center md:grid-cols-2">
          <Image
            src="/illustration/handover-cat-no-bg.webp"
            alt="Overleverng av katt"
            width={150}
            height={150}
            className="w-[300px]"
          />
          <div className="mx-auto max-w-sm md:max-w-4xl">
            <p className="mb-4 leading-relaxed text-slate-700">
              Mathopen Kattepensjonat kan ikke holdes økonomisk ansvarlig for
              skader eller sykdom som fører til at katten blir syk, skadet, får
              varige mén eller dør, under eller etter oppholdet. Det anbefales
              generelt å ha forsikring på katten.
            </p>
            <p className="text-sm text-slate-600">
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
