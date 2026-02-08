"use server";

import { createClient } from "@/lib/supabase/server";
import { CatInput } from "@/lib/validation/cat";
import { readCat } from "./readCat";
import { readCatBucket } from "./readCatBucket";

export async function updateCat(
  catId: string,
  values: CatInput,
  file: File | null,
) {
  const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const cat = await readCat(catId);

  if (file) {
    const ext = file.name.split(".").pop();
    const bucket = cat.image_path.split("/").slice(0, -1).join("/");
    const newPath = `${bucket}/${cat.name}.${ext}`;

    if (cat.image_path !== newPath) {
      await supabase.storage.from("catphotos").remove([cat.image_path]);
    }

    await supabase.storage.from("catphotos").upload(newPath, file, {
      upsert: true,
      contentType: file.type,
    });

    const imageUrl = await readCatBucket(newPath);

    const { error: updateError } = await supabase
      .from("cats")
      .update({ ...values, image_path: newPath, image_url: imageUrl })
      .eq("id", catId);

    if (updateError) throw updateError;
    return;
  }

  const { error: updateError } = await supabase
    .from("cats")
    .update({ ...values })
    .eq("id", catId);

  if (updateError) throw updateError;
  return;
}
