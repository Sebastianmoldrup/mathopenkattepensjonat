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
import { useState } from "react";

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

const StepCatInfo = () => {
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

  const handleChange = (field: keyof CatInfo, value: any) => {
    setCatInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Generell info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cat-name">Navn</Label>
          <Input
            id="cat-name"
            placeholder="Kattens navn"
            value={catInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cat-breed">Rase</Label>
          <Input
            id="cat-breed"
            placeholder="Rase"
            value={catInfo.breed}
            onChange={(e) => handleChange("breed", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cat-age">Alder (år)</Label>
          <Input
            id="cat-age"
            type="number"
            placeholder="F.eks. 3"
            value={catInfo.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cat-gender">Kjønn</Label>
          <Select
            value={catInfo.gender}
            onValueChange={(val) => handleChange("gender", val)}
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
          <Label htmlFor="cat-chip">Chip nummer</Label>
          <Input
            id="cat-chip"
            placeholder="Chip nummer"
            value={catInfo.chip}
            onChange={(e) => handleChange("chip", e.target.value)}
          />
        </div>
      </div>

      {/* Forsikring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="insurance-company">Forsikrings selskap</Label>
          <Input
            id="insurance-company"
            placeholder="Selskap"
            value={catInfo.insuranceCompany}
            onChange={(e) => handleChange("insuranceCompany", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="insurance-number">Forsikrings nummer</Label>
          <Input
            id="insurance-number"
            placeholder="Nummer"
            value={catInfo.insuranceNumber}
            onChange={(e) => handleChange("insuranceNumber", e.target.value)}
          />
        </div>
      </div>

      {/* Helse */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="sterilized"
            checked={catInfo.sterilized}
            onCheckedChange={(val) => handleChange("sterilized", !!val)}
          />
          <Label htmlFor="sterilized">Sterilisert</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="vaccinated"
            checked={catInfo.vaccinated}
            onCheckedChange={(val) => handleChange("vaccinated", !!val)}
          />
          <Label htmlFor="vaccinated">Vaksinert</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="worming">Ormekur (sist gitt)</Label>
            <Input
              id="worming"
              placeholder="MM/YYYY"
              value={catInfo.worming}
              onChange={(e) => handleChange("worming", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="flea-treatment"
              checked={catInfo.fleaTreatment}
              onCheckedChange={(val) => handleChange("fleaTreatment", !!val)}
            />
            <Label htmlFor="flea-treatment">Under loppebehandling?</Label>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="diet">Diett</Label>
          <Input
            id="diet"
            placeholder="F.eks. spesialfôr"
            value={catInfo.diet}
            onChange={(e) => handleChange("diet", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="medical">Medisinsk info</Label>
          <Textarea
            id="medical"
            placeholder="Skriv om sykdommer, allergier osv."
            value={catInfo.medical}
            onChange={(e) => handleChange("medical", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="behavior">Atferd</Label>
          <Textarea
            id="behavior"
            placeholder="Skriv om adferd, lek, sosialisering osv."
            value={catInfo.behavior}
            onChange={(e) => handleChange("behavior", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepCatInfo;
