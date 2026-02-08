"use server";

import { createClient } from "@/lib/supabase/server";

export async function readCat(catId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("cats")
    .select("*")
    .eq("id", catId)
    .eq("owner_id", user.id)
    .maybeSingle();

  return data;
}
