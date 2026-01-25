import { Suspense } from "react";
import BookingContent from "./BookingContent";

const Page = () => {
  return (
    <main className="w-full min-h-screen grid place-content-center bg-muted/40">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <BookingContent />
      </Suspense>
    </main>
  );
};

export default Page;
