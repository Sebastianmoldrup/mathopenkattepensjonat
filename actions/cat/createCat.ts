"use server";

import { createClient } from "@/lib/supabase/server";
import { CatInput } from "@/lib/validation/cat";

export async function createCat(values: CatInput, file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in");

  const { data: cat, error: insertError } = await supabase
    .from("cats")
    .insert({
      ...values,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  const ext = file.name.split(".").pop();
  const photoPath = `cats/${cat.id}/photo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("catphotos")
    .upload(photoPath, file);

  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase
    .from("cats")
    .update({ photo_path: photoPath })
    .eq("id", cat.id);

  if (updateError) throw updateError;

  return { success: true };
}
