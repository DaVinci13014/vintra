import { serverEnv } from "./server-env";
import { resolveApplicationUrl } from "./application-url-resolver";

export function getApplicationUrl() {
  return resolveApplicationUrl({
    baseUrl: serverEnv.BETTER_AUTH_URL,
    branchHost: serverEnv.VERCEL_BRANCH_URL,
    deploymentHost: serverEnv.VERCEL_URL,
    environment: serverEnv.VERCEL_ENV,
  });
}

export function getTrustedApplicationOrigins() {
  const additionalOrigins =
    serverEnv.VERCEL_ENV === "preview"
      ? [
          serverEnv.VERCEL_BRANCH_URL ? `https://${serverEnv.VERCEL_BRANCH_URL}` : null,
          serverEnv.VERCEL_URL ? `https://${serverEnv.VERCEL_URL}` : null,
        ]
      : [
          serverEnv.BETTER_AUTH_URL,
          serverEnv.VERCEL_URL ? `https://${serverEnv.VERCEL_URL}` : null,
        ];

  return [
    ...new Set(
      [getApplicationUrl(), ...additionalOrigins].filter((origin): origin is string =>
        Boolean(origin),
      ),
    ),
  ];
}
