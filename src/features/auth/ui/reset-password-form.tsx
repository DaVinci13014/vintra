"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field } from "@/shared/ui";
import { authClient } from "../api/auth-client";
import { resetPasswordSchema, type ResetPasswordValues } from "../model/auth-schemas";
import { PasswordInput } from "./password-input";
import { PasswordRules } from "./password-rules";

type ResetPasswordFormProps = {
  token?: string;
  isInvalidToken?: boolean;
};

export function ResetPasswordForm({ token, isInvalidToken = false }: ResetPasswordFormProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const hasValidToken = Boolean(token && !isInvalidToken);

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) return;

    setSubmissionError(null);
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      setSubmissionError("Ce lien est invalide ou a expiré. Demandez un nouveau lien.");
      return;
    }

    router.replace("/connexion?mot-de-passe=modifie");
  }

  if (!hasValidToken) {
    return (
      <div className="grid gap-5">
        <p
          className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning"
          role="alert"
        >
          Ce lien est invalide ou a expiré.
        </p>
        <Button onClick={() => router.replace("/mot-de-passe-oublie")} size="lg">
          Demander un lien
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field htmlFor="password" label="Nouveau mot de passe" error={errors.password?.message}>
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
      {submissionError && (
        <p
          className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
          role="alert"
        >
          {submissionError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Modification..." : "Modifier le mot de passe"}
      </Button>
    </form>
  );
}
