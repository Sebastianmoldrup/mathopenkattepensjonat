"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { ArrowRight, ArrowLeft, CalendarDays } from "lucide-react";
import { Cat } from "@/types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingState {
  selectedCats: string[];
  dateRange: { from: Date; to: Date } | null;
  times: { dropOff: string; pickUp: string } | null;
}

interface Props {
  booking: BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
  // Map of "YYYY-MM-DD" -> number of cats already booked that day
  // This comes from your server action that checks existing bookings
  bookedCounts?: Record<string, number>;
  // Max cats allowed per day at the facility
  dailyCapacity?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a Date to YYYY.MM.DD */
export function formatDate(date: Date): string {
  return format(date, "yyyy.MM.dd");
}

/** Format a Date to a key used in bookedCounts */
function toKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Get how many cats are booked on a given day */
function getCatCount(date: Date, bookedCounts: Record<string, number>): number {
  return bookedCounts[toKey(date)] ?? 0;
}

/** Returns true if adding selectedCount cats exceeds daily capacity */
function isOverCapacity(
  date: Date,
  bookedCounts: Record<string, number>,
  selectedCount: number,
  dailyCapacity: number,
): boolean {
  return getCatCount(date, bookedCounts) + selectedCount > dailyCapacity;
}

// ─── Custom DayButton ─────────────────────────────────────────────────────────

// We use a React context to pass bookedCounts/capacity into the custom button
// without prop drilling through DayPicker internals.
const DayContext = React.createContext<{
  bookedCounts: Record<string, number>;
  dailyCapacity: number;
  selectedCatCount: number;
}>({ bookedCounts: {}, dailyCapacity: 10, selectedCatCount: 0 });

function CustomDayButton({
  day,
  modifiers,
  ...props
}: React.ComponentProps<"button"> & {
  day?: { date: Date };
  modifiers?: Record<string, boolean>;
}) {
  const { bookedCounts, dailyCapacity, selectedCatCount } =
    React.useContext(DayContext);

  if (!day) return <button {...props} />;

  const date = day.date;
  const booked = getCatCount(date, bookedCounts);
  const over = isOverCapacity(
    date,
    bookedCounts,
    selectedCatCount,
    dailyCapacity,
  );
  const remaining = Math.max(0, dailyCapacity - booked);
  const hasBookings = booked > 0;

  return (
    <button
      {...props}
      className={`${props.className ?? ""} relative flex flex-col items-center justify-center w-full h-full`}
    >
      {/* Day number */}
      <span className="text-sm leading-none">{date.getDate()}</span>

      {/* Cat count badge - only show if there are existing bookings */}
      {hasBookings && !modifiers?.disabled && (
        <span
          className={`
            mt-0.5 text-[9px] font-semibold leading-none px-1 py-0.5 rounded-full
            ${
              over
                ? "bg-red-100 text-red-600"
                : remaining <= 2
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#f0ebe4] text-[#b08d6a]"
            }
          `}
          title={`${booked} katter booket - ${remaining} plasser igjen`}
        >
          {booked} / {dailyCapacity}
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const DateRangePicker = ({
  booking,
  update,
  onNext,
  onBack,
  bookedCounts = {},
  dailyCapacity = 22,
}: Props) => {
  const selectedCatCount = booking.selectedCats.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log("Booked counts:", bookedCounts);

  // Internal calendar state kept in sync with booking via onSelect
  const [range, setRange] = React.useState<DateRange | undefined>(
    booking.dateRange
      ? { from: booking.dateRange.from, to: booking.dateRange.to }
      : undefined,
  );

  const handleSelect = (value: DateRange | undefined) => {
    setRange(value);
    if (value?.from && value?.to) {
      update({ dateRange: { from: value.from, to: value.to } });
    } else {
      update({ dateRange: null });
    }
  };

  // Build disabled dates: past days + days that exceed capacity with selected cats
  const disabledDates = React.useMemo(() => {
    const overCapacityDays: Date[] = Object.entries(bookedCounts)
      .filter(([, count]) => count + selectedCatCount > dailyCapacity)
      .map(([key]) => new Date(key));

    return [{ before: today }, ...overCapacityDays];
  }, [bookedCounts, selectedCatCount, dailyCapacity]);

  const hasValidRange = booking.dateRange?.from && booking.dateRange?.to;

  // Number of days selected
  const days =
    range?.from && range?.to
      ? Math.round(
          (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24) +
            1, // +1 to include both start and end date
        )
      : 0;

  return (
    <DayContext.Provider
      value={{ bookedCounts, dailyCapacity, selectedCatCount }}
    >
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-[#b08d6a] font-medium mb-2">
              Steg 2 av 4
            </p>
            <h1
              className="text-4xl font-bold text-[#2c2420] mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Velg datoer
            </h1>
            <p className="text-[#7a6a5a] text-base">
              Velg start- og sluttdato for kattepasset.{" "}
              <span className="text-[#b08d6a] font-medium">
                {selectedCatCount} {selectedCatCount === 1 ? "katt" : "katter"}
              </span>{" "}
              er valgt.
            </p>
          </div>

          {/* Calendar card */}
          <div className="bg-background rounded-2xl shadow-md border border-[#ede8e0] p-4 mb-6">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleSelect}
              disabled={disabledDates}
              excludeDisabled
              fixedWeeks
              startMonth={today}
              min={1}
              locale={nb}
              components={{
                DayButton: CustomDayButton,
              }}
              classNames={{
                today: "font-bold underline underline-offset-2",
                disabled: "opacity-25 cursor-not-allowed line-through",
                selected: "bg-[#b08d6a] text-white rounded-md",
                range_start: "bg-[#b08d6a] text-white rounded-l-md",
                range_end: "bg-[#b08d6a] text-white rounded-r-md",
                range_middle: "bg-[#f0ebe4] text-[#2c2420] rounded-none",
                day: "h-12 w-full flex-1",
              }}
              className="w-full"
            />
          </div>

          {/* Selected range summary */}
          <div
            className={`
              rounded-xl border px-5 py-4 mb-8 transition-all duration-300
              ${
                hasValidRange
                  ? "border-[#b08d6a]/40 bg-[#fdf9f5]"
                  : "border-dashed border-[#d8cfc5] bg-transparent"
              }
            `}
          >
            {hasValidRange ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-[#b08d6a]" />
                  <div>
                    <p className="text-xs text-[#7a6a5a] mb-0.5">
                      Valgt periode
                    </p>
                    <p
                      className="text-sm font-semibold text-[#2c2420]"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {formatDate(range!.from!)} {"->"} {formatDate(range!.to!)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#7a6a5a] mb-0.5">Dager</p>
                  <p className="text-sm font-semibold text-[#b08d6a]">{days}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#a09080] text-center">
                Ingen datoer valgt enda - klikk en startdato i kalenderen
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-8 text-xs text-[#7a6a5a]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#f0ebe4]" />
              Ledige plasser
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-100" />
              Nesten fullt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-100" />
              Fullt
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[#7a6a5a] bg-white border border-[#e0d8ce] hover:bg-[#f5f0ea] transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Tilbake
            </button>

            <button
              onClick={onNext}
              disabled={!hasValidRange}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
                transition-all duration-200
                ${
                  hasValidRange
                    ? "bg-[#2c2420] text-white hover:bg-[#b08d6a] shadow-md hover:shadow-lg hover:gap-3"
                    : "bg-[#e8e0d8] text-[#b0a090] cursor-not-allowed"
                }
              `}
            >
              Neste steg
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </DayContext.Provider>
  );
};

export default DateRangePicker;
