import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  Cat,
  Booking,
  ProfileFormData,
  CatFormData,
  OnboardingStatus,
} from "@/types";

export const supabase = createClient();

// ============================================
// PROFILE OPERATIONS
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  console.log(data);

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  profileData: ProfileFormData,
): Promise<boolean> {
  // Check if all required fields are filled
  const isComplete = !!(
    profileData.first_name &&
    profileData.last_name &&
    profileData.address &&
    profileData.phone
  );

  const { error } = await supabase
    .from("users")
    .update({
      ...profileData,
      profile_completed: isComplete,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    return false;
  }

  return true;
}

// ============================================
// CAT OPERATIONS
// ============================================

export async function getCats(userId: string): Promise<Cat[]> {
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cats:", error);
    return [];
  }

  return data || [];
}

export async function getCat(catId: string): Promise<Cat | null> {
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("id", catId)
    .single();

  if (error) {
    console.error("Error fetching cat:", error);
    return null;
  }

  return data;
}

export async function createCat(
  userId: string,
  catData: CatFormData,
): Promise<Cat | null> {
  const { data, error } = await supabase
    .from("cats")
    .insert([{ ...catData, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating cat:", error);
    return null;
  }

  return data;
}

export async function updateCat(
  catId: string,
  catData: Partial<CatFormData>,
): Promise<boolean> {
  const { error } = await supabase.from("cats").update(catData).eq("id", catId);

  if (error) {
    console.error("Error updating cat:", error);
    return false;
  }

  return true;
}

export async function deleteCat(catId: string): Promise<boolean> {
  const { error } = await supabase.from("cats").delete().eq("id", catId);

  if (error) {
    console.error("Error deleting cat:", error);
    return false;
  }

  return true;
}

// ============================================
// BOOKING OPERATIONS
// ============================================

export async function getBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      booking_cats (
        cat_id,
        cats (*)
      )
    `,
    )
    .eq("user_id", userId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  // Transform the data to include cats array
  const bookings = data.map((booking: any) => ({
    ...booking,
    cats: booking.booking_cats.map((bc: any) => bc.cats),
  }));

  return bookings;
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      booking_cats (
        cat_id,
        cats (*)
      )
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Error fetching booking:", error);
    return null;
  }

  return {
    ...data,
    cats: data.booking_cats.map((bc: any) => bc.cats),
  };
}

export async function createBooking(
  userId: string,
  startDate: string,
  endDate: string,
  numberOfNights: number,
  totalPrice: number,
  catIds: string[],
): Promise<Booking | null> {
  // Create the booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert([
      {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        number_of_nights: numberOfNights,
        total_price: totalPrice,
      },
    ])
    .select()
    .single();

  if (bookingError) {
    console.error("Error creating booking:", bookingError);
    return null;
  }

  // Link cats to the booking
  const bookingCats = catIds.map((catId) => ({
    booking_id: booking.id,
    cat_id: catId,
  }));

  const { error: linkError } = await supabase
    .from("booking_cats")
    .insert(bookingCats);

  if (linkError) {
    console.error("Error linking cats to booking:", linkError);
    // Optionally rollback the booking creation
    await supabase.from("bookings").delete().eq("id", booking.id);
    return null;
  }

  return booking;
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error cancelling booking:", error);
    return false;
  }

  return true;
}

// ============================================
// FILE UPLOAD (for cat images)
// ============================================

export async function uploadCatImage(
  file: File,
  userId: string,
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("cat-images")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from("cat-images").getPublicUrl(fileName);

  return data.publicUrl;
}

// ============================================
// ONBOARDING STATUS
// ============================================

export async function getOnboardingStatus(
  userId: string,
): Promise<OnboardingStatus> {
  const profile = await getProfile(userId);
  const cats = await getCats(userId);

  const hasProfile = !!(
    profile?.first_name &&
    profile?.last_name &&
    profile?.address &&
    profile?.phone
  );

  const hasCats = cats.length > 0;

  return {
    hasProfile,
    hasCats,
    isComplete: hasProfile,
  };
}
