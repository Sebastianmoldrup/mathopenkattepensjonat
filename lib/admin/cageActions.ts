'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CageSection = 'standard' | 'senior_comfort' | 'suite' | 'outdoor'

export type CageAssignment = {
  assignment_id: string
  booking_id: string
  cage_id: string
  cage_label: string
  cage_section: CageSection
  date_from: string
  date_to: string
  owner_first: string
  owner_last: string
  cat_names: string
  has_note: boolean
}

export type UnassignedBooking = {
  booking_id: string
  date_from: string
  date_to: string
  owner_first: string
  owner_last: string
  cat_names: string
  cage_type: string
  num_cats: number
}

export type CageOption = {
  cage_id: string
  cage_label: string
  cage_section: CageSection
  cage_number: number
  is_fully_free: boolean
}

export async function getCageAssignments(
  from: string,
  to: string
): Promise<CageAssignment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_cage_assignments', {
    p_from: from,
    p_to: to,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as CageAssignment[]
}

export async function getUnassignedConfirmed(): Promise<UnassignedBooking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_unassigned_confirmed')
  if (error) throw new Error(error.message)
  return (data ?? []) as UnassignedBooking[]
}

export async function getFreeCages(
  from: string,
  to: string
): Promise<CageOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_free_cages', {
    p_from: from,
    p_to: to,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as CageOption[]
}

export async function assignCage(
  bookingId: string,
  cageId: string,
  dateFrom: string,
  dateTo: string,
  notes?: string
): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_assign_cage', {
    p_booking_id: bookingId,
    p_cage_id: cageId,
    p_date_from: dateFrom,
    p_date_to: dateTo,
    p_notes: notes ?? null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/burplassering')
  return data as string
}

export async function updateCageAssignment(
  assignmentId: string,
  cageId: string,
  dateFrom: string,
  dateTo: string,
  notes?: string
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_update_cage_assignment', {
    p_assignment_id: assignmentId,
    p_cage_id: cageId,
    p_date_from: dateFrom,
    p_date_to: dateTo,
    p_notes: notes ?? null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/burplassering')
}

export async function deleteCageAssignment(
  assignmentId: string
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_delete_cage_assignment', {
    p_assignment_id: assignmentId,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/burplassering')
}

export async function splitCageAssignment(
  assignmentId: string,
  splitDate: string,
  secondCageId: string,
  secondNotes?: string
): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_split_cage_assignment', {
    p_assignment_id: assignmentId,
    p_split_date: splitDate,
    p_second_cage_id: secondCageId,
    p_second_notes: secondNotes ?? null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/burplassering')
  return data as string
}

export type CageConflict = {
  assignment_id: string
  booking_id: string
  conflict_from: string
  conflict_to: string
  owner_first: string
  owner_last: string
  cat_names: string
}

export async function getCageConflicts(
  cageId: string,
  dateFrom: string,
  dateTo: string
): Promise<CageConflict[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_get_cage_conflicts', {
    p_cage_id: cageId,
    p_date_from: dateFrom,
    p_date_to: dateTo,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as CageConflict[]
}
