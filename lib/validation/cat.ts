import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const requiredBoolean = z
  .any()
  .refine((v) => v === true || v === false, { message: 'Må fylles ut' })

const yesNoUnknown = z
  .any()
  .refine((v) => v === 'yes' || v === 'no' || v === 'unknown', {
    message: 'Må fylles ut',
  })

export const AGE_OPTIONS = [
  '3 måneder',
  '6 måneder',
  '9 måneder',
  ...Array.from({ length: 20 }, (_, i) => `${i + 1} år`),
] as const

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
  age: z.string().min(1, 'Velg alder'),
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
  gets_medication: requiredBoolean,
  medication_details: optionalText,
  has_cat_experience: requiredBoolean,
  gets_along_with_cats: yesNoUnknown,
  has_stress_issues: requiredBoolean,
  stress_details: optionalText,
  aggression_risk: yesNoUnknown,
  aggression_details: optionalText,
})

export type CatInput = z.input<typeof CatSchema>
export type CatData = z.output<typeof CatSchema>
