'use server'

import { createClient } from '@/lib/supabase/server'

export async function updatePassword(
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: 'Kunne ikke oppdatere passordet. Prøv igjen.' }
  return {}
}
