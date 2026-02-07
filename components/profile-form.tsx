"use client";

import { cn } from "@/lib/utils";
import { profileSchema } from "@/schemas/profileSchema";
import { User } from "@/types";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/lib/supabase/utils";

type FieldErrors = {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  notes?: string;
};

export function ProfileForm({ user }: { user: User | null }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergency_contact, setEmergencyContact] = useState("");
  const [notes, setNotes] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setAddress(user?.address || "");
    setPhone(user?.phone || "");
    setEmergencyContact(user?.emergency_contact || "");
    setNotes(user?.notes || "");
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = profileSchema.safeParse({
      first_name,
      last_name,
      address,
      phone,
      emergency_contact,
      notes,
    });

    if (!result.success) {
      const errors: FieldErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });

      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    const newProfileData = {
      id: user?.id,
      first_name,
      last_name,
      address,
      phone,
      emergency_contact,
      notes,
      profile_completed: true,
    };

    const response = await updateUserProfile(newProfileData);

    if (response.error) {
      setFormError("Kunne ikke oppdatere profilen. Prøv igjen.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Min profil</CardTitle>
          <CardDescription>
            Se og oppdater kontaktinformasjonen din
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate action={handleProfileUpdate}>
            <div className="grid w-full items-center gap-4">
              <div className="">
                <Label htmlFor="first_name">Fornavn</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.first_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="last_name">Etternavn</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.last_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="emergency_contact">Nødtelefon</Label>
                <Input
                  id="emergency_contact"
                  type="text"
                  value={emergency_contact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.emergency_contact && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.emergency_contact}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="notes">Notater</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
                {fieldErrors.notes && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.notes}
                  </p>
                )}
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Lagrer..." : "Lagre profil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
