"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { CatSchema, type CatInput } from "@/lib/validation/cat";
import { createCat } from "@/actions/cat/createCat";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddCatForm() {
  const router = useRouter();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<CatInput>({
    resolver: zodResolver(CatSchema),
    defaultValues: {
      is_sterilized: false,
      deworming_info: "",
      flea_treatment_info: "",
      medical_notes: "",
      diet: "",
      behavior_notes: "",
    },
  });

  React.useEffect(() => {
    form.reset();
    setFile(null);
    setPreview(null);
  }, []);

  const onSubmit = async (values: CatInput) => {
    if (!file) {
      alert("Vennligst last opp et bilde av katten.");
      return;
    }

    try {
      await createCat(values, file);
      router.replace("/minside/minekatter");
    } catch (err) {
      console.error(err);
      alert("Noe gikk galt ved lagring. Prøv igjen.");
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  if (form.formState.isSubmitting) {
    return (
      <div className="flex items-center justify-center gap-3 py-10">
        <Spinner className="size-6" />
        Lagrer katt…
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-8 rounded-2xl border bg-background p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Legg til katt</h2>
        <p className="text-sm text-muted-foreground">
          Felter merket med * er obligatoriske.
        </p>
      </div>

      {/* ===================== */}
      {/* Om katten */}
      {/* ===================== */}
      <FieldSet>
        <FieldLegend>Om din katt</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field className="md:col-span-2">
            <FieldLabel>Bilde *</FieldLabel>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="h-32 w-32 overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Forhåndsvisning"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
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

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Velg bilde
                </Button>
                <span className="text-xs text-muted-foreground">
                  JPEG, PNG eller WEBP. Maks 5MB.
                </span>
              </div>
            </div>
          </Field>

          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel>Navn *</FieldLabel>
            <Input {...form.register("name")} placeholder="f.eks. Luna" />
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
            <Input {...form.register("breed")} />
            <FieldError errors={[form.formState.errors.breed]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.age}>
            <FieldLabel>Alder *</FieldLabel>
            <Input type="number" {...form.register("age")} />
            <FieldError errors={[form.formState.errors.age]} />
          </Field>

          <Field orientation="horizontal" className="items-center gap-3">
            <Input
              type="checkbox"
              {...form.register("is_sterilized")}
              className="h-4 w-4"
            />
            <FieldLabel>Katten er sterilisert/kastrert</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      {/* ===================== */}
      {/* ID & forsikring */}
      {/* ===================== */}
      <FieldSet>
        <FieldLegend>ID & Forsikring</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.id_chip}>
            <FieldLabel>ID-chip</FieldLabel>
            <FieldDescription>
              Hvis katten ikke har chip, la feltet være tomt.
            </FieldDescription>
            <Input {...form.register("id_chip")} />
            <FieldError errors={[form.formState.errors.id_chip]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.insurance_number}>
            <FieldLabel>Forsikringsnummer</FieldLabel>
            <FieldDescription>
              Hvis katten ikke er forsikret, la feltet være tomt.
            </FieldDescription>
            <Input {...form.register("insurance_number")} />
            <FieldError errors={[form.formState.errors.insurance_number]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      {/* ===================== */}
      {/* Helse */}
      {/* ===================== */}
      <FieldSet>
        <FieldLegend>Helse</FieldLegend>
        <FieldGroup className="space-y-5">
          <Field
            data-invalid={!!form.formState.errors.last_vaccine_date}
            className="max-w-xs"
          >
            <FieldLabel>Sist vaksine *</FieldLabel>
            <FieldDescription>
              Hvis katten ikke har fått årets vaksine ennå, velg dato når den
              skal tas
            </FieldDescription>
            <Input type="date" {...form.register("last_vaccine_date")} />
            <FieldError errors={[form.formState.errors.last_vaccine_date]} />
          </Field>

          <Field>
            <FieldLabel>Ormebehandling</FieldLabel>{" "}
            <FieldDescription>
              Relevant informasjon om ormebehandling, dersom aktuelt.
            </FieldDescription>
            <Textarea {...form.register("deworming_info")} />
          </Field>

          <Field>
            <FieldLabel>Loppebehandling</FieldLabel>{" "}
            <FieldDescription>
              Relevant informasjon om loppebehandling, dersom aktuelt.
            </FieldDescription>
            <Textarea {...form.register("flea_treatment_info")} />
          </Field>

          <Field>
            <FieldLabel>Medisinske notater</FieldLabel>
            <FieldDescription>
              Annen helseinformasjon som er nyttig for oss å vite ved kattepass.
            </FieldDescription>
            <Textarea {...form.register("medical_notes")} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      {/* ===================== */}
      {/* Daglig pleie */}
      {/* ===================== */}
      <FieldSet>
        <FieldLegend>Daglig pleie & atferd</FieldLegend>
        <FieldGroup className="space-y-5">
          <Field>
            <FieldLabel>Kosthold</FieldLabel>{" "}
            <FieldDescription>
              Spesielle behov, rutiner eller annet som er nyttig å vite.
            </FieldDescription>
            <Textarea {...form.register("diet")} />
          </Field>

          <Field>
            <FieldLabel>Atferdsnotater</FieldLabel>{" "}
            <FieldDescription>
              Personlighet, vaner eller ting vi bør ta hensyn til.
            </FieldDescription>
            <Textarea {...form.register("behavior_notes")} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="px-8">
          Lagre katt
        </Button>
      </div>
    </form>
  );
}
