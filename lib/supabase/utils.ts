import { createClient } from "@/lib/supabase/client";
import { Cat, User } from "@/types";

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

export const readUser = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error reading user:", error.message);
    return null;
  }

  return data;
};

export const updateUserEmail = async (updates: {
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

export const updateUserProfile = async (newProfileData: {
  id?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  notes?: string;
  profile_completed?: boolean;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: newProfileData.first_name,
      last_name: newProfileData.last_name,
      address: newProfileData.address,
      phone: newProfileData.phone,
      emergency_contact: newProfileData.emergency_contact,
      notes: newProfileData.notes,
      profile_completed: newProfileData.profile_completed,
    })
    .eq("id", newProfileData.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error.message);
    return null;
  }

  return data;
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

// ========================================================
// Cats CRUD Operations
// ========================================================

export const createCat = async (catData: {
  name: string;
  breed: string;
  age: number;
  owner_id: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cats")
    .insert([catData])
    .select()
    .single();

  if (error) {
    console.error("Error creating cat:", error.message);
    return null;
  }

  return data;
};

export const uploadCatPhoto = async (catId: string, file: File) => {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${catId}.${fileExt}`;
  const filePath = `cat-photos/${fileName}`;

  const { data, error } = await supabase.storage
    .from("cat-photos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading cat photo:", error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("cat-photos")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

// ========================================================
// Linked Records Operations
// ========================================================

const linkCatToOwner = async (catId: string, ownerId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_cats")
    .insert([{ user_id: ownerId, cat_id: catId }])
    .select()
    .single();

  if (error) {
    console.error("Error linking cat to owner:", error.message);
    return null;
  }
  return data;
};

// ========================================================
// Utility Functions
// ========================================================

export const getCatById = async (catId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("id", catId)
    .single();

  if (error) {
    console.error("Error fetching cat:", error.message);
    return null;
  }

  return data;
};

export const updateCat = async (catId: string, updates: Partial<Cat>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cats")
    .update(updates)
    .eq("id", catId)
    .select()
    .single();

  if (error) {
    console.error("Error updating cat:", error.message);
    return null;
  }

  return data;
};

export const getCatPhoto = async (url: string) => {
  const supabase = createClient();
  const { data } = supabase.storage.from("catphotos").getPublicUrl(url);

  return data.publicUrl;
};
