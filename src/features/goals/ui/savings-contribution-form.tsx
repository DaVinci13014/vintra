"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, PartyPopper, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { addSavingsContribution, savingsContributionInputSchema } from "@/features/goals/client";
import { Button, Field, Input } from "@/shared/ui";

type Celebration = {
  currentAmount: number;
  targetAmount: number;
  title: string;
};

export function SavingsContributionForm({
  currency,
  goalId,
  isCompleted,
  remainingAmount,
}: {
  currency: string;
  goalId: string;
  isCompleted: boolean;
  remainingAmount: number;
}) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [isPending, startTransition] = useTransition();
  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    if (celebration) closeButtonRef.current?.focus();
  }, [celebration]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const parsed = savingsContributionInputSchema.safeParse({
      goalId,
      amount: Number(amount.replace(",", ".")),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez le montant saisi.");
      return;
    }

    startTransition(async () => {
      const response = await addSavingsContribution(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setAmount("");
      router.refresh();
      if (response.data.completed) {
        setCelebration({
          currentAmount: response.data.currentAmount,
          targetAmount: response.data.targetAmount,
          title: response.data.title,
        });
      }
    });
  }

  function closeCelebration() {
    setCelebration(null);
    router.refresh();
  }

  return (
    <>
      {isCompleted ? (
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-brand" size={30} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Objectif atteint</h2>
          <p className="mt-2 text-secondary-text">
            Votre progression et vos versements restent disponibles ci-dessous.
          </p>
          <Link
            href={`/goals/${goalId}`}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-medium"
          >
            Voir l’objectif
          </Link>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={submit} noValidate>
          <Field
            label="Montant à ajouter"
            htmlFor="contribution-amount"
            hint={`Il reste ${money.format(remainingAmount)} pour atteindre votre objectif.`}
            error={error ?? undefined}
          >
            <div className="relative">
              <Input
                id="contribution-amount"
                name="amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="100"
                hasError={Boolean(error)}
                required
                aria-label={`Montant à ajouter en ${currency}`}
                className="pr-16"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-secondary-text">
                {currency}
              </span>
            </div>
          </Field>
          <Button type="submit" size="lg" disabled={isPending}>
            <Plus size={18} aria-hidden="true" />
            {isPending ? "Ajout en cours..." : "Ajouter un versement"}
          </Button>
        </form>
      )}

      <AnimatePresence>
        {celebration && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebration-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeCelebration();
            }}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-3xl border border-brand/30 bg-surface p-6 text-center shadow-2xl sm:p-9"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCelebration}
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-xl text-secondary-text transition hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Fermer le message de félicitations"
              >
                <X size={19} aria-hidden="true" />
              </button>
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand/15 text-brand">
                <PartyPopper size={30} aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-medium text-brand">Objectif atteint</p>
              <h2 id="celebration-title" className="mt-2 text-2xl font-semibold sm:text-3xl">
                Félicitations !
              </h2>
              <p className="mx-auto mt-4 max-w-sm leading-7 text-secondary-text">
                Vous avez atteint « {celebration.title} » avec{" "}
                {money.format(celebration.currentAmount)} épargnés.
              </p>
              {celebration.currentAmount > celebration.targetAmount && (
                <p className="mt-2 text-sm text-secondary-text">
                  Votre objectif de {money.format(celebration.targetAmount)} est dépassé.
                </p>
              )}
              <Button asChild size="lg" className="mt-7 w-full">
                <Link href={`/goals/${goalId}`}>
                  <Check size={18} aria-hidden="true" />
                  Voir mon objectif
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
