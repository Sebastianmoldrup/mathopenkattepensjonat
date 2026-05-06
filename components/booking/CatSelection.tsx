'use client'

import Image from 'next/image'
import { Cat } from '@/lib/booking/types'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CatSelectionProps {
  cats: Cat[]
  catCount: number
  selectedCatIds: string[]
  onChange: (ids: string[]) => void
  onNext: () => void
  onBack: () => void
}

export function CatSelection({
  cats,
  catCount,
  selectedCatIds,
  onChange,
  onNext,
  onBack,
}: CatSelectionProps) {
  function toggle(id: string) {
    if (selectedCatIds.includes(id)) {
      onChange(selectedCatIds.filter((i) => i !== id))
    } else {
      if (selectedCatIds.length >= catCount) {
        // Replace last selected if at limit
        onChange([...selectedCatIds.slice(0, catCount - 1), id])
      } else {
        onChange([...selectedCatIds, id])
      }
    }
  }

  const canProceed = selectedCatIds.length === catCount

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Velg katter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg {catCount === 1 ? 'katten' : `${catCount} katter`} som skal være
          med på oppholdet.
        </p>
      </div>

      {cats.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/30 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Du har ingen katter registrert ennå.
          </p>
          <Button asChild variant="outline">
            <Link href="/minside/minekatter/legg-til">Legg til katt</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => {
            const isSelected = selectedCatIds.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-muted-foreground/40'
                )}
              >
                {isSelected && (
                  <span className="absolute right-3 top-3 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-muted">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl">
                      🐱
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{cat.name}</p>
                  {cat.breed && (
                    <p className="truncate text-xs text-muted-foreground">
                      {cat.breed}
                    </p>
                  )}
                  {cat.age && (
                    <p className="text-xs text-muted-foreground">
                      {cat.age} år
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedCatIds.length > 0 && selectedCatIds.length < catCount && (
        <p className="text-sm text-amber-600">
          Velg {catCount - selectedCatIds.length} katt
          {catCount - selectedCatIds.length !== 1 ? 'er' : ''} til
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Neste
        </Button>
      </div>
    </div>
  )
}
