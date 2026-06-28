import { createClient } from "@/lib/supabase/server";

export const readCatBucket = async (url: string) => {
  const supabase = await createClient();

  if (url === "") {
    return null;
  }

  const { data } = supabase.storage.from("catphotos").getPublicUrl(url);

  return data.publicUrl;
};
