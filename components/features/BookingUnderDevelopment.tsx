export default function BookingUnderDevelopment() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b bg-muted/40 px-8 py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <span className="text-2xl">📅</span>
          </div>
          <h2 className="mb-1.5 text-xl font-semibold text-slate-900">
            Send inn en bookingforespørsel
          </h2>
          <p className="text-sm text-slate-500">
            Vi tar imot bestillinger for opphold hos Mathopen Kattepensjonat
          </p>
        </div>

        <div className="border-b px-8 py-6">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-red-600">
                Juli
              </p>
              <p className="text-sm font-medium text-red-700">Fullbooket</p>
              <p className="mt-1 text-xs text-red-500">
                Venteliste tilgjengelig
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-green-600">
                August
              </p>
              <p className="text-sm font-medium text-green-700">
                God kapasitet
              </p>
              <p className="mt-1 text-xs text-green-500">Ledige plasser</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Vi opplever stor pågang i forbindelse med sommerferien. Har du behov
            for pass i juli, kan vi sette deg på venteliste.
          </p>
        </div>

        <div className="px-8 py-6">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Ta kontakt for å booke eller stå på venteliste
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:post@mathopenkattepensjonat.no"
              className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-muted"
            >
              <span>✉️</span>
              post@mathopenkattepensjonat.no
            </a>
            <a
              href="tel:+4747322279"
              className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-muted"
            >
              <span>📞</span>
              +47 473 22 279
            </a>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Mathopen Kattepensjonat AS · Storingavika 2, 5174 Mathopen
      </p>
    </div>
  )
}
