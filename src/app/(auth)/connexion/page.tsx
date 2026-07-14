import type { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "@/features/auth";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Connexion" };

export default function SignInPage() {
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
