"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createGoal, goalInputSchema, updateGoal, type GoalInput } from "@/features/goals/client";
import { Button, Field, Input } from "@/shared/ui";

export function GoalForm({
  goalId,
  initialValues,
}: {
  goalId?: string;
  initialValues?: GoalInput;
}) {
  const router = useRouter();
  const [values, setValues] = useState<GoalInput>(
    initialValues ?? { title: "", description: "", targetAmount: 100, targetDate: "" },
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = goalInputSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez les informations.");
      return;
    }
    startTransition(async () => {
      const response = goalId
        ? await updateGoal({ id: goalId, ...parsed.data })
        : await createGoal(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      router.push(`/goals/${response.data.id}`);
      router.refresh();
    });
  }

  return (
    <form className="grid gap-5" onSubmit={submit} noValidate>
      <Field label="Nom de l’objectif" htmlFor="title">
        <Input
          id="title"
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
          maxLength={80}
          required
        />
      </Field>
      <Field label="Montant cible" htmlFor="targetAmount" hint="Minimum 100 €">
        <Input
          id="targetAmount"
          type="number"
          inputMode="decimal"
          min={100}
          step="0.01"
          value={values.targetAmount}
          onChange={(event) => setValues({ ...values, targetAmount: Number(event.target.value) })}
          required
        />
      </Field>
      <Field label="Date cible" htmlFor="targetDate" hint="Choisissez un mois à venir.">
        <Input
          id="targetDate"
          type="month"
          value={values.targetDate}
          onChange={(event) => setValues({ ...values, targetDate: event.target.value })}
          required
        />
      </Field>
      <Field
        label="Description (facultative)"
        htmlFor="description"
        hint={`${values.description.length}/250 caractères`}
      >
        <textarea
          id="description"
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          maxLength={250}
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </Field>
      {error && (
        <p
          className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending
          ? "Enregistrement..."
          : goalId
            ? "Enregistrer les modifications"
            : "Créer l’objectif"}
      </Button>
    </form>
  );
}
