"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function ReloadErrorState() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 text-primary-text">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold">Une erreur s’est produite</h1>
        <p className="mt-3 text-sm leading-6 text-secondary-text">
          Veuillez réessayer en rechargeant la page.
        </p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          <RotateCcw size={18} aria-hidden="true" />
          Recharger la page
        </Button>
      </div>
    </main>
  );
}
