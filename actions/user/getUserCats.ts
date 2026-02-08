"use server";
import { createClient } from "@/lib/supabase/server";

export const getUserCats = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("owner_id", userId);

  if (error) {
    console.error("Error fetching cats:", error.message);
    return [];
  }

  return data || [];
};
