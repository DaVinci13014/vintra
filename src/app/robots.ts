import type { MetadataRoute } from "next";

import { getApplicationUrl } from "@/shared/config/server";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: ["/", "/connexion", "/inscription", "/mot-de-passe-oublie"],
      disallow: [
        "/api/",
        "/dashboard",
        "/goals",
        "/notifications",
        "/onboarding",
        "/profile",
        "/recommendations",
        "/reinitialiser-mot-de-passe",
        "/settings",
        "/verification-email",
      ],
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", getApplicationUrl()).toString(),
  };
}
