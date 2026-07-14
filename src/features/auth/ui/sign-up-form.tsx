"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field, Input } from "@/shared/ui";
import { authClient } from "../api/auth-client";
import { signUpSchema, type SignUpValues } from "../model/auth-schemas";
import { PasswordInput } from "./password-input";
import { PasswordRules } from "./password-rules";

export function SignUpForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  async function onSubmit(values: SignUpValues) {
    setIsSubmitted(false);
    setSubmissionError(null);

    const { error } = await authClient.signUp.email({
      name: `${values.firstName} ${values.lastName}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setSubmissionError("Impossible de créer le compte. Vérifiez vos informations et réessayez.");
      return;
    }

    setIsSubmitted(true);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="firstName" label="Prénom" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" hasError={Boolean(errors.firstName)} {...register("firstName")} />
        </Field>
        <Field htmlFor="lastName" label="Nom" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" hasError={Boolean(errors.lastName)} {...register("lastName")} />
        </Field>
      </div>

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

      <Field htmlFor="password" label="Mot de passe" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          hasError={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>
      <PasswordRules password={password} />

      <Field htmlFor="confirmPassword" label="Confirmer le mot de passe" error={errors.confirmPassword?.message}>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          hasError={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </Field>

      {submissionError && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {submissionError}
        </p>
      )}

      {isSubmitted && (
        <p className="rounded-xl border border-border bg-surface p-3 text-sm text-secondary-text" role="status">
          Votre compte a été créé. Vous pouvez maintenant vous connecter.
        </p>
      )}

      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Création..." : "Créer mon compte"}
      </Button>
    </form>
  );
}
