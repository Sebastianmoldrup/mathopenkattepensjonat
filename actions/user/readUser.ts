"use server";

import { createClient } from "@/lib/supabase/server";

export async function readUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("readUser:", error.message);
    return null;
  }

  return data;
}
