"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { archiveGoal, deleteGoal } from "@/features/goals/client";
import { Button, ConfirmationDialog } from "@/shared/ui";

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
        setConfirmation(null);
        return;
      }
      router.replace(response.data.destination);
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
      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <ConfirmationDialog
        open={Boolean(confirmation)}
        title={confirmation === "delete" ? "Supprimer cet objectif ?" : "Archiver cet objectif ?"}
        description={
          confirmation === "delete"
            ? "Cette action est irréversible. Toutes les données de cet objectif seront supprimées."
            : "L’objectif restera visible dans votre historique et ne sera plus actif."
        }
        confirmLabel={confirmation === "delete" ? "Supprimer l’objectif" : "Archiver l’objectif"}
        pendingLabel="Traitement..."
        danger={confirmation === "delete"}
        pending={isPending}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirm}
      />
    </>
  );
}
