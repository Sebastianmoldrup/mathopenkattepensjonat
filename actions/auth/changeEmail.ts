"use server";
import { createClient } from "@/lib/supabase/server";

export const changeEmail = async (newEmail: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "email_change",
    email: newEmail,
  });

  if (error) {
    console.error("Error resending email change confirmation:", error);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
};
