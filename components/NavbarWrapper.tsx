import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Navbar from './Navbar'

export async function NavbarWrapper() {
  await connection()
  const supabase = await createClient()

  // getUser()/rpc() can throw during a session cookie that's mid-transition
  // (e.g. right after a cross-tab auth event triggers a reload). Since this
  // is an async Server Component inside a Suspense boundary, an uncaught
  // throw here fails the whole boundary server-side with no client-side
  // fallback to switch to (Server Components can't render on the client),
  // which is what produced the "could not finish this Suspense boundary"
  // error. Treat any failure as logged-out instead.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let isAdmin = false
    if (user) {
      const { data } = await supabase.rpc('is_admin')
      isAdmin = !!data
    }

    return <Navbar isAdmin={isAdmin} isLoggedIn={!!user} />
  } catch {
    return <Navbar isAdmin={false} isLoggedIn={false} />
  }
}
