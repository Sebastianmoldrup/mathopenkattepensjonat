import { Cat } from "@/types";

interface BookingState {
  selectedCats: string[];
  dateRange: { from: Date; to: Date } | null;
  times: { dropOff: string; pickUp: string } | null;
}

interface Props {
  cats: Cat[];
  booking: BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateRangePicker = ({ cats, booking, update, onNext, onBack }: Props) => {
  return (
    <div>
      <h2>Select Booking Dates</h2>
      <p>
        Here you will be able to select the start and end dates for your
        booking.
      </p>
    </div>
  );
};

export default DateRangePicker;
