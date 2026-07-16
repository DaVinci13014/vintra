"use client";

import { useReportError } from "@/shared/lib/monitoring/client";
import { ReloadErrorState } from "@/shared/ui";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useReportError(error);

  return (
    <html lang="fr">
      <body>
        <ReloadErrorState />
      </body>
    </html>
  );
}
