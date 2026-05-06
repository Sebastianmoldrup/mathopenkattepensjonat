'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CatCountStepProps {
  onSelect: (count: number) => void
}

export function CatCountStep({ onSelect }: CatCountStepProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Hvor mange katter?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg antall katter du ønsker å booke opphold for.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((count) => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-border',
              'bg-card p-6 text-left transition-all duration-150',
              'hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <span className="text-3xl font-bold text-primary">{count}</span>
            <span className="text-sm text-muted-foreground">
              {count === 1 ? 'katt' : 'katter'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowDialog(true)}
          className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Mer enn 3 katter?
        </button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mer enn 3 katter</DialogTitle>
            <DialogDescription>
              For opphold med 4 eller flere katter ta kontakt med oss direkte så
              finner vi en løsning.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild className="gap-2">
              <Link href="mailto:post@mathopenkattepensjonat.no">
                <Mail className="h-4 w-4" />
                post@mathopenkattepensjonat.no
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="tel:+4747322279">
                <Phone className="h-4 w-4" />
                473 22 279
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
