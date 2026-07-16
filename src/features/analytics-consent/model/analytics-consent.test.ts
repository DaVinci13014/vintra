import { describe, expect, it } from "vitest";

import { parseAnalyticsConsent } from "./analytics-consent";

describe("consentement à la mesure d’audience", () => {
  it("accepte uniquement les deux choix explicites", () => {
    expect(parseAnalyticsConsent("accepted")).toBe("accepted");
    expect(parseAnalyticsConsent("declined")).toBe("declined");
    expect(parseAnalyticsConsent("unknown")).toBeNull();
    expect(parseAnalyticsConsent(null)).toBeNull();
  });
});
