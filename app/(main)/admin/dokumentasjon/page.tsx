import { BulkExportPanel } from '@/components/admin/BulkExportPanel'
import { ShieldCheck } from 'lucide-react'

export default function DokumentasjonPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dokumentasjon</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lovpålagt dokumentasjon etter §5 i Forskrift om hold av dyr i
          dyrepensjonat.
        </p>
      </div>

      {/* Legal summary */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">§5 — Krav til dokumentasjon</h2>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                para: '§5a',
                text: 'Dyreart, kjønn, chip-ID og navn',
                covered: true,
              },
              {
                para: '§5b',
                text: 'Ankomst- og tilbakeleveringsdato',
                covered: true,
              },
              { para: '§5c', text: 'Eiers navn og adresse', covered: true },
              {
                para: '§5e',
                text: 'Smittestatus bekreftet ved innsjekk',
                covered: true,
              },
              {
                para: '§5f',
                text: 'Veterinærbehandling og avvik',
                covered: true,
              },
              {
                para: 'Rutiner',
                text: 'Daglige rutiner, HMS, innsjekk/utsjekk',
                covered: true,
              },
            ].map(({ para, text, covered }) => (
              <div key={para} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 w-8 shrink-0 text-xs font-bold ${covered ? 'text-green-600' : 'text-amber-600'}`}
                >
                  {covered ? '✓' : '○'}
                </span>
                <div>
                  <span className="text-xs font-medium">{para}</span>
                  <span className="text-xs text-muted-foreground">
                    {' '}
                    — {text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="border-t pt-2 text-xs text-muted-foreground">
            Dokumentasjonen skal oppbevares i minimum <strong>3 år</strong> og
            fremlegges for Mattilsynet på forespørsel. PDF-dokumenter bør lagres
            sikkert lokalt eller i sky.
          </p>
        </div>
      </div>

      {/* Individual booking PDF — note */}
      <div className="space-y-3 rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold">Enkeltbooking PDF</h2>
        <p className="text-sm text-muted-foreground">
          Last ned fullstendig §5-dokumentasjon for én enkelt booking direkte
          fra bookingdetaljene. Gå til <strong>Bookinger</strong>, åpne en
          booking og klikk <strong>Last ned PDF</strong> i detaljpanelet.
        </p>
        <div className="space-y-1 rounded-lg bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <p>Enkeltbooking-PDF inkluderer i tillegg:</p>
          <p>· Helseavvik og veterinærlogg (§5f)</p>
          <p>· Smittestatusbekreftelse fra innsjekk (§5e)</p>
          <p>· Spesielle instruksjoner og interne notater</p>
          <p>· Signaturer fra innsjekk og utsjekk</p>
        </div>
      </div>

      {/* Bulk export */}
      <BulkExportPanel />
    </div>
  )
}
