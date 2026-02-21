'use client'

import Image from 'next/image'
import { catImages } from '@/lib/hooks/getCatImages'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

export default function CatMasonryGallery() {
  return (
    <section className="w-full px-4">
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {catImages.map(({ src, alt }) => (
          <Dialog key={src}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={`Åpne bilde: ${alt}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-auto w-full rounded-lg transition-transform hover:scale-[1.01]"
                />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-0">
              <DialogTitle className="sr-only">{alt}</DialogTitle>
              <DialogDescription className="sr-only">
                Forstørret bilde.
              </DialogDescription>

              <div className="relative w-full">
                {/* Big image */}
                <Image
                  src={src}
                  alt={alt}
                  width={1600}
                  height={1200}
                  className="h-auto w-full rounded-lg"
                />
              </div>

              <DialogClose asChild>
                <button
                  aria-label="Lukk bilde"
                  className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow ring-1 ring-border transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  )
}
