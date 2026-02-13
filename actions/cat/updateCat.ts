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
  const bucketPath = "catphotos";

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

  // New image path
  const ext = file.name.split(".").pop();
  const uuid = crypto.randomUUID();
  const newImagePath = `${uuid}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketPath)
    .upload(newImagePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  // Get the new image URL
  const imageUrl = await readCatBucket(newImagePath);

  // Delete old image if it exists (don't add bucketPath again)
  if (cat.image_path) {
    const { error: deleteError } = await supabase.storage
      .from(bucketPath)
      .remove([cat.image_path]);

    if (deleteError) {
      console.error("Failed to delete old image:", deleteError.message);
    }
  }

  // Update database
  const { error } = await supabase
    .from("cats")
    .update({
      ...values,
      image_path: newImagePath,
      image_url: imageUrl,
    })
    .eq("id", catId)
    .eq("owner_id", cat.owner_id);

  if (error) throw error;
}
