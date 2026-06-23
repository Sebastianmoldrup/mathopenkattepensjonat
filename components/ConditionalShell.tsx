'use client'

import { usePathname } from 'next/navigation'

export function ConditionalShell({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname?.startsWith('/print')) {
    return <>{children}</>
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  )
}
