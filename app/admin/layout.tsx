import { AdminNav } from '@/components/admin/AdminNav'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <AdminMobileNav />
    </div>
  )
}
