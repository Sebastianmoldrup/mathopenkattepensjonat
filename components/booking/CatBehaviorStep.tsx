'use client'

import { useState } from 'react'
import { Cat } from '@/lib/booking/types'
import { CatBehaviorData } from '@/lib/booking/behaviorActions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface CatBehaviorStepProps {
  cats: Cat[]
  behaviorData: CatBehaviorData[]
  onChange: (data: CatBehaviorData[]) => void
  wantsOutdoorCage: boolean
  onOutdoorCageChange: (value: boolean) => void
  onNext: () => void
  onBack: () => void
}

type YesNoUnknown = 'yes' | 'no' | 'unknown'

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
          value === true
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card hover:border-muted-foreground/40'
        )}
      >
        Ja
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
          value === false
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card hover:border-muted-foreground/40'
        )}
      >
        Nei
      </button>
    </div>
  )
}

function ThreeWayToggle({
  value,
  onChange,
}: {
  value: YesNoUnknown | null
  onChange: (v: YesNoUnknown) => void
}) {
  return (
    <div className="flex gap-2">
      {(['yes', 'no', 'unknown'] as YesNoUnknown[]).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            value === opt
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:border-muted-foreground/40'
          )}
        >
          {opt === 'yes' ? 'Ja' : opt === 'no' ? 'Nei' : 'Vet ikke'}
        </button>
      ))}
    </div>
  )
}

function getDefault(catId: string): CatBehaviorData {
  return {
    cat_id: catId,
    gets_medication: false,
    medication_details: '',
    has_cat_experience: false,
    gets_along_with_cats: 'unknown',
    has_stress_issues: false,
    stress_details: '',
    aggression_risk: 'unknown',
    aggression_details: '',
  }
}

export function CatBehaviorStep({
  cats,
  behaviorData,
  onChange,
  wantsOutdoorCage,
  onOutdoorCageChange,
  onNext,
  onBack,
}: CatBehaviorStepProps) {
  // Initialize with defaults for any cats not yet in behaviorData
  const [data, setData] = useState<CatBehaviorData[]>(() =>
    cats.map(
      (cat) =>
        behaviorData.find((d) => d.cat_id === cat.id) ?? getDefault(cat.id)
    )
  )

  function updateCat(catId: string, partial: Partial<CatBehaviorData>) {
    const updated = data.map((d) =>
      d.cat_id === catId ? { ...d, ...partial } : d
    )
    setData(updated)
    onChange(updated)
  }

  function isComplete(): boolean {
    return data.every((d) => {
      if (d.gets_medication === null) return false
      if (d.has_cat_experience === null) return false
      if (!d.gets_along_with_cats) return false
      if (d.has_stress_issues === null) return false
      if (!d.aggression_risk) return false
      return true
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Atferd og helse
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fyll ut for {cats.length === 1 ? 'katten din' : 'hver katt'} slik at
          vi kan gi best mulig opphold.
        </p>
      </div>

      {cats.map((cat, catIndex) => {
        const d = data.find((x) => x.cat_id === cat.id) ?? getDefault(cat.id)

        return (
          <div key={cat.id} className="space-y-5">
            {catIndex > 0 && <Separator />}

            {/* Cat header */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🐱</span>
                )}
              </div>
              <h3 className="text-lg font-semibold">{cat.name}</h3>
            </div>

            <div className="space-y-5 pl-0 sm:pl-12">
              {/* Medisinering */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Får katten medisiner?
                </Label>
                <YesNoToggle
                  value={d.gets_medication}
                  onChange={(v) =>
                    updateCat(cat.id, {
                      gets_medication: v,
                      medication_details: v ? d.medication_details : '',
                    })
                  }
                />
                {d.gets_medication && (
                  <Textarea
                    placeholder="Hvordan gis medisinen, og hvordan reagerer katten? (F.eks. lett å gi / motvillig / trenger spesielle hensyn)"
                    value={d.medication_details ?? ''}
                    onChange={(e) =>
                      updateCat(cat.id, { medication_details: e.target.value })
                    }
                    rows={2}
                    className="mt-2 resize-none text-sm"
                  />
                )}
              </div>

              {/* Erfaring med andre katter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Har katten tidligere erfaring med andre katter?
                </Label>
                <YesNoToggle
                  value={d.has_cat_experience}
                  onChange={(v) => updateCat(cat.id, { has_cat_experience: v })}
                />
              </div>

              {/* Går godt med andre katter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Går katten godt sammen med andre katter?
                </Label>
                <ThreeWayToggle
                  value={d.gets_along_with_cats}
                  onChange={(v) =>
                    updateCat(cat.id, { gets_along_with_cats: v })
                  }
                />
              </div>

              {/* Stress */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Har katten stressrelaterte utfordringer?
                </Label>
                <YesNoToggle
                  value={d.has_stress_issues}
                  onChange={(v) =>
                    updateCat(cat.id, {
                      has_stress_issues: v,
                      stress_details: v ? d.stress_details : '',
                    })
                  }
                />
                {d.has_stress_issues && (
                  <Textarea
                    placeholder="Vennligst utdyp..."
                    value={d.stress_details ?? ''}
                    onChange={(e) =>
                      updateCat(cat.id, { stress_details: e.target.value })
                    }
                    rows={2}
                    className="mt-2 resize-none text-sm"
                  />
                )}
              </div>

              {/* Aggresjonsrisiko */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Kan katten utgjøre en risiko for andre katter (f.eks. ved
                  aggressiv atferd)?
                </Label>
                <ThreeWayToggle
                  value={d.aggression_risk}
                  onChange={(v) =>
                    updateCat(cat.id, {
                      aggression_risk: v,
                      aggression_details:
                        v === 'no' ? '' : d.aggression_details,
                    })
                  }
                />
                {(d.aggression_risk === 'yes' ||
                  d.aggression_risk === 'unknown') && (
                  <Textarea
                    placeholder="Vennligst utdyp..."
                    value={d.aggression_details ?? ''}
                    onChange={(e) =>
                      updateCat(cat.id, { aggression_details: e.target.value })
                    }
                    rows={2}
                    className="mt-2 resize-none text-sm"
                  />
                )}
              </div>
            </div>
          </div>
        )
      })}

      <Separator />

      {/* Utebur */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Utebur</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Vi har 4 utebur tilgjengelig for booking i sommermånedene. For
            katter som trives best ute om natten, kan dette være et fint
            alternativ. Burene har egne isolerte kattehus for god komfort og
            beskyttelse.
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Ønsker du å booke et utebur til katten din?
          </Label>
          <YesNoToggle
            value={wantsOutdoorCage}
            onChange={onOutdoorCageChange}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button onClick={onNext} disabled={!isComplete()} size="lg">
          Neste
        </Button>
      </div>
    </div>
  )
}
