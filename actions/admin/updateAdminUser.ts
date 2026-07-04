'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/actions'
import { revalidatePath } from 'next/cache'

type AdminProfileUpdates = {
  first_name?: string
  last_name?: string
  address?: string
  phone?: string
  emergency_contact?: string
  notes?: string
}

export const updateAdminUser = async (updates: AdminProfileUpdates) => {
  await requireAdmin()

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating admin user:', error.message)
      return null
    }

    revalidatePath('/admin/profil')
    return data
  } catch (err) {
    console.error('Unexpected error updating admin user:', err)
    return null
  }
}
