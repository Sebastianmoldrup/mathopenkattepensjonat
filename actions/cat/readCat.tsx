"use server";
import { createClient } from "@/lib/supabase/server";

export async function readCat(catId: string) {
  const supabase = await createClient();
  await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("id", catId)
    .single();

  if (error) throw error;

  return data;
}
