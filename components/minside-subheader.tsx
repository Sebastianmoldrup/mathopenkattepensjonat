"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MinSideSubHeader() {
  const pathname = usePathname();

  if (pathname === "/minside") return null;

  return (
    <Link
      href="/minside"
      className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      ← Tilbake til Min side
    </Link>
  );
}
