'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/actions/auth/signOut'

export function LogoutButton({
  fullWidth = false,
  mobile = false,
}: {
  fullWidth?: boolean
  mobile?: boolean
}) {
  async function handleSignOut() {
    await signOut()
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
