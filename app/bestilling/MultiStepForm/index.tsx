"use client";

import { useContext } from "react";
import MultiStepProvider, { MultiStepContext } from "./MultiStepProvider";
import StepIntro from "./steps/StepIntro";
import StepCats from "./steps/StepCats";
import StepDates from "./steps/StepDates";
import StepAboutCats from "./steps/StepAboutCats";
import StepUserInfo from "./steps/StepUserInfo";
import StepReview from "./steps/StepReview";
import StepThankYou from "./steps/StepThankYou";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookingLayout from "./BookingLayout";

const steps = [
  StepIntro,
  StepCats,
  StepDates,
  StepAboutCats,
  StepUserInfo,
  StepReview,
  StepThankYou,
];

export default function MultiStepForm({
  initialCats,
}: {
  initialCats: string;
}) {
  return (
    <MultiStepProvider>
      <StepRenderer />
    </MultiStepProvider>
  );
}

// Step render component
// `currentStep` is zero-based (array index), while `steps.length` is a count.
// Math.min / Math.max are used to keep navigation within valid bounds.) to make up for difference.
const StepRenderer = () => {
  const { currentStep, setCurrentStep } = useContext(MultiStepContext);

  const CurrentStepComponent = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const next = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <BookingLayout currentStep={currentStep} totalSteps={steps.length}>
      <CurrentStepComponent />

      <div className="flex justify-between mt-8">
        {!isFirst ? (
          <Button variant="ghost" onClick={prev}>
            Tilbake
          </Button>
        ) : (
          <div />
        )}

        {!isLast ? (
          <Button onClick={next}>Neste</Button>
        ) : (
          <Link href="/bestilling/bekreftet">
            <Button>Fullfør</Button>
          </Link>
        )}
      </div>
    </BookingLayout>
  );
};
