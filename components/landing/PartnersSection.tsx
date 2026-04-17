import Image from 'next/image'

export function PartnersSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Samarbeidspartnere & leverandører
          </h2>
        </div>

        {/* Partners */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Vi samarbeider med
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
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
            ].map(({ src, alt, width, height }) => (
              <div
                key={alt}
                className="group flex h-40 w-72 items-center justify-center rounded-2xl border border-slate-100 bg-white px-8 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md"
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

        {/* Divider */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Leverandører
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Suppliers */}
        <div>
          <p className="mb-6 text-center text-sm text-slate-500">
            Vi serverer kvalitetsfôr fra anerkjente merkevarer
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Monster — alone */}
            <div className="group flex h-40 w-64 items-center justify-center rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm">
              <Image
                src="/partners/monster.webp"
                alt="Monster"
                width={160}
                height={60}
                className="opacity-70 transition-opacity duration-200 group-hover:opacity-100"
              />
            </div>

            {/* Orijen + Acana — same box */}
            <div className="group flex h-40 w-72 items-center justify-center gap-8 rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
