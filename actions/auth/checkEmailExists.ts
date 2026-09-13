'use server'

import { createClient } from '@/lib/supabase/server'

// If the RPC itself fails (network/DB hiccup), we don't want that to look
// like "this e-mail isn't registered" -- fail open into the password step
// so an existing user can still try to log in normally.
export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('email_exists', {
    p_email: email,
  })
  if (error) {
    console.error('[checkEmailExists]', error.message)
    return true
  }
  return data ?? true
}
