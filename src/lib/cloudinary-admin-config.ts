import type { CloudinaryLookupCategory } from "@/lib/cloudinary-diagnostics";

type CloudinaryEnvironment = Record<string, string | undefined>;

type CloudinaryConfigState = {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
};

type CloudinaryConfigurable = {
  config(options?: CloudinaryConfigState): CloudinaryConfigState;
};

export type CloudinaryAdminConfigurationDiagnostic = {
  operation: "admin_configuration";
  category: "VALID" | Extract<CloudinaryLookupCategory, `CONFIG_${string}`>;
  cloudNameConfigured: boolean;
  apiKeyConfigured: boolean;
  apiSecretConfigured: boolean;
  cloudNameMatchesExpected: boolean;
  apiKeyMatchesExpected: boolean;
  apiSecretMatchesExpected: boolean;
};

export class CloudinaryAdminConfigurationError extends Error {
  readonly diagnostic: CloudinaryAdminConfigurationDiagnostic;
  readonly cloudinaryConfigurationCategory: CloudinaryAdminConfigurationDiagnostic["category"];

  constructor(diagnostic: CloudinaryAdminConfigurationDiagnostic) {
    super("Cloudinary Admin configuration is invalid.");
    this.name = "CloudinaryAdminConfigurationError";
    this.diagnostic = diagnostic;
    this.cloudinaryConfigurationCategory = diagnostic.category;
  }
}

function isConfigured(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function inspectCloudinaryAdminConfiguration(environment: CloudinaryEnvironment): CloudinaryAdminConfigurationDiagnostic {
  const cloudNameConfigured = isConfigured(environment.CLOUDINARY_CLOUD_NAME);
  const apiKeyConfigured = isConfigured(environment.CLOUDINARY_API_KEY);
  const apiSecretConfigured = isConfigured(environment.CLOUDINARY_API_SECRET);
  const category = !cloudNameConfigured ? "CONFIG_MISSING_CLOUD_NAME" : !apiKeyConfigured ? "CONFIG_MISSING_API_KEY" : !apiSecretConfigured ? "CONFIG_MISSING_API_SECRET" : "VALID";

  return {
    operation: "admin_configuration",
    category,
    cloudNameConfigured,
    apiKeyConfigured,
    apiSecretConfigured,
    cloudNameMatchesExpected: false,
    apiKeyMatchesExpected: false,
    apiSecretMatchesExpected: false,
  };
}

/** Configures the one Cloudinary v2 instance used by signing, Admin API, and cleanup. */
export function configureCloudinaryAdminSdk(sdk: CloudinaryConfigurable, environment: CloudinaryEnvironment): CloudinaryAdminConfigurationDiagnostic {
  const inspected = inspectCloudinaryAdminConfiguration(environment);
  if (inspected.category !== "VALID") throw new CloudinaryAdminConfigurationError(inspected);

  const expected = {
    cloud_name: environment.CLOUDINARY_CLOUD_NAME!,
    api_key: environment.CLOUDINARY_API_KEY!,
    api_secret: environment.CLOUDINARY_API_SECRET!,
  };
  sdk.config(expected);
  const configured = sdk.config();
  const diagnostic: CloudinaryAdminConfigurationDiagnostic = {
    ...inspected,
    cloudNameMatchesExpected: configured.cloud_name === expected.cloud_name,
    apiKeyMatchesExpected: configured.api_key === expected.api_key,
    apiSecretMatchesExpected: configured.api_secret === expected.api_secret,
  };

  if (!diagnostic.cloudNameMatchesExpected || !diagnostic.apiKeyMatchesExpected || !diagnostic.apiSecretMatchesExpected) {
    throw new CloudinaryAdminConfigurationError({ ...diagnostic, category: "CONFIG_INVALID" });
  }
  return diagnostic;
}
