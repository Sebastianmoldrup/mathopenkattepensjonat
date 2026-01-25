import { createClient } from "@/lib/supabase/server";
import BookingProvider from "./BookingProvider";
import BookingFormComponent from "./BookingFormComponent";

const BookingContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookingUser = user
    ? {
        auth: user.aud,
        email: user.email,
      }
    : null;

  return (
    <BookingProvider user={bookingUser}>
      <BookingFormComponent />
    </BookingProvider>
  );
};

export default BookingContent;
