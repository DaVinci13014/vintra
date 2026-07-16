"use client";

import { useReportError } from "@/shared/lib/monitoring/client";
import { ReloadErrorState } from "@/shared/ui";

export default function GoalsError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useReportError(error);

  return <ReloadErrorState />;
}
