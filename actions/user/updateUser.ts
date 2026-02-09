"use server";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types";
import { revalidatePath } from "next/cache";

export const updateUser = async (
  userId: string | null,
  updates: Partial<User>,
) => {
  if (!userId) {
    console.error("User ID is required to update user profile.");
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, profile_completed: true })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating user:", error.message);
    return null;
  }

  revalidatePath("/minside"); // Update the minside header with new name immediately

  return data;
};
