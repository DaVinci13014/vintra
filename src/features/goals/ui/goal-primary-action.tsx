"use client";

import { Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setPrimaryGoal } from "@/features/goals/client";
import { Button, ConfirmationDialog } from "@/shared/ui";

export function GoalPrimaryAction({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function promote() {
    setError(null);
    startTransition(async () => {
      const response = await setPrimaryGoal(goalId);
      if (!response.success) {
        setError(response.error.message);
        setConfirmation(false);
        return;
      }
      router.replace(`/goals/${response.data.id}`);
      router.refresh();
    });
  }

  return (
    <div>
      <Button type="button" disabled={isPending} onClick={() => setConfirmation(true)}>
        <Target size={17} aria-hidden="true" />
        {isPending ? "Activation..." : "Définir comme principal"}
      </Button>
      {error && (
        <p className="mt-2 max-w-sm text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <ConfirmationDialog
        open={confirmation}
        title="Changer d’objectif principal ?"
        description="Votre plan d’épargne actif suivra désormais cet objectif. L’ancien objectif restera planifié."
        confirmLabel="Définir comme principal"
        pendingLabel="Activation..."
        pending={isPending}
        onCancel={() => setConfirmation(false)}
        onConfirm={promote}
      />
    </div>
  );
}
