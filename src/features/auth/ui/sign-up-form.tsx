"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, FeedbackMessage, Field, Input } from "@/shared/ui";
import { authClient } from "../api/auth-client";
import { isEmailAlreadyUsed } from "../lib/auth-error-message";
import { signUpSchema, type SignUpValues } from "../model/auth-schemas";
import { PasswordInput } from "./password-input";
import { PasswordRules } from "./password-rules";

export function SignUpForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  async function onSubmit(values: SignUpValues) {
    setSubmissionError(null);

    const firstName = normalizeName(values.firstName);
    const lastName = normalizeName(values.lastName);

    const { data, error } = await authClient.signUp.email({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: values.email,
      password: values.password,
      callbackURL: "/onboarding",
    });

    if (error) {
      if (isEmailAlreadyUsed(error.code)) {
        setError(
          "email",
          { type: "server", message: "Cette adresse email est déjà utilisée." },
          { shouldFocus: true },
        );
        return;
      }

      setSubmissionError(
        error.code === "TOO_MANY_REQUESTS"
          ? "Trop de tentatives. Réessayez dans quelques instants."
          : "Impossible de créer le compte. Réessayez dans quelques instants.",
      );
      return;
    }

    if (!data?.token) {
      router.replace(`/verification-email?email=${encodeURIComponent(values.email)}`);
      return;
    }

    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="firstName" label="Prénom" error={errors.firstName?.message}>
          <Input
            id="firstName"
            autoComplete="given-name"
            hasError={Boolean(errors.firstName)}
            {...register("firstName")}
          />
        </Field>
        <Field htmlFor="lastName" label="Nom" error={errors.lastName?.message}>
          <Input
            id="lastName"
            autoComplete="family-name"
            hasError={Boolean(errors.lastName)}
            {...register("lastName")}
          />
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

      <Field
        htmlFor="confirmPassword"
        label="Confirmer le mot de passe"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          hasError={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </Field>

      <FeedbackMessage error={submissionError} />

      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Création..." : "Créer mon compte"}
      </Button>
    </form>
  );
}

function normalizeName(value: string) {
  const normalizedValue = value.trim().toLocaleLowerCase("fr");
  return normalizedValue.charAt(0).toLocaleUpperCase("fr") + normalizedValue.slice(1);
}
