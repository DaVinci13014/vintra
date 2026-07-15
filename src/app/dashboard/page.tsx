import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getDashboardData } from "@/features/dashboard";
import { DashboardPage } from "@/widgets/dashboard";

export default async function DashboardRoute() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");

  const data = await getDashboardData(session.user.id);
  if (!data.completed) redirect("/onboarding");

  return <DashboardPage data={data} firstName={session.user.firstName} />;
}
