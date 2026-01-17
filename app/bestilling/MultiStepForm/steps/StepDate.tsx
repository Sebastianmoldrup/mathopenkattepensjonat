"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { Suspense } from "react";

const StepDate = () => {
  const disabledDates = [
    { before: new Date() },
    { from: new Date(2026, 1, 15), to: new Date(2026, 1, 25) },
  ];
  return (
    <div>
      <Calendar
        fixedWeeks
        // modifiers={{
        //   booked: fullBooked,
        // }}
        // onDayClick={(date, modifies) => {
        //   if (modifies.booked) {
        //     alert("Allerede fullbooket.");
        //   }
        // }}
        classNames={{
          today: "bg-amber-300 rounded-md",
          disabled: "bg-red-300 rounded-md",
          // disabled: "text-white",
          // selected: "bg-green-300 rounded-md",
        }}
        modifiersClassNames={{ booked: "full-booked-date" }}
        mode="range"
        className="rounded-md border shadow-sm w-[320px] md:w-[480px]"
        min={3}
        startMonth={new Date()}
        disabled={disabledDates}
        excludeDisabled
      />
    </div>
  );
};

export default StepDate;
