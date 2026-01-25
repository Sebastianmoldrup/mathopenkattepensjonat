"use client";

import { createContext, useState } from "react";

interface BookingProviderType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const BookingProviderContext = createContext<BookingProviderType>({
  currentStep: 0,
  setCurrentStep: () => {},
});

const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <BookingProviderContext
      value={{
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </BookingProviderContext>
  );
};

export default BookingProvider;
export { BookingProviderContext };
