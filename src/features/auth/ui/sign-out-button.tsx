"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/ui";
import { authClient } from "../api/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut();
    router.replace("/connexion");
    router.refresh();
  }

  return (
    <Button variant="secondary" onClick={signOut} disabled={isPending}>
      {isPending ? "Déconnexion..." : "Se déconnecter"}
    </Button>
  );
}
