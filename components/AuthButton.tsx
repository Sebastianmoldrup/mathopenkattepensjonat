import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LogoutButton } from './logout-button'

export async function AuthButton({
  fullWidth = false,
  mobile = false,
}: {
  fullWidth?: boolean
  mobile?: boolean
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data } = await supabase.rpc('is_admin')
    isAdmin = !!data
  }

  const mobileStyle = mobile ? 'py-8' : ''
  const fullWidthStyle = fullWidth ? 'w-full' : ''
  const className = `max-w-lg ${fullWidthStyle} ${mobileStyle}`

  if (!user) {
    return (
      <Button asChild className={className}>
        <Link href="/login">Logg inn</Link>
      </Button>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 ${fullWidth ? 'w-full flex-col' : ''}`}
    >
      {isAdmin && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className={fullWidth ? 'w-full max-w-lg py-8' : ''}
        >
          <Link href="/admin">Admin</Link>
        </Button>
      )}
      <Button asChild variant="outline" className={className}>
        <Link href="/minside">Min side</Link>
      </Button>
      <LogoutButton fullWidth={fullWidth} mobile={mobile} />
    </div>
  )
}
