"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";

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
  email?: string;
};

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = forgotPasswordSchema.safeParse({ email });

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

    const { error } = await supabase.auth.resetPasswordForEmail(
      result.data.email,
      {
        redirectTo: `${window.location.origin}/endre-passord`,
      },
    );

    if (error) {
      setFormError("Kunne ikke sende e-post. Prøv igjen senere.");
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sjekk e-posten din</CardTitle>
            <CardDescription>
              Vi har sendt deg en lenke for å endre passord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hvis e-postadressen er registrert hos oss, vil du motta en e-post
              med instruksjoner for å tilbakestille passordet ditt.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Glemt passord</CardTitle>
            <CardDescription>
              Skriv inn e-postadressen din, så sender vi deg en lenke for å lage
              et nytt passord
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form noValidate action={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                {/* E-post */}
                <div className="grid gap-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="navn@eksempel.no"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                {formError && (
                  <p className="text-sm text-red-500">{formError}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Sender e-post..."
                    : "Send lenke for nytt passord"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Har du allerede en konto?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Logg inn
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
