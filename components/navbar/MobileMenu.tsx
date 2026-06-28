'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LIST_ITEMS = [
  { url: '/', text: 'Hjem' },
  { url: '/om-oss', text: 'Om oss' },
  { url: '/informasjon', text: 'Informasjon' },
  { url: '/priser', text: 'Priser & betingelser' },
  { url: '/rom-og-fasiliteter', text: 'Rom & fasiliteter' },
  { url: '/bilder', text: 'Bilder' },
  { url: '/kontakt', text: 'Kontakt oss' },
]

export function MobileMenuButton({
  isAdmin,
  isLoggedIn,
}: {
  isAdmin: boolean
  isLoggedIn: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md p-2 transition-colors hover:bg-accent-foreground/10 lg:hidden"
        aria-label="Åpne meny"
      >
        <Menu size={28} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ backgroundColor: '#f5f0eb' }}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-2">
            <Image
              src="/img/cropped.webp"
              width={160}
              height={160}
              alt="Logo"
              className="h-24 w-24 object-contain"
              style={{ width: 'auto' }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 transition-colors hover:bg-accent-foreground/10"
              aria-label="Lukk meny"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-1 items-center justify-center">
            <ul className="flex flex-col gap-8 text-center">
              {LIST_ITEMS.map(({ url, text }) => (
                <li key={url}>
                  <Link
                    href={url}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-medium tracking-tight text-foreground transition-colors hover:text-primary"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border p-4">
            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className="w-full max-w-lg py-8"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            {isLoggedIn ? (
              <Button
                asChild
                variant="outline"
                className="w-full max-w-lg py-8"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/minside">Min side</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="w-full max-w-lg py-8"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/login">Logg inn</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
