'use client'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const supabase = createClient()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      window.location.href = '/'
    }
  }

  return (
    <Button type="submit" variant="outline" onClick={signOut}>
      Logg ut
    </Button>
  )
}
