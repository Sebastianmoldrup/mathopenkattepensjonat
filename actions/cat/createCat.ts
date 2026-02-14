"use server";

import { createClient } from "@/lib/supabase/server";
import { CatInput } from "@/lib/validation/cat";
import { readCatBucket } from "./readCatBucket";

export async function createCat(values: CatInput, file: File) {
  const supabase = await createClient();

  console.log("Auth check starting...");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log("User result:", { user: user?.id, error: userError });

  if (!user) {
    // Add session fallback test
    console.log("getUser() failed, checking session...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    console.log("Session result:", {
      session: session?.user?.id,
      error: sessionError,
    });

    if (!session) {
      console.error("Both auth checks failed");
      throw new Error("You must be logged in");
    }
  }

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (!user) throw new Error("You must be logged in");

  const uuid = crypto.randomUUID();

  const { data: cat, error: insertError } = await supabase
    .from("cats")
    .insert({
      ...values,
      owner_id: user.id,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  const ext = file.name.split(".").pop();
  const imagePath = `${uuid}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("catphotos")
    .upload(imagePath, file);

  if (uploadError) throw uploadError;

  const ImageUrl = await readCatBucket(imagePath);

  const { error: updateError } = await supabase
    .from("cats")
    .update({ image_url: ImageUrl, image_path: imagePath })
    .eq("id", cat.id);

  if (updateError) throw updateError;

  return { success: true };
}
