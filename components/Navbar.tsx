'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/client'

const LIST_ITEMS = [
  { url: '/', text: 'Hjem' },
  { url: '/om-oss', text: 'Om oss' },
  { url: '/informasjon', text: 'Informasjon' },
  { url: '/priser', text: 'Priser & betingelser' },
  { url: '/rom-og-fasiliteter', text: 'Rom & fasiliteter' },
  { url: '/bilder', text: 'Bilder' },
  { url: '/kontakt', text: 'Kontakt oss' },
]

export default function Navbar({
  isAdmin: initialIsAdmin,
  isLoggedIn: initialIsLoggedIn,
}: {
  isAdmin: boolean
  isLoggedIn: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        const { data } = await supabase.rpc('is_admin')
        setIsAdmin(!!data)
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-accent/95 p-2 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-24 items-center justify-between">
            <Link href="/" aria-label="Hjem" className="flex items-center">
              <Image
                src="/img/cropped.webp"
                width={160}
                height={160}
                priority
                alt="Logo"
                className="h-24 w-24 object-contain"
                style={{ width: 'auto' }}
              />
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {LIST_ITEMS.map(({ url, text }) => (
                <Link
                  key={url}
                  href={url}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {text}
                </Link>
              ))}
            </nav>

            {/* PC knapper */}
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              {isLoggedIn ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/minside">Min side</Link>
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link href="/login">Logg inn</Link>
                </Button>
              )}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="rounded-md p-2 transition-colors hover:bg-accent-foreground/10 lg:hidden"
              aria-label="Åpne meny"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobilmeny */}
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

          {/* Mobil knapper */}
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
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full max-w-lg py-8"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/minside">Min side</Link>
                </Button>
              </>
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
