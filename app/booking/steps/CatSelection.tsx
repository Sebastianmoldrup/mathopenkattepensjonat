import { getUserCats } from "@/actions/cat/getUserCats";
import { BookingState } from "@/types";

export default async function CatSelection({
  booking,
  updateBooking,
}: {
  booking: BookingState;
  updateBooking: Partial<BookingState>;
}) {
  console.log(booking);

  const cats = getUserCats(userId);
  return <div>cat selection</div>;
}
