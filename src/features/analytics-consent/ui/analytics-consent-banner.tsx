"use client";

import { Button } from "@/shared/ui";
import { useAnalyticsConsent } from "../lib/use-analytics-consent";

export function AnalyticsConsentBanner() {
  const { configured, consent, updateConsent } = useAnalyticsConsent();
  if (!configured || consent !== null) return null;

  return (
    <aside
      aria-labelledby="analytics-consent-title"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
      role="dialog"
    >
      <h2 className="text-lg font-semibold" id="analytics-consent-title">
        Mesure d’audience facultative
      </h2>
      <p className="mt-2 text-sm leading-6 text-secondary-text">
        Vintra peut mesurer uniquement les pages visitées pour améliorer le produit. Aucun replay,
        texte, identifiant persistant ni donnée financière n’est envoyé.
      </p>
      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={() => updateConsent("declined")} variant="secondary">
          Refuser
        </Button>
        <Button onClick={() => updateConsent("accepted")}>Autoriser</Button>
      </div>
    </aside>
  );
}
