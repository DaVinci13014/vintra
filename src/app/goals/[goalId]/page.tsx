import { CalendarClock, Pencil, PiggyBank, Plus, Target } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getGoal } from "@/features/goals";
import { GoalActions, GoalPrimaryAction } from "@/features/goals/ui";
import { GoalsLayout } from "@/widgets/goals";

export default async function GoalDetailPage({ params }: { params: Promise<{ goalId: string }> }) {
  const session = await requireSession();
  const { goalId } = await params;
  const goal = await getGoal(session.user.id, goalId);
  if (!goal) notFound();
  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: goal.currency,
    maximumFractionDigits: 0,
  });
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  return (
    <GoalsLayout backHref="/goals">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-brand">{STATUS_LABELS[goal.status]}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">{goal.title}</h1>
          {goal.description && (
            <p className="mt-3 max-w-2xl text-secondary-text">{goal.description}</p>
          )}
        </div>
        {goal.status !== "ARCHIVED" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {goal.status === "PLANNED" ? (
              <GoalPrimaryAction goalId={goal.id} />
            ) : (
              <Link
                href={`/goals/${goal.id}/epargne`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition hover:bg-brand hover:text-brand-foreground"
              >
                {goal.status === "COMPLETED" ? (
                  <PiggyBank size={17} aria-hidden="true" />
                ) : (
                  <Plus size={17} aria-hidden="true" />
                )}
                {goal.status === "COMPLETED" ? "Voir les versements" : "Ajouter un versement"}
              </Link>
            )}
            <Link
              href={`/goals/${goal.id}/modifier`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm"
            >
              <Pencil size={17} aria-hidden="true" />
              Modifier
            </Link>
          </div>
        )}
      </div>
      {goal.status === "PLANNED" && (
        <p className="mt-5 max-w-3xl rounded-2xl border border-brand/25 bg-brand/10 p-4 text-sm leading-6 text-secondary-text">
          Cette projection suit votre épargne actuelle. En la définissant comme principale, votre
          plan d’épargne actif basculera automatiquement vers cet objectif.
        </p>
      )}
      <section className="mt-10 rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-semibold">{money.format(goal.currentAmount)}</p>
          <p className="text-secondary-text">sur {money.format(goal.targetAmount)}</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-card">
          <div className="h-full bg-brand" style={{ width: `${Math.min(100, goal.progress)}%` }} />
        </div>
        <p className="mt-3 text-sm text-secondary-text">{Math.round(goal.progress)} % atteint</p>
      </section>
      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat icon={Target} label="Montant restant" value={money.format(remaining)} />
        <Stat
          icon={PiggyBank}
          label={goal.isSimulation ? "Estimation mensuelle" : "Épargne recommandée"}
          value={`${money.format(goal.recommendedMonthlySaving)}/mois`}
        />
        <Stat
          icon={CalendarClock}
          label="Date estimée"
          value={
            goal.estimatedCompletionDate ? formatDate(goal.estimatedCompletionDate) : "À ajuster"
          }
        />
      </section>
      <div className="mt-8">
        <GoalActions goalId={goal.id} />
      </div>
    </GoalsLayout>
  );
}

const STATUS_LABELS = {
  PLANNED: "Objectif planifié",
  ACTIVE: "Objectif principal",
  COMPLETED: "Objectif atteint",
  ARCHIVED: "Objectif archivé",
} as const;

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <Icon className="text-brand" size={20} />
      <p className="mt-4 text-sm text-secondary-text">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </article>
  );
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}
