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
} from '@/components/ui/dialog'
import {
  Field,
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
import { cn } from '@/lib/utils'

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
            'rounded-lg border px-3 py-1 text-sm font-medium transition-colors',
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
    <div className="flex flex-wrap gap-2">
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
            'rounded-lg border px-3 py-1 text-sm font-medium transition-colors',
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
          msg = 'Filtypen støttes ikke.'
        else msg = err.message
      }
      alert(msg)
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      alert('Ugyldig filtype.')
      return
    }
    if (f.size > 4.4 * 1024 * 1024) {
      alert('Bildet er for stort. Maks 4.4MB.')
      return
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const getsMedication = form.watch('gets_medication') as boolean
  const hasStressIssues = form.watch('has_stress_issues') as boolean
  const aggressionRisk = form.watch('aggression_risk') as YesNoUnknown

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legg til katt</DialogTitle>
        </DialogHeader>

        {form.formState.isSubmitting ? (
          <div className="flex items-center justify-center gap-3 py-10">
            <Spinner className="size-5" />
            <span className="text-sm text-muted-foreground">Lagrer katt…</span>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-2"
          >
            {/* Om katten */}
            <FieldSet>
              <FieldLegend>Om din katt</FieldLegend>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Forhåndsvisning"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="px-1 text-center text-xs text-muted-foreground">
                        Bilde
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
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3">
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
                            <SelectValue placeholder="Velg" />
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
                    <Input
                      type="number"
                      min={0}
                      max={40}
                      {...form.register('age')}
                    />
                    <FieldError errors={[form.formState.errors.age]} />
                  </Field>
                  <Field
                    orientation="horizontal"
                    className="col-span-2 items-center gap-2"
                  >
                    <Input
                      type="checkbox"
                      {...form.register('is_sterilized')}
                      className="h-4 w-4"
                    />
                    <FieldLabel>Sterilisert / kastrert</FieldLabel>
                  </Field>
                </div>
              </div>
            </FieldSet>

            <FieldSeparator />

            {/* Helse */}
            <FieldSet>
              <FieldLegend>Helse</FieldLegend>
              <FieldGroup>
                <Field data-invalid={!!form.formState.errors.last_vaccine_date}>
                  <FieldLabel>Sist vaksine *</FieldLabel>
                  <Input
                    type="date"
                    {...form.register('last_vaccine_date')}
                    className="input-date max-w-xs"
                  />
                  <FieldError
                    errors={[form.formState.errors.last_vaccine_date]}
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
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Atferd */}
            <FieldSet>
              <FieldLegend>Atferd</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel>Får katten medisiner?</FieldLabel>
                  <Controller
                    name="gets_medication"
                    control={form.control}
                    render={({ field }) => (
                      <YesNoToggle
                        value={!!field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {getsMedication && (
                    <Textarea
                      {...form.register('medication_details')}
                      placeholder="Beskriv medisinering..."
                      rows={2}
                      className="mt-2 resize-none text-sm"
                    />
                  )}
                </Field>
                <Field>
                  <FieldLabel>Går katten godt med andre katter?</FieldLabel>
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
                <Field>
                  <FieldLabel>
                    Har katten stressrelaterte utfordringer?
                  </FieldLabel>
                  <Controller
                    name="has_stress_issues"
                    control={form.control}
                    render={({ field }) => (
                      <YesNoToggle
                        value={!!field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {hasStressIssues && (
                    <Textarea
                      {...form.register('stress_details')}
                      placeholder="Utdyp..."
                      rows={2}
                      className="mt-2 resize-none text-sm"
                    />
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Kan katten utgjøre en risiko for andre katter?
                  </FieldLabel>
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
                  {(aggressionRisk === 'yes' ||
                    aggressionRisk === 'unknown') && (
                    <Textarea
                      {...form.register('aggression_details')}
                      placeholder="Utdyp..."
                      rows={2}
                      className="mt-2 resize-none text-sm"
                    />
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Avbryt
              </Button>
              <Button type="submit">Lagre katt</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
