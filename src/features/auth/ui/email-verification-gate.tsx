"use client";

import { motion } from "framer-motion";
import { MailCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui";
import { authClient } from "../api/auth-client";

type EmailVerificationGateProps = {
  email: string;
};

export function EmailVerificationGate({ email }: EmailVerificationGateProps) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void checkVerification(false);
    }, 5_000);

    return () => window.clearInterval(intervalId);
  });

  async function checkVerification(showFeedback = true) {
    if (isChecking) return;

    setIsChecking(true);
    const { data } = await authClient.getSession({
      query: { disableCookieCache: true },
    });
    setIsChecking(false);

    if (data?.user.emailVerified) {
      router.refresh();
      return;
    }

    if (showFeedback) {
      setMessage("L’adresse n’est pas encore vérifiée. Ouvrez le lien reçu par email.");
    }
  }

  async function resendEmail() {
    setIsSending(true);
    setMessage(null);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/onboarding",
    });
    setIsSending(false);
    setMessage(
      error
        ? "Impossible d’envoyer l’email. Réessayez dans quelques instants."
        : "Un nouvel email de vérification vient d’être envoyé.",
    );
  }

  async function signOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/connexion");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md">
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-verification-title"
        aria-describedby="email-verification-description"
        className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-9"
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <MailCheck aria-hidden="true" size={28} />
        </div>

        <h1 id="email-verification-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Vérifiez votre adresse email
        </h1>
        <p
          id="email-verification-description"
          className="mt-3 text-sm leading-6 text-secondary-text sm:text-base"
        >
          Votre connexion a réussi. Pour protéger vos données financières, confirmez maintenant
          votre adresse avec le lien que nous vous avons envoyé.
        </p>

        <p className="mt-5 break-all rounded-xl border border-border bg-card p-4 text-sm text-foreground">
          {email}
        </p>

        {message && (
          <p className="mt-4 text-sm leading-6 text-secondary-text" role="status">
            {message}
          </p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button size="lg" onClick={resendEmail} disabled={isSending}>
            {isSending ? "Envoi..." : "Renvoyer l’email"}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => void checkVerification()}
            disabled={isChecking}
          >
            <RefreshCw aria-hidden="true" size={18} className={isChecking ? "animate-spin" : ""} />
            {isChecking ? "Vérification..." : "J’ai vérifié mon email"}
          </Button>
        </div>

        <Button
          className="mt-3 w-full"
          variant="ghost"
          onClick={signOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
        </Button>

        <p className="mt-5 text-center text-xs leading-5 text-muted">
          Cette étape est obligatoire pour accéder au questionnaire et au reste de Vintra.
        </p>
      </motion.section>
    </div>
  );
}
