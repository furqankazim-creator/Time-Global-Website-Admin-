import "dotenv/config";
import { z } from "zod";

/**
 * Validated at boot so a missing secret fails immediately and loudly,
 * rather than at 3am on the first request that happens to need it.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // Must differ: a leaked access token must not be replayable as a refresh token.
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be >=32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be >=32 chars"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),

  // Comma-separated allowlist. No wildcard — cookies require a real origin.
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  SEED_ADMIN_EMAIL: z.string().email().default("admin@timeglobaltech.com"),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional(),

  // Media storage. `local` works out of the box; swap to `cloudinary`
  // by filling the CLOUDINARY_* vars — callers are driver-agnostic.
  STORAGE_DRIVER: z.enum(["local", "cloudinary"]).default("local"),
  UPLOAD_DIR: z.string().default("uploads"),
  /** Absolute base the API is reachable at, used to build media URLs. */
  PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  /** Origin of the public marketing site — used for sitemap/robots URLs. */
  SITE_URL: z.string().url().default("http://localhost:5173"),
  MAX_UPLOAD_MB: z.coerce.number().default(10),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  /**
   * SMTP fallback. The admin Settings screen is still the primary source of
   * SMTP config (stored in the DB); these env vars are used only when that
   * screen has not been filled in — so the "new inquiry" email works out of
   * the box in a fresh deploy.
   */
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_APP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_FROM_NAME: z.string().optional(),
  /** Where "new inquiry" notification emails are sent, if SMTP is configured. */
  LEAD_NOTIFY_TO: z.string().email().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`);
  console.error("Invalid environment configuration:\n" + issues.join("\n"));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === "production",
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
};

if (env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET) {
  console.error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.");
  process.exit(1);
}
