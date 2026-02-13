"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCat(formData: FormData) {
  const catId = formData.get("catId") as string;

  if (!catId) {
    throw new Error("Missing cat id");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1️⃣ Fetch cat first (to get image_path)
  const { data: cat, error: fetchError } = await supabase
    .from("cats")
    .select("id, owner_id, image_path")
    .eq("id", catId)
    .single();

  if (fetchError) throw fetchError;
  if (cat.owner_id !== user.id) {
    throw new Error("Unauthorized");
  }

  // 2️⃣ Delete storage image if exists
  if (cat.image_path) {
    const { error: storageError } = await supabase.storage
      .from("catphotos")
      .remove([cat.image_path]);

    if (storageError) {
      console.error("Storage delete failed:", storageError);
    }
  }

  // 3️⃣ Delete cat row
  const { error: deleteError } = await supabase
    .from("cats")
    .delete()
    .eq("id", catId);

  if (deleteError) throw deleteError;

  revalidatePath("/minside/minekatter");
}
