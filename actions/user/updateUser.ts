"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ProfileUpdates = {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  notes?: string;
};

export const updateUser = async (updates: ProfileUpdates) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No authenticated user found.");
      return null;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, profile_completed: true })
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating user:", error.message);
      return null;
    }

    revalidatePath("/minside");
    revalidatePath("/booking");

    return data;
  } catch (err) {
    console.error("Unexpected error updating user:", err);
    return null;
  }
};
