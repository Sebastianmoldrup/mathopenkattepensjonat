import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Kattepensjonat i Bergen | Mathopen Kattepensjonat',
  description:
    'Mathopen Kattepensjonat i Bergen – et trygt, rolig og moderne kattepensjonat med store rom, kattegård, tett oppfølging og omsorg. Perfekt for katter i alle aldre.',
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://www.mathopenkattepensjonat.no',
    siteName: 'Mathopen Kattepensjonat',
    title: 'Kattepensjonat i Bergen | Mathopen Kattepensjonat',
    description:
      'Mathopen Kattepensjonat i Bergen – et trygt, rolig og moderne kattepensjonat med store rom, kattegård, tett oppfølging og omsorg. Perfekt for katter i alle aldre.',
    images: [
      {
        url: '/img/om-oss.webp',
        width: 1200,
        height: 630,
        alt: 'Mathopen Kattepensjonat i Bergen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kattepensjonat i Bergen | Mathopen Kattepensjonat',
    description:
      'Mathopen Kattepensjonat i Bergen – et trygt, rolig og moderne kattepensjonat med store rom, kattegård, tett oppfølging og omsorg. Perfekt for katter i alle aldre.',
    images: ['/img/om-oss.webp'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AnimalBoardingFacility',
  name: 'Mathopen Kattepensjonat',
  description:
    'Trygt, rolig og moderne kattepensjonat i Bergen med store rom, kattegård og tett individuell oppfølging.',
  url: 'https://www.mathopenkattepensjonat.no',
  telephone: '+4747322279',
  email: 'post@mathopenkattepensjonat.no',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Storingavika 2',
    addressLocality: 'Mathopen',
    postalCode: '5174',
    addressCountry: 'NO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 60.3414794,
    longitude: 5.1973496,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Sunday',
      ],
      opens: '17:30',
      closes: '19:30',
    },
  ],
  priceRange: 'kr',
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
    <html lang="no" suppressHydrationWarning>
      <body
        className={`${geistSans.className} flex min-h-screen flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
