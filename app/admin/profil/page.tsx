import type { Metadata } from 'next'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/actions'
import { AdminProfileForm } from '@/components/admin/AdminProfileForm'

export const metadata: Metadata = { title: 'Min profil – Admin' }

async function ProfilContent() {
  await connection()
  await requireAdmin()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('first_name, last_name, phone, address, emergency_contact, notes')
    .eq('id', user!.id)
    .single()

  return <AdminProfileForm adminUser={adminUser} />
}

export default function AdminProfilPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProfilContent />
    </Suspense>
  )
}
