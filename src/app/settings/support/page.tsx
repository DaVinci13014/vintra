import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { SupportForm } from "@/features/settings/ui";
import { SettingsLayout } from "@/widgets/settings";

const FAQ = [
  {
    question: "Pourquoi mes recommandations ont-elles changé ?",
    answer:
      "Une modification de vos revenus, dépenses ou de votre épargne déclenche une nouvelle analyse fondée sur les données les plus récentes.",
  },
  {
    question: "Puis-je modifier mon objectif ?",
    answer:
      "Oui. Ouvrez Objectifs depuis le tableau de bord, puis sélectionnez l’objectif à ajuster.",
  },
  {
    question: "Comment récupérer mes données ?",
    answer:
      "La section Confidentialité permet de télécharger votre profil ou une archive JSON complète.",
  },
  {
    question: "Que se passe-t-il si je supprime mon compte ?",
    answer:
      "Le compte, les sessions et les données personnelles et financières associées sont supprimés définitivement.",
  },
] as const;

export default async function SettingsSupportPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");

  return (
    <SettingsLayout active="support" user={session.user}>
      <p className="text-sm font-medium text-brand">Support</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Comment pouvons-nous vous aider ?
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">Vintra version 0.1.0</p>

      <section className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-lg font-semibold">Questions fréquentes</h2>
        <div className="mt-5 divide-y divide-divider">
          {FAQ.map(({ question, answer }) => (
            <details key={question} className="group py-4">
              <summary className="cursor-pointer font-medium marker:text-brand">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-secondary-text">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="mt-5">
        <SupportForm />
      </div>
    </SettingsLayout>
  );
}
