import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ugyldig e-postadresse"),

  password: z.string().min(1, "Du må skrive inn passordet"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
