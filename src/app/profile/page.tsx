import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getEditableFinancialProfile } from "@/features/financial-profile";
import { FinancialProfileForm } from "@/features/financial-profile/ui";
import { GoalsLayout } from "@/widgets/goals";

export default async function ProfilePage() {
  const session = await requireSession();
  const profile = await getEditableFinancialProfile(session.user.id);
  if (!profile) redirect("/onboarding");
  return (
    <GoalsLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-brand">Votre situation</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Profil financier</h1>
        <p className="mt-3 max-w-2xl text-secondary-text">
          Chaque modification déclenche une nouvelle analyse et actualise votre dashboard, votre
          objectif et vos recommandations.
        </p>
        <div className="mt-10">
          <FinancialProfileForm initialValues={profile.values} currency={profile.currency} />
        </div>
      </div>
    </GoalsLayout>
  );
}
