"use client";

import { useState, useTransition } from "react";

import {
  createSupportRequest,
  supportRequestSchema,
  type SupportRequestInput,
} from "@/features/settings/client";
import { Button, FeedbackMessage, Field } from "@/shared/ui";

const INITIAL_VALUES: SupportRequestInput = { type: "CONTACT", message: "" };

export function SupportForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const parsed = supportRequestSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez votre demande.");
      return;
    }

    startTransition(async () => {
      const response = await createSupportRequest(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setValues(INITIAL_VALUES);
      setError(null);
      setMessage("Votre demande a bien été enregistrée.");
    });
  }

  return (
    <form className="rounded-3xl border border-border bg-surface p-5 sm:p-8" onSubmit={submit}>
      <h2 className="text-lg font-semibold">Contacter l’équipe Vintra</h2>
      <p className="mt-1 text-sm text-secondary-text">
        Décrivez votre question, un problème ou une suggestion.
      </p>
      <div className="mt-6 grid gap-5">
        <Field label="Type de demande" htmlFor="supportType">
          <select
            id="supportType"
            value={values.type}
            onChange={(event) =>
              setValues({ ...values, type: event.target.value as SupportRequestInput["type"] })
            }
            className="h-12 w-full rounded-xl border border-border bg-card px-4"
          >
            <option value="CONTACT">Question</option>
            <option value="BUG">Signaler un problème</option>
            <option value="FEEDBACK">Donner un avis</option>
          </select>
        </Field>
        <Field label="Message" htmlFor="supportMessage" hint="20 à 2 000 caractères.">
          <textarea
            id="supportMessage"
            value={values.message}
            onChange={(event) => setValues({ ...values, message: event.target.value })}
            rows={7}
            maxLength={2_000}
            required
            className="w-full resize-y rounded-xl border border-border bg-card px-4 py-3 leading-6"
          />
        </Field>
      </div>
      <FeedbackMessage className="mt-5" error={error} message={message} />
      <Button type="submit" className="mt-6" disabled={isPending}>
        {isPending ? "Envoi..." : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
