import BookingGate from "./BookingGate";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <BookingGate />
    </Suspense>
  );
};

export default Page;
