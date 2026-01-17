import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

type CatInfo = {
  name: string;
  breed: string;
  age: string;
  gender: string;
  chip: string;
  insuranceCompany: string;
  insuranceNumber: string;
  sterilized: boolean;
  vaccinated: boolean;
  worming: string;
  fleaTreatment: boolean;
  diet: string;
  medical: string;
  behavior: string;
};

const StepCatInfo = ({ catIndex }: { catIndex: number }) => {
  // const { bookingData, setBookingData } = useBooking(); // hent context
  const [catInfo, setCatInfo] = useState<CatInfo>({
    name: "",
    breed: "",
    age: "",
    gender: "",
    chip: "",
    insuranceCompany: "",
    insuranceNumber: "",
    sterilized: false,
    vaccinated: false,
    worming: "",
    fleaTreatment: false,
    diet: "",
    medical: "",
    behavior: "",
  });

  // Oppdater provider hver gang catInfo endres
  // useEffect(() => {
  //   const cats = [...(bookingData.cats || [])];
  //   cats[catIndex] = catInfo;
  //   setBookingData({ ...bookingData, cats });
  // }, [catInfo]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Informasjon om katten</h3>

      {/* Generell info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`cat-name-${catIndex}`}>Navn</Label>
          <Input
            id={`cat-name-${catIndex}`}
            placeholder="Kattens navn"
            value={catInfo.name}
            onChange={(e) => setCatInfo({ ...catInfo, name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`cat-breed-${catIndex}`}>Rase</Label>
          <Input
            id={`cat-breed-${catIndex}`}
            placeholder="Rase"
            value={catInfo.breed}
            onChange={(e) => setCatInfo({ ...catInfo, breed: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`cat-age-${catIndex}`}>Alder (år)</Label>
          <Input
            id={`cat-age-${catIndex}`}
            type="number"
            placeholder="F.eks. 3"
            value={catInfo.age}
            onChange={(e) => setCatInfo({ ...catInfo, age: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`cat-gender-${catIndex}`}>Kjønn</Label>
          <Select
            value={catInfo.gender}
            onValueChange={(val) => setCatInfo({ ...catInfo, gender: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg kjønn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Hann</SelectItem>
              <SelectItem value="female">Hunn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor={`cat-chip-${catIndex}`}>Chip nummer</Label>
          <Input
            id={`cat-chip-${catIndex}`}
            placeholder="Chip nummer"
            value={catInfo.chip}
            onChange={(e) => setCatInfo({ ...catInfo, chip: e.target.value })}
          />
        </div>
      </div>

      {/* Forsikring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`insurance-company-${catIndex}`}>
            Forsikrings selskap
          </Label>
          <Input
            id={`insurance-company-${catIndex}`}
            placeholder="Selskap"
            value={catInfo.insuranceCompany}
            onChange={(e) =>
              setCatInfo({ ...catInfo, insuranceCompany: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`insurance-number-${catIndex}`}>
            Forsikrings nummer
          </Label>
          <Input
            id={`insurance-number-${catIndex}`}
            placeholder="Nummer"
            value={catInfo.insuranceNumber}
            onChange={(e) =>
              setCatInfo({ ...catInfo, insuranceNumber: e.target.value })
            }
          />
        </div>
      </div>

      {/* Helse */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`sterilized-${catIndex}`}
            checked={catInfo.sterilized}
            onCheckedChange={(val) =>
              setCatInfo({ ...catInfo, sterilized: !!val })
            }
          />
          <Label htmlFor={`sterilized-${catIndex}`}>Sterilisert</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`vaccinated-${catIndex}`}
            checked={catInfo.vaccinated}
            onCheckedChange={(val) =>
              setCatInfo({ ...catInfo, vaccinated: !!val })
            }
          />
          <Label htmlFor={`vaccinated-${catIndex}`}>Vaksinert</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`worming-${catIndex}`}>Ormekur (sist gitt)</Label>
            <Input
              id={`worming-${catIndex}`}
              placeholder="MM/YYYY"
              value={catInfo.worming}
              onChange={(e) =>
                setCatInfo({ ...catInfo, worming: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id={`flea-${catIndex}`}
              checked={catInfo.fleaTreatment}
              onCheckedChange={(val) =>
                setCatInfo({ ...catInfo, fleaTreatment: !!val })
              }
            />
            <Label htmlFor={`flea-${catIndex}`}>Under loppebehandling?</Label>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor={`diet-${catIndex}`}>Diett</Label>
          <Input
            id={`diet-${catIndex}`}
            placeholder="F.eks. spesialfôr"
            value={catInfo.diet}
            onChange={(e) => setCatInfo({ ...catInfo, diet: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`medical-${catIndex}`}>Medisinsk info</Label>
          <Textarea
            id={`medical-${catIndex}`}
            placeholder="Skriv om sykdommer, allergier osv."
            value={catInfo.medical}
            onChange={(e) =>
              setCatInfo({ ...catInfo, medical: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`behavior-${catIndex}`}>Atferd</Label>
          <Textarea
            id={`behavior-${catIndex}`}
            placeholder="Skriv om adferd, lek, sosialisering osv."
            value={catInfo.behavior}
            onChange={(e) =>
              setCatInfo({ ...catInfo, behavior: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StepCatInfo;
