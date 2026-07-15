import { redirect } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { getGoals } from "@/features/goals";
import { GoalForm } from "@/features/goals/ui/goal-form";
import { GoalsLayout } from "@/widgets/goals";

export default async function NewGoalPage() { const session = await requireSession(); const data = await getGoals(session.user.id); if (!data) redirect("/onboarding"); if (data.goals.some((goal) => goal.status === "ACTIVE")) redirect("/goals"); return <GoalsLayout backHref="/goals"><div className="mx-auto max-w-xl"><p className="text-sm text-brand">Nouveau projet</p><h1 className="mt-2 text-3xl font-semibold">Créer un objectif</h1><div className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8"><GoalForm /></div></div></GoalsLayout>; }
