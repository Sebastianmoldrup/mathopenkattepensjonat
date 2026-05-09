import Link from 'next/link'

export default function FastKattepass() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b bg-muted/40 px-8 py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🐾</span>
          </div>
          <h2 className="mb-1.5 text-xl font-semibold text-slate-900">
            Fast og forutsigbar kattepass
          </h2>
          <p className="text-sm text-slate-500">
            For deg som er mye borte — offshore, reisejobb eller lignende
          </p>
        </div>

        <div className="border-b px-8 py-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Jobber du{' '}
            <span className="font-medium text-slate-700">offshore</span>
            {', har en '}
            <span className="font-medium text-slate-700">reisejobb</span> eller
            er mye borte hjemmefra? Da vet vi hvor viktig det er å kunne reise
            med ro i hjertet — trygg på at katten din har det bra mens du er
            borte.
          </p>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
              Rabatt for faste kunder
            </p>
            <p className="text-sm text-blue-700">
              Bruker du oss regelmessig, for eksempel hver eller annenhver
              måned, tilbyr vi rabatt i lavsesong. En stabil og forutsigbar
              kattepass-løsning gjennom hele året.
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Høres dette interessant ut?
          </p>
          <Link
            href="/kontakt"
            className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-muted"
          >
            <span>✉️</span>
            Ta kontakt for en fast avtale
          </Link>
        </div>
      </div>
    </div>
  )
}
