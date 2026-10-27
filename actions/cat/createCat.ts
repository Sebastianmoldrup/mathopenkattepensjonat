'use server'
import { createClient } from '@/lib/supabase/server'
import { CatInput } from '@/lib/validation/cat'
import { readCatBucket } from './readCatBucket'

export async function createCat(values: CatInput, file: File) {
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
    console.error('[createCat] getUser() returned no user:', userError?.message)
    throw new Error('Du må være logget inn.')
  }

  const uuid = crypto.randomUUID()
  const ext = file.name.split('.').pop()
  const imagePath = `${uuid}.${ext}`

  // The cat row and the photo upload don't actually depend on each other
  // -- imagePath is keyed by a fresh uuid, not the row's id -- so running
  // them concurrently instead of sequentially roughly halves the total
  // time spent on the two slowest, network-bound steps here. That
  // directly reduces exposure to any per-request time limit for someone
  // on a slow upload connection.
  const [insertResult, uploadResult] = await Promise.all([
    supabase.from('cats').insert({ ...values, owner_id: user.id }).select().single(),
    supabase.storage.from('catphotos').upload(imagePath, file),
  ])

  const { data: cat, error: insertError } = insertResult
  const { error: uploadError } = uploadResult

  if (insertError) {
    console.error('[createCat] insert failed:', insertError.message)
    // The upload may have succeeded even though the insert didn't --
    // clean it up so a failed attempt doesn't leave an orphaned file in
    // storage with nothing in the database ever referencing it.
    if (!uploadError) {
      await supabase.storage.from('catphotos').remove([imagePath])
    }
    throw new Error('Kunne ikke lagre katten. Prøv igjen.')
  }

  if (uploadError) {
    console.error('[createCat] upload failed:', uploadError.message)
    // Roll back the cat row -- otherwise it's left behind with no photo,
    // and a retry creates a second, duplicate cat rather than fixing this
    // one (there's no "edit and retry the same cat" path in this form).
    await supabase.from('cats').delete().eq('id', cat.id)
    throw new Error('Kunne ikke laste opp bildet. Prøv igjen.')
  }

  const imageUrl = await readCatBucket(imagePath)

  const { error: updateError } = await supabase
    .from('cats')
    .update({ image_url: imageUrl, image_path: imagePath })
    .eq('id', cat.id)

  if (updateError) {
    console.error('[createCat] update failed:', updateError.message)
    // Same rollback reasoning as above -- also drop the now-orphaned
    // upload so a failed attempt leaves nothing behind to clean up later.
    await supabase.storage.from('catphotos').remove([imagePath])
    await supabase.from('cats').delete().eq('id', cat.id)
    throw new Error('Kunne ikke lagre katten. Prøv igjen.')
  }

  return { success: true }
}
