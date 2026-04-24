'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CatBehaviorData } from './behaviorActions'

export async function addToWaitlist(payload: {
  dateFrom: string
  dateTo: string
  numCats: number
  cageType?: string
  cageCount?: number
  specialInstructions?: string
  behaviorNotes?: CatBehaviorData[]
  wantsOutdoorCage?: boolean
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget.' }

  const { error } = await supabase.rpc('add_to_waitlist', {
    p_date_from: payload.dateFrom,
    p_date_to: payload.dateTo,
    p_num_cats: payload.numCats,
    p_cage_type: payload.cageType ?? null,
    p_cage_count: payload.cageCount ?? 1,
    p_special_instructions: payload.specialInstructions ?? null,
    p_behavior_notes: payload.behaviorNotes ? payload.behaviorNotes : null,
    p_wants_outdoor_cage: payload.wantsOutdoorCage ?? false,
  })

  if (error) {
    console.error('[addToWaitlist]', error.message)
    return {
      success: false,
      error: 'Kunne ikke registrere venteliste. Prøv igjen.',
    }
  }

  revalidatePath('/minside')
  return { success: true }
}
