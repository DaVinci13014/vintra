import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "child-src 'none'",
  "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://eu.i.posthog.com https://eu-assets.i.posthog.com",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "img-src 'self' data: blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  distDir: isProduction ? ".next" : ".next-dev",
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...[
        "/api/:path*",
        "/dashboard/:path*",
        "/goals/:path*",
        "/notifications/:path*",
        "/onboarding/:path*",
        "/profile/:path*",
        "/recommendations/:path*",
        "/reinitialiser-mot-de-passe",
        "/settings/:path*",
        "/verification-email",
      ].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
    ];
  },
};

const sentryBuildSchema = z
  .object({
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
    SENTRY_ORG: z.string().min(1).optional(),
    SENTRY_PROJECT: z.string().min(1).optional(),
  })
  .superRefine((config, context) => {
    const configuredValues = [
      config.SENTRY_AUTH_TOKEN,
      config.SENTRY_ORG,
      config.SENTRY_PROJECT,
    ].filter(Boolean).length;

    if (configuredValues > 0 && configuredValues < 3) {
      context.addIssue({
        code: "custom",
        message: "La configuration Sentry de build doit être complète.",
      });
    }
  });

const sentryBuildConfig = sentryBuildSchema.parse({
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || undefined,
  SENTRY_ORG: process.env.SENTRY_ORG || undefined,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT || undefined,
});

const canUploadSourceMaps = Boolean(
  sentryBuildConfig.SENTRY_AUTH_TOKEN &&
  sentryBuildConfig.SENTRY_ORG &&
  sentryBuildConfig.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  authToken: sentryBuildConfig.SENTRY_AUTH_TOKEN,
  org: sentryBuildConfig.SENTRY_ORG,
  project: sentryBuildConfig.SENTRY_PROJECT,
  silent: true,
  sourcemaps: canUploadSourceMaps ? { deleteSourcemapsAfterUpload: true } : { disable: true },
  telemetry: false,
  widenClientFileUpload: canUploadSourceMaps,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      excludeReplayCompressionWorker: true,
      excludeReplayIframe: true,
      excludeReplayShadowDOM: true,
      removeDebugLogging: true,
    },
  },
});
