import { redirect } from "next/navigation";

import { AnalyticsConsentSettings } from "@/features/analytics-consent";
import { requireSession } from "@/features/auth/server";
import { SettingsLayout } from "@/widgets/settings";

export default async function PrivacyPolicyPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");

  return (
    <SettingsLayout active="privacy" user={session.user}>
      <p className="text-sm font-medium text-brand">Confidentialité</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Politique de confidentialité
      </h1>
      <div className="mt-8 grid gap-5">
        <PolicySection title="Données collectées">
          Vintra conserve les informations de compte, les réponses financières que vous fournissez,
          vos objectifs, analyses, recommandations, préférences et demandes adressées au support.
          Les mots de passe restent protégés par Better Auth et ne sont jamais inclus dans les
          exports.
        </PolicySection>
        <PolicySection title="Utilisation">
          Ces données servent uniquement à sécuriser votre accès, calculer votre profil financier,
          personnaliser vos conseils et répondre à vos demandes. Les emails techniques de
          vérification ou de récupération sont transmis au prestataire d’envoi configuré par Vintra.
        </PolicySection>
        <PolicySection title="Hébergement et mesure technique">
          L’application est hébergée par Vercel et sa base PostgreSQL par Supabase dans l’Union
          européenne. Si la surveillance est activée, Sentry reçoit uniquement les informations
          techniques nécessaires au diagnostic, sans corps de requête, cookie ni identité. La mesure
          d’audience PostHog reste facultative, sans replay, autocapture, texte visible ni
          identifiant persistant, et ne démarre qu’après votre accord explicite. Aucune réponse
          financière n’est envoyée à ces outils.
        </PolicySection>
        <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <h2 className="text-lg font-semibold">Votre choix de mesure d’audience</h2>
          <div className="mt-4">
            <AnalyticsConsentSettings />
          </div>
        </section>
        <PolicySection title="Conservation et suppression">
          Les données liées au compte sont conservées tant que celui-ci existe. La suppression du
          compte efface les données personnelles et financières associées. Une trace technique
          anonymisée de la suppression peut être conservée pour l’audit de sécurité.
        </PolicySection>
        <PolicySection title="Vos droits et votre contrôle">
          Vous pouvez modifier vos informations, télécharger votre profil ou l’ensemble de vos
          données, fermer les sessions actives et supprimer définitivement votre compte depuis ces
          paramètres. Le formulaire Support permet de poser toute question complémentaire.
        </PolicySection>
      </div>
    </SettingsLayout>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-secondary-text">{children}</p>
    </section>
  );
}
