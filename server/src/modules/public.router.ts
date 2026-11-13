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
import { JobApplication } from "../models/JobApplication.js";
import { notify } from "../models/Notification.js";
import { Service } from "../models/Service.js";
import { Settings } from "../models/Settings.js";
import { publicContentRouter } from "./public.content.js";
import { chatRouter } from "./chat.routes.js";

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
publicRouter.use("/chat", chatRouter);

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
    })().catch((err) => logger.error({ err }, "failed to send lead notification"));

    // Confirm receipt to the visitor independently of admin notification preferences.
    void sendMail({
      to: lead.email,
      subject: "Thank you for contacting Time Global",
      text: [
        `Hi ${lead.name},`,
        "",
        "Thank you for contacting Time Global. We have received your inquiry and our team will get back to you soon.",
        "",
        "Best regards,",
        "The Time Global Team",
      ].join("\n"),
    });

    res.status(201).json({ data: { received: true } });
  })
);

/* -------------------- Job Application Submission -------------------- */

const jobApplicationSchema = z.object({
  name: z.string().trim().min(2, "Full Name is required").max(160),
  fatherName: z.string().trim().min(2, "Father's Name is required").max(160),
  email: z.string().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(5, "Phone number is required").max(50),
  education: z.string().trim().min(2, "Education/Qualification is required").max(200),
  jobTitle: z.string().trim().min(2, "Job Role is required").max(200),
  jobSlug: z.string().trim().max(200).optional(),
  experience: z.string().trim().min(10, "Please write 2-3 lines about your experience & key skills").max(3000),
  coverLetter: z.string().trim().max(5000).optional(),
  portfolioUrl: z.string().trim().max(300).optional(),
  resume: z.object({
    filename: z.string().min(1, "Resume file is required"),
    size: z.number().max(5 * 1024 * 1024, "Resume file must not exceed 5MB"),
    mimeType: z.string().default("application/pdf"),
    dataUrl: z.string().optional(),
  }),
  website: z.string().max(300).optional(), // Honeypot
});

publicRouter.post(
  "/applications",
  publicWriteLimiter,
  validate({ body: jobApplicationSchema }),
  asyncHandler(async (req, res) => {
    // Honeypot check
    if (req.body.website) {
      return res.status(201).json({ data: { received: true } });
    }

    const application = await JobApplication.create({
      name: req.body.name,
      fatherName: req.body.fatherName,
      email: req.body.email,
      phone: req.body.phone,
      education: req.body.education,
      jobTitle: req.body.jobTitle,
      jobSlug: req.body.jobSlug || "",
      experience: req.body.experience,
      coverLetter: req.body.coverLetter || "",
      portfolioUrl: req.body.portfolioUrl || "",
      resume: {
        filename: req.body.resume.filename,
        size: req.body.resume.size,
        mimeType: req.body.resume.mimeType,
        dataUrl: req.body.resume.dataUrl || "",
      },
      ipAddress: req.ip ?? null,
    });

    audit(req, {
      action: "job_application.create",
      model: "JobApplication",
      docId: application._id,
      actorEmail: application.email,
    });

    notify({
      type: "lead",
      title: `New Job Application: ${application.name}`,
      body: `${application.jobTitle} — ${application.email}`,
      link: "/admin/applications",
    });

    // 1. Send Alert Email to Company / HR
    void (async () => {
      try {
        const s = await Settings.findOne({ key: "site" }).lean();
        const to = s?.smtp?.notifyTo || s?.contact?.email || env.LEAD_NOTIFY_TO || "careers@timeglobaltech.com";
        
        let attachments: any[] = [];
        if (req.body.resume?.dataUrl && req.body.resume.dataUrl.includes(";base64,")) {
          const base64Data = req.body.resume.dataUrl.split(";base64,").pop();
          if (base64Data) {
            attachments.push({
              filename: req.body.resume.filename,
              content: Buffer.from(base64Data, "base64"),
              contentType: req.body.resume.mimeType,
            });
          }
        }

        await sendMail({
          to,
          subject: `New Job Application: ${application.name} (${application.jobTitle})`,
          text: [
            `New Job Application Received on Time Global Careers:`,
            `----------------------------------------------------`,
            `Candidate Name:   ${application.name}`,
            `Father's Name:    ${application.fatherName}`,
            `Email:            ${application.email}`,
            `Phone / WhatsApp: ${application.phone}`,
            `Education:        ${application.education}`,
            `Position Applied: ${application.jobTitle}`,
            `Portfolio/Links:  ${application.portfolioUrl || "—"}`,
            `Resume File:      ${application.resume.filename} (${Math.round(application.resume.size / 1024)} KB)`,
            ``,
            `Experience & Skill Summary (2-3 lines):`,
            application.experience,
            ``,
            `Cover Letter:`,
            application.coverLetter || "(No cover letter provided)",
          ].join("\n"),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 8px;">New Job Application Received</h2>
              <p><strong>Position:</strong> ${application.jobTitle}</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 6px 0; color: #666;">Candidate Name:</td><td style="font-weight: bold;">${application.name}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Father's Name:</td><td style="font-weight: bold;">${application.fatherName}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Email:</td><td><a href="mailto:${application.email}">${application.email}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Phone:</td><td>${application.phone}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Education:</td><td>${application.education}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Portfolio / Links:</td><td>${application.portfolioUrl || "—"}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Resume Attached:</td><td><strong>${application.resume.filename}</strong> (${Math.round(application.resume.size / 1024)} KB)</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">Experience & Expertise Summary:</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #444;">${application.experience}</p>
              </div>
              ${application.coverLetter ? `
              <div style="margin-top: 15px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">Cover Letter:</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #444;">${application.coverLetter}</p>
              </div>` : ''}
              <p style="margin-top: 25px; font-size: 12px; color: #999; text-align: center;">Time Global Careers Portal</p>
            </div>
          `,
          attachments,
        });
      } catch (err) {
        logger.error({ err }, "failed to send HR job application email");
      }
    })();

    // 2. Send Auto-Reply "Thank You for Applying" Email to Applicant
    void (async () => {
      try {
        await sendMail({
          to: application.email,
          subject: `Thank you for applying: ${application.jobTitle} — Time Global`,
          text: [
            `Dear ${application.name},`,
            ``,
            `Thank you for your interest in joining Time Global and for submitting your application for the ${application.jobTitle} position.`,
            ``,
            `We have successfully received your application details and resume. Our talent acquisition squad is currently reviewing candidate submissions. If your qualifications match the role requirements, we will reach out to you directly for the next interview stage.`,
            ``,
            `In the meantime, feel free to explore our work and engineering stories at https://timeglobal.com/work.`,
            ``,
            `Best regards,`,
            `Talent Acquisition Team`,
            `Time Global`,
          ].join("\n"),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #10b981; margin-top: 0;">Application Received!</h2>
              <p style="font-size: 15px; color: #333; line-height: 1.6;">Dear <strong>${application.name}</strong>,</p>
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                Thank you for your application for the <strong>${application.jobTitle}</strong> position at <strong>Time Global</strong>.
              </p>
              <div style="margin: 20px 0; padding: 16px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500;">
                  We have safely received your profile, cover letter, and resume (<em>${application.resume.filename}</em>).
                </p>
              </div>
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                Our technical hiring team is reviewing applicant profiles. If your background aligns with our current engineering needs, our team will connect with you via email or phone (${application.phone}) to schedule an initial discussion.
              </p>
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                We appreciate the time you took to share your credentials with us.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
              <p style="margin: 0; font-size: 13px; color: #333; font-weight: bold;">Talent Acquisition Team</p>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #10b981;">Time Global</p>
            </div>
          `,
        });
      } catch (err) {
        logger.error({ err }, "failed to send applicant thank-you confirmation email");
      }
    })();

    res.status(201).json({ data: { success: true, id: application._id } });
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
