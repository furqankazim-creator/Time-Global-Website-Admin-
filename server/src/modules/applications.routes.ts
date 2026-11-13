import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { crudFactory } from "../lib/crudFactory.js";
import { listQuerySchema } from "../lib/pagination.js";
import { requireEditor } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { JobApplication, APPLICATION_STATUSES } from "../models/JobApplication.js";
import { idParamSchema } from "./content/content.schemas.js";

const updateApplicationSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z
    .array(
      z.object({
        body: z.string().trim().max(2000),
        author: z.string().nullable().optional(),
        createdAt: z.coerce.date().optional(),
      })
    )
    .optional(),
});

const ctrl = crudFactory({
  name: "job_application",
  model: JobApplication,
  // Résumé contents are fetched only when opening a candidate's profile.
  listSelect: "-resume.dataUrl",
  sortable: ["name", "email", "jobTitle", "createdAt", "status"],
  searchable: ["name", "email", "jobTitle", "fatherName", "education"],
  filters: (q) => ({
    ...(q.status ? { status: q.status } : {}),
    ...(q.jobTitle ? { jobTitle: q.jobTitle } : {}),
  }),
});

export const applicationsRouter = Router();

applicationsRouter.get(
  "/",
  validate({
    query: listQuerySchema.extend({
      status: z.enum(APPLICATION_STATUSES).optional(),
      jobTitle: z.string().optional(),
    }),
  }),
  asyncHandler(ctrl.list)
);

applicationsRouter.get("/:id", validate({ params: idParamSchema }), asyncHandler(ctrl.getOne));
applicationsRouter.patch(
  "/:id",
  requireEditor,
  validate({ params: idParamSchema, body: updateApplicationSchema }),
  asyncHandler(ctrl.update)
);
applicationsRouter.delete("/:id", requireEditor, validate({ params: idParamSchema }), asyncHandler(ctrl.remove));
applicationsRouter.post("/:id/restore", requireEditor, validate({ params: idParamSchema }), asyncHandler(ctrl.restore));
