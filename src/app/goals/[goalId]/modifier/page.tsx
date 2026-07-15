import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { getGoal } from "@/features/goals";
import { GoalForm } from "@/features/goals/ui";
import { GoalsLayout } from "@/widgets/goals";

export default async function EditGoalPage({ params }: { params: Promise<{ goalId: string }> }) {
  const session = await requireSession();
  const { goalId } = await params;
  const goal = await getGoal(session.user.id, goalId);
  if (!goal || goal.status === "ARCHIVED") notFound();
  return (
    <GoalsLayout backHref={`/goals/${goal.id}`}>
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-brand">Objectif</p>
        <h1 className="mt-2 text-3xl font-semibold">Modifier l’objectif</h1>
        <div className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <GoalForm
            goalId={goal.id}
            initialValues={{
              title: goal.title,
              description: goal.description ?? "",
              targetAmount: goal.targetAmount,
              targetDate: goal.targetDate.toISOString().slice(0, 7),
            }}
          />
        </div>
      </div>
    </GoalsLayout>
  );
}
