import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Ugyldig e-postadresse"),

    password: z.string().min(6, "Passordet må være minst 6 tegn"),

    repeatPassword: z.string().min(1, "Du må gjenta passordet"),

    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: "Du må godta personvernerklæringen og vilkårene",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passordene er ikke like",
    path: ["repeatPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
