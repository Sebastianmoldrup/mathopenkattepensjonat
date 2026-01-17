"use client";

import { createContext, useState } from "react";

interface MultiStepContextValue {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const MultiStepContext = createContext<MultiStepContextValue>({
  currentStep: 0,
  setCurrentStep: () => {},
});

const MultiStepProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <MultiStepContext
      value={{
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </MultiStepContext>
  );
};

export default MultiStepProvider;
export { MultiStepContext };
