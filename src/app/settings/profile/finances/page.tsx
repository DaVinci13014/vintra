import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getEditableFinancialProfile } from "@/features/financial-profile";
import { FinancialProfileForm } from "@/features/financial-profile/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsFinancialProfilePage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const profile = await getEditableFinancialProfile(session.user.id);
  if (!profile) redirect("/onboarding");

  return (
    <SettingsLayout active="profile">
      <p className="text-sm font-medium text-brand">Mon profil</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Situation financière
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Enregistrez vos montants réels pour recalculer votre profil, votre objectif et vos conseils.
      </p>
      <div className="mt-8">
        <FinancialProfileForm initialValues={profile.values} currency={profile.currency} />
      </div>
    </SettingsLayout>
  );
}
