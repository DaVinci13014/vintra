"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field, Input } from "@/shared/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../model/auth-schemas";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  async function onSubmit() {
    setIsSubmitted(true);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field htmlFor="email" label="Adresse email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          hasError={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>
      {isSubmitted && (
        <p className="rounded-xl border border-border bg-surface p-3 text-sm text-secondary-text" role="status">
          L’adresse est valide. L’envoi sécurisé sera activé à l’étape 3.
        </p>
      )}
      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Envoi..." : "Envoyer le lien"}
      </Button>
    </form>
  );
}
