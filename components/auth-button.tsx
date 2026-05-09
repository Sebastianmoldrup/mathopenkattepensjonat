'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function AuthButton({
  fullWidth = false,
  mobile = false,
}: {
  fullWidth?: boolean
  mobile?: boolean
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const mobileStyle = mobile ? 'py-8' : ''
  const fullWidthStyle = fullWidth ? 'w-full' : ''
  const className = `max-w-lg ${fullWidthStyle} ${mobileStyle}`

  useEffect(() => {
    const supabase = createClient()

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      setIsLoggedIn(!!session)

      if (session?.user) {
        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()
        setIsAdmin(!!adminRow)
      } else {
        setIsAdmin(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()
        setIsAdmin(!!adminRow)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoggedIn === null) {
    return (
      <Button variant="ghost" disabled>
        Laster…
      </Button>
    )
  }

  if (!isLoggedIn) {
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
    </div>
  )
}
