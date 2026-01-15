"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LIST_ITEMS = [
  {
    url: "",
    text: "Hjem",
  },
  {
    url: "",
    text: "Om oss",
  },
  {
    url: "",
    text: "Informasjon",
  },
  {
    url: "",
    text: "Priser & betingelser",
  },
  {
    url: "",
    text: "Bilder",
  },
  {
    url: "",
    text: "Kontakt oss",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-accent py-6 shadow-xl">
        <div className="container mx-auto flex items-center justify-between px-4 lg:justify-center lg:gap-8 lg:px-0">
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <Image
              src="/img/cropped.webp"
              width={150}
              height={150}
              alt="Picture of the author"
              className="w-24 h-24 lg:w-[150px] lg:h-[150px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-center">
            <ul className="flex gap-2 items-center">
              {LIST_ITEMS.map(
                (
                  { url, text }: { url: string; text: string },
                  index: number,
                ) => (
                  <li key={index}>
                    <Link
                      href={url}
                      className="inline-block px-4 py-2 text-md font-medium transition-transform hover:scale-110"
                    >
                      {text}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <Button size="lg" className="hidden lg:block shrink-0">
            BOOK NÅ
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-accent-foreground/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-accent z-50 lg:hidden">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link href="/" aria-label="Home" onClick={() => setIsOpen(false)}>
                <Image
                  src="/img/cropped.webp"
                  width={100}
                  height={100}
                  alt="Picture of the author"
                  className="w-20 h-20"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent-foreground/10 rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex items-center justify-center">
              <ul className="flex flex-col gap-6 text-center">
                {LIST_ITEMS.map(
                  (
                    { url, text }: { url: string; text: string },
                    index: number,
                  ) => (
                    <li key={index}>
                      <Link
                        href={url}
                        onClick={() => setIsOpen(false)}
                        className="block text-2xl font-medium hover:text-primary transition-colors"
                      >
                        {text}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* CTA Button */}
            <div className="p-6 border-t border-border">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={() => setIsOpen(false)}
              >
                BOOK NÅ
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
