"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/schemas/loginSchema";

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
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = loginSchema.safeParse({
      email,
      password,
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

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (error?.message === "Email not confirmed") {
      setFormError(
        "E-posten er ikke bekreftet. Sjekk innboksen din for bekreftelseslenke.",
      );
      setIsLoading(false);
      return;
    }

    if (error) {
      setFormError("Feil e-post eller passord. Prøv igjen.");
      setIsLoading(false);
      return;
    }

    router.push("/minside");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logg inn</CardTitle>
          <CardDescription>
            Skriv inn e-postadressen og passordet ditt
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate action={handleLogin}>
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
                <div className="flex items-center">
                  <Label htmlFor="password">Passord</Label>
                  <Link
                    href="/glemt-passord"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Glemt passord?
                  </Link>
                </div>
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

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logger inn..." : "Logg inn"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Har du ikke en konto?{" "}
              <Link
                href="/registrering"
                className="underline underline-offset-4"
              >
                Opprett konto
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
