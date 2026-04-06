'use client'

import Image from 'next/image'
import { Cat } from '@/lib/booking/types'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CatSelectionProps {
  cats: Cat[]
  selectedCatIds: string[]
  onChange: (ids: string[]) => void
  onNext: () => void
}

const MAX_CATS = 3

export function CatSelection({
  cats,
  selectedCatIds,
  onChange,
  onNext,
}: CatSelectionProps) {
  function toggle(catId: string) {
    if (selectedCatIds.includes(catId)) {
      onChange(selectedCatIds.filter((id) => id !== catId))
    } else {
      if (selectedCatIds.length >= MAX_CATS) return
      onChange([...selectedCatIds, catId])
    }
  }

  const canProceed = selectedCatIds.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Velg katter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg opptil {MAX_CATS} katter som skal bo hos oss.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((cat) => {
          const isSelected = selectedCatIds.includes(cat.id)
          const isDisabled = !isSelected && selectedCatIds.length >= MAX_CATS

          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              disabled={isDisabled}
              className={cn(
                'relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-muted-foreground/40',
                isDisabled && 'cursor-not-allowed opacity-40'
              )}
            >
              {/* Checkmark */}
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}

              {/* Cat image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    🐱
                  </div>
                )}
              </div>

              {/* Cat info */}
              <div className="space-y-1">
                <p className="font-semibold leading-none">{cat.name}</p>
                {cat.breed && (
                  <p className="text-xs text-muted-foreground">{cat.breed}</p>
                )}
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {cat.age && (
                    <Badge variant="secondary" className="text-xs">
                      {cat.age}
                    </Badge>
                  )}
                  {cat.gender && (
                    <Badge variant="outline" className="text-xs">
                      {cat.gender}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selectedCatIds.length === MAX_CATS && (
        <p className="text-center text-xs text-muted-foreground">
          Maks {MAX_CATS} katter per booking. Fjern en for å velge en annen.
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Neste
        </Button>
      </div>
    </div>
  )
}
