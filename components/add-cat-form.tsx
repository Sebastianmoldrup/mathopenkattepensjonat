'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CatSchema, type CatInput } from '@/lib/validation/cat'
import { createCat } from '@/actions/cat/createCat'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type YesNoUnknown = 'yes' | 'no' | 'unknown'

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-2">
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            value === v
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:border-muted-foreground/40'
          )}
        >
          {v ? 'Ja' : 'Nei'}
        </button>
      ))}
    </div>
  )
}

function ThreeWayToggle({
  value,
  onChange,
}: {
  value: YesNoUnknown
  onChange: (v: YesNoUnknown) => void
}) {
  return (
    <div className="flex gap-2">
      {(
        [
          { val: 'yes', label: 'Ja' },
          { val: 'no', label: 'Nei' },
          { val: 'unknown', label: 'Vet ikke' },
        ] as const
      ).map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            value === val
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:border-muted-foreground/40'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function AddCatForm() {
  const router = useRouter()
  const [preview, setPreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<CatInput>({
    resolver: zodResolver(CatSchema),
    defaultValues: {
      is_sterilized: false,
      deworming_info: '',
      flea_treatment_info: '',
      medical_notes: '',
      diet: '',
      behavior_notes: '',
      gets_medication: false,
      medication_details: '',
      has_cat_experience: false,
      gets_along_with_cats: 'unknown',
      has_stress_issues: false,
      stress_details: '',
      aggression_risk: 'unknown',
      aggression_details: '',
    },
  })

  const onSubmit = async (values: CatInput) => {
    if (!file) {
      alert('Vennligst last opp et bilde av katten.')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      await createCat(values, file)
      router.replace('/minside/minekatter')
    } catch (err) {
      let msg = 'Noe gikk galt ved lagring.'
      if (err instanceof Error) {
        if (err.message.includes('size') || err.message.includes('large'))
          msg = 'Bildet er for stort. Maks 4.4MB.'
        else if (err.message.includes('type') || err.message.includes('mime'))
          msg = 'Filtypen støttes ikke. Bruk JPEG, PNG eller WEBP.'
        else msg = err.message
      }
      alert(msg)
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      alert('Ugyldig filtype. Velg JPEG, PNG eller WEBP.')
      return
    }
    if (f.size > 4.4 * 1024 * 1024) {
      alert(
        `Filen er for stor (${Math.floor(f.size / 1024 / 1024)}MB). Maks 4.4MB.`
      )
      return
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const getsMedication = form.watch('gets_medication') as boolean
  const hasStressIssues = form.watch('has_stress_issues') as boolean
  const aggressionRisk = form.watch('aggression_risk') as YesNoUnknown

  if (form.formState.isSubmitting) {
    return (
      <div className="flex items-center justify-center gap-3 py-10">
        <Spinner className="size-6" />
        Lagrer katt…
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-10 py-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Legg til katt</h2>
        <p className="text-sm text-muted-foreground">
          Felter merket med * er obligatoriske.
        </p>
      </div>

      {/* ─── Om katten ───────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h3 className="border-b pb-2 text-base font-medium">Om din katt</h3>

        {/* Bilde + grunninfo */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {preview ? (
                <img
                  src={preview}
                  alt="Forhåndsvisning"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-2 text-center text-xs text-muted-foreground">
                  Forhåndsvisning
                </span>
              )}
            </div>
            <Input
              type="file"
              accept=".jpeg,.jpg,.png,.webp"
              hidden
              ref={fileInputRef}
              onChange={handleImage}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Velg bilde
            </Button>
            <span className="text-center text-xs text-muted-foreground">
              JPEG · PNG · WEBP
              <br />
              maks 4.4 MB
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel>Navn *</FieldLabel>
              <Input {...form.register('name')} placeholder="f.eks. Luna" />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Kjønn *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kjønn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="hann">Hann</SelectItem>
                        <SelectItem value="hunn">Hunn</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Field data-invalid={!!form.formState.errors.breed}>
              <FieldLabel>Rase *</FieldLabel>
              <Input {...form.register('breed')} />
              <FieldError errors={[form.formState.errors.breed]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.age}>
              <FieldLabel>Alder *</FieldLabel>
              <Input type="number" min={0} max={40} {...form.register('age')} />
              <FieldError errors={[form.formState.errors.age]} />
            </Field>

            <Field
              orientation="horizontal"
              className="col-span-2 items-center gap-3"
            >
              <Input
                type="checkbox"
                {...form.register('is_sterilized')}
                className="h-4 w-4"
              />
              <FieldLabel>Katten er sterilisert / kastrert</FieldLabel>
            </Field>
          </div>
        </div>
      </section>

      {/* ─── ID & Forsikring + Helse ─────────────────────────────────────────── */}
      <div className="grid gap-8 sm:grid-cols-2">
        <section className="space-y-4">
          <h3 className="border-b pb-2 text-base font-medium">
            ID & Forsikring
          </h3>
          <Field>
            <FieldLabel>ID-chip</FieldLabel>
            <FieldDescription>
              La feltet være tomt hvis katten ikke har chip.
            </FieldDescription>
            <Input {...form.register('id_chip')} />
          </Field>
          <Field>
            <FieldLabel>Forsikringsnummer</FieldLabel>
            <FieldDescription>
              La feltet være tomt hvis katten ikke er forsikret.
            </FieldDescription>
            <Input {...form.register('insurance_number')} />
          </Field>
        </section>

        <section className="space-y-4">
          <h3 className="border-b pb-2 text-base font-medium">Helse</h3>
          <Field data-invalid={!!form.formState.errors.last_vaccine_date}>
            <FieldLabel>Sist vaksine *</FieldLabel>
            <FieldDescription>
              Hvis ikke tatt ennå, velg planlagt dato.
            </FieldDescription>
            <Input
              type="date"
              {...form.register('last_vaccine_date')}
              className="input-date"
            />
            <FieldError errors={[form.formState.errors.last_vaccine_date]} />
          </Field>
          <Field>
            <FieldLabel>Ormebehandling</FieldLabel>
            <Textarea
              {...form.register('deworming_info')}
              rows={2}
              className="resize-none"
            />
          </Field>
          <Field>
            <FieldLabel>Loppebehandling</FieldLabel>
            <Textarea
              {...form.register('flea_treatment_info')}
              rows={2}
              className="resize-none"
            />
          </Field>
          <Field>
            <FieldLabel>Medisinske notater</FieldLabel>
            <FieldDescription>
              Annen helseinformasjon som er nyttig for oss å vite.
            </FieldDescription>
            <Textarea
              {...form.register('medical_notes')}
              rows={2}
              className="resize-none"
            />
          </Field>
        </section>
      </div>

      {/* ─── Daglig pleie ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-base font-medium">Daglig pleie</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Kosthold</FieldLabel>
            <FieldDescription>
              Spesielle behov, rutiner eller annet nyttig å vite.
            </FieldDescription>
            <Textarea
              {...form.register('diet')}
              rows={3}
              className="resize-none"
            />
          </Field>
          <Field>
            <FieldLabel>Atferdsnotater</FieldLabel>
            <FieldDescription>
              Personlighet, vaner eller ting vi bør ta hensyn til.
            </FieldDescription>
            <Textarea
              {...form.register('behavior_notes')}
              rows={3}
              className="resize-none"
            />
          </Field>
        </div>
      </section>

      {/* ─── Atferd & helse ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h3 className="border-b pb-2 text-base font-medium">
            Atferd & helse
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hjelper oss gi katten best mulig opphold. Ikke obligatorisk — alle
            felter har standardsvar.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Medisinering */}
          <Field>
            <FieldLabel>Får katten medisiner?</FieldLabel>
            <Controller
              name="gets_medication"
              control={form.control}
              render={({ field }) => (
                <YesNoToggle value={!!field.value} onChange={field.onChange} />
              )}
            />
            {getsMedication && (
              <Textarea
                {...form.register('medication_details')}
                placeholder="Hvordan gis medisinen, og hvordan reagerer katten?"
                rows={2}
                className="mt-2 resize-none text-sm"
              />
            )}
          </Field>

          {/* Erfaring */}
          <Field>
            <FieldLabel>Har katten erfaring med andre katter?</FieldLabel>
            <Controller
              name="has_cat_experience"
              control={form.control}
              render={({ field }) => (
                <YesNoToggle value={!!field.value} onChange={field.onChange} />
              )}
            />
          </Field>

          {/* Går godt med andre */}
          <Field>
            <FieldLabel>Går katten godt sammen med andre katter?</FieldLabel>
            <Controller
              name="gets_along_with_cats"
              control={form.control}
              render={({ field }) => (
                <ThreeWayToggle
                  value={(field.value ?? 'unknown') as YesNoUnknown}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          {/* Stress */}
          <Field>
            <FieldLabel>Har katten stressrelaterte utfordringer?</FieldLabel>
            <Controller
              name="has_stress_issues"
              control={form.control}
              render={({ field }) => (
                <YesNoToggle value={!!field.value} onChange={field.onChange} />
              )}
            />
            {hasStressIssues && (
              <Textarea
                {...form.register('stress_details')}
                placeholder="Vennligst utdyp..."
                rows={2}
                className="mt-2 resize-none text-sm"
              />
            )}
          </Field>

          {/* Aggresjonsrisiko — full bredde siden den kan ekspandere */}
          <Field className="sm:col-span-2">
            <FieldLabel>
              Kan katten utgjøre en risiko for andre katter?
            </FieldLabel>
            <FieldDescription>F.eks. ved aggressiv atferd.</FieldDescription>
            <Controller
              name="aggression_risk"
              control={form.control}
              render={({ field }) => (
                <ThreeWayToggle
                  value={(field.value ?? 'unknown') as YesNoUnknown}
                  onChange={field.onChange}
                />
              )}
            />
            {(aggressionRisk === 'yes' || aggressionRisk === 'unknown') && (
              <Textarea
                {...form.register('aggression_details')}
                placeholder="Vennligst utdyp..."
                rows={2}
                className="mt-2 resize-none text-sm"
              />
            )}
          </Field>
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="px-8">
          Lagre katt
        </Button>
      </div>
    </form>
  )
}
