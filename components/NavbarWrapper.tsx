import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Navbar from './Navbar'

export async function NavbarWrapper() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data } = await supabase.rpc('is_admin')
    isAdmin = !!data
  }

  return <Navbar isAdmin={isAdmin} isLoggedIn={!!user} />
}
