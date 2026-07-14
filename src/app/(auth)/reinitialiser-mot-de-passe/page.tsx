import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/features/auth";
import { getSession } from "@/features/auth/server";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await getSession();
  if (session) redirect("/onboarding");

  const { token, error } = await searchParams;

  return (
    <AuthLayout
      title="Choisissez un nouveau mot de passe."
      description="Utilisez un mot de passe unique pour protéger votre espace."
      alternateAction={
        <Button asChild variant="secondary">
          <Link href="/connexion">Retour</Link>
        </Button>
      }
    >
      <ResetPasswordForm token={token} isInvalidToken={error === "INVALID_TOKEN"} />
    </AuthLayout>
  );
}
