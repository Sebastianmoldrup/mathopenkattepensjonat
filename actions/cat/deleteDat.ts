"use server";
import { createClient } from "@/lib/supabase/server";
import { Cat } from "@/types";
import { revalidatePath } from "next/cache";

const deleteCat = async (cat: Cat) => {
  const supabase = await createClient();

  const { error: catError } = await supabase
    .from("cats")
    .delete()
    .eq("id", cat.id)
    .select();

  if (catError) {
    throw new Error("Cat not found or access denied");
  }

  const { error: imageError } = await supabase.storage
    .from("catphotos")
    .remove([`cats/${cat.image_path})`]);

  if (imageError) {
    console.warn("Failed to delete cat image:", imageError.message);
  }

  revalidatePath("/minside/minekatter");
  return { success: true };
};

export default deleteCat;
