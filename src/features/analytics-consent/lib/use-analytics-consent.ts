"use client";

import { useCallback, useEffect, useState } from "react";

import {
  disableAnalytics,
  enableAnalytics,
  isAnalyticsConfigured,
  readAnalyticsConsent,
  saveAnalyticsConsent,
} from "./analytics-client";
import { ANALYTICS_CONSENT_EVENT, type AnalyticsConsent } from "../model/analytics-consent";

export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>();
  const configured = isAnalyticsConfigured();

  useEffect(() => {
    const synchronizeConsent = () => setConsent(readAnalyticsConsent());
    synchronizeConsent();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, synchronizeConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, synchronizeConsent);
  }, []);

  useEffect(() => {
    if (!configured || consent !== "accepted") return;
    void enableAnalytics();
  }, [configured, consent]);

  const updateConsent = useCallback((nextConsent: AnalyticsConsent) => {
    setConsent(nextConsent);
    saveAnalyticsConsent(nextConsent);
    if (nextConsent === "accepted") {
      void enableAnalytics();
    } else {
      disableAnalytics();
    }
  }, []);

  return { configured, consent, updateConsent };
}
