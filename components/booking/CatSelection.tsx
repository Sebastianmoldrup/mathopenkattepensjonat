'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Cat } from '@/lib/booking/types'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddCatDialog } from './AddCatDialog'

interface CatSelectionProps {
  cats: Cat[]
  catCount: number | null
  selectedCatIds: string[]
  onChange: (ids: string[]) => void
  onCatsUpdated: (cats: Cat[]) => void
  onNext: () => void
  onBack?: () => void
}

export function CatSelection({
  cats,
  catCount,
  selectedCatIds,
  onChange,
  onCatsUpdated,
  onNext,
  onBack,
}: CatSelectionProps) {
  const [showAddCat, setShowAddCat] = useState(false)
  const maxCats = catCount ?? 3

  function toggle(id: string) {
    if (selectedCatIds.includes(id)) {
      onChange(selectedCatIds.filter((i) => i !== id))
    } else if (catCount === null) {
      if (selectedCatIds.length < maxCats) {
        onChange([...selectedCatIds, id])
      }
    } else {
      if (selectedCatIds.length >= maxCats) {
        onChange([...selectedCatIds.slice(0, maxCats - 1), id])
      } else {
        onChange([...selectedCatIds, id])
      }
    }
  }

  function handleCatAdded(newCat: Cat) {
    const updated = [...cats, newCat]
    onCatsUpdated(updated)
    // Auto-select the new cat if there's room
    if (selectedCatIds.length < maxCats) {
      onChange([...selectedCatIds, newCat.id])
    }
  }

  const canProceed =
    catCount === null
      ? selectedCatIds.length >= 1 && selectedCatIds.length <= 3
      : selectedCatIds.length === catCount

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Velg katter</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {catCount === null
              ? 'Velg kattene som skal være med på oppholdet (maks 3).'
              : catCount === 1
                ? 'Velg katten som skal være med på oppholdet.'
                : `Velg ${catCount} katter som skal være med på oppholdet.`}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => setShowAddCat(true)}
        >
          <Plus className="h-4 w-4" />
          Ny katt
        </Button>
      </div>

      {cats.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/30 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Du har ingen katter registrert ennå.
          </p>
          <Button
            type="button"
            onClick={() => setShowAddCat(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Legg til katt
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

      {catCount !== null &&
        selectedCatIds.length > 0 &&
        selectedCatIds.length < catCount && (
          <p className="text-sm text-amber-600">
            Velg {catCount - selectedCatIds.length} katt
            {catCount - selectedCatIds.length !== 1 ? 'er' : ''} til
          </p>
        )}

      <div className="flex justify-between pt-2">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Tilbake
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Neste
        </Button>
      </div>

      <AddCatDialog
        open={showAddCat}
        onOpenChange={setShowAddCat}
        onCatAdded={handleCatAdded}
      />
    </div>
  )
}
