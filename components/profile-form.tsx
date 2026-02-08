"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ProfileSchema, type ProfileInput } from "@/lib/validation/profile";
import { updateUser } from "@/actions/user/updateUser";
import { User } from "@/types";

export function ProfileForm({ user }: { user: User | null }) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address: "",
      phone: "",
      emergency_contact: "",
      notes: "",
    },
  });

  // Sync form when user loads or changes
  React.useEffect(() => {
    if (!user) return;

    form.reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      address: user.address ?? "",
      phone: user.phone ?? "",
      emergency_contact: user.emergency_contact ?? "",
      notes: user.notes ?? "",
    });
  }, [user, form]);

  const onSubmit = async (values: ProfileInput) => {
    if (!user) return;

    await updateUser(user.id, values);
    form.reset(values);
    redirect("/minside");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-8 rounded-2xl border bg-background p-6 shadow-sm"
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
              {...form.register("first_name")}
            />
            <FieldError errors={[form.formState.errors.first_name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.last_name}>
            <FieldLabel htmlFor="last_name">Etternavn *</FieldLabel>
            <Input
              id="last_name"
              placeholder="Etternavn"
              {...form.register("last_name")}
            />
            <FieldError errors={[form.formState.errors.last_name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.address}>
            <FieldLabel htmlFor="address">Adresse *</FieldLabel>
            <Input
              id="address"
              placeholder="Adresse"
              {...form.register("address")}
            />
            <FieldError errors={[form.formState.errors.address]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.phone}>
            <FieldLabel htmlFor="phone">Telefonnummer *</FieldLabel>
            <Input
              id="phone"
              placeholder="+47 12345678"
              {...form.register("phone")}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>
        </FieldGroup>

        <FieldSeparator />

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.emergency_contact}>
            <FieldLabel htmlFor="emergency_contact">Nødtelefon</FieldLabel>
            <Input
              id="emergency_contact"
              placeholder="+47 12345678"
              {...form.register("emergency_contact")}
            />
            <FieldError errors={[form.formState.errors.emergency_contact]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.notes}>
            <FieldLabel htmlFor="notes">Notater</FieldLabel>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Annen relevant informasjon om deg"
              {...form.register("notes")}
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
  );
}
