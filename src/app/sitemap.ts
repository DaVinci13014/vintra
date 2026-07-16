import type { MetadataRoute } from "next";

import { getApplicationUrl } from "@/shared/config/server";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: new URL("/", getApplicationUrl()).toString(),
    },
  ];
}
