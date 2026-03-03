"use client";

import Image from "next/image";
import { Cat } from "@/types";
import { ArrowRight, Check } from "lucide-react";

interface BookingState {
  selectedCats: string[];
  dateRange: { from: Date; to: Date } | null;
  times: { dropOff: string; pickUp: string } | null;
}

interface Props {
  cats: Cat[];
  booking: BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
}

const CatSelection = ({ cats, booking, update, onNext }: Props) => {
  const selected = booking.selectedCats;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((c) => c !== id)
      : [...selected, id];
    update({ selectedCats: next });
  };

  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#b08d6a] font-medium mb-2">
            Steg 1 av 4
          </p>
          <h1
            className="text-4xl font-bold text-[#2c2420] mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Velg kattene dine
          </h1>
          <p className="text-[#7a6a5a] text-base">
            Velg hvilke katter du vil ta med på denne bookingen.
          </p>
        </div>

        {/* Cat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {cats.map((cat) => {
            const active = isSelected(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={`
                  relative group rounded-2xl overflow-hidden text-left
                  transition-all duration-200 cursor-pointer
                  border-2 outline-none
                  ${
                    active
                      ? "border-[#b08d6a] shadow-lg shadow-[#b08d6a]/20 scale-[1.02]"
                      : "border-transparent shadow-md hover:shadow-lg hover:scale-[1.01]"
                  }
                  bg-white
                `}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-[#f0ebe4]">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Selection overlay */}
                  <div
                    className={`
                      absolute inset-0 transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0"}
                    `}
                    style={{ background: "rgba(176, 141, 106, 0.15)" }}
                  />
                  {/* Checkmark badge */}
                  <div
                    className={`
                      absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${
                        active
                          ? "bg-[#b08d6a] scale-100 opacity-100"
                          : "bg-white/80 scale-75 opacity-0 group-hover:opacity-60 group-hover:scale-90"
                      }
                    `}
                  >
                    <Check
                      size={14}
                      className={active ? "text-white" : "text-[#b08d6a]"}
                      strokeWidth={3}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="px-3 py-3">
                  <p
                    className={`font-semibold capitalize text-sm transition-colors duration-200 ${
                      active ? "text-[#b08d6a]" : "text-[#2c2420]"
                    }`}
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {cat.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Selection count */}
          <p className="text-sm text-[#7a6a5a]">
            {selected.length === 0 ? (
              "Ingen katter valgt ennå"
            ) : (
              <>
                <span className="text-[#b08d6a] font-semibold">
                  {selected.length}
                </span>{" "}
                {selected.length === 1 ? "katt" : "katter"} valgt
              </>
            )}
          </p>

          {/* Next button */}
          <button
            onClick={onNext}
            disabled={selected.length === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
              transition-all duration-200
              ${
                selected.length > 0
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
  );
};

export default CatSelection;
