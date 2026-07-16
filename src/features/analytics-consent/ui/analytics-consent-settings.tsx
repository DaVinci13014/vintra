"use client";

import { Button } from "@/shared/ui";
import { useAnalyticsConsent } from "../lib/use-analytics-consent";

export function AnalyticsConsentSettings() {
  const { configured, consent, updateConsent } = useAnalyticsConsent();

  if (!configured) {
    return <p className="text-sm text-secondary-text">La mesure d’audience est désactivée.</p>;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-secondary-text">
        {consent === "accepted"
          ? "La mesure anonyme des pages est autorisée."
          : "Aucune mesure d’audience n’est envoyée."}
      </p>
      {consent === "accepted" ? (
        <Button onClick={() => updateConsent("declined")} variant="secondary">
          Désactiver
        </Button>
      ) : (
        <Button onClick={() => updateConsent("accepted")}>Autoriser</Button>
      )}
    </div>
  );
}
