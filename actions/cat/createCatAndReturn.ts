'use server'
import { createClient } from '@/lib/supabase/server'
import { CatInput } from '@/lib/validation/cat'
import { readCatBucket } from './readCatBucket'
import { Cat } from '@/lib/booking/types'

export async function createCatAndReturn(
  values: CatInput,
  file: File
): Promise<Cat> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be logged in')

  const uuid = crypto.randomUUID()

  const { data: cat, error: insertError } = await supabase
    .from('cats')
    .insert({ ...values, owner_id: user.id })
    .select('id, name, breed, gender, age, image_url, owner_id')
    .single()

  if (insertError) throw insertError

  const ext = file.name.split('.').pop()
  const imagePath = `${uuid}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('catphotos')
    .upload(imagePath, file)

  if (uploadError) throw uploadError

  const imageUrl = await readCatBucket(imagePath)

  const { error: updateError } = await supabase
    .from('cats')
    .update({ image_url: imageUrl, image_path: imagePath })
    .eq('id', cat.id)

  if (updateError) throw updateError

  return { ...cat, image_url: imageUrl }
}
