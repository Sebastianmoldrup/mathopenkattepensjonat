"use client";

import Image from "next/image";
import { Cat } from "@/types";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 w-full">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[#b08d6a] font-medium mb-2">
            Steg 1 av 4
          </p>
          <h1
            className="text-3xl font-bold text-[#2c2420] mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Velg kattene dine
          </h1>
          <p className="text-[#7a6a5a] text-sm">
            Velg hvilke katter du vil ta med på denne bookingen.
          </p>
        </div>

        {/* Cat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
          {cats.map((cat) => {
            const active = isSelected(cat.id);
            return (
              <Card
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-200 border-2 p-0 shadow-sm",
                  active
                    ? "border-[#b08d6a] shadow-md shadow-[#b08d6a]/20 scale-[1.03]"
                    : "border-transparent hover:border-[#d4b896] hover:shadow-md hover:scale-[1.01]",
                )}
              >
                <CardContent className="p-0">
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
                      className={cn(
                        "absolute inset-0 transition-opacity duration-200",
                        active ? "opacity-100" : "opacity-0",
                      )}
                      style={{ background: "rgba(176, 141, 106, 0.18)" }}
                    />

                    {/* Checkmark badge */}
                    <div
                      className={cn(
                        "absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200",
                        active
                          ? "bg-[#b08d6a] scale-100 opacity-100"
                          : "bg-white/80 scale-75 opacity-0 group-hover:opacity-50 group-hover:scale-90",
                      )}
                    >
                      <Check
                        size={10}
                        className={active ? "text-white" : "text-[#b08d6a]"}
                        strokeWidth={3}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="px-2 py-2">
                    <p
                      className={cn(
                        "font-semibold capitalize text-xs transition-colors duration-200 truncate",
                        active ? "text-[#b08d6a]" : "text-[#2c2420]",
                      )}
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {cat.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Selection count badge */}
          <div className="flex items-center gap-2 text-sm text-[#7a6a5a]">
            {selected.length === 0 ? (
              <span>Ingen katter valgt ennå</span>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="bg-[#f0ebe4] text-[#b08d6a] border border-[#d4b896] font-semibold"
                >
                  {selected.length}
                </Badge>
                <span>{selected.length === 1 ? "katt" : "katter"} valgt</span>
              </>
            )}
          </div>

          {/* Next button */}
          <Button
            onClick={onNext}
            disabled={selected.length === 0}
            className={cn(
              "gap-2 rounded-xl font-medium text-sm transition-all duration-200",
              selected.length > 0
                ? "bg-[#2c2420] text-white hover:bg-[#b08d6a] shadow-md hover:shadow-lg"
                : "bg-[#e8e0d8] text-[#b0a090] cursor-not-allowed",
            )}
          >
            Neste steg
            <ArrowRight size={15} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatSelection;
