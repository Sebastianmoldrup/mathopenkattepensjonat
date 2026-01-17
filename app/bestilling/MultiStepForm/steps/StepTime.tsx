import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StepTime() {
  const openTimes = [
    { start: "17:00", end: "18:00" },
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
  ];

  // State for selected times
  const [selectedCheckin, setSelectedCheckin] = useState<string | null>(null);
  const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Info */}
      <p className="text-sm text-muted-foreground">
        Ved sommersesong vil det være mulig å levere og hente også på lørdager.
      </p>

      {/* Standard times */}
      <div className="space-y-6">
        {/* Check-in */}
        <div className="space-y-2">
          <h3 className="font-semibold">Levering</h3>
          <div className="flex flex-wrap gap-3">
            {openTimes.map((time, index) => {
              const value = `${time.start}-${time.end}`;
              return (
                <Button
                  key={index}
                  variant={selectedCheckin === value ? "default" : "outline"}
                  className="flex-1 sm:flex-none min-w-[100px]"
                  onClick={() => setSelectedCheckin(value)}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <h3 className="font-semibold">Henting</h3>
          <div className="flex flex-wrap gap-3">
            {openTimes.map((time, index) => {
              const value = `${time.start}-${time.end}`;
              return (
                <Button
                  key={index}
                  variant={selectedCheckout === value ? "default" : "outline"}
                  className="flex-1 sm:flex-none min-w-[100px]"
                  onClick={() => setSelectedCheckout(value)}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom times */}
      <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
        <p className="text-sm text-muted-foreground">
          Dersom våre åpningstider ikke passer, legg inn forslag så tar vi
          kontakt.
        </p>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="custom-checkin">Levering</Label>
            <Input id="custom-checkin" type="time" className="w-full" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="custom-checkout">Henting</Label>
            <Input id="custom-checkout" type="time" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
