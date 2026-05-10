import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export async function AdminButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) return null

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/admin">Admin</Link>
    </Button>
  )
}
