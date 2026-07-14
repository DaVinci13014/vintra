"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field, Input } from "@/shared/ui";
import { signInSchema, type SignInValues } from "../model/auth-schemas";
import { PasswordInput } from "./password-input";

export function SignInForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), mode: "onChange" });

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

      <Field htmlFor="password" label="Mot de passe" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>

      <div className="flex justify-end">
        <Link className="text-sm text-secondary transition hover:text-foreground" href="/mot-de-passe-oublie">
          Mot de passe oublié ?
        </Link>
      </div>

      {isSubmitted && (
        <p className="rounded-xl border border-border bg-surface p-3 text-sm text-secondary-text" role="status">
          Vos informations sont valides. La connexion sécurisée sera activée à l’étape 3.
        </p>
      )}

      <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
