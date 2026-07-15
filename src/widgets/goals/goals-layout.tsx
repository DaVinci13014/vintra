import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/shared/ui";

export function GoalsLayout({
  children,
  backHref = "/dashboard",
}: {
  children: ReactNode;
  backHref?: string;
}) {
  return (
    <main className="min-h-svh bg-background px-4 py-4 sm:px-8 sm:py-6">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Logo priority />
        <Link
          href={backHref}
          className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-secondary-text hover:bg-card hover:text-foreground"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Retour
        </Link>
      </header>
      <div className="mx-auto max-w-5xl py-10">{children}</div>
    </main>
  );
}
