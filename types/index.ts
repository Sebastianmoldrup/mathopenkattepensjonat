export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  address: string | null;
  phone: string | null;
  emergency_contact: string | null;
  notes: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cat {
  id: string;
  user_id: string;
  image_url: string;
  name: string;
  breed: string | null;
  age: number | null;
  gender: "hann" | "hunn" | null;
  id_chip: string | null;
  insurance_number: string | null;
  is_sterilized: boolean;
  last_vaccine_date: string | null;
  deworming_info: string | null;
  flea_treatment_info: string | null;
  diet: string | null;
  medical_notes: string | null;
  behavior_notes: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  number_of_nights: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
  cats?: Cat[];
}

export interface BookingCat {
  booking_id: string;
  cat_id: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  emergency_contact?: string;
  notes?: string;
}

export interface CatFormData {
  image_url: string;
  name: string;
  breed?: string;
  age?: number;
  gender?: "hann" | "hunn";
  id_marking?: string;
  insurance_number?: string;
  is_sterilized: boolean;
  last_vaccine_date?: string;
  deworming_info?: string;
  flea_treatment_info?: string;
  diet?: string;
  medical_notes?: string;
  behavior_notes?: string;
}

export interface OnboardingStatus {
  hasProfile: boolean;
  hasCats: boolean;
  isComplete: boolean;
}
