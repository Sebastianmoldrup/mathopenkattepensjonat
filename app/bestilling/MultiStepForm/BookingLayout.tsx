const BookingLayout = ({
  children,
  currentStep,
  totalSteps,
}: {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="min-w-[320px] md:min-w-[700px] flex justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-background rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Bestilling</h1>
          <p className="text-sm text-muted-foreground">
            Steg {currentStep + 1} av {totalSteps}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>

        {/* Step content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default BookingLayout;
