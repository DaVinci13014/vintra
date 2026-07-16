type ApplicationUrlConfig = {
  baseUrl: string;
  branchHost?: string;
  deploymentHost?: string;
  environment?: "development" | "preview" | "production";
};

export function resolveApplicationUrl(config: ApplicationUrlConfig) {
  if (config.environment === "preview" && config.branchHost) {
    return `https://${config.branchHost}`;
  }

  if (config.environment === "preview" && config.deploymentHost) {
    return `https://${config.deploymentHost}`;
  }

  return config.baseUrl;
}
