import { serverEnv } from "./server-env";

export function getApplicationUrl() {
  if (serverEnv.VERCEL_ENV === "preview" && serverEnv.VERCEL_URL) {
    return `https://${serverEnv.VERCEL_URL}`;
  }

  return serverEnv.BETTER_AUTH_URL;
}
