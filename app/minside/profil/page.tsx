'use client'

import { useState, useEffect } from 'react'
import { readUser } from '@/lib/supabase/utils'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types'
import { ProfileForm } from '@/components/profile-form'

const getUserId = async () => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error.message)
    return null
  }
  return user?.id || null
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await getUserId()
      if (userId) {
        const user = await readUser(userId)
        // userProfileIncomplete(user) && setOnboarding(true);
        setUser(user)
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-8">
      <ProfileForm user={user} />
    </div>
  )
}

export default Page
