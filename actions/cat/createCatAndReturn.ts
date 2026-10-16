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
    error: userError,
  } = await supabase.auth.getUser()
  if (!user) {
    // getUser() makes a live call to Supabase's Auth server (unlike
    // reading the local session token), so a transient Auth-API hiccup
    // can land here even for someone who's genuinely logged in -- same
    // class of failure as the readuser gateway timeouts in the
    // 2026-09-16 /minside incident (see FIXLOG.md). Logging the actual
    // error (if any) so a recurrence is diagnosable instead of another
    // dead end.
    console.error('[createCatAndReturn] getUser() returned no user:', userError?.message)
    throw new Error('Du må være logget inn.')
  }

  const uuid = crypto.randomUUID()

  const { data: cat, error: insertError } = await supabase
    .from('cats')
    .insert({ ...values, owner_id: user.id })
    .select('id, name, breed, gender, age, image_url, owner_id')
    .single()

  if (insertError) {
    console.error('[createCatAndReturn] insert failed:', insertError.message)
    throw new Error('Kunne ikke lagre katten. Prøv igjen.')
  }

  const ext = file.name.split('.').pop()
  const imagePath = `${uuid}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('catphotos')
    .upload(imagePath, file)

  if (uploadError) {
    console.error('[createCatAndReturn] upload failed:', uploadError.message)
    // Roll back the cat row -- otherwise it's left behind with no photo,
    // and a retry creates a second, duplicate cat rather than fixing this
    // one (there's no "edit and retry the same cat" path in this dialog).
    await supabase.from('cats').delete().eq('id', cat.id)
    throw new Error('Kunne ikke laste opp bildet. Prøv igjen.')
  }

  const imageUrl = await readCatBucket(imagePath)

  const { error: updateError } = await supabase
    .from('cats')
    .update({ image_url: imageUrl, image_path: imagePath })
    .eq('id', cat.id)

  if (updateError) {
    console.error('[createCatAndReturn] update failed:', updateError.message)
    // Same rollback reasoning as above -- also drop the now-orphaned
    // upload so a failed attempt leaves nothing behind to clean up later.
    await supabase.storage.from('catphotos').remove([imagePath])
    await supabase.from('cats').delete().eq('id', cat.id)
    throw new Error('Kunne ikke lagre katten. Prøv igjen.')
  }

  return { ...cat, image_url: imageUrl }
}
