import { Sparkles } from "lucide-react";
import Link from "next/link";

import { RecommendationsLayout } from "@/widgets/recommendations";

export default function RecommendationNotFound() {
  return (
    <RecommendationsLayout backHref="/recommendations">
      <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
        <Sparkles className="mx-auto text-brand" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Recommandation introuvable</h1>
        <p className="mt-2 text-secondary-text">
          Elle a peut-être été archivée ou ne fait plus partie de votre plan d’action.
        </p>
        <Link
          href="/recommendations"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background"
        >
          Voir mes recommandations
        </Link>
      </div>
    </RecommendationsLayout>
  );
}
