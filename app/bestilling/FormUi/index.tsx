"use client";

import { useContext } from "react";
import MultiStepProvider, { MultiStepContext } from "./MultiStepProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookingLayout from "./BookingLayout";
import StepCatAmount from "./steps/StepCatAmount";
import StepTime from "./steps/StepTime";
import StepDate from "./steps/StepDate";
import StepCatInfo from "./steps/StepCatInfo";
import StepOwnerInfo from "./steps/StepOwnerInfo";
import StepConfirmation from "./steps/StepConfirmation";

// Max cats 25
// Max booking cats 2

// Antall katter
// Check in / check out
// Ønsket klokke slett for levering og henting
// Informasjon om katten
// Informasjon om eier
// Bekreftelse

const steps = [
  StepCatAmount,
  StepDate,
  StepTime,
  StepCatInfo,
  StepOwnerInfo,
  StepConfirmation,
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
