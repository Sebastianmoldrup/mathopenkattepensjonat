"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthButton } from "./auth-button";

const LIST_ITEMS = [
  { url: "/", text: "Hjem" },
  { url: "/om-oss", text: "Om oss" },
  { url: "/informasjon", text: "Informasjon" },
  { url: "/priser", text: "Priser & betingelser" },
  // { url: "/bilder", text: "Bilder" },
  { url: "/rom-og-fasiliteter", text: "Rom & fasiliteter" },
  { url: "/kontakt", text: "Kontakt oss" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-border bg-accent/95 backdrop-blur p-2">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-24 items-center justify-between">
            {/* Logo */}
            <Link href="/" aria-label="Hjem" className="flex items-center">
              <Image
                src="/img/cropped.webp"
                width={160}
                height={160}
                priority
                alt="Logo"
                className="h-24 w-24 object-contain"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-6">
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

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden rounded-md p-2 transition-colors hover:bg-accent-foreground/10"
              aria-label="Åpne meny"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          fixed inset-0 z-50 bg-accent
          transition-all duration-300 ease-out
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          className={`
            flex h-full flex-col
            transform transition-transform duration-300 ease-out
            ${isOpen ? "translate-y-0" : "-translate-y-4"}
          `}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Image
              src="/img/cropped.webp"
              width={160}
              height={160}
              alt="Logo"
              className="h-24 w-24 object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 transition-colors hover:bg-accent-foreground/10"
              aria-label="Lukk meny"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation (centered vertically) */}
          <nav className="flex flex-1 items-center justify-center">
            <ul className="flex flex-col gap-8 text-center">
              {LIST_ITEMS.map(({ url, text }, index) => (
                <li
                  key={url}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`
                    transform transition-all duration-300 ease-out
                    ${
                      isOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }
                  `}
                >
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

          {/* Bottom CTA */}
          <div
            className="flex justify-center border-t border-border p-4"
            onClick={() => setIsOpen(false)}
          >
            <AuthButton fullWidth mobile />
          </div>
        </div>
      </div>
    </>
  );
}
