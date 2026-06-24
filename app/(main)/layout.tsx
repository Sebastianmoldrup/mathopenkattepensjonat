import { NavbarWrapper } from '@/components/NavbarWrapper'
import { Suspense } from 'react'
import Footer from '@/components/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense
        fallback={
          <nav className="h-[104px] border-b border-border bg-accent/95" />
        }
      >
        <NavbarWrapper />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
