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
        {active.length === 0 && (
          <Link
            href="/goals/nouveau"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
          >
            <Plus size={18} />
            Créer un objectif
          </Link>
        )}
      </div>
      <section className="mt-10 grid gap-4">
        {active.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
            <Target className="mx-auto text-brand" />
            <h2 className="mt-4 text-xl font-semibold">Créez votre premier objectif</h2>
            <p className="mt-2 text-secondary-text">
              Donnez une destination concrète à votre épargne.
            </p>
          </div>
        ) : (
          active.map((goal) => <GoalCard key={goal.id} goal={goal} money={money} />)
        )}
      </section>
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
          <p className="text-xs font-medium text-brand">{goal.status}</p>
          <h2 className="mt-2 text-lg font-semibold">{goal.title}</h2>
        </div>
        <p className="font-semibold">{money.format(goal.targetAmount)}</p>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-card">
        <div className="h-full bg-brand" style={{ width: `${Math.min(100, goal.progress)}%` }} />
      </div>
      <p className="mt-2 text-sm text-secondary-text">{Math.round(goal.progress)} % atteint</p>
    </Link>
  );
}
