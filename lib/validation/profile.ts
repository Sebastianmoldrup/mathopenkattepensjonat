import { z } from "zod";

/**
 * Helpers
 */

// empty textarea -> undefined instead of ""
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

/**
 * Main schema
 */
export const ProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "Fornavn er påkrevd")
    .max(50, "Fornavn er for langt"),
  last_name: z
    .string()
    .trim()
    .min(1, "Etternavn er påkrevd")
    .max(50, "Etternavn er for langt"),
  address: z
    .string()
    .trim()
    .min(1, "Adresse er påkrevd")
    .max(200, "Adresse er for lang"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, "Ugyldig telefonnummer")
    .optional(),
  emergency_contact: optionalText,
  notes: optionalText,
});

/**
 * Type used in React Hook Form
 */
export type ProfileInput = z.infer<typeof ProfileSchema>;

/**
 * Type AFTER validation (safe for DB)
 */
export type Profile = z.output<typeof ProfileSchema>;
