"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, FeedbackMessage, Field, Input } from "@/shared/ui";
import { authClient } from "../api/auth-client";
import { getSignInErrorMessage } from "../lib/auth-error-message";
import { signInSchema, type SignInValues } from "../model/auth-schemas";
import { PasswordInput } from "./password-input";

export function SignInForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  async function onSubmit(values: SignInValues) {
    setSubmissionError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL: "/onboarding",
    });

    if (error) {
      setSubmissionError(getSignInErrorMessage(error.code));
      return;
    }

    router.replace("/onboarding");
    router.refresh();
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

      <Field htmlFor="password" label="Mot de passe" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>

      <div className="flex items-center justify-between gap-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-secondary-text">
          <input type="checkbox" className="size-4 accent-brand" {...register("rememberMe")} />
          Rester connecté
        </label>
        <Link
          className="text-sm text-secondary transition hover:text-foreground"
          href="/mot-de-passe-oublie"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <FeedbackMessage error={submissionError} />

      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
