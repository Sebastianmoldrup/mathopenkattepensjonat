'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HMSForm } from './forms/HMSForm'
import {
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HmsLog {
  id: string
  røykvarslere: boolean
  brannslukker: boolean
  slokkeutstyr_kontrollert: boolean
  branninstruks: boolean
  evakueringsplan: boolean
  beredskapsplan: boolean
  transportutstyr: boolean
  midlertidig_plassering: boolean
  ansvarsfordeling: boolean
  fast_veterinær: boolean
  akuttveterinær: boolean
  telefon_tilgjengelig: boolean
  førstehjelpsutstyr: boolean
  isolering_rutine: boolean
  isolat_redskaper: boolean
  håndhygiene: boolean
  verneutstyr: boolean
  smitteavfall: boolean
  rutine_strømbrudd: boolean
  alternativ_oppvarming: boolean
  rutine_vannmangel: boolean
  ventilasjon_kontroll: boolean
  varme_kulde_tiltak: boolean
  avvik_registreres: boolean
  tiltak_iverksettes: boolean
  hendelser_evalueres: boolean
  rutiner_oppdateres: boolean
  godkjent_navn: string | null
  godkjent_dato: string | null
  slokkeutstyr_dato: string | null
  førstehjelpsutstyr_dato: string | null
  created_at: string
}

const ALL_BOOL_KEYS: (keyof HmsLog)[] = [
  'røykvarslere',
  'brannslukker',
  'slokkeutstyr_kontrollert',
  'branninstruks',
  'evakueringsplan',
  'beredskapsplan',
  'transportutstyr',
  'midlertidig_plassering',
  'ansvarsfordeling',
  'fast_veterinær',
  'akuttveterinær',
  'telefon_tilgjengelig',
  'førstehjelpsutstyr',
  'isolering_rutine',
  'isolat_redskaper',
  'håndhygiene',
  'verneutstyr',
  'smitteavfall',
  'rutine_strømbrudd',
  'alternativ_oppvarming',
  'rutine_vannmangel',
  'ventilasjon_kontroll',
  'varme_kulde_tiltak',
  'avvik_registreres',
  'tiltak_iverksettes',
  'hendelser_evalueres',
  'rutiner_oppdateres',
]

function countChecked(log: HmsLog): number {
  return ALL_BOOL_KEYS.filter((k) => !!log[k]).length
}

interface HMSContentProps {
  history: HmsLog[]
}

export function HMSContent({ history }: HMSContentProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [localHistory, setLocalHistory] = useState<HmsLog[]>(history)

  function handleSaved(newLog: HmsLog) {
    setLocalHistory((prev) => [newLog, ...prev])
    setShowForm(false)
    setExpandedId(newLog.id)
  }

  return (
    <div className="space-y-5">
      {/* New registration button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ny HMS-registrering
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Ny registrering</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Avbryt
            </Button>
          </div>
          <HMSForm existing={null} history={[]} onSaved={handleSaved} />
        </div>
      )}

      {/* History list */}
      {localHistory.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">
            Tidligere registreringer ({localHistory.length})
          </h2>

          <div className="divide-y overflow-hidden rounded-xl border">
            {localHistory.map((log) => {
              const checked = countChecked(log)
              const total = ALL_BOOL_KEYS.length
              const allDone = checked === total
              const isExpanded = expandedId === log.id

              return (
                <div key={log.id}>
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="flex w-full items-center justify-between bg-card px-4 py-3 text-left transition-colors hover:bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      {allDone ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(log.created_at).toLocaleDateString(
                            'nb-NO',
                            {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                        {log.godkjent_navn && (
                          <p className="text-xs text-muted-foreground">
                            Signert av {log.godkjent_navn}
                            {log.godkjent_dato ? ` · ${log.godkjent_dato}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-xs font-medium',
                          allDone
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        )}
                      >
                        {checked}/{total}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="space-y-3 border-t bg-muted/10 px-4 py-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        {[
                          ['Røykvarslere', log.røykvarslere],
                          ['Brannslukningsapparat', log.brannslukker],
                          [
                            'Slokkeutstyr kontrollert',
                            log.slokkeutstyr_kontrollert,
                          ],
                          ['Branninstruks', log.branninstruks],
                          ['Evakueringsplan', log.evakueringsplan],
                          ['Beredskapsplan', log.beredskapsplan],
                          ['Transportutstyr', log.transportutstyr],
                          [
                            'Midlertidig plassering',
                            log.midlertidig_plassering,
                          ],
                          ['Ansvarsfordeling', log.ansvarsfordeling],
                          ['Fast veterinær', log.fast_veterinær],
                          ['Akuttveterinær', log.akuttveterinær],
                          ['Telefon tilgjengelig', log.telefon_tilgjengelig],
                          ['Førstehjelpsutstyr', log.førstehjelpsutstyr],
                          ['Isoleringsrutine', log.isolering_rutine],
                          ['Isolat redskaper', log.isolat_redskaper],
                          ['Håndhygiene', log.håndhygiene],
                          ['Verneutstyr', log.verneutstyr],
                          ['Smitteavfall', log.smitteavfall],
                          ['Rutine strømbrudd', log.rutine_strømbrudd],
                          ['Alternativ oppvarming', log.alternativ_oppvarming],
                          ['Rutine vannmangel', log.rutine_vannmangel],
                          ['Ventilasjonskontroll', log.ventilasjon_kontroll],
                          ['Varme/kulde tiltak', log.varme_kulde_tiltak],
                          ['Avvik registreres', log.avvik_registreres],
                          ['Tiltak iverksettes', log.tiltak_iverksettes],
                          ['Hendelser evalueres', log.hendelser_evalueres],
                          ['Rutiner oppdateres', log.rutiner_oppdateres],
                        ].map(([label, val]) => (
                          <div
                            key={label as string}
                            className="flex items-center gap-2"
                          >
                            <span
                              className={cn(
                                'h-3 w-3 shrink-0 rounded-sm border',
                                val
                                  ? 'border-green-600 bg-green-500'
                                  : 'border-gray-300 bg-white'
                              )}
                            />
                            <span
                              className={cn(
                                val
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {label as string}
                            </span>
                          </div>
                        ))}
                      </div>
                      {(log.slokkeutstyr_dato ||
                        log.førstehjelpsutstyr_dato) && (
                        <div className="space-y-0.5 border-t pt-1 text-xs text-muted-foreground">
                          {log.slokkeutstyr_dato && (
                            <p>
                              Slokkeutstyr kontrollert: {log.slokkeutstyr_dato}
                            </p>
                          )}
                          {log.førstehjelpsutstyr_dato && (
                            <p>
                              Førstehjelpsutstyr kontrollert:{' '}
                              {log.førstehjelpsutstyr_dato}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {localHistory.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card py-16 text-muted-foreground">
          <ShieldCheck className="h-8 w-8" />
          <p className="text-sm">Ingen HMS-registreringer ennå.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="mt-1 gap-2"
          >
            <Plus className="h-4 w-4" /> Opprett første registrering
          </Button>
        </div>
      )}
    </div>
  )
}
