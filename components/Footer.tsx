import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, FileText, Shield } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

const Footer = () => {
  return (
    <footer className="bg-slate-700 text-slate-200">
      <div className="bg-slate-700">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-14 md:grid-cols-4">
            {/* Om */}
            <div>
              <Image
                src="/img/logo.webp"
                alt="Mathopen Kattepensjonat"
                width={100}
                height={100}
                className="mb-4 rounded-lg object-contain"
                style={{ width: 'auto' }}
              />
              <h3 className="mb-5 text-lg font-semibold text-white">
                Mathopen Kattepensjonat
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Et trygt og omsorgsfullt kattepensjonat i Mathopen, Bergen. Vi
                tilbyr rolige omgivelser, god plass og tett oppfølging gjennom
                hele oppholdet.
              </p>
            </div>

            {/* Hurtiglenker */}
            <div>
              <h4 className="mb-5 font-semibold text-white">Hurtiglenker</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/booking"
                    className="transition-colors hover:text-white"
                  >
                    Bestill opphold
                  </Link>
                </li>
                <li>
                  <Link
                    href="/priser"
                    className="transition-colors hover:text-white"
                  >
                    Priser
                  </Link>
                </li>
                <li>
                  <Link
                    href="/om-oss"
                    className="transition-colors hover:text-white"
                  >
                    Om oss
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="transition-colors hover:text-white"
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="mb-5 font-semibold text-white">Kontakt</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-slate-500" />
                  <span>Storingavika 2, 5174 Mathopen</span>
                </li>

                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-slate-500" />
                  <a
                    href="tel:47322279"
                    className="transition-colors hover:text-white"
                  >
                    473 22 279
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-slate-500" />
                  <a
                    href="mailto:post@mathopenkattepensjonat.no"
                    className="break-all transition-colors hover:text-white"
                  >
                    post@mathopenkattepensjonat.no
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 text-slate-500" />
                  <span>
                    Telefontid:
                    <br />
                    11:00–12:00 og 17:00–20:00
                  </span>
                </li>
              </ul>
            </div>

            {/* Praktisk */}
            <div>
              <h4 className="mb-5 font-semibold text-white">Praktisk</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-500" />
                  <span>Org.nr: 936 918 867</span>
                </li>

                <li className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-500" />
                  <Link
                    href="/personvern"
                    className="transition-colors hover:text-white"
                  >
                    Personvern
                  </Link>
                </li>

                <li className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-500" />
                  <Link
                    href="/vilkar"
                    className="transition-colors hover:text-white"
                  >
                    Vilkår
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row">
            <p className="text-center md:text-left">
              © {CURRENT_YEAR} Mathopen Kattepensjonat. Alle rettigheter
              reservert.
            </p>

            <p>
              Utviklet av{' '}
              <a
                href="https://sebastianmoldrup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors"
              >
                Sebastian Møldrup
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
