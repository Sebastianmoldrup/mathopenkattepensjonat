'use client'

// import React from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useState } from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { LoginSchema, type LoginInput } from '@/lib/validation/login'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginInput) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error?.message === 'Email not confirmed') {
        setError(
          'E-posten er ikke bekreftet. Sjekk innboksen din for bekreftelseslenke.'
        )
        setLoading(false)
        return
      }

      if (error) {
        setError('Feil e-post eller passord. Prøv igjen.')
        setLoading(false)
        return
      }

      router.push('/minside')
    } catch (err) {
      console.error(err)
      setError('Noe gikk galt ved innlogging. Prøv igjen.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logg inn</CardTitle>
          <CardDescription>
            Skriv inn e-postadressen og passordet ditt
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Field>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="email">E-post</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                  </Field>

                  <Field data-invalid={!!form.formState.errors.password}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Passord</FieldLabel>
                      <Link
                        href="/glemt-passord"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Glemt passord?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...form.register('password')}
                    />
                    <FieldError errors={[form.formState.errors.password]} />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </Field>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            Logg inn
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-4 text-center text-sm">
            Har du ikke en konto?{' '}
            <Link href="/registrering" className="underline underline-offset-4">
              Opprett konto
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginForm
