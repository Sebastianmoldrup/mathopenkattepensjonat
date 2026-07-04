'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton({
  fullWidth = false,
  mobile = false,
}: {
  fullWidth?: boolean
  mobile?: boolean
}) {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Hard navigation, not router.push(). The signOut() call fires a
    // SIGNED_OUT event that AuthListener also reacts to (with its own
    // reload) -- stacking that with a router.push() in this same tab
    // creates overlapping client-side transitions, which is what caused
    // stuck "infinite loading" on the next navigation. A hard reload
    // avoids that entirely. Other tabs are unaffected -- they only ever
    // receive the single broadcasted SIGNED_OUT event.
    window.location.href = '/'
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className={`${fullWidth ? 'w-full max-w-lg' : ''} ${mobile ? 'py-8' : ''}`}
    >
      Logg ut
    </Button>
  )
}
