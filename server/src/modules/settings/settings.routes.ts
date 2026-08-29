import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { audit } from "../../lib/audit.js";
import { flattenForSet } from "../../lib/flatten.js";
import { sendTestMail } from "../../lib/mailer.js";
import { ApiError } from "../../lib/ApiError.js";
import { requireAdmin } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { getSettings, Settings } from "../../models/Settings.js";

export const settingsRouter = Router();

const menuItem = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().min(1).max(300),
  order: z.number().int().min(0).default(0),
  children: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        url: z.string().trim().min(1).max(300),
        order: z.number().int().min(0).default(0),
      })
    )
    .max(20)
    .default([]),
});

const updateSchema = z.object({
  siteName: z.string().trim().max(120).optional(),
  siteUrl: z.string().url().or(z.literal("")).optional(),
  logo: z.string().regex(/^[a-f\d]{24}$/i).nullable().optional(),
  favicon: z.string().regex(/^[a-f\d]{24}$/i).nullable().optional(),
  contact: z
    .object({
      email: z.string().email().or(z.literal("")).optional(),
      phone: z.string().trim().max(40).optional(),
      address: z.string().trim().max(400).optional(),
    })
    .optional(),
  socials: z
    .object({
      linkedin: z.string().url().or(z.literal("")).optional(),
      twitter: z.string().url().or(z.literal("")).optional(),
      facebook: z.string().url().or(z.literal("")).optional(),
      instagram: z.string().url().or(z.literal("")).optional(),
      youtube: z.string().url().or(z.literal("")).optional(),
    })
    .optional(),
  headerMenu: z.array(menuItem).max(20).optional(),
  footerMenu: z.array(menuItem).max(30).optional(),
  smtp: z
    .object({
      host: z.string().trim().max(200).optional(),
      port: z.number().int().min(1).max(65535).optional(),
      secure: z.boolean().optional(),
      user: z.string().trim().max(200).optional(),
      // Optional on purpose: an empty string means "leave unchanged", so the
      // UI never has to round-trip the existing password to save other fields.
      password: z.string().max(300).optional(),
      fromName: z.string().trim().max(120).optional(),
      fromEmail: z.string().email().or(z.literal("")).optional(),
      notifyOnLead: z.boolean().optional(),
      notifyTo: z.string().email().or(z.literal("")).optional(),
    })
    .optional(),
  maintenanceMode: z.boolean().optional(),
  defaultSeo: z
    .object({
      metaTitle: z.string().trim().max(70).optional(),
      metaDescription: z.string().trim().max(170).optional(),
      ogImage: z.string().regex(/^[a-f\d]{24}$/i).nullable().optional(),
    })
    .optional(),
});

/** Settings hold live credentials and site-wide switches → admin only. */
settingsRouter.use(requireAdmin);

settingsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const doc = await getSettings();
    await doc!.populate("logo favicon defaultSeo.ogImage");
    const json = doc!.toJSON() as Record<string, any>;
    // Never return the SMTP password. Report only whether one is set, so the
    // UI can show "•••• configured" without ever holding the secret.
    if (json.smtp) delete json.smtp.password;
    const withPw = await Settings.findOne({ key: "site" }).select("+smtp.password").lean();
    json.smtp = { ...json.smtp, passwordSet: !!withPw?.smtp?.password };
    res.json({ data: json });
  })
);

settingsRouter.put(
  "/",
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    const body = { ...req.body };

    // Empty password = "unchanged". Combined with flattenForSet below, this
    // leaves the stored credential untouched. Deleting the key alone is NOT
    // enough: `$set: { smtp: {...} }` replaces the whole subdocument.
    if (body.smtp && !body.smtp.password) delete body.smtp.password;

    const doc = await Settings.findOneAndUpdate(
      { key: "site" },
      { $set: { ...flattenForSet(body), updatedBy: req.user!.sub } },
      { new: true, upsert: true, runValidators: true }
    );

    const diff = { ...body };
    if (diff.smtp?.password) diff.smtp = { ...diff.smtp, password: "[redacted]" };
    audit(req, { action: "settings.update", model: "Settings", docId: doc!._id, diff });

    const json = doc!.toJSON() as Record<string, any>;
    if (json.smtp) delete json.smtp.password;
    res.json({ data: json });
  })
);

settingsRouter.post(
  "/test-email",
  validate({ body: z.object({ to: z.string().email("Enter a valid email") }) }),
  asyncHandler(async (req, res) => {
    try {
      await sendTestMail(req.body.to);
      audit(req, { action: "settings.testEmail", diff: { to: req.body.to } });
      res.json({ data: { sent: true } });
    } catch (err) {
      audit(req, { action: "settings.testEmail", success: false });
      throw ApiError.badRequest(
        err instanceof Error ? err.message : "Test email failed"
      );
    }
  })
);
