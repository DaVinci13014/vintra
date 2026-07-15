"use client";

import { Button } from "@/shared/ui";

export default function SettingsError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-4">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold">Impossible de charger les paramètres</h1>
        <p className="mt-3 text-sm text-secondary-text">
          Vos données sont conservées. Réessayez le chargement.
        </p>
        <Button className="mt-6" onClick={reset}>
          Réessayer
        </Button>
      </div>
    </main>
  );
}
