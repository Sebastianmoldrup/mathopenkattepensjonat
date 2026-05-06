import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const yesNoUnknown = z.enum(['yes', 'no', 'unknown']).default('unknown')

export const CatSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Navn er påkrevd')
    .max(50, 'Navn er for langt'),
  gender: z
    .enum(['hann', 'hunn'])
    .or(z.literal(''))
    .refine((v) => v === 'hann' || v === 'hunn', { message: 'Velg kjønn' }),
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
  deworming_info: optionalText,
  flea_treatment_info: optionalText,
  medical_notes: optionalText,
  diet: optionalText,
  behavior_notes: optionalText,
  // ─── Behavior fields ───────────────────────────────────────────────────────
  gets_medication: z.coerce.boolean().default(false),
  medication_details: optionalText,
  has_cat_experience: z.coerce.boolean().default(false),
  gets_along_with_cats: yesNoUnknown,
  has_stress_issues: z.coerce.boolean().default(false),
  stress_details: optionalText,
  aggression_risk: yesNoUnknown,
  aggression_details: optionalText,
})

export type CatInput = z.input<typeof CatSchema>
export type CatData = z.output<typeof CatSchema>
