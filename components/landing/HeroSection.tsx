import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-background to-white px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-200">
          Kattepensjonat i Bergen
        </Badge>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Mathopen Kattepensjonat
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-600">
          Det trygge hjemmet når du er bortreist
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/booking">
            <Button size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Bestill opphold
            </Button>
          </Link>
          <Link
            href="https://maps.app.goo.gl/AdkUWXNkv9DGmobE6"
            target="_blank"
          >
            <Button size="lg" variant="outline">
              <MapPin className="mr-2 h-5 w-5" />
              Storingavika 2, 5174 Mathopen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
