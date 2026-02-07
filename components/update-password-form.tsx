"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { updatePasswordSchema } from "@/schemas/updatePasswordSchema";

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

type FieldErrors = {
  password?: string;
};

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = updatePasswordSchema.safeParse({ password });

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

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: result.data.password,
    });

    if (error) {
      setFormError("Kunne ikke oppdatere passordet. Prøv igjen.");
      setIsLoading(false);
      return;
    }

    router.push("/protected");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Oppdater passord</CardTitle>
          <CardDescription>Skriv inn ditt nye passord nedenfor</CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate action={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              {/* Nytt passord */}
              <div className="grid gap-2">
                <Label htmlFor="password">Nytt passord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nytt passord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Lagrer passord..." : "Lagre nytt passord"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
