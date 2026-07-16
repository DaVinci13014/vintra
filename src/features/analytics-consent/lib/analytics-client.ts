"use client";

import * as Sentry from "@sentry/nextjs";
import type posthog from "posthog-js";

import { publicEnv } from "@/shared/config/public";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  parseAnalyticsConsent,
  type AnalyticsConsent,
} from "../model/analytics-consent";

let analyticsClient: typeof posthog | null = null;
let analyticsInitialization: Promise<void> | null = null;
let analyticsEnabled = false;
let inMemoryConsent: AnalyticsConsent | null = null;

export function isAnalyticsConfigured() {
  return Boolean(publicEnv.NEXT_PUBLIC_POSTHOG_KEY);
}

export function readAnalyticsConsent() {
  if (inMemoryConsent) return inMemoryConsent;

  try {
    return parseAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(consent: AnalyticsConsent) {
  inMemoryConsent = consent;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // Le choix reste actif pour la page courante si le stockage est indisponible.
  }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}

export async function enableAnalytics() {
  const posthogKey = publicEnv.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) return;

  analyticsEnabled = true;
  if (analyticsClient) {
    analyticsClient.opt_in_capturing();
    analyticsClient.capture("$pageview");
    return;
  }

  analyticsInitialization ??= import("posthog-js")
    .then(({ default: posthogClient }) => {
      if (!analyticsEnabled) {
        analyticsInitialization = null;
        return;
      }
      analyticsClient = posthogClient;
      posthogClient.init(posthogKey, {
        api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
        autocapture: false,
        capture_dead_clicks: false,
        capture_pageleave: true,
        capture_pageview: "history_change",
        disable_session_recording: true,
        mask_all_text: true,
        persistence: "memory",
        person_profiles: "identified_only",
      });
    })
    .catch((error: unknown) => {
      analyticsInitialization = null;
      Sentry.captureException(error);
    });

  await analyticsInitialization;
}

export function disableAnalytics() {
  analyticsEnabled = false;
  analyticsClient?.opt_out_capturing();
  analyticsClient?.reset();
}
