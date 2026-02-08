"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserCats(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserCats:", error.message);
    return [];
  }

  return data;
}
