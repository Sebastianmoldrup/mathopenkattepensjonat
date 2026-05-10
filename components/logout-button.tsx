'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/actions/auth/signOut'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Logg ut
      </Button>
    </form>
  )
}
