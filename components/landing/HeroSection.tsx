import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
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
        <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600">
          Det trygge hjemmet når du er bortreist
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/booking">
            <Button
              size="lg"
              className="group h-14 gap-2 rounded-xl px-8 text-base font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <Calendar className="h-5 w-5" />
              Bestill opphold
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link
            href="https://maps.app.goo.gl/AdkUWXNkv9DGmobE6"
            target="_blank"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-14 gap-2 rounded-xl px-6 text-sm text-slate-600"
            >
              <MapPin className="h-4 w-4" />
              Storingavika 2, 5174 Mathopen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
