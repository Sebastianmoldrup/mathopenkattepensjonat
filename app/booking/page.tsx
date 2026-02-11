import { AuthButton } from "@/components/auth-button";
import { Calendar, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { readUser } from "@/actions/user/readUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TODO:
// 1. Start -> check if user is logged in                                                           - SERVER
// 2. User not logged in -> show login button                                                       - SERVER
// 3. User logged in -> show booking page                                                           - SERVER
// 4. Next step -> If user has not cats -> show message "You need to add cats before you can book"  - SERVER
// 5. Next step -> Let user pick cats                                                               - CLIENT
// 6. Next step -> Let user pick period of bookign with range calendar                              - CLIENT
// 7. Next step -> Let user pick time slot and confirm booking                                      - CLIENT
// 8. Next step -> Show booking confirmation and details                                            - CLIENT / SERVER
// 9. End -> Send booking data to backend and save in database                                      - SERVER
//
// 10. Let user view and manage their bookings
// 11. Implement cancellation and rescheduling features

// COMPONENTS:
// 1. BookingPage (main page component)
// 2. BookingForm (handles the booking form and user interactions)
//  2.1. CatSelection (allows users to select their cats for booking)
//  2.2. DateRangePicker (allows users to select the booking period)
//  2.3. TimeSlotPicker (allows users to select available time slots)
// 3. BookingConfirmation (displays booking confirmation details)
// 4. AuthButton (handles user authentication and login/logout)

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await readUser(user.id);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {profile?.profile_completed ? (
        <div>Logget inn</div>
      ) : (
        <div>
          <h2>Vennligst logg inn</h2>
          <Link href="/login">
            <Button>Gå til login</Button>
          </Link>
        </div>
      )}

      {/* <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm"> */}
      {/*   <div className="flex justify-center mb-4"> */}
      {/*     <Calendar className="h-10 w-10 text-gray-800" /> */}
      {/*   </div> */}
      {/**/}
      {/*   <h1 className="text-2xl font-semibold text-gray-900 mb-2"> */}
      {/*     Booking kommer snart */}
      {/*   </h1> */}
      {/**/}
      {/*   <p className="text-gray-600 mb-6"> */}
      {/*     Vi jobber med en ny og enkel bookingløsning. Følg med – lansering */}
      {/*     snart. */}
      {/*   </p> */}
      {/**/}
      {/*   <div className="h-px bg-gray-200 my-6" /> */}
      {/**/}
      {/*   <AuthButton /> */}
      {/* </div> */}
    </div>
  );
};

export default Page;
