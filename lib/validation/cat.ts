import { z } from 'zod'

/**
 * Helpers
 */

// empty textarea -> undefined instead of ""
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

/**
 * Main schema
 */
export const CatSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Navn er påkrevd')
    .max(50, 'Navn er for langt'),

  gender: z
    .enum(['hann', 'hunn'])
    .or(z.literal(''))
    .refine((v) => v === 'hann' || v === 'hunn', {
      message: 'Velg kjønn',
    }),

  breed: z
    .string()
    .trim()
    .min(1, 'Rase er påkrevd')
    .max(50, 'Rase er for lang'),

  age: z.coerce
    .number()
    .int('Alder må være et helt tall')
    .min(0, 'Ugyldig alder')
    .max(40, 'Ugyldig alder'),

  is_sterilized: z.coerce.boolean().default(false),

  id_chip: z.string().trim().optional(),

  insurance_number: z.string().trim().optional(),

  last_vaccine_date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: 'Velg gyldig dato',
  }),

  // optional fields
  deworming_info: optionalText,
  flea_treatment_info: optionalText,
  medical_notes: optionalText,
  diet: optionalText,
  behavior_notes: optionalText,
})

/**
 * Type used in React Hook Form
 */
export type CatInput = z.input<typeof CatSchema>

/**
 * Type AFTER validation (safe for DB)
 */
export type CatData = z.output<typeof CatSchema>
