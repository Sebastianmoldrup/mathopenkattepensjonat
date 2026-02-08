"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CatSchema, type CatInput } from "@/lib/validation/cat";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  Field,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateCat } from "@/actions/cat/updateCat";
import { Cat } from "@/types";

export default function UpdateCatForm({ cat }: { cat: Cat }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // console.log("Cat data in form:", cat);
  // console.log("Initial photo URL:", photoUrl);
  console.log("Preview state:", preview);

  useEffect(() => {
    setPreview(cat.image_url || null);
  }, [cat.image_url]);

  const form = useForm<CatInput>({
    resolver: zodResolver(CatSchema),
    defaultValues: {
      name: cat.name,
      gender: cat.gender as "hann" | "hunn",
      breed: cat.breed || "",
      age: cat.age,
      id_chip: cat.id_chip || "",
      insurance_number: cat.insurance_number || "",
      last_vaccine_date: cat.last_vaccine_date,
      deworming_info: cat.deworming_info || "",
      flea_treatment_info: cat.flea_treatment_info || "",
      medical_notes: cat.medical_notes || "",
      diet: cat.diet || "",
      behavior_notes: cat.behavior_notes || "",
      is_sterilized: cat.is_sterilized,
    },
  });

  const onSubmit = async (values: CatInput) => {
    await updateCat(cat.id, values, file);

    form.reset();
    setPreview(null);
    setFile(null);
    redirect("/minside/minekatter");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-8 rounded-2xl border bg-background p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Oppdater din katt</h2>
        <p className="text-sm text-muted-foreground">
          Felter merket med * er obligatoriske.
        </p>
      </div>

      <FieldSet>
        <FieldLegend>Om din katt</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field className="md:col-span-2">
            <FieldLabel>Bilde *</FieldLabel>
            <div className="flex space-y-1 justify-start items-center flex-col md:flex-row gap-4">
              <div className="h-32 w-32  overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Forhåndsvisning
                  </span>
                )}
              </div>
              <Input
                type="file"
                accept=".jpeg, .png, .webp"
                hidden
                onChange={handleImage}
                ref={fileInputRef}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Velg bilde
                </Button>
                <span className="text-xs text-muted-foreground">
                  Støttede formater: JPEG, PNG, WEBP. Maks størrelse: 5MB.
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
              className="w-4 h-4"
            />
            <FieldLabel>Katten er sterilisert/kastrert</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>ID & Forsikring</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.id_chip}>
            <FieldLabel>ID-chip *</FieldLabel>
            <Input {...form.register("id_chip")} />
            <FieldError errors={[form.formState.errors.id_chip]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.insurance_number}>
            <FieldLabel>Forsikringsnummer *</FieldLabel>
            <Input {...form.register("insurance_number")} />
            <FieldError errors={[form.formState.errors.insurance_number]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Helse</FieldLegend>
        <FieldGroup className="space-y-5">
          <Field
            data-invalid={!!form.formState.errors.last_vaccine_date}
            className="max-w-xs"
          >
            <FieldLabel>Sist vaksine *</FieldLabel>
            <Input type="date" {...form.register("last_vaccine_date")} />
            <FieldError errors={[form.formState.errors.last_vaccine_date]} />
          </Field>

          <Field>
            <FieldLabel>Ormebehandling</FieldLabel>
            <Textarea {...form.register("deworming_info")} />
          </Field>

          <Field>
            <FieldLabel>Loppebehandling</FieldLabel>
            <Textarea {...form.register("flea_treatment_info")} />
          </Field>

          <Field>
            <FieldLabel>Medisinske notater</FieldLabel>
            <Textarea {...form.register("medical_notes")} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Daglig pleie & atferd</FieldLegend>
        <FieldGroup className="space-y-5">
          <Field>
            <FieldLabel>Kosthold</FieldLabel>
            <Textarea {...form.register("diet")} />
          </Field>

          <Field>
            <FieldLabel>Atferdsnotater</FieldLabel>
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
