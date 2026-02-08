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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(catId, values, file);

  const cat = await readCat(catId);

  if (file) {
    const ext = file.name.split(".").pop();
    // console.log("File extension:", ext);
    const bucket = cat.image_path.split("/").slice(0, -1).join("/");
    // console.log(bucket);
    const newPath = `${bucket}/${cat.name}.${ext}`;
    // console.log(newPath);

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

    // console.log("prevPath", prevPath.split("/"));
    // const photoPath = ext ? `cats/${catId}/photo-${Date.now()}.${ext}` : "";
    // console.log(photoPath);

    // const { error: uploadError } = await supabase.storage
    //   .from("catphotos")
    //   .upload(cat.image_path, file, {
    //     upsert: true,
    //     contentType: file.type,
    //   });
    //
    // if (uploadError) throw uploadError;

    // const { error: updateError } = await supabase
    //   .from("cats")
    //   .update({ ...values })
    //   .eq("id", catId);
    //
    // if (updateError) throw updateError;
  }

  // if (!user) throw new Error("You must be logged in");
  //
  // console.log(file);
  //
  // const ext = file?.name.split(".").pop();
  // const photoPath = ext ? `cats/${catId}/photo-${Date.now()}.${ext}` : "";
  // console.log(photoPath);
  //
  // if (!file) {
  //   return { success: true };
  // }
  //
  // const { data: existingCat } = await supabase
  //   .from("cats")
  //   .select("photo_path")
  //   .eq("id", catId)
  //   .single();
  //
  // const oldPhotoPath = existingCat?.photo_path;
  // console.log("Old photo path:", oldPhotoPath);
  //
  // const { error: uploadError } = await supabase.storage
  //   .from("catphotos")
  //   .upload(photoPath, file, {
  //     upsert: true,
  //     contentType: file.type,
  //   });
  //
  // if (uploadError) throw uploadError;
  //
  // const { error: updateError } = await supabase.storage
  //   .from("catphotos")
  //   .update(photoPath, file, {
  //     cacheControl: "3600",
  //     upsert: true,
  //   });

  // const { data, error } = await supabase.storage
  //   .from("catphotos")
  //   .update(photoPath, file, {
  //     cacheControl: "3600",
  //     upsert: true,
  //   });
  //
  // console.log(data, error);

  // const { error: uploadError } = await supabase.storage
  //   .from("catphotos")
  //   .upload(photoPath, file);

  // // 1️⃣ Update cat fields (no photo yet)
  // const { error: updateError } = await supabase
  //   .from("cats")
  //   .update({
  //     ...values,
  //     owner_id: user.id,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq("id", catId);
  //
  // if (updateError) throw updateError;
  //
  // // 2️⃣ No new image → done
  // if (!file) {
  //   return { success: true };
  // }
  //
  // // 3️⃣ Generate NEW photo path (cache-safe)
  // const ext = file.name.split(".").pop();
  // const photoPath = `cats/${catId}/photo-${Date.now()}.${ext}`;
  //
  // // 4️⃣ Upload new photo
  // const { error: uploadError } = await supabase.storage
  //   .from("catphotos")
  //   .upload(photoPath, file);
  //
  // if (uploadError) throw uploadError;
  //
  // // 5️⃣ Save new photo path on cat
  // const { error: photoUpdateError } = await supabase
  //   .from("cats")
  //   .update({ photo_path: photoPath })
  //   .eq("id", catId);
  //
  // if (photoUpdateError) throw photoUpdateError;
  //
  // return { success: true };
}
