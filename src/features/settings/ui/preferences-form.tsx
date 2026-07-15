"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  preferencesSchema,
  updatePreferences,
  type PreferencesInput,
} from "@/features/settings/client";
import { Field } from "@/shared/ui";

const THEMES = [
  { value: "LIGHT", label: "Clair", icon: Sun },
  { value: "DARK", label: "Sombre", icon: Moon },
  { value: "SYSTEM", label: "Système", icon: Monitor },
] as const;

const CURRENCIES = [
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "Dollar américain ($)" },
  { value: "GBP", label: "Livre sterling (£)" },
  { value: "CHF", label: "Franc suisse (CHF)" },
  { value: "CAD", label: "Dollar canadien (CA$)" },
] as const;

export function PreferencesForm({ initialValues }: { initialValues: PreferencesInput }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save(nextValues: PreferencesInput) {
    const previousValues = values;
    const parsed = preferencesSchema.safeParse(nextValues);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez vos préférences.");
      return;
    }

    setValues(parsed.data);
    setError(null);
    setMessage(null);
    document.documentElement.dataset.theme = parsed.data.theme.toLowerCase();
    startTransition(async () => {
      const response = await updatePreferences(parsed.data);
      if (!response.success) {
        setValues(previousValues);
        document.documentElement.dataset.theme = previousValues.theme.toLowerCase();
        setError(response.error.message);
        return;
      }
      setMessage("Préférences enregistrées.");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-lg font-semibold">Apparence</h2>
        <p className="mt-1 text-sm text-secondary-text">Le thème est appliqué immédiatement.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const selected = values.theme === value;
            return (
              <button
                key={value}
                type="button"
                disabled={isPending}
                onClick={() => save({ ...values, theme: value })}
                aria-pressed={selected}
                className={`relative flex min-h-24 flex-col items-start justify-between rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-brand bg-brand/10"
                    : "border-border bg-card hover:border-brand/40"
                }`}
              >
                <Icon size={20} className={selected ? "text-brand" : "text-secondary-text"} />
                <span className="font-medium">{label}</span>
                {selected && (
                  <Check
                    className="absolute right-3 top-3 text-brand"
                    size={17}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-lg font-semibold">Langue et devise</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="Langue"
            htmlFor="locale"
            hint="Le français est la langue actuellement disponible."
          >
            <select
              id="locale"
              value={values.locale}
              disabled
              className="h-12 w-full rounded-xl border border-border bg-card px-4 disabled:opacity-70"
            >
              <option value="FR">Français</option>
            </select>
          </Field>
          <Field
            label="Devise d’affichage"
            htmlFor="currency"
            hint="Les montants existants ne sont pas convertis."
          >
            <select
              id="currency"
              value={values.currency}
              disabled={isPending}
              onChange={(event) =>
                save({ ...values, currency: event.target.value as PreferencesInput["currency"] })
              }
              className="h-12 w-full rounded-xl border border-border bg-card px-4"
            >
              {CURRENCIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {(message || error || isPending) && (
        <p
          className={`rounded-xl border p-3 text-sm ${
            error
              ? "border-danger/40 bg-danger/10 text-danger"
              : "border-success/40 bg-success/10 text-success"
          }`}
          role={error ? "alert" : "status"}
        >
          {error ?? (isPending ? "Enregistrement..." : message)}
        </p>
      )}
    </div>
  );
}
