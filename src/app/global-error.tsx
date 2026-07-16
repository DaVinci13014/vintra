"use client";

import { useReportError } from "@/shared/lib/monitoring/client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useReportError(error);

  return (
    <html lang="fr">
      <body className="grid min-h-svh place-items-center bg-background px-4 text-primary-text">
        <main className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
          <h1 className="text-2xl font-semibold">Vintra a rencontré un problème</h1>
          <p className="mt-3 text-sm leading-6 text-secondary-text">
            Vos données sont conservées. Vous pouvez relancer l’application en toute sécurité.
          </p>
          <button
            className="mt-6 min-h-11 rounded-xl bg-brand px-5 font-medium text-on-brand"
            onClick={reset}
            type="button"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
