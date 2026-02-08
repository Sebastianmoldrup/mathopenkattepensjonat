import { createClient } from "@/lib/supabase/client";

export const readCatBucket = async (url: string) => {
  const supabase = createClient();

  if (url === "") {
    return null;
  }

  const { data } = supabase.storage.from("catphotos").getPublicUrl(url);

  return data.publicUrl;
};
