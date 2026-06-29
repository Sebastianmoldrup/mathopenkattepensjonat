'use client'

import * as z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateAdminUser } from '@/actions/admin/updateAdminUser'

const adminProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Fornavn er påkrevd')
    .max(18, 'Fornavn er for langt')
    .toLowerCase(),
  last_name: z
    .string()
    .min(1, 'Etternavn er påkrevd')
    .max(18, 'Etternavn er for langt')
    .toLowerCase(),
  address: z.string().trim().min(1, 'Adresse er påkrevd').toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(1, 'Telefonnummer er påkrevd')
    .regex(/^\+?\d{7,15}$/, 'Ugyldig telefonnummer'),
  emergency_contact: z
    .string()
    .trim()
    .min(1, 'Nødkontakt er påkrevd')
    .regex(/^\+?\d{7,15}$/, 'Ugyldig telefonnummer'),
  notes: z.string().optional(),
})

type AdminProfileData = {
  first_name?: string | null
  last_name?: string | null
  address?: string | null
  phone?: string | null
  emergency_contact?: string | null
  notes?: string | null
}

function stripCountryCode(phone: string | null | undefined): string {
  return phone?.replace(/^\+47/, '') ?? ''
}

function normalizePhone(phone: string): string {
  return phone.startsWith('+') ? phone : `+47${phone}`
}

export function AdminProfileForm({ adminUser }: { adminUser: AdminProfileData | null }) {
  const router = useRouter()

  const form = useForm<z.infer<typeof adminProfileSchema>>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      first_name: adminUser?.first_name ?? '',
      last_name: adminUser?.last_name ?? '',
      address: adminUser?.address ?? '',
      phone: stripCountryCode(adminUser?.phone),
      emergency_contact: stripCountryCode(adminUser?.emergency_contact),
      notes: adminUser?.notes ?? '',
    },
  })

  const onSubmit = async (data: z.infer<typeof adminProfileSchema>) => {
    const result = await updateAdminUser({
      ...data,
      phone: normalizePhone(data.phone),
      emergency_contact: normalizePhone(data.emergency_contact),
    })
    if (!result) {
      toast.error('Noe gikk galt. Prøv igjen.', { position: 'bottom-center' })
      return
    }
    toast.success('Profil oppdatert', { position: 'bottom-center' })
    router.push('/admin')
  }

  if (form.formState.isSubmitting) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-6" />
        <p className="ml-2 text-muted-foreground">Lagrer profil...</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-8 rounded-2xl"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Min profil</h2>
        <p className="text-sm text-muted-foreground">
          Felter merket med * er obligatoriske.
        </p>
      </div>

      <FieldSet>
        <FieldLegend>Personlig informasjon</FieldLegend>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.first_name}>
            <FieldLabel htmlFor="first_name">Fornavn *</FieldLabel>
            <Input
              id="first_name"
              placeholder="Fornavn"
              className="capitalize"
              {...form.register('first_name')}
            />
            <FieldError errors={[form.formState.errors.first_name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.last_name}>
            <FieldLabel htmlFor="last_name">Etternavn *</FieldLabel>
            <Input
              id="last_name"
              placeholder="Etternavn"
              className="capitalize"
              {...form.register('last_name')}
            />
            <FieldError errors={[form.formState.errors.last_name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.address}>
            <FieldLabel htmlFor="address">Adresse *</FieldLabel>
            <Input
              id="address"
              placeholder="Adresse"
              className="capitalize"
              {...form.register('address')}
            />
            <FieldError errors={[form.formState.errors.address]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.phone}>
            <FieldLabel htmlFor="phone">Telefonnummer *</FieldLabel>
            <Input
              id="phone"
              placeholder="12345678"
              {...form.register('phone')}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>
        </FieldGroup>

        <FieldSeparator />

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.emergency_contact}>
            <FieldLabel htmlFor="emergency_contact">Nødtelefon *</FieldLabel>
            <Input
              id="emergency_contact"
              placeholder="12345678"
              {...form.register('emergency_contact')}
            />
            <FieldError errors={[form.formState.errors.emergency_contact]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.notes}>
            <FieldLabel htmlFor="notes">Notater</FieldLabel>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Annen relevant informasjon"
              {...form.register('notes')}
            />
            <FieldError errors={[form.formState.errors.notes]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="lg"
          className="px-8"
          disabled={form.formState.isSubmitting}
        >
          Lagre profil
        </Button>
      </div>
    </form>
  )
}
