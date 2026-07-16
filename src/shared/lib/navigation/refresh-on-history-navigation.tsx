"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RefreshOnHistoryNavigation() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();
    const refreshRestoredPage = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };

    window.addEventListener("popstate", refresh);
    window.addEventListener("pageshow", refreshRestoredPage);

    return () => {
      window.removeEventListener("popstate", refresh);
      window.removeEventListener("pageshow", refreshRestoredPage);
    };
  }, [router]);

  return null;
}
