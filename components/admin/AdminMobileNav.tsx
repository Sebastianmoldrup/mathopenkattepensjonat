'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BedDouble, LogIn, ClipboardCheck, Menu, PawPrint } from 'lucide-react'
import { AdminNavLinks } from './AdminNav'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Only the tasks staff actually do on a phone at the cages, day to day.
// Everything else (bookings, users, HMS, etc.) lives behind "Mer".
const MOBILE_TABS = [
  { href: '/admin/burstatus', label: 'Burstatus', icon: BedDouble },
  { href: '/admin/innsjekk', label: 'Innsjekk', icon: LogIn },
  { href: '/admin/sjekkliste', label: 'Rutiner', icon: ClipboardCheck },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Link>
        )
      })}
      <button
        onClick={() => setMoreOpen(true)}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
        Mer
      </button>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-5 py-5">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold leading-tight">
              <PawPrint className="h-5 w-5 text-primary" />
              Mathopen Admin
            </SheetTitle>
          </SheetHeader>
          <AdminNavLinks onNavigateAction={() => setMoreOpen(false)} />
        </SheetContent>
      </Sheet>
    </nav>
  )
}
