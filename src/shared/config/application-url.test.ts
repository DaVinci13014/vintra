import { describe, expect, it } from "vitest";

import { resolveApplicationUrl } from "./application-url-resolver";

describe("URL publique de l’application", () => {
  it("préfère l’alias stable de branche pour un aperçu", () => {
    expect(
      resolveApplicationUrl({
        baseUrl: "https://vintra.example",
        branchHost: "vintra-git-audit.vercel.app",
        deploymentHost: "vintra-abc.vercel.app",
        environment: "preview",
      }),
    ).toBe("https://vintra-git-audit.vercel.app");
  });

  it("conserve l’URL canonique en production et en local", () => {
    expect(
      resolveApplicationUrl({
        baseUrl: "https://vintra.example",
        deploymentHost: "vintra-abc.vercel.app",
        environment: "production",
      }),
    ).toBe("https://vintra.example");
  });
});
