'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface MasonryImage {
  src: string
  alt: string
  width: number
  height: number
}

interface MasonryGalleryProps {
  images: MasonryImage[]
}

const THUMB_SIZES = '(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw'
const LIGHTBOX_SIZES = '(min-width: 768px) 800px, 90vw'

export default function MasonryGallery({ images }: MasonryGalleryProps) {
  return (
    <section className="w-full">
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {images.map(({ src, alt, width, height }) => (
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
                  width={width}
                  height={height}
                  loading="lazy"
                  sizes={THUMB_SIZES}
                  className="h-auto w-full rounded-lg transition-transform hover:scale-[1.01]"
                />
              </button>
            </DialogTrigger>

            <DialogContent
              showCloseButton={false}
              className="w-auto max-w-[92vw] border-none bg-transparent p-0 shadow-none sm:max-w-[92vw]"
            >
              <DialogTitle className="sr-only">{alt}</DialogTitle>
              <DialogDescription className="sr-only">
                Forstørret bilde.
              </DialogDescription>

              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={LIGHTBOX_SIZES}
                className="block h-auto max-h-[85vh] w-auto max-w-[92vw] rounded-lg"
              />

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
