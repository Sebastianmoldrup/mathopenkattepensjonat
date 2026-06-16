'use client'

import * as z from 'zod'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { updateUser } from '@/actions/user/updateUser'
import { User } from '@/types'

const profileSchema = z.object({
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
  address: z.string().trim().toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(1, 'Telefonnummer er påkrevd')
    .regex(/^\+?\d{7,15}$/, 'Ugyldig telefonnummer'),
  emergency_contact: z
    .string()
    .trim()
    .min(1, 'Nødkontakt er påkrev')
    .regex(/^\+?\d{7,15}$/, 'Ugyldig telefonnummer'),
  notes: z.string().optional(),
})

export function ProfileForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      phone: '',
      emergency_contact: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!user) return
    form.reset({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      address: user.address ?? '',
      phone: user.phone?.replace(/^\+47/, '') ?? '',
      emergency_contact: user.emergency_contact?.replace(/^\+47/, '') ?? '',
      notes: user.notes ?? '',
    })
  }, [user, form])

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return
    setLoading(true)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    await updateUser(user.id, data)
    form.reset(data)
    setLoading(false)
    redirect('/minside')
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-6" />{' '}
        <p className="text-muted-foreground">Lagrer profil...</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-8 rounded-2xl"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Oppdater din profil</h2>
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
            <FieldDescription>
              Legg ved en nødkontakt vi kan ringe hvis vi ikke får tak i deg
            </FieldDescription>
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
              placeholder="Annen relevant informasjon om deg"
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
          onClick={() =>
            toast.info('Profil oppdatert', { position: 'bottom-center' })
          }
        >
          Lagre profil
        </Button>
      </div>
    </form>
  )
}
