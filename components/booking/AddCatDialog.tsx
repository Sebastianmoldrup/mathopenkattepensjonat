'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CatSchema, type CatInput } from '@/lib/validation/cat'
import { createCatAndReturn } from '@/actions/cat/createCatAndReturn'
import { Cat } from '@/lib/booking/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type YesNoUnknown = 'yes' | 'no' | 'unknown'

function YesNoToggle({
  value,
  onChange,
  hasError,
}: {
  value: boolean | undefined | null
  onChange: (v: boolean) => void
  hasError?: boolean
}) {
  return (
    <div
      className={cn(
        'flex gap-2 rounded-lg',
        hasError &&
          (value === undefined || value === null) &&
          'ring-1 ring-destructive'
      )}
    >
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
  hasError,
}: {
  value: string | undefined | null
  onChange: (v: YesNoUnknown) => void
  hasError?: boolean
}) {
  return (
    <div
      className={cn(
        'flex gap-2',
        hasError &&
          (!value || value === '') &&
          'rounded-lg ring-1 ring-destructive'
      )}
    >
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

interface AddCatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCatAdded: (cat: Cat) => void
}

export function AddCatDialog({
  open,
  onOpenChange,
  onCatAdded,
}: AddCatDialogProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<CatInput>({
    resolver: zodResolver(CatSchema),
    defaultValues: {
      name: '',
      breed: '',
      age: '',
      is_sterilized: false,
      id_chip: '',
      insurance_number: '',
      deworming_info: '',
      flea_treatment_info: '',
      medical_notes: '',
      diet: '',
      behavior_notes: '',
      medication_details: '',
      stress_details: '',
      aggression_details: '',
      gets_medication: null,
      has_cat_experience: null,
      has_stress_issues: null,
      gets_along_with_cats: '',
      aggression_risk: '',
    },
  })

  function handleClose() {
    form.reset()
    setFile(null)
    setPreview(null)
    onOpenChange(false)
  }

  const onSubmit = async (values: CatInput) => {
    if (!file) {
      alert('Vennligst last opp et bilde av katten.')
      return
    }
    try {
      const newCat = await createCatAndReturn(values, file)
      onCatAdded(newCat)
      handleClose()
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
        'Filen er for stor (' +
          Math.floor(f.size / 1024 / 1024) +
          'MB). Maks 4.4MB.'
      )
      return
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const getsMedication = form.watch('gets_medication')
  const hasStressIssues = form.watch('has_stress_issues')
  const aggressionRisk = form.watch('aggression_risk')

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legg til katt</DialogTitle>
          <DialogDescription className="sr-only">
            Legg til informasjon om katten din
          </DialogDescription>
        </DialogHeader>

        {form.formState.isSubmitting ? (
          <div className="flex items-center justify-center gap-3 py-10">
            <Spinner className="size-6" />
            <span className="text-sm text-muted-foreground">Lagrer katt…</span>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2"
          >
            {/* ─── Om katten ─────────────────────────────────────────────────── */}
            <section className="space-y-5">
              <h3 className="border-b pb-2 text-base font-medium">
                Om din katt
              </h3>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border bg-muted">
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
                    <Input
                      {...form.register('name')}
                      placeholder="f.eks. Luna"
                    />
                    <FieldError errors={[form.formState.errors.name]} />
                  </Field>

                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Kjønn *</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                    <Controller
                      name="age"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Velg alder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="3 måneder">
                                3 måneder
                              </SelectItem>
                              <SelectItem value="6 måneder">
                                6 måneder
                              </SelectItem>
                              <SelectItem value="9 måneder">
                                9 måneder
                              </SelectItem>
                              {Array.from({ length: 20 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={String(i + 1) + ' år'}
                                >
                                  {i + 1} år
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
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

            {/* ─── ID & Forsikring + Helse ────────────────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2">
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
                  <FieldError
                    errors={[form.formState.errors.last_vaccine_date]}
                  />
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
                  <Textarea
                    {...form.register('medical_notes')}
                    rows={2}
                    className="resize-none"
                  />
                </Field>
              </section>
            </div>

            {/* ─── Daglig pleie ───────────────────────────────────────────────── */}
            <section className="space-y-4">
              <h3 className="border-b pb-2 text-base font-medium">
                Daglig pleie
              </h3>
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

            {/* ─── Atferd & helse ─────────────────────────────────────────────── */}
            <section className="space-y-5">
              <div>
                <h3 className="border-b pb-2 text-base font-medium">
                  Atferd & helse
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Hjelper oss gi katten best mulig opphold. Alle felt er
                  påkrevd.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Medisinering */}
                <Field>
                  <FieldLabel>Får katten medisiner? *</FieldLabel>
                  <Controller
                    name="gets_medication"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <YesNoToggle
                          value={field.value as boolean | null | undefined}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  {getsMedication === true && (
                    <>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Oppgi hvilke medisiner, dosering og hvordan de gis
                      </p>
                      <Textarea
                        {...form.register('medication_details')}
                        placeholder="F.eks. Prednisolon 5mg, 1 tablett morgen og kveld, blandes i mat"
                        rows={3}
                        className="mt-1 resize-none text-sm"
                      />
                    </>
                  )}
                </Field>

                {/* Erfaring */}
                <Field>
                  <FieldLabel>
                    Har katten erfaring med andre katter? *
                  </FieldLabel>
                  <Controller
                    name="has_cat_experience"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <YesNoToggle
                          value={field.value as boolean | null | undefined}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </Field>

                {/* Går godt med andre */}
                <Field>
                  <FieldLabel>
                    Går katten godt sammen med andre katter? *
                  </FieldLabel>
                  <Controller
                    name="gets_along_with_cats"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <ThreeWayToggle
                          value={field.value as string}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </Field>

                {/* Stress */}
                <Field>
                  <FieldLabel>
                    Har katten stressrelaterte utfordringer? *
                  </FieldLabel>
                  <Controller
                    name="has_stress_issues"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <YesNoToggle
                          value={field.value as boolean | null | undefined}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  {hasStressIssues === true && (
                    <Textarea
                      {...form.register('stress_details')}
                      placeholder="Vennligst utdyp..."
                      rows={2}
                      className="mt-2 resize-none text-sm"
                    />
                  )}
                </Field>

                {/* Aggresjonsrisiko */}
                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Kan katten utgjøre en risiko for andre katter? *
                  </FieldLabel>
                  <FieldDescription>
                    F.eks. ved aggressiv atferd.
                  </FieldDescription>
                  <Controller
                    name="aggression_risk"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <ThreeWayToggle
                          value={field.value as string}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  {(aggressionRisk === 'yes' ||
                    aggressionRisk === 'unknown') && (
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

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Avbryt
              </Button>
              <Button type="submit" size="lg" className="px-8">
                Lagre katt
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
