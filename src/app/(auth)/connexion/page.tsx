import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth";
import { getSession } from "@/features/auth/server";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Connexion" };

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/onboarding");

  return (
    <AuthLayout
      title="Heureux de vous revoir."
      description="Retrouvez votre plan d’épargne et votre progression."
      alternateAction={
        <Button asChild variant="secondary">
          <Link href="/inscription">Créer un compte</Link>
        </Button>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
