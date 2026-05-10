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
