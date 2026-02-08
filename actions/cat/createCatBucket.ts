import { createClient } from "@/lib/supabase/server";

export const uploadCatPhoto = async (catId: string, file: File) => {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${catId}.${fileExt}`;
  const filePath = `catphotos/${fileName}`;

  const { error } = await supabase.storage
    .from("catphotos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading cat photo:", error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("catphotos")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
