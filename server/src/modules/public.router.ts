import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { audit } from "../lib/audit.js";
import { logger } from "../lib/logger.js";
import { sendMail } from "../lib/mailer.js";
import { publicWriteLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { Lead } from "../models/Lead.js";
import { notify } from "../models/Notification.js";
import { Service } from "../models/Service.js";
import { Settings } from "../models/Settings.js";
import { publicContentRouter } from "./public.content.js";

/**
 * Unauthenticated, read-only. Structurally incapable of returning a draft:
 * PUBLISHED_ONLY is applied in every query here, so a draft cannot leak to
 * the live site even if an admin filter is wrong.
 */
export const publicRouter = Router();

const PUBLISHED_ONLY = { status: "published", deletedAt: null } as const;
const FIELDS = "-createdBy -updatedBy -deletedAt -__v";

// Cache headers first, so every public route below inherits them.
// (A POST /leads response is uncacheable anyway — Express won't let a 201
// with no-store semantics be reused, and browsers don't cache POSTs.)
publicRouter.use((_req, res, next) => {
  if (_req.method === "GET") {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }
  next();
});

// Content endpoints (projects, posts, testimonials, team, home)
publicRouter.use("/", publicContentRouter);

publicRouter.get(
  "/services",
  asyncHandler(async (_req, res) => {
    const data = await Service.find(PUBLISHED_ONLY)
      .select(FIELDS)
      .sort({ order: 1, createdAt: -1 })
      .populate("image", "url alt width height")
      .lean();
    res.json({ data });
  })
);

publicRouter.get(
  "/services/:slug",
  asyncHandler(async (req, res) => {
    const doc = await Service.findOne({ ...PUBLISHED_ONLY, slug: req.params.slug })
      .select(FIELDS)
      .populate("image", "url alt width height")
      .populate("seo.ogImage", "url alt")
      .lean();
    if (!doc) throw ApiError.notFound("Service not found");
    res.json({ data: doc });
  })
);

/* --------------------------- Lead submission -------------------------- */

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(160),
  email: z.string().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  industry: z.string().trim().max(120).optional(),
  budgetRange: z.string().trim().max(60).optional(),
  preferredContact: z.enum(["Email", "Phone", "WhatsApp", "SMS"]).optional(),
  topic: z.string().trim().max(120).optional(),
  message: z.string().trim().max(5000).optional(),
  sourcePage: z.string().trim().max(300).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  /**
   * Honeypot: hidden in the real form, so only a bot fills it. Accept ANY
   * value here — validating it would return a `website` field error that
   * tells the bot exactly which field caught it. The handler decides.
   */
  website: z.string().max(300).optional(),
});

publicRouter.post(
  "/leads",
  publicWriteLimiter, // 3/hour/IP — an open POST is a spam and SMTP-abuse vector
  validate({ body: leadSchema }),
  asyncHandler(async (req, res) => {
    // Honeypot tripped: respond 201 so the bot believes it succeeded and
    // doesn't retry with a different strategy. Nothing is stored.
    if (req.body.website) {
      return res.status(201).json({ data: { received: true } });
    }

    const rawMessage = (req.body.message ?? "").trim();
    const topic = (req.body.topic ?? "").trim();

    const lead = await Lead.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone ?? "",
      company: req.body.company ?? "",
      industry: req.body.industry ?? "",
      budgetRange: req.body.budgetRange ?? "",
      preferredContact: req.body.preferredContact ?? "",
      // Topic has no column of its own — prepend it so it stays visible in
      // the admin inbox.
      message: topic && rawMessage ? `[${topic}]\n\n${rawMessage}` : rawMessage,
      sourcePage: req.body.sourcePage ?? "",
      ipAddress: req.ip ?? null,
      consentGivenAt: new Date(),
    });

    audit(req, { action: "lead.create", model: "Lead", docId: lead._id, actorEmail: lead.email });

    notify({
      type: "lead",
      title: `New inquiry: ${lead.name}`,
      body: [lead.company, lead.budgetRange, lead.email].filter(Boolean).join(" — "),
      link: "/admin/leads",
    });

    // Forward the inquiry into the Time Global Tech CRM (crm.tgailab.site).
    // Server-to-server, fire-and-forget: the visitor's submission is already
    // stored, so a slow or unreachable CRM must never delay or fail it. Only
    // runs when CRM_INQUIRY_URL is configured.
    if (env.CRM_INQUIRY_URL && env.NODE_ENV !== "test") {
      const url = env.CRM_INQUIRY_URL;
      void (async () => {
        try {
          const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_name: lead.name,
              email: lead.email || undefined,
              phone: lead.phone || undefined,
              company: lead.company || undefined,
              service: topic || undefined,
              industry: lead.industry || undefined,
              budget_range: lead.budgetRange || undefined,
              preferred_contact_method: lead.preferredContact || undefined,
              description: rawMessage || "(no message provided)",
            }),
          });
          if (r.ok) {
            const body = (await r.json().catch(() => null)) as { id?: string } | null;
            logger.info({ crmId: body?.id, leadId: String(lead._id) }, "CRM inquiry forwarded");
          } else {
            logger.warn({ status: r.status }, "CRM inquiry forward rejected");
          }
        } catch (err) {
          logger.error({ err }, "CRM inquiry forward failed");
        }
      })();
    }

    // Notify asynchronously — a slow or broken SMTP must not delay or fail
    // the visitor's submission, which is already safely stored.
    void (async () => {
      const s = await Settings.findOne({ key: "site" }).lean();
      // DB Settings win; otherwise fall back to LEAD_NOTIFY_TO from env so a
      // fresh deploy still emails someone. An explicit notifyOnLead:false in
      // Settings is respected as an opt-out.
      const to = s?.smtp?.notifyTo || s?.contact?.email || env.LEAD_NOTIFY_TO;
      const enabled = s?.smtp?.notifyOnLead ?? Boolean(env.LEAD_NOTIFY_TO);
      if (!enabled || !to) return;
      await sendMail({
        to,
        subject: `New inquiry: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
        text: [
          `Name:      ${lead.name}`,
          `Email:     ${lead.email}`,
          `Phone:     ${lead.phone || "—"}`,
          `Company:   ${lead.company || "—"}`,
          `Industry:  ${lead.industry || "—"}`,
          `Budget:    ${lead.budgetRange || "—"}`,
          `Contact:   ${lead.preferredContact || "—"}`,
          `Page:      ${lead.sourcePage || "—"}`,
          ``,
          lead.message || "(no message)",
        ].join("\n"),
      });
    })();

    res.status(201).json({ data: { received: true } });
  })
);

/* ------------------------------ Settings ------------------------------ */
publicRouter.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    // Explicit allowlist — never `.find()` on a doc holding SMTP credentials.
    const s = await Settings.findOne({ key: "site" })
      .select("siteName logo favicon contact socials headerMenu footerMenu maintenanceMode defaultSeo")
      .populate("logo favicon", "url alt width height")
      .lean();
    res.json({ data: s ?? {} });
  })
);
