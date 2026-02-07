import { z } from "zod";

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Passordet må være minst 8 tegn")
    .max(72, "Passordet er for langt"),
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
