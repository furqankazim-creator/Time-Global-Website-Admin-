import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { Settings } from "../models/Settings.js";
import { logger } from "./logger.js";

type Mail = { to: string; subject: string; text: string };

/**
 * SMTP config is read per send (not cached at boot) so a change takes effect
 * immediately. Primary source is the DB (editable from the admin Settings
 * screen); if that hasn't been filled in, fall back to the SMTP_* env vars so
 * a fresh deploy can still send the "new inquiry" email.
 */
async function getTransport() {
  const s = await Settings.findOne({ key: "site" }).select("+smtp.password");

  if (s?.smtp?.host && s.smtp.user) {
    return {
      transport: nodemailer.createTransport({
        host: s.smtp.host,
        port: s.smtp.port,
        secure: s.smtp.secure,
        auth: { user: s.smtp.user, pass: s.smtp.password },
      }),
      from: `"${s.smtp.fromName || s.siteName}" <${s.smtp.fromEmail || s.smtp.user}>`,
    };
  }

  const host = env.SMTP_HOST || (env.SMTP_USER ? "smtp.gmail.com" : undefined);
  if (host && env.SMTP_USER && env.SMTP_APP_PASSWORD) {
    const port = env.SMTP_PORT ?? 465;
    return {
      transport: nodemailer.createTransport({
        host,
        port,
        secure: env.SMTP_SECURE || port === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD },
      }),
      from: `"${env.SMTP_FROM_NAME || s?.siteName || "Time Global Tech"}" <${env.SMTP_FROM || env.SMTP_USER}>`,
    };
  }

  return null;
}

/**
 * Fire-and-forget. A failed notification must never fail the request that
 * triggered it — a lead that reached the DB is captured whether or not the
 * email went out. Failures are logged, not thrown.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  try {
    const t = await getTransport();
    if (!t) {
      logger.warn("SMTP not configured — skipping notification");
      return false;
    }
    await t.transport.sendMail({ from: t.from, ...mail });
    return true;
  } catch (err) {
    logger.error({ err }, "mail send failed");
    return false;
  }
}

/** Used by the Settings "send test email" button. Throws so the UI can show why. */
export async function sendTestMail(to: string) {
  const t = await getTransport();
  if (!t) throw new Error("SMTP is not configured. Fill in host and username first.");
  await t.transport.sendMail({
    from: t.from,
    to,
    subject: "Time Global Tech — SMTP test",
    text: "If you're reading this, your SMTP settings work.",
  });
}
