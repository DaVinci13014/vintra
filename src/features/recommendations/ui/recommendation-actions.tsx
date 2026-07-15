"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  applyRecommendation,
  archiveRecommendation,
  markRecommendationOpened,
} from "@/features/recommendations/client";
import { Button } from "@/shared/ui";

type RecommendationStatus = "GENERATED" | "DISPLAYED" | "OPENED" | "APPLIED";

export function RecommendationActions({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: RecommendationStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialStatus !== "GENERATED" && initialStatus !== "DISPLAYED") return;

    void markRecommendationOpened(id).then((response) => {
      if (response.success) {
        setStatus(response.data.status);
        return;
      }

      setError(response.error.message);
    });
  }, [id, initialStatus]);

  function apply() {
    setError(null);
    startTransition(async () => {
      const response = await applyRecommendation(id);
      if (!response.success) {
        setError(response.error.message);
        return;
      }

      setStatus(response.data.status);
      router.refresh();
    });
  }

  function archive() {
    setError(null);
    startTransition(async () => {
      const response = await archiveRecommendation(id);
      if (!response.success) {
        setError(response.error.message);
        return;
      }

      router.push("/recommendations");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {status !== "APPLIED" && (
          <Button type="button" disabled={isPending} onClick={apply}>
            {isPending ? "Enregistrement..." : "Marquer comme appliquée"}
          </Button>
        )}
        <Button type="button" variant="ghost" disabled={isPending} onClick={archive}>
          {status === "APPLIED" ? "Archiver" : "Ignorer"}
        </Button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {status === "APPLIED" && (
          <motion.p
            key="applied"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-success"
            role="status"
          >
            Cette recommandation est marquée comme appliquée.
          </motion.p>
        )}
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
