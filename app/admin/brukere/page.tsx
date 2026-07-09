import { Suspense } from 'react'
import { adminGetAllUsers } from '@/lib/admin/actions'
import { UsersTable } from '@/components/admin/UsersTable'
import { Loader2 } from 'lucide-react'

async function UsersContent() {
  const users = await adminGetAllUsers()
  return <UsersTable users={users} />
}

export default function AdminBrukerePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Brukere</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Se registrerte eiere og kattene deres, og finn brukere som trenger oppfølging.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <UsersContent />
      </Suspense>
    </div>
  )
}
