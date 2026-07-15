"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { authClient } from "@/features/auth/client";
import {
  deleteAccount,
  deleteAccountSchema,
  type DeleteAccountInput,
} from "@/features/settings/client";
import { Button, Field, Input } from "@/shared/ui";

const INITIAL_VALUES: DeleteAccountInput = { confirmation: "" as "SUPPRIMER", password: "" };

export function DeleteAccount({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = deleteAccountSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "La confirmation est invalide.");
      return;
    }

    startTransition(async () => {
      const response = await deleteAccount(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      await authClient.signOut();
      router.replace(response.data.destination);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="mt-5 text-danger"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={18} aria-hidden="true" />
        Supprimer définitivement mon compte
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/85 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <form
            className="w-full max-w-lg rounded-3xl border border-danger/40 bg-surface p-6 shadow-2xl sm:p-8"
            onSubmit={submit}
          >
            <Trash2 className="text-danger" aria-hidden="true" />
            <h2 id="delete-account-title" className="mt-5 text-2xl font-semibold">
              Supprimer définitivement votre compte ?
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary-text">
              Cette action est irréversible. Le compte {email}, ses sessions et toutes ses données
              financières seront supprimés.
            </p>
            <div className="mt-6 grid gap-5">
              <Field label="Saisissez SUPPRIMER" htmlFor="deleteConfirmation">
                <Input
                  id="deleteConfirmation"
                  value={values.confirmation}
                  onChange={(event) =>
                    setValues({ ...values, confirmation: event.target.value as "SUPPRIMER" })
                  }
                  autoComplete="off"
                  required
                />
              </Field>
              <Field label="Mot de passe actuel" htmlFor="deletePassword">
                <Input
                  id="deletePassword"
                  type="password"
                  value={values.password}
                  onChange={(event) => setValues({ ...values, password: event.target.value })}
                  autoComplete="current-password"
                  required
                />
              </Field>
            </div>
            {error && (
              <p
                className="mt-5 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => {
                  setOpen(false);
                  setError(null);
                  setValues(INITIAL_VALUES);
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-danger text-white hover:bg-danger/85"
              >
                {isPending ? "Suppression..." : "Supprimer définitivement"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
