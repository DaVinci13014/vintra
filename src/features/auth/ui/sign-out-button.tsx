"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/features/auth/client";
import { Button } from "@/shared/ui";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setIsPending(true);
    setError(null);
    const response = await signOut();
    if (!response.success) {
      setError(response.error.message);
      setIsPending(false);
      return;
    }
    router.replace(response.data.destination);
    router.refresh();
  }

  return (
    <div>
      <Button variant="secondary" onClick={submit} disabled={isPending}>
        {isPending ? "Déconnexion..." : "Se déconnecter"}
      </Button>
      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
