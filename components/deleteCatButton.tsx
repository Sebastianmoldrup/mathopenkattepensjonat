'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteCat } from '@/actions/cat/deleteCat'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'

export function DeleteCatButton({ catId }: { catId: string }) {
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('catId', catId)
        await deleteCat(formData)
        setDialogOpen(false)
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Noe gikk galt ved sletting.'
        )
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setError(null)
          setDialogOpen(true)
        }}
      >
        Slett
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              Slett katt
            </DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette denne katten? All informasjon
              slettes permanent og kan ikke gjenopprettes.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!error ? (
            <div className="flex gap-2 pt-2">
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                {isPending ? 'Sletter...' : 'Ja, slett permanent'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Avbryt
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full"
            >
              Lukk
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
