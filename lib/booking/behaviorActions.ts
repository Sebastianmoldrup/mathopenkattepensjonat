'use server'

import { createClient } from '@/lib/supabase/server'

export interface CatBehaviorData {
  cat_id: string
  gets_medication: boolean
  medication_details?: string
  has_cat_experience: boolean
  gets_along_with_cats: 'yes' | 'no' | 'unknown'
  has_stress_issues: boolean
  stress_details?: string
  aggression_risk: 'yes' | 'no' | 'unknown'
  aggression_details?: string
}

export async function saveCatBehaviorNotes(
  bookingId: string,
  notes: CatBehaviorData[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('save_cat_behavior_notes', {
    p_booking_id: bookingId,
    p_notes: notes,
  })

  if (error) {
    console.error('[saveCatBehaviorNotes] full error:', JSON.stringify(error))
    return { success: false, error: 'Kunne ikke lagre atferdsopplysninger.' }
  }

  return { success: true }
}
