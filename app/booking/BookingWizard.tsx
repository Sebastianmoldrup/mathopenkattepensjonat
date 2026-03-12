"use client";
import React from "react";
import { BookingState } from "@/types";
import { Button } from "@/components/ui/button";
import CatSelection from "./steps/CatSelection";
import CageSelection from "./steps/CageSelection";
import DateRangeSelection from "./steps/DateRangeSelection";
import BookingSummary from "./steps/BookingSummary";

{
  /*
  GENERAL INFORMATION:
  1. Cages:
    - 1.1 there are 3 types of cages (standard (14), senior (3), suite (3))
    - 1.2 High season: June 15 - August 15, December 20 - January 2. Easter friday before palm sunday - second easter day. Low season: rest of the year.
    - 1.3 Pricing:
      - Standard:
        - Low season:
          - 1 cat (220kr)
          - 2 cats (320kr)
        - High season:
          - 1 cat (250kr)
          - 2 cats (350kr)
      - Senior:
        - Same as standard but made for cats who need it
      - Suite
        - Low season:
          - 1-2 cats (350kr)
          - 3 cats (400kr)
        - High season:

  2. Cancellation policy:
    - Low season: latest 24 hours before booking start
    - High season: latest 7 days before booking start
    - If cancellation happens after latest period then 50% of the entire booking has to be refunded

  3. BOOKING FLOW:
    - Step 1: LoginGate > user logged in ? skip : render redirect UI.
    - Step 2: NoCatsGate > user has not added a cat yet ? render redirect UI : skip.
    - Step 3: CatSelection > user has to select 1-3 cats to continue. (Limit to atleast pick 1 cat and max 3 cats).
    - Step 4: CageSelection > user gets recommend a cage, and can select whichever they like (include pricing).
    - Step 5: DateRangePicker > user can pick a start-end date range. Cannot select days that are fully booked.
    - Step 6: BookingSummary > user gets a summary of the booking they have to confirm. 

  4. BOOKING UI:
    - Step 1:
    - Step 2:
    - Step 3:
    - Step 4:
    - Step 5:
    - Step 6:

  5. BOOKING ACTIONS:
    - function calculateBookingPricing(from, to) > return pricing based on days, season and amount of cats
    - function getUserCats(userId) > return cats registered for the user
    - function getCageAvailability(catAmount) > return status on cages availability
    - function checkBookingOverlap() > check if the booking overlaps with any upcoming bookings for the cats selected


  6. BOOKING EDGE CASES:
    - If the user tries to select more cats than the maximum allowed (3), show an error message / show UI to send custom boooking or message.
    - If the user tries to book more cats than available cages, show an error message.
    - If the user selects a date range with no availability, show an error message and suggest contacting us.
    - If the user tries to proceed without selecting any cats, show an error message.
    - If the user tries to proceed without selecting a date range, show an error message.
    - If the user tries to proceed without selecting a cage type, show an error message.
    - If the user tries to book a date range that overlaps with an existing booking for one of their cats, show an error message.

  7. BOOKING MODELS:
    7.1 public.booking 
    {
      id: string;
      userId: string;
      price: number;
      special_instructions: string | null;
      date_from: Date;
      date_to: Date;
      cage_type: "standard" | "senior" | "suite";
      cage_count: number; // number of cages booked (1 or more depending on the number of cats and cage type)
    }

    7.2 public.booking_cats
    {
      id: string;
      booking_id: string; // link to booking table
      cat_id: string; // link to cat table
    }
*/
}

const STEPS = [
  { id: 0, component: CatSelection },
  { id: 1, component: CageSelection },
  { id: 2, component: DateRangeSelection },
  { id: 3, component: BookingSummary },
];

// Define what "complete" means per step — clean and easy to extend
const isStepComplete = (step: number, booking: BookingState): boolean => {
  switch (step) {
    case 0:
      return booking.selectedCats.length > 0;
    case 1:
      return booking.selectedCage !== null;
    case 2:
      return booking.dateRange !== null;
    case 3:
      return true;
    default:
      return false;
  }
};

export default function BookingWizard() {
  const [step, setStep] = React.useState(0);
  const [booking, setBooking] = React.useState<BookingState>({
    selectedCats: [],
    selectedCage: null,
    dateRange: null,
  });

  const updateBooking = (patch: Partial<BookingState>) =>
    setBooking((prev) => ({ ...prev, ...patch }));

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const isFirstStep = step === 0;
  const isLastStep = step === STEPS.length - 1;
  const canProceed = isStepComplete(step, booking);

  const StepComponent = STEPS[step].component;

  return (
    <main className="w-full grid place-content-center min-h-screen place-items-center gap-y-28">
      <h1>Mathopen kattepensjonat</h1>

      <StepComponent booking={booking} updateBooking={updateBooking} />

      <div className="flex justify-between w-full">
        <Button onClick={prevStep} disabled={isFirstStep}>
          Tilbake
        </Button>

        {!isLastStep ? (
          <Button onClick={nextStep} disabled={!canProceed}>
            Neste
          </Button>
        ) : (
          <Button onClick={() => null}>Bekreft</Button>
        )}
      </div>
    </main>
  );
}
