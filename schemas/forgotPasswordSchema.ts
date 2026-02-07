import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ugyldig e-postadresse"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
