import { AuthButton } from "@/components/auth-button";
import { Calendar, Lock } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <Calendar className="h-10 w-10 text-gray-800" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Booking kommer snart
        </h1>

        <p className="text-gray-600 mb-6">
          Vi jobber med en ny og enkel bookingløsning. Følg med – lansering
          snart.
        </p>

        <div className="h-px bg-gray-200 my-6" />

        <AuthButton />
      </div>
    </div>
  );
};

export default Page;
