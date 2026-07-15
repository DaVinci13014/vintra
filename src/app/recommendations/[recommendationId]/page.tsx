import { Gauge, Layers3, Sparkles, Zap } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getRecommendation } from "@/features/recommendations";
import { RecommendationActions } from "@/features/recommendations/ui";
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

const IMPACT_LABELS = {
  VERY_LOW: "Très faible",
  LOW: "Faible",
  MEDIUM: "Moyen",
  HIGH: "Élevé",
  VERY_HIGH: "Très élevé",
} as const;

const DIFFICULTY_LABELS = {
  VERY_EASY: "Très facile",
  EASY: "Facile",
  MEDIUM: "Moyenne",
  HARD: "Difficile",
} as const;

export default async function RecommendationDetailPage({
  params,
}: {
  params: Promise<{ recommendationId: string }>;
}) {
  const session = await requireSession();
  const { recommendationId } = await params;
  const recommendation = await getRecommendation(session.user.id, recommendationId);
  if (!recommendation) notFound();

  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: recommendation.currency,
    maximumFractionDigits: 0,
  });

  return (
    <RecommendationsLayout backHref="/recommendations">
      <div className="max-w-3xl">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-brand">
            {CATEGORY_LABELS[recommendation.category]}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-secondary-text">
            {PRIORITY_LABELS[recommendation.priority]}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {recommendation.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-secondary-text sm:text-lg">
          {recommendation.description}
        </p>
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-3" aria-label="Effet estimé">
        <Metric icon={Gauge} label="Impact estimé" value={IMPACT_LABELS[recommendation.impact]} />
        <Metric
          icon={Zap}
          label="Difficulté"
          value={DIFFICULTY_LABELS[recommendation.difficulty]}
        />
        <Metric icon={Layers3} label="Catégorie" value={CATEGORY_LABELS[recommendation.category]} />
      </section>

      {recommendation.potentialSaving > 0 && (
        <section className="mt-5 rounded-3xl border border-brand/30 bg-brand/10 p-6 sm:p-8">
          <Sparkles className="text-brand" aria-hidden="true" />
          <p className="mt-5 text-sm text-secondary-text">Économie mensuelle potentielle</p>
          <p className="mt-1 text-3xl font-semibold">
            {money.format(recommendation.potentialSaving)}
          </p>
          <p className="mt-2 text-sm text-secondary-text">
            Cette estimation repose sur les données communiquées dans votre profil.
          </p>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Passer à l’action</h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-secondary-text">
          Marquez ce conseil comme appliqué lorsque vous l’avez intégré, ou ignorez-le s’il ne
          correspond plus à votre situation.
        </p>
        <RecommendationActions id={recommendation.id} initialStatus={recommendation.status} />
      </section>
    </RecommendationsLayout>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <Icon className="text-brand" size={20} aria-hidden="true" />
      <p className="mt-4 text-sm text-secondary-text">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </article>
  );
}
