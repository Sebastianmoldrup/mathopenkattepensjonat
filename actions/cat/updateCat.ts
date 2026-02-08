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

  const cat = await readCat(catId);
  if (!cat) {
    throw new Error("Cat not found or access denied");
  }

  // No new image → only update fields
  if (!file) {
    const { error } = await supabase
      .from("cats")
      .update(values)
      .eq("id", catId)
      .eq("owner_id", cat.owner_id);

    if (error) throw error;
    return;
  }

  // Image update
  const ext = file.type.split("/")[1] ?? "jpg";
  const bucketPath = cat.image_path.split("/").slice(0, -1).join("/");
  const newPath = `${bucketPath}/${cat.name}.${ext}`;

  // Remove old image if path changed
  if (cat.image_path && cat.image_path !== newPath) {
    await supabase.storage
      .from("catphotos")
      .remove([cat.image_path])
      .catch(() => {});
  }

  await supabase.storage.from("catphotos").upload(newPath, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  const imageUrl = await readCatBucket(newPath);

  const { error } = await supabase
    .from("cats")
    .update({
      ...values,
      image_path: newPath,
      image_url: imageUrl,
    })
    .eq("id", catId)
    .eq("owner_id", cat.owner_id);

  if (error) throw error;
}
