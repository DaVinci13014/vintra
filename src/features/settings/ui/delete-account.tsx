"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, MessageSquareText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { authClient } from "@/features/auth/client";
import {
  ACCOUNT_DELETION_REASONS,
  ACCOUNT_RETENTION_SUGGESTIONS,
  deleteAccount,
  deleteAccountSchema,
  type AccountDeletionReason,
} from "@/features/settings/client";
import { Button, FeedbackMessage, Field, Input } from "@/shared/ui";

type DeleteStep = "reason" | "retention" | "confirmation";

const INITIAL_VALUES = { feedback: "", confirmation: "", password: "" };

export function DeleteAccount({ email }: { email: string }) {
  const router = useRouter();
  const firstReasonInput = useRef<HTMLInputElement>(null);
  const feedbackInput = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DeleteStep>("reason");
  const [reason, setReason] = useState<AccountDeletionReason | null>(null);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const retentionSuggestion = reason ? ACCOUNT_RETENTION_SUGGESTIONS[reason] : null;

  useEffect(() => {
    if (!open) return;
    if (step === "reason") firstReasonInput.current?.focus();
    if (step === "confirmation") feedbackInput.current?.focus();
  }, [open, step]);

  function closeDialog() {
    setOpen(false);
    setStep("reason");
    setReason(null);
    setError(null);
    setValues(INITIAL_VALUES);
  }

  function continueToRetention() {
    if (!reason) {
      setError("Choisissez la raison principale de votre départ.");
      return;
    }
    setError(null);
    setStep("retention");
  }

  function continueToConfirmation() {
    setError(null);
    setStep("confirmation");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason) {
      setStep("reason");
      setError("Choisissez la raison principale de votre départ.");
      return;
    }

    const parsed = deleteAccountSchema.safeParse({ ...values, reason });
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
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/85 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onKeyDown={(event) => {
            if (event.key === "Escape" && !isPending) closeDialog();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <section className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {step === "reason" && (
                <motion.div
                  key="reason"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <MessageSquareText className="text-brand" aria-hidden="true" />
                  <p className="mt-5 text-xs font-medium uppercase tracking-wide text-brand">
                    Étape 1 sur 3
                  </p>
                  <h2 id="delete-account-title" className="mt-2 text-2xl font-semibold">
                    Qu’est-ce qui vous fait partir ?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-secondary-text">
                    Votre réponse nous aide à comprendre ce que Vintra doit améliorer.
                  </p>

                  <fieldset className="mt-6 grid gap-2">
                    <legend className="sr-only">Raison principale de la suppression</legend>
                    {ACCOUNT_DELETION_REASONS.map((option, index) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                          reason === option.value
                            ? "border-brand bg-brand/10"
                            : "border-border bg-card hover:border-brand/40"
                        }`}
                      >
                        <input
                          ref={index === 0 ? firstReasonInput : undefined}
                          type="radio"
                          name="accountDeletionReason"
                          value={option.value}
                          checked={reason === option.value}
                          onChange={() => {
                            setReason(option.value);
                            setError(null);
                          }}
                          className="mt-1 size-4 accent-brand"
                        />
                        <span className="text-sm leading-6">{option.label}</span>
                      </label>
                    ))}
                  </fieldset>

                  {error && (
                    <p className="mt-5 text-sm text-danger" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <Button type="button" onClick={closeDialog}>
                      Garder mon compte
                    </Button>
                    <Button type="button" variant="secondary" onClick={continueToRetention}>
                      Continuer
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "retention" && retentionSuggestion && (
                <motion.div
                  key="retention"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <HeartHandshake className="text-brand" aria-hidden="true" />
                  <p className="mt-5 text-xs font-medium uppercase tracking-wide text-brand">
                    Avant de partir
                  </p>
                  <h2 id="delete-account-title" className="mt-2 text-2xl font-semibold">
                    {retentionSuggestion.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-secondary-text">
                    {retentionSuggestion.description}
                  </p>

                  <div className="mt-7 grid gap-3">
                    {retentionSuggestion.href ? (
                      <Button asChild>
                        <Link href={retentionSuggestion.href} onClick={closeDialog}>
                          {retentionSuggestion.actionLabel}
                        </Link>
                      </Button>
                    ) : (
                      <Button type="button" onClick={closeDialog}>
                        {retentionSuggestion.actionLabel}
                      </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={continueToConfirmation}>
                      Je souhaite quand même supprimer mon compte
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setStep("reason")}>
                      Modifier ma réponse
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "confirmation" && (
                <motion.form
                  key="confirmation"
                  onSubmit={submit}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <Trash2 className="text-danger" aria-hidden="true" />
                  <p className="mt-5 text-xs font-medium uppercase tracking-wide text-danger">
                    Étape 3 sur 3
                  </p>
                  <h2 id="delete-account-title" className="mt-2 text-2xl font-semibold">
                    Dernière étape avant suppression
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-secondary-text">
                    Cette action est irréversible. Le compte {email}, ses sessions et toutes ses
                    données financières seront supprimés.
                  </p>

                  <div className="mt-6 grid gap-5">
                    <Field
                      label="Souhaitez-vous ajouter quelque chose ? (facultatif)"
                      htmlFor="deleteFeedback"
                      hint="Votre motif et ce commentaire seront transmis à l’équipe Vintra pour améliorer le service."
                    >
                      <textarea
                        ref={feedbackInput}
                        id="deleteFeedback"
                        value={values.feedback}
                        onChange={(event) => setValues({ ...values, feedback: event.target.value })}
                        rows={4}
                        maxLength={2_000}
                        className="w-full resize-y rounded-xl border border-border bg-card px-4 py-3 leading-6"
                      />
                    </Field>
                    <Field label="Saisissez SUPPRIMER" htmlFor="deleteConfirmation">
                      <Input
                        id="deleteConfirmation"
                        value={values.confirmation}
                        onChange={(event) =>
                          setValues({ ...values, confirmation: event.target.value })
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

                  <FeedbackMessage className="mt-5" error={error} />

                  <div className="mt-7 grid gap-3">
                    <Button type="button" disabled={isPending} onClick={closeDialog}>
                      Garder mon compte
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-danger text-white hover:bg-danger/85"
                    >
                      {isPending ? "Suppression..." : "Supprimer définitivement mon compte"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => setStep("retention")}
                    >
                      Retour
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      )}
    </>
  );
}
