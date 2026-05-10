'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { AuthButton } from '@/components/auth-button'

const LIST_ITEMS = [
  { url: '/', text: 'Hjem' },
  { url: '/om-oss', text: 'Om oss' },
  { url: '/informasjon', text: 'Informasjon' },
  { url: '/priser', text: 'Priser & betingelser' },
  { url: '/rom-og-fasiliteter', text: 'Rom & fasiliteter' },
  { url: '/bilder', text: 'Bilder' },
  { url: '/kontakt', text: 'Kontakt oss' },
]

export function MobileMenuButton() {
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

      <div
        className={`fixed inset-0 z-50 bg-accent transition-all duration-300 ease-out ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`flex h-full transform flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
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
              {LIST_ITEMS.map(({ url, text }, index) => (
                <li
                  key={url}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`transform transition-all duration-300 ease-out ${
                    isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                  }`}
                >
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

          <div
            className="flex justify-center border-t border-border p-4"
            onClick={() => setIsOpen(false)}
          >
            <AuthButton fullWidth mobile />
          </div>
        </div>
      </div>
    </>
  )
}
