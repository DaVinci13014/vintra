import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getRecommendations, type RecommendationsData } from "@/features/recommendations";
import { RecommendationsLayout } from "@/widgets/recommendations";

const CATEGORY_LABELS = {
  INCOME: "Revenus",
  EXPENSES: "Dépenses",
  SAVINGS: "Épargne",
  HABITS: "Habitudes",
  GOAL: "Objectif",
  PROFILE: "Profil",
} as const;

const PRIORITY_LABELS = {
  LOW: "À explorer",
  MEDIUM: "Utile",
  HIGH: "Prioritaire",
  CRITICAL: "Urgent",
} as const;

type Recommendation = RecommendationsData["recommendations"][number];

export default async function RecommendationsPage() {
  const session = await requireSession();
  const data = await getRecommendations(session.user.id);
  if (!data) redirect("/onboarding");

  const active = data.recommendations.filter(
    (recommendation) => recommendation.status !== "APPLIED",
  );
  const applied = data.recommendations.filter(
    (recommendation) => recommendation.status === "APPLIED",
  );
  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: data.currency,
    maximumFractionDigits: 0,
  });

  return (
    <RecommendationsLayout>
      <div>
        <p className="text-sm font-medium text-brand">Votre plan d’action</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Recommandations
        </h1>
        <p className="mt-3 max-w-2xl text-secondary-text">
          Commencez par les actions qui ont le plus d’impact sur votre budget.
        </p>
      </div>

      <section className="mt-10 grid gap-4" aria-labelledby="active-recommendations">
        <h2 id="active-recommendations" className="sr-only">
          Recommandations à explorer
        </h2>
        {active.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center sm:p-12">
            <Sparkles className="mx-auto text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Vous êtes à jour</h2>
            <p className="mx-auto mt-2 max-w-md text-secondary-text">
              Aucune nouvelle action n’est nécessaire pour le moment. Vos conseils seront actualisés
              à la prochaine analyse.
            </p>
          </div>
        ) : (
          active.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              money={money}
            />
          ))
        )}
      </section>

      {applied.length > 0 && (
        <section className="mt-12" aria-labelledby="applied-recommendations">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success" size={20} aria-hidden="true" />
            <h2 id="applied-recommendations" className="text-lg font-semibold">
              Actions appliquées
            </h2>
          </div>
          <div className="mt-4 grid gap-3 opacity-80">
            {applied.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                money={money}
              />
            ))}
          </div>
        </section>
      )}
    </RecommendationsLayout>
  );
}

function RecommendationCard({
  recommendation,
  money,
}: {
  recommendation: Recommendation;
  money: Intl.NumberFormat;
}) {
  return (
    <Link
      href={`/recommendations/${recommendation.id}`}
      className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-brand">
            {CATEGORY_LABELS[recommendation.category]}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-secondary-text">
            {PRIORITY_LABELS[recommendation.priority]}
          </span>
        </div>
        <ChevronRight
          className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
          size={20}
          aria-hidden="true"
        />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{recommendation.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-secondary-text">
        {recommendation.description}
      </p>
      {recommendation.potentialSaving > 0 && (
        <p className="mt-4 text-sm font-medium text-foreground">
          Potentiel estimé : {money.format(recommendation.potentialSaving)}/mois
        </p>
      )}
    </Link>
  );
}
