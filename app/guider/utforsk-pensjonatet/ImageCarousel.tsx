'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
  src: string
  alt: string
}

interface ImageCarouselProps {
  images: CarouselImage[]
}

const CLONE = 3
const TRANSITION_MS = 380

export function ImageCarousel({ images }: ImageCarouselProps) {
  const n = images.length
  if (n === 0) return null

  const items = [
    ...images.slice(-CLONE),
    ...images,
    ...images.slice(0, CLONE),
  ]

  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const busyRef = useRef(false)
  const touchXRef = useRef<number | null>(null)

  const getItemWidth = () => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null
    return first ? first.offsetWidth : (wrapRef.current?.clientWidth ?? 0)
  }

  const applyTranslate = (pos: number, animate: boolean) => {
    const el = trackRef.current
    if (!el) return
    const px = (CLONE + pos) * getItemWidth()
    el.style.transition = animate ? `transform ${TRANSITION_MS}ms ease` : 'none'
    el.style.transform = `translateX(-${px}px)`
  }

  const go = (delta: number) => {
    if (busyRef.current) return
    busyRef.current = true
    posRef.current += delta
    applyTranslate(posRef.current, true)
  }

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Ignore events bubbling up from child elements or non-transform transitions
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return
    if (posRef.current >= n) {
      posRef.current -= n
      applyTranslate(posRef.current, false)
    } else if (posRef.current < 0) {
      posRef.current += n
      applyTranslate(posRef.current, false)
    }
    busyRef.current = false
  }

  useEffect(() => {
    const init = () => applyTranslate(posRef.current, false)
    init()
    const obs = new ResizeObserver(init)
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchXRef.current === null) return
    const diff = touchXRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1)
    touchXRef.current = null
  }

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-xl">
      <div
        ref={trackRef}
        className="flex"
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((img, i) => (
          <div key={i} className="w-full shrink-0 px-1 sm:w-1/2 lg:w-1/3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Forrige bilde"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Neste bilde"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>
    </div>
  )
}
