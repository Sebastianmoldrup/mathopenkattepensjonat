"use client";

// import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { LoginSchema, type LoginInput } from "@/lib/validation/login";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error?.message === "Email not confirmed") {
        setError(
          "E-posten er ikke bekreftet. Sjekk innboksen din for bekreftelseslenke.",
        );
        setLoading(false);
        return;
      }

      if (error) {
        setError("Feil e-post eller passord. Prøv igjen.");
        setLoading(false);
        return;
      }

      router.push("/minside");
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt ved innlogging. Prøv igjen.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logg inn</CardTitle>
          <CardDescription>
            Skriv inn e-postadressen og passordet ditt
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Field>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="email">E-post</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                  </Field>

                  <Field data-invalid={!!form.formState.errors.password}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Passord</FieldLabel>
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
                      {...form.register("password")}
                    />
                    <FieldError errors={[form.formState.errors.password]} />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </Field>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            Logg inn
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-4 text-center text-sm">
            Har du ikke en konto?{" "}
            <Link href="/registrering" className="underline underline-offset-4">
              Opprett konto
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;

// export function LoginForm({
//   className,
//   ...props
// } {
//   const [loading, setLoading] = React.useState(false);
//
//
//   const form = useForm<LoginInput>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
//
//   if (loading) {
//     return (
//       <div
//         className={cn("flex items-center justify-center", className)}
//         {...props}
//       >
//         <Spinner />
//       </div>
//     );
//   }
//
//   return ();

// const handleLogin = async () => {
//   setIsLoading(true);
//   setFormError(null);
//   setFieldErrors({});
//
//   const result = loginSchema.safeParse({
//     email,
//     password,
//   });
//
//   if (!result.success) {
//     const errors: FieldErrors = {};
//
//     result.error.issues.forEach((issue) => {
//       const field = issue.path[0] as keyof FieldErrors;
//       if (field && !errors[field]) {
//         errors[field] = issue.message;
//       }
//     });
//
//     setFieldErrors(errors);
//     setIsLoading(false);
//     return;
//   }
//
//   const supabase = createClient();
//
//   const { error } = await supabase.auth.signInWithPassword({
//     email: result.data.email,
//     password: result.data.password,
//   });
//
//   if (error?.message === "Email not confirmed") {
//     setFormError(
//       "E-posten er ikke bekreftet. Sjekk innboksen din for bekreftelseslenke.",
//     );
//     setIsLoading(false);
//     return;
//   }
//
//   if (error) {
//     setFormError("Feil e-post eller passord. Prøv igjen.");
//     setIsLoading(false);
//     return;
//   }
//
//   router.push("/minside");
// };

// return (
//   <div className={cn("flex flex-col gap-6", className)} {...props}>
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-2xl">Logg inn</CardTitle>
//         <CardDescription>
//           Skriv inn e-postadressen og passordet ditt
//         </CardDescription>
//       </CardHeader>
//
//       <CardContent>
//         <form noValidate action={handleLogin}>
//           <div className="flex flex-col gap-6">
//             {/* E-post */}
//             <div className="grid gap-2">
//               <Label htmlFor="email">E-post</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               {fieldErrors.email && (
//                 <p className="text-sm text-red-500">{fieldErrors.email}</p>
//               )}
//             </div>
//
//             {/* Passord */}
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Passord</Label>
//                 <Link
//                   href="/glemt-passord"
//                   className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                 >
//                   Glemt passord?
//                 </Link>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               {fieldErrors.password && (
//                 <p className="text-sm text-red-500">{fieldErrors.password}</p>
//               )}
//             </div>
//
//             {formError && <p className="text-sm text-red-500">{formError}</p>}
//
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Logger inn..." : "Logg inn"}
//             </Button>
//           </div>
//
//           <div className="mt-4 text-center text-sm">
//             Har du ikke en konto?{" "}
//             <Link
//               href="/registrering"
//               className="underline underline-offset-4"
//             >
//               Opprett konto
//             </Link>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   </div>
// );
// }
