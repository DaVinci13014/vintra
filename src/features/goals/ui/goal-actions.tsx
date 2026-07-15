"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { archiveGoal, deleteGoal } from "@/features/goals/client";
import { Button } from "@/shared/ui";

export function GoalActions({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<"archive" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    if (!confirmation) return;
    startTransition(async () => {
      const response =
        confirmation === "archive" ? await archiveGoal(goalId) : await deleteGoal(goalId);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      router.push(response.data.destination);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => setConfirmation("archive")}>
          Archiver
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-danger"
          onClick={() => setConfirmation("delete")}
        >
          Supprimer
        </Button>
      </div>
      {confirmation && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <h2 id="confirmation-title" className="text-xl font-semibold">
              {confirmation === "delete" ? "Supprimer cet objectif ?" : "Archiver cet objectif ?"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary-text">
              {confirmation === "delete"
                ? "Cette action est irréversible. Toutes les données de cet objectif seront supprimées."
                : "L’objectif restera visible dans votre historique et ne sera plus actif."}
            </p>
            {error && (
              <p className="mt-4 text-sm text-danger" role="alert">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => setConfirmation(null)}
              >
                Annuler
              </Button>
              <Button type="button" disabled={isPending} onClick={confirm}>
                {isPending ? "Traitement..." : "Confirmer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
