import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/features/auth";
import { getSession } from "@/features/auth/server";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) redirect("/onboarding");

  return (
    <AuthLayout
      title="Retrouvez votre accès."
      description="Indiquez l’adresse email associée à votre compte."
      alternateAction={
        <Button asChild variant="secondary">
          <Link href="/connexion">Retour</Link>
        </Button>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
