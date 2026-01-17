import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type OwnerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
};

const StepOwnerInfo = () => {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
  });

  const handleChange = (field: keyof OwnerInfo, value: string) => {
    setOwnerInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Dine opplysninger</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="owner-name">Navn</Label>
          <Input
            id="owner-name"
            placeholder="F.eks. Ola Nordmann"
            value={ownerInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="owner-email">E-post</Label>
          <Input
            id="owner-email"
            type="email"
            placeholder="F.eks. ola@example.com"
            value={ownerInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="owner-phone">Telefon</Label>
          <Input
            id="owner-phone"
            type="tel"
            placeholder="F.eks. +47 12345678"
            value={ownerInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="owner-address">Adresse / Postkode</Label>
          <Input
            id="owner-address"
            placeholder="F.eks. Karl Johans gate 1, 0154 Oslo"
            value={ownerInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="owner-emergency">
            Kontaktperson dersom vi ikke får tak i deg
          </Label>
          <Input
            id="owner-emergency"
            placeholder="Navn og telefon"
            value={ownerInfo.emergencyContact}
            onChange={(e) => handleChange("emergencyContact", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepOwnerInfo;
