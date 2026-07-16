import { Plus, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getGoals } from "@/features/goals";
import { GoalsLayout } from "@/widgets/goals";

export default async function GoalsPage() {
  const session = await requireSession();
  const data = await getGoals(session.user.id);
  if (!data) redirect("/onboarding");
  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: data.currency,
    maximumFractionDigits: 0,
  });
  const active = data.goals.filter((goal) => goal.status === "ACTIVE");
  const planned = data.goals.filter((goal) => goal.status === "PLANNED");
  const archived = data.goals.filter(
    (goal) => goal.status === "ARCHIVED" || goal.status === "COMPLETED",
  );
  return (
    <GoalsLayout>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-brand">Vos projets</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Objectifs</h1>
        </div>
        <Link
          href="/goals/nouveau"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
        >
          <Plus size={18} />
          Ajouter un objectif
        </Link>
      </div>
      <section className="mt-10 grid gap-4" aria-labelledby="primary-goal-title">
        <h2 id="primary-goal-title" className="text-lg font-semibold">
          Objectif principal
        </h2>
        {active.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
            <Target className="mx-auto text-brand" />
            <h3 className="mt-4 text-xl font-semibold">Choisissez votre prochain objectif</h3>
            <p className="mt-2 text-secondary-text">
              Ajoutez un projet ou activez un objectif planifié pour guider votre épargne.
            </p>
          </div>
        ) : (
          active.map((goal) => <GoalCard key={goal.id} goal={goal} money={money} />)
        )}
      </section>
      {planned.length > 0 && (
        <section className="mt-12" aria-labelledby="planned-goals-title">
          <div>
            <h2 id="planned-goals-title" className="text-lg font-semibold">
              Objectifs planifiés
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Ils suivent votre épargne actuelle. Activez-en un lorsque vous souhaitez en faire
              votre priorité.
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {planned.map((goal) => (
              <GoalCard key={goal.id} goal={goal} money={money} />
            ))}
          </div>
        </section>
      )}
      {archived.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Historique</h2>
          <div className="mt-4 grid gap-3 opacity-75">
            {archived.map((goal) => (
              <GoalCard key={goal.id} goal={goal} money={money} />
            ))}
          </div>
        </section>
      )}
    </GoalsLayout>
  );
}

function GoalCard({
  goal,
  money,
}: {
  goal: Awaited<ReturnType<typeof getGoals>> extends infer Data
    ? Data extends { goals: Array<infer Goal> }
      ? Goal
      : never
    : never;
  money: Intl.NumberFormat;
}) {
  return (
    <Link
      href={`/goals/${goal.id}`}
      className="rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
    >
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-brand">{STATUS_LABELS[goal.status]}</p>
          <h2 className="mt-2 text-lg font-semibold">{goal.title}</h2>
        </div>
        <p className="font-semibold">{money.format(goal.targetAmount)}</p>
      </div>
      <div
        className="mt-5 h-2 overflow-hidden rounded-full bg-card"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(goal.progress)}
        aria-label={`Progression de ${goal.title}`}
      >
        <div className="h-full bg-brand" style={{ width: `${Math.min(100, goal.progress)}%` }} />
      </div>
      <p className="mt-2 text-sm text-secondary-text">{Math.round(goal.progress)} % atteint</p>
    </Link>
  );
}

const STATUS_LABELS = {
  PLANNED: "Planifié",
  ACTIVE: "Principal",
  COMPLETED: "Atteint",
  ARCHIVED: "Archivé",
} as const;
