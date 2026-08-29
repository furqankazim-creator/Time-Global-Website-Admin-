import crypto from "node:crypto";
import { connectDb, disconnectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { User } from "../models/User.js";

/**
 * Creates the first admin. Idempotent: re-running never overwrites an
 * existing account (which would silently reset a live password).
 */
async function seed() {
  await connectDb();

  const email = env.SEED_ADMIN_EMAIL;
  const existing = await User.findOne({ email });

  if (existing) {
    logger.info(`Admin already exists: ${email} — nothing to do.`);
    return;
  }

  // A generated password is safer than a hardcoded default that ships to prod.
  const password = env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(12).toString("base64url");
  const passwordHash = await User.hashPassword(password);

  await User.create({ name: "Admin", email, passwordHash, role: "admin", isActive: true });

  logger.info("Admin user created");
  console.log("\n  ────────────────────────────────────────");
  console.log(`   email:    ${email}`);
  console.log(`   password: ${password}`);
  console.log("  ────────────────────────────────────────");
  console.log("   Save this now — it is not stored anywhere.\n");
}

seed()
  .catch((err) => {
    logger.error({ err }, "seed failed");
    process.exitCode = 1;
  })
  .finally(disconnectDb);
