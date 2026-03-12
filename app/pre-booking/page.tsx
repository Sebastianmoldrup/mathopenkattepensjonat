import BookingGate from "./BookingGate";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense>
        <BookingGate />
      </Suspense>
    </div>
  );
};

export default Page;
