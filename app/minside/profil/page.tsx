import { createClient } from '@/lib/supabase/server'
import { readUser } from '@/actions/user/readUser'
import { ProfileForm } from '@/components/profile-form'
import { redirect } from 'next/navigation'

export default async function ProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await readUser(user.id)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-8">
      <ProfileForm user={profile} />
    </div>
  )
}
