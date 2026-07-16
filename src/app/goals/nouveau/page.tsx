import { redirect } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { getGoals } from "@/features/goals";
import { GoalForm } from "@/features/goals/ui";
import { GoalsLayout } from "@/widgets/goals";

export default async function NewGoalPage() {
  const session = await requireSession();
  const data = await getGoals(session.user.id);
  if (!data) redirect("/onboarding");
  const hasPrimaryGoal = data.goals.some((goal) => goal.status === "ACTIVE");
  return (
    <GoalsLayout backHref="/goals">
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-brand">Nouveau projet</p>
        <h1 className="mt-2 text-3xl font-semibold">Ajouter un objectif</h1>
        <p className="mt-3 leading-7 text-secondary-text">
          {hasPrimaryGoal
            ? "Ce projet sera planifié à côté de votre objectif principal. Vous pourrez l’activer quand vous le souhaitez."
            : "Ce premier projet deviendra votre objectif principal et guidera votre plan d’épargne."}
        </p>
        <div className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <GoalForm />
        </div>
      </div>
    </GoalsLayout>
  );
}
