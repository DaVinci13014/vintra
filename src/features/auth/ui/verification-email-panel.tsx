"use client";

import { useState } from "react";

import { Button } from "@/shared/ui";
import { authClient } from "../api/auth-client";

type VerificationEmailPanelProps = {
  email?: string;
};

export function VerificationEmailPanel({ email }: VerificationEmailPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function resendEmail() {
    if (!email) return;

    setIsSending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/onboarding",
    });
    setIsSending(false);
    setMessage(
      error
        ? "Impossible d’envoyer l’email. Réessayez dans quelques instants."
        : "Un nouvel email vient d’être envoyé.",
    );
  }

  return (
    <div className="grid gap-5">
      {email && (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-secondary-text">
          {email}
        </p>
      )}
      {message && (
        <p className="text-sm text-secondary-text" role="status">
          {message}
        </p>
      )}
      <Button size="lg" onClick={resendEmail} disabled={!email || isSending}>
        {isSending ? "Envoi..." : "Renvoyer l’email"}
      </Button>
    </div>
  );
}
