"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { signUpSchema } from "@/schemas/signUpSchema";

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
  password?: string;
  repeatPassword?: string;
  privacyAccepted?: string;
};

const SignUpForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = signUpSchema.safeParse({
      email,
      password,
      repeatPassword,
      privacyAccepted,
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

    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/minside`,
        data: {
          privacy_accepted_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      setFormError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.user) {
      setFormError("Noe gikk galt. Prøv igjen.");
      setIsLoading(false);
      return;
    }

    router.push("/registrering-bekreftet");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Opprett konto</CardTitle>
          <CardDescription>
            Lag en ny brukerkonto for å bestille opphold
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} noValidate>
            <div className="flex flex-col gap-6">
              {/* E-post */}
              <div className="grid gap-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* Passord */}
              <div className="grid gap-2">
                <Label htmlFor="password">Passord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {/* Gjenta passord */}
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Gjenta passord</Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {fieldErrors.repeatPassword && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.repeatPassword}
                  </p>
                )}
              </div>

              {/* GDPR checkbox */}
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="leading-snug">
                  Jeg har lest og godtar{" "}
                  <Link
                    href="/personvern"
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    personvernerklæringen
                  </Link>{" "}
                  og{" "}
                  <Link
                    href="/vilkar"
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    vilkårene
                  </Link>
                </label>
              </div>

              {fieldErrors.privacyAccepted && (
                <p className="text-sm text-red-500">
                  {fieldErrors.privacyAccepted}
                </p>
              )}

              {/* Generell feil */}
              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Oppretter konto..." : "Opprett konto"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Har du allerede en konto?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Logg inn
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
