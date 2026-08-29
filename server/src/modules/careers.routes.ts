import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { crudFactory } from "../lib/crudFactory.js";
import { listQuerySchema } from "../lib/pagination.js";
import { htmlField } from "../lib/sanitize.js";
import { requireEditor } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { Job, JOB_DEPARTMENTS, JOB_TYPES } from "../models/Job.js";
import { Notification } from "../models/Notification.js";
import { idParamSchema, reorderSchema } from "./content/content.schemas.js";

/* ------------------------------- Jobs -------------------------------- */

const createJobSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z.string().trim().max(160).optional(),
  department: z.enum(JOB_DEPARTMENTS).optional(),
  location: z.string().trim().max(120).optional(),
  type: z.enum(JOB_TYPES).optional(),
  description: z.string().transform(htmlField).optional(),
  applyEmail: z.string().email().or(z.literal("")).optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  closesAt: z.coerce.date().nullable().optional(),
  order: z.number().int().min(0).optional(),
});
const updateJobSchema = createJobSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const ctrl = crudFactory({
  name: "job",
  model: Job,
  slugFrom: "title",
  urlPrefix: "careers",
  sortable: ["title", "department", "type", "order", "publishedAt", "closesAt"],
  searchable: ["title", "location"],
  filters: (q) => ({
    ...(q.department ? { department: q.department } : {}),
    ...(q.type ? { type: q.type } : {}),
  }),
});

export const jobsRouter = Router();
jobsRouter.get(
  "/",
  validate({
    query: listQuerySchema.extend({
      department: z.enum(JOB_DEPARTMENTS).optional(),
      type: z.enum(JOB_TYPES).optional(),
    }),
  }),
  asyncHandler(ctrl.list)
);
jobsRouter.patch("/reorder", requireEditor, validate({ body: reorderSchema }), asyncHandler(ctrl.reorder));
jobsRouter.get("/:id", validate({ params: idParamSchema }), asyncHandler(ctrl.getOne));
jobsRouter.post("/", requireEditor, validate({ body: createJobSchema }), asyncHandler(ctrl.create));
jobsRouter.patch("/:id", requireEditor, validate({ params: idParamSchema, body: updateJobSchema }), asyncHandler(ctrl.update));
jobsRouter.delete("/:id", requireEditor, validate({ params: idParamSchema }), asyncHandler(ctrl.remove));
jobsRouter.post("/:id/restore", requireEditor, validate({ params: idParamSchema }), asyncHandler(ctrl.restore));

/* --------------------------- Notifications ---------------------------- */

export const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const unreadOnly = req.query.unread === "true";
    const filter = unreadOnly ? { readAt: null } : {};
    const [data, unread] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
      Notification.countDocuments({ readAt: null }),
    ]);
    res.json({ data, meta: { unread } });
  })
);

notificationsRouter.post(
  "/read-all",
  asyncHandler(async (_req, res) => {
    await Notification.updateMany({ readAt: null }, { $set: { readAt: new Date() } });
    res.json({ data: { ok: true } });
  })
);

notificationsRouter.post(
  "/:id/read",
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await Notification.updateOne({ _id: req.params.id }, { $set: { readAt: new Date() } });
    res.json({ data: { ok: true } });
  })
);
