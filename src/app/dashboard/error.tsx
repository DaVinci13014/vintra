"use client";

import { Button } from "@/shared/ui";
import { useReportError } from "@/shared/lib/monitoring/client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useReportError(error);

  return (
    <main className="grid min-h-svh place-items-center bg-background px-4">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold">Impossible de charger votre espace</h1>
        <p className="mt-3 text-sm leading-6 text-secondary-text">
          Vos données sont conservées. Vous pouvez relancer le chargement en toute sécurité.
        </p>
        <Button className="mt-6" onClick={reset}>
          Réessayer
        </Button>
      </div>
    </main>
  );
}
