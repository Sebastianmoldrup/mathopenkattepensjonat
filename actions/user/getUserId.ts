import { createClient } from "@/lib/supabase/client";

export const getUserId = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    console.error("Error getting user claims:", error.message);
    return null;
  }
  return data?.claims.sub || null;
};
