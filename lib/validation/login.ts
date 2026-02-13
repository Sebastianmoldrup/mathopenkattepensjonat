import { z } from "zod";

/**
 * Main schema
 */
export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ugyldig e-postadresse"),
  password: z.string().min(1, "Du må skrive inn passordet"),
});

/**
 * Type used in React Hook Form
 */
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Type AFTER validation (safe for DB)
 */
export type Login = z.output<typeof LoginSchema>;
