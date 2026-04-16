'use client'

import { useState, useTransition } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileDown,
  Loader2,
  BookOpen,
  CalendarDays,
  Banknote,
} from 'lucide-react'
import { BulkBookingPDFDocument } from '@/components/admin/BulkBookingPDFDocument'
import { adminGetBookingsForYear } from '@/lib/admin/docActions'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i)

export function BulkExportPanel() {
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [previewCount, setPreviewCount] = useState<number | null>(null)

  async function handleExport() {
    setError(null)
    startTransition(async () => {
      try {
        const entries = await adminGetBookingsForYear(Number(selectedYear))

        if (entries.length === 0) {
          setError(
            `Ingen bekreftede eller gjennomførte bookinger funnet for ${selectedYear}`
          )
          return
        }

        setPreviewCount(entries.length)

        const blob = await pdf(
          <BulkBookingPDFDocument
            entries={entries}
            year={Number(selectedYear)}
          />
        ).toBlob()

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bookingregister_${selectedYear}_mathopen.pdf`
        a.click()
        URL.revokeObjectURL(url)
      } catch (e) {
        setError('Kunne ikke generere PDF. Prøv igjen.')
        console.error(e)
      }
    })
  }

  return (
    <div className="space-y-5 rounded-xl border bg-card p-6">
      <div>
        <h2 className="text-base font-semibold">Årseksport — Bulk PDF</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Eksporter alle bekreftede og gjennomførte bookinger for et år som ett
          PDF-dokument. Oppfyller §5 krav om dokumentasjon tilgjengelig i 3 år.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Velg år</p>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleExport}
          disabled={isPending}
          className="h-9 gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Genererer PDF...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Last ned årsregister
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {previewCount !== null && !isPending && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          ✅ PDF generert med {previewCount} bookinger for {selectedYear}
        </p>
      )}

      <div className="space-y-1 rounded-lg bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Hva inkluderes i PDF-en:</p>
        <p>· Ankomst- og tilbakeleveringsdato (§5b)</p>
        <p>· Eiers navn, adresse og kontaktinfo (§5c)</p>
        <p>· Kattenes navn, kjønn, rase og chip-ID der registrert (§5a)</p>
        <p>· Burtype, antall katter og pris</p>
        <p>· Sammendrag med totalt antall bookinger, netter og inntekt</p>
      </div>
    </div>
  )
}
