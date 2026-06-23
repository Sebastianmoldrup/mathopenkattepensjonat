'use client'

import { useEffect } from 'react'

export function PrintTrigger() {
  useEffect(() => {
    // Kort delay for å la bilder laste
    const timer = setTimeout(() => {
      window.print()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return null
}
