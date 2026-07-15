"use client";

import { KeyRound, Laptop, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { authClient } from "@/features/auth/client";
import {
  changePassword,
  changePasswordSchema,
  revokeAllSessions,
  revokeOtherSessions as revokeOtherSessionsAction,
  type ChangePasswordInput,
} from "@/features/settings/client";
import { Button, Field, Input } from "@/shared/ui";

type SessionView = {
  id: string;
  current: boolean;
  device: string;
  location: string;
  createdAt: string;
  expiresAt: string;
};

const EMPTY_PASSWORDS: ChangePasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function SecuritySettings({ sessions }: { sessions: SessionView[] }) {
  const router = useRouter();
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmAllSessions, setConfirmAllSessions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const otherSessionCount = sessions.filter((session) => !session.current).length;

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const parsed = changePasswordSchema.safeParse(passwords);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez les mots de passe.");
      return;
    }

    startTransition(async () => {
      const response = await changePassword(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setPasswords(EMPTY_PASSWORDS);
      setError(null);
      setMessage("Mot de passe modifié. Les autres sessions ont été fermées.");
      router.refresh();
    });
  }

  function revokeOtherSessions() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const response = await revokeOtherSessionsAction();
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setMessage("Les autres sessions ont été fermées.");
      router.refresh();
    });
  }

  function revokeEverySession() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const response = await revokeAllSessions();
      if (!response.success) {
        setError(response.error.message);
        setConfirmAllSessions(false);
        return;
      }
      await authClient.signOut();
      router.replace("/connexion");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-5">
      <form
        className="rounded-3xl border border-border bg-surface p-5 sm:p-8"
        onSubmit={submitPassword}
      >
        <div className="flex items-center gap-3">
          <KeyRound className="text-brand" size={20} aria-hidden="true" />
          <h2 className="text-lg font-semibold">Modifier le mot de passe</h2>
        </div>
        <div className="mt-6 grid gap-5">
          <Field label="Mot de passe actuel" htmlFor="currentPassword">
            <Input
              id="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, currentPassword: event.target.value })
              }
              autoComplete="current-password"
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nouveau mot de passe"
              htmlFor="newPassword"
              hint="8 caractères, une majuscule, une minuscule et un chiffre."
            >
              <Input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords({ ...passwords, newPassword: event.target.value })
                }
                autoComplete="new-password"
                required
              />
            </Field>
            <Field label="Confirmer le mot de passe" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(event) =>
                  setPasswords({ ...passwords, confirmPassword: event.target.value })
                }
                autoComplete="new-password"
                required
              />
            </Field>
          </div>
        </div>
        <Button type="submit" className="mt-7" disabled={isPending}>
          {isPending ? "Modification..." : "Modifier mon mot de passe"}
        </Button>
      </form>

      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <Laptop className="text-brand" size={20} aria-hidden="true" />
          <h2 className="text-lg font-semibold">Sessions actives</h2>
        </div>
        <div className="mt-6 grid gap-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current && (
                    <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                      Session actuelle
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-secondary-text">
                  {session.location} · ouverte le {formatDate(session.createdAt)}
                </p>
              </div>
              <p className="text-xs text-muted">Expire le {formatDate(session.expiresAt)}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending || otherSessionCount === 0}
            onClick={revokeOtherSessions}
          >
            <ShieldCheck size={18} aria-hidden="true" />
            Fermer les autres sessions ({otherSessionCount})
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-danger"
            disabled={isPending}
            onClick={() => setConfirmAllSessions(true)}
          >
            <LogOut size={18} aria-hidden="true" />
            Tout déconnecter
          </Button>
        </div>
      </section>

      {(message || error) && (
        <p
          className={`rounded-xl border p-3 text-sm ${
            error
              ? "border-danger/40 bg-danger/10 text-danger"
              : "border-success/40 bg-success/10 text-success"
          }`}
          role={error ? "alert" : "status"}
        >
          {error ?? message}
        </p>
      )}

      {confirmAllSessions && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="revoke-sessions-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <h2 id="revoke-sessions-title" className="text-xl font-semibold">
              Déconnecter tous les appareils ?
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary-text">
              Vous devrez vous reconnecter sur cet appareil et sur tous les autres.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => setConfirmAllSessions(false)}
              >
                Annuler
              </Button>
              <Button type="button" disabled={isPending} onClick={revokeEverySession}>
                {isPending ? "Déconnexion..." : "Tout déconnecter"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
