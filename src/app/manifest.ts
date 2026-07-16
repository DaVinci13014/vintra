import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#090b10",
    description: "Coach financier personnel pour comprendre et améliorer son épargne.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/logo/vintra-logo.svg",
        type: "image/svg+xml",
      },
    ],
    lang: "fr",
    name: "Vintra",
    short_name: "Vintra",
    start_url: "/",
    theme_color: "#090b10",
  };
}
