import { createClient } from "@/lib/supabase/client";

// ========================================================
// User CRUD Operations
// ========================================================

export const createUser = async (email: string, password: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error creating user:", error.message);
    return null;
  }

  return data.user;
};

export const readUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return user;
};

export const updateUser = async (updates: {
  email?: string;
  password?: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Error updating user:", error.message);
    return null;
  }

  return data.user;
};

export const deleteUser = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error deleting user session:", error.message);
    return false;
  }

  return true;
};
