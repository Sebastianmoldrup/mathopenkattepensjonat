import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1, "Fornavn er påkrevd"),
  last_name: z.string().min(1, "Etternavn er påkrevd"),

  address: z.string().min(1, "Adresse er påkrevd"),
  phone: z.string().min(1, "Telefonnummer er påkrevd"),

  emergency_contact: z.string().optional().nullable(),

  notes: z.string().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
