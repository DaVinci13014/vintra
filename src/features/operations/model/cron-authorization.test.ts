import { describe, expect, it } from "vitest";

import { isValidCronAuthorization } from "./cron-authorization";

const secret = "vintra-test-cron-secret";

describe("autorisation des tâches planifiées", () => {
  it("accepte uniquement le jeton Bearer exact", () => {
    expect(isValidCronAuthorization(`Bearer ${secret}`, secret)).toBe(true);
    expect(isValidCronAuthorization(`Bearer ${secret}-invalid`, secret)).toBe(false);
    expect(isValidCronAuthorization(secret, secret)).toBe(false);
  });

  it("rejette les en-têtes absents ou anormalement longs", () => {
    expect(isValidCronAuthorization(null, secret)).toBe(false);
    expect(isValidCronAuthorization(`Bearer ${"a".repeat(600)}`, secret)).toBe(false);
  });
});
