'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  PawPrint,
  ShieldCheck,
  FileText,
  BookMarked,
  XCircle,
  Grid3X3,
  LogIn,
  User,
  BedDouble,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

export type AdminNavGroup = {
  title: string | null
  items: AdminNavItem[]
}

// Grouped by how staff actually use the panel: daily on-the-floor tasks
// first, then back-office booking admin, then reference/compliance material.
export const NAV_GROUPS: AdminNavGroup[] = [
  {
    title: null,
    items: [{ href: '/admin', label: 'Oversikt', icon: LayoutDashboard, exact: true }],
  },
  {
    title: 'I dag',
    items: [
      { href: '/admin/burstatus', label: 'Burstatus', icon: BedDouble },
      { href: '/admin/innsjekk', label: 'Innsjekk / Utsjekk', icon: LogIn },
      { href: '/admin/sjekkliste', label: 'Daglige rutiner', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Bookinger',
    items: [
      { href: '/admin/bookinger', label: 'Bookinger', icon: BookOpen },
      { href: '/admin/brukere', label: 'Brukere', icon: Users },
      { href: '/admin/avbestillinger', label: 'Avbestillinger', icon: XCircle },
      { href: '/admin/burplassering', label: 'Burplassering', icon: Grid3X3 },
    ],
  },
  {
    title: 'Dokumentasjon',
    items: [
      { href: '/admin/hms', label: 'HMS & Beredskap', icon: ShieldCheck },
      { href: '/admin/dokumentasjon', label: 'Dokumentasjon', icon: FileText },
      { href: '/admin/guide', label: 'Guide', icon: BookMarked },
    ],
  },
  {
    title: null,
    items: [{ href: '/admin/profil', label: 'Min profil', icon: User }],
  },
]

function isItemActive(pathname: string, item: AdminNavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href)
}

export function AdminNavLinks({ onNavigateAction }: { onNavigateAction?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 space-y-4 px-3 py-4">
      {NAV_GROUPS.map((group, i) => (
        <div key={group.title ?? `group-${i}`} className="space-y-1">
          {group.title && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
              {group.title}
            </p>
          )}
          {group.items.map((item) => {
            const isActive = isItemActive(pathname, item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigateAction}
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
        </div>
      ))}
    </nav>
  )
}

export function AdminNav() {
  return (
    <aside className="hidden min-h-screen w-56 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex items-center gap-2 border-b px-5 py-5">
        <PawPrint className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold leading-tight">
          Mathopen
          <br />
          Admin
        </span>
      </div>
      <AdminNavLinks />
      <div className="border-t px-5 py-4">
        <p className="text-xs text-muted-foreground">Admin panel</p>
      </div>
    </aside>
  )
}
