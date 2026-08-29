import { Router } from "express";
import { z } from "zod";
import { ApiError } from "../../lib/ApiError.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { audit } from "../../lib/audit.js";
import { escapeRegex, listQuerySchema, paginate, type ListQuery } from "../../lib/pagination.js";
import { requireEditor } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { Lead, LEAD_STATUSES } from "../../models/Lead.js";

export const leadsRouter = Router();

const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id") });

const listSchema = listQuerySchema
  .omit({ status: true })
  .extend({ status: z.enum(LEAD_STATUSES).optional() });

/* -------------------------------- List -------------------------------- */
leadsRouter.get(
  "/",
  validate({ query: listSchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as ListQuery;
    const filter: Record<string, unknown> = { deletedAt: null };
    if (query.status) filter.status = query.status;
    if (query.q) {
      const rx = new RegExp(escapeRegex(query.q), "i");
      filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
    }
    res.json(
      await paginate(Lead, filter, query, { sortable: ["name", "email", "status", "createdAt"] })
    );
  })
);

/* ------------------------------ CSV export ---------------------------- */
/** Registered before "/:id" so "export.csv" isn't parsed as an id. */
leadsRouter.get(
  "/export.csv",
  asyncHandler(async (req, res) => {
    const leads = await Lead.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5000).lean();

    const cols = ["createdAt", "name", "email", "phone", "company", "status", "sourcePage", "message"];

    /**
     * A field starting with = + - @ is executed as a formula by Excel/Sheets.
     * Since these values come from a public form, that's CSV injection —
     * prefix with a quote to neutralise it.
     */
    const cell = (v: unknown) => {
      let s = v == null ? "" : String(v);
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const csv = [
      cols.join(","),
      ...leads.map((l) => cols.map((c) => cell((l as Record<string, unknown>)[c])).join(",")),
    ].join("\r\n");

    audit(req, { action: "lead.export", model: "Lead", diff: { count: leads.length } });
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename="leads-${Date.now()}.csv"`);
    res.send("﻿" + csv); // BOM so Excel reads UTF-8 correctly
  })
);

/* ------------------------------- Get one ------------------------------ */
leadsRouter.get(
  "/:id",
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const lead = await Lead.findOne({ _id: req.params.id, deletedAt: null }).populate(
      "notes.author",
      "name email"
    );
    if (!lead) throw ApiError.notFound("Lead not found");
    res.json({ data: lead });
  })
);

/* ------------------------------- Status ------------------------------- */
leadsRouter.patch(
  "/:id",
  requireEditor,
  validate({ params: idParam, body: z.object({ status: z.enum(LEAD_STATUSES) }) }),
  asyncHandler(async (req, res) => {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!lead) throw ApiError.notFound("Lead not found");
    audit(req, { action: "lead.status", model: "Lead", docId: lead._id, diff: req.body });
    res.json({ data: lead });
  })
);

/* -------------------------------- Notes ------------------------------- */
leadsRouter.post(
  "/:id/notes",
  requireEditor,
  validate({ params: idParam, body: z.object({ body: z.string().trim().min(1).max(2000) }) }),
  asyncHandler(async (req, res) => {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $push: { notes: { body: req.body.body, author: req.user!.sub, createdAt: new Date() } } },
      { new: true }
    ).populate("notes.author", "name email");
    if (!lead) throw ApiError.notFound("Lead not found");
    audit(req, { action: "lead.note", model: "Lead", docId: lead._id });
    res.status(201).json({ data: lead });
  })
);

/* ------------------------------- Delete ------------------------------- */
leadsRouter.delete(
  "/:id",
  requireEditor,
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!lead) throw ApiError.notFound("Lead not found");
    audit(req, { action: "lead.delete", model: "Lead", docId: lead._id });
    res.status(204).end();
  })
);

/* ---------------------------- GDPR erasure ---------------------------- */
/**
 * Right to erasure. Scrubs PII in place but keeps the row, so historical
 * counts stay accurate. Irreversible by design — that's the point.
 */
leadsRouter.delete(
  "/:id/pii",
  requireEditor,
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: "[erased]",
          email: `erased-${req.params.id}@example.invalid`, // keeps the unique-ish shape
          phone: "",
          company: "",
          message: "[erased at data subject request]",
          ipAddress: null,
          notes: [],
          anonymizedAt: new Date(),
        },
      },
      { new: true }
    );
    if (!lead) throw ApiError.notFound("Lead not found");
    audit(req, { action: "lead.erasePii", model: "Lead", docId: lead._id });
    res.json({ data: lead });
  })
);
