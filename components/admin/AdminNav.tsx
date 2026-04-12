'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  PawPrint,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Oversikt', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookinger', label: 'Bookinger', icon: BookOpen },
  { href: '/admin/kalender', label: 'Kalender', icon: CalendarDays },
  { href: '/admin/sjekkliste', label: 'Daglige rutiner', icon: ClipboardCheck },
  { href: '/admin/hms', label: 'HMS & Beredskap', icon: ShieldCheck },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col border-r bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-5">
        <PawPrint className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold leading-tight">
          Mathopen
          <br />
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t px-5 py-4">
        <p className="text-xs text-muted-foreground">Admin panel</p>
      </div>
    </aside>
  )
}
