import Image from 'next/image'

export default function BookingUnderDevelopment() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center gap-8 rounded-2xl border bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-shrink-0">
          <Image
            src="/illustration/reserve-spots.webp"
            alt="Reservér plass"
            width={180}
            height={180}
            className="mx-auto rounded-md"
          />
        </div>

        <div className="space-y-5 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-slate-900">Booking er åpen</h2>

          <div className="space-y-2 text-slate-700">
            <p className="text-lg font-medium">🐾 Åpner 1. juli</p>

            <p>Forhåndsbestillinger blir prioritert ved oppstart.</p>

            <p>
              Venteliste er under arbeid og vil bli brukt dersom vi blir
              fullbooket.
            </p>
          </div>

          <div className="mx-auto h-px w-16 bg-slate-200 lg:mx-0" />

          <div className="space-y-2">
            <p className="text-slate-600">
              Ta kontakt for plass eller venteliste:
            </p>

            <a
              href="mailto:post@mathopenkattepensjonat.no"
              className="inline-block font-medium text-blue-600 hover:underline"
            >
              post@mathopenkattepensjonat.no
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
