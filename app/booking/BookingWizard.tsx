"use client";
import { useState } from "react";
import CatSelection from "./steps/CatSelection";
import DateRangePicker from "./steps/DateRangePicker";
import TimeSlotPicker from "./steps/TimeSlotPicker";
import BookingSummary from "./steps/BookingSummary";

// The shape of everything the wizard collects
type BookingState = {
  selectedCats: string[];
  dateRange: { from: Date; to: Date } | null;
  times: { dropOff: string; pickUp: string } | null;
};

export default function BookingWizard({ user, cats }) {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    selectedCats: [],
    dateRange: null,
    times: null,
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const updateBooking = (patch: Partial<BookingState>) =>
    setBooking((prev) => ({ ...prev, ...patch }));

  console.log("Current booking state:", booking);

  switch (step) {
    case 0:
      return (
        <CatSelection
          cats={cats}
          booking={booking}
          update={updateBooking}
          onNext={next}
        />
      );
    case 1:
      return (
        <DateRangePicker
          booking={booking}
          update={updateBooking}
          onNext={next}
          onBack={back}
        />
      );
    case 2:
      return (
        <TimeSlotPicker
          booking={booking}
          update={updateBooking}
          onNext={next}
          onBack={back}
        />
      );
    case 3:
      return (
        <BookingSummary
          booking={booking}
          user={user}
          cats={cats}
          onBack={back}
        />
      );
  }
}
