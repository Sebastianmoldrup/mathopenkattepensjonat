import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StepCatAmount() {
  const [selected, setSelected] = useState<number | "more" | null>(null);

  const handleButtonClick = (value: number | "more") => {
    setSelected(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Hvor mange katter skal bo hos oss?</h3>

      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4].map((num) => (
          <Button
            key={num}
            variant={selected === num ? "default" : "outline"}
            className="h-[48px] px-6 text-lg min-w-[64px]"
            onClick={() => handleButtonClick(num)}
          >
            {num}
          </Button>
        ))}

        {/* "Mer enn 4 katter"-knapp */}
        <Button
          variant={selected === "more" ? "default" : "outline"}
          className="h-[48px] px-6 text-sm min-w-[120px]"
          onClick={() => handleButtonClick("more")}
        >
          Mer enn 4 katter
        </Button>
      </div>

      {/* Info hvis >4 katter */}
      {selected === "more" && (
        <p className="text-sm text-muted-foreground mt-2">
          Vi tar kontakt med deg for å avtale hvordan vi kan ordne plass til
          alle kattene.
        </p>
      )}
    </div>
  );
}
