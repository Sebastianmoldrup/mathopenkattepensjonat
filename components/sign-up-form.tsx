"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    const result = signUpSchema.safeParse({
      email,
      password,
      repeatPassword,
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

    const { error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/minside`,
      },
    });

    if (error) {
      setFormError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/registrering-bekreftet");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Opprett konto</CardTitle>
          <CardDescription>Lag en ny brukerkonto</CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate action={handleSignUp}>
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
                <Label htmlFor="repeat-password">Gjenta passord</Label>
                <Input
                  id="repeat-password"
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
}
