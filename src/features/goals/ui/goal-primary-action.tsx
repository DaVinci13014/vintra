"use client";

import { Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setPrimaryGoal } from "@/features/goals/client";
import { Button } from "@/shared/ui";

export function GoalPrimaryAction({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function promote() {
    setError(null);
    startTransition(async () => {
      const response = await setPrimaryGoal(goalId);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      router.push(`/goals/${response.data.id}`);
      router.refresh();
    });
  }

  return (
    <div>
      <Button type="button" disabled={isPending} onClick={promote}>
        <Target size={17} aria-hidden="true" />
        {isPending ? "Activation..." : "Définir comme principal"}
      </Button>
      {error && (
        <p className="mt-2 max-w-sm text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
