import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { NavbarWrapper } from '@/components/NavbarWrapper'
import { Suspense } from 'react'
import Footer from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Mathopen Kattepensjonat',
  description:
    'Mathopen Kattepensjonat i Bergen – et trygt, rolig og moderne kattepensjonat med store rom, kattegård, tett oppfølging og omsorg. Perfekt for katter i alle aldre.',
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <nav className="h-[104px] border-b border-border bg-accent/95" />
            }
          >
            <NavbarWrapper />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
