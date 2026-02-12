import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, FileText, Shield } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="text-slate-200 bg-slate-700">
      <div className="bg-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid gap-14 md:grid-cols-4">
            {/* Om */}
            <div>
              <Image
                src="/img/logo.webp"
                alt="Mathopen Kattepensjonat"
                width={100}
                height={100}
                className="mb-4 object-contain rounded-lg"
              />
              <h3 className="text-lg font-semibold mb-5 text-white">
                Mathopen Kattepensjonat
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Et trygt og omsorgsfullt kattepensjonat i Mathopen, Bergen. Vi
                tilbyr rolige omgivelser, god plass og tett oppfølging gjennom
                hele oppholdet.
              </p>
            </div>

            {/* Hurtiglenker */}
            <div>
              <h4 className="font-semibold mb-5 text-white">Hurtiglenker</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/booking"
                    className="hover:text-white transition-colors"
                  >
                    Bestill opphold
                  </Link>
                </li>
                <li>
                  <Link
                    href="/priser"
                    className="hover:text-white transition-colors"
                  >
                    Priser
                  </Link>
                </li>
                <li>
                  <Link
                    href="/om-oss"
                    className="hover:text-white transition-colors"
                  >
                    Om oss
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="hover:text-white transition-colors"
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="font-semibold mb-5 text-white">Kontakt</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-slate-500" />
                  <span>Storingavika 2, 5174 Mathopen</span>
                </li>

                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-slate-500" />
                  <a
                    href="tel:47322279"
                    className="hover:text-white transition-colors"
                  >
                    473 22 279
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-slate-500" />
                  <a
                    href="mailto:post@mathopenkattepensjonat.no"
                    className="hover:text-white transition-colors break-all"
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
              <h4 className="font-semibold mb-5 text-white">Praktisk</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-500" />
                  <span>Org.nr: 936 918 867</span>
                </li>

                <li className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-500" />
                  <Link
                    href="/personvern"
                    className="hover:text-white transition-colors"
                  >
                    Personvern
                  </Link>
                </li>

                <li className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-500" />
                  <Link
                    href="/vilkar"
                    className="hover:text-white transition-colors"
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
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p className="text-center md:text-left">
              © {CURRENT_YEAR} Mathopen Kattepensjonat. Alle rettigheter
              reservert.
            </p>

            <p>
              Utviklet av{" "}
              <a
                href="https://sebastianmoldrup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-white"
              >
                Sebastian Møldrup
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
