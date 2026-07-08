'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CageTransitionType = 'checkin' | 'checkout' | 'swap'

export type CageConfirmation = {
  booking_id: string
  transition_type: CageTransitionType
  confirmed_by: string | null
  confirmed_at: string
}

export async function getCageDayConfirmations(
  date: string
): Promise<CageConfirmation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_cage_confirmations', {
    p_date: date,
  })
  if (error) {
    console.error('[getCageDayConfirmations]', error.message)
    return []
  }
  return (data ?? []) as CageConfirmation[]
}

export async function toggleCageConfirmation(
  date: string,
  bookingId: string,
  transitionType: CageTransitionType
): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_toggle_cage_confirmation', {
    p_date: date,
    p_booking_id: bookingId,
    p_transition_type: transitionType,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/burstatus')
  return data as boolean
}
