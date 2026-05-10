import Link from 'next/link'
import Image from 'next/image'
import { AuthButton } from './auth-button'
import { AdminButton } from './navbar/AdminButton'
import { MobileMenuButton } from './navbar/MobileMenu'
import { Suspense } from 'react'

const LIST_ITEMS = [
  { url: '/', text: 'Hjem' },
  { url: '/om-oss', text: 'Om oss' },
  { url: '/informasjon', text: 'Informasjon' },
  { url: '/priser', text: 'Priser & betingelser' },
  { url: '/rom-og-fasiliteter', text: 'Rom & fasiliteter' },
  { url: '/bilder', text: 'Bilder' },
  { url: '/kontakt', text: 'Kontakt oss' },
]

export default async function Navbar() {
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

            <div className="hidden items-center gap-2 lg:flex">
              <Suspense fallback={null}>
                <AdminButton />
              </Suspense>
              <AuthButton />
            </div>

            <MobileMenuButton />
          </div>
        </div>
      </header>
    </>
  )
}
