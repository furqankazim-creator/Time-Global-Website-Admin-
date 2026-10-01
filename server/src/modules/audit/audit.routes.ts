import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { escapeRegex, parseSort } from "../../lib/pagination.js";
import { requireAdmin } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { AuditLog } from "../../models/AuditLog.js";

export const auditLogsRouter = Router();

const listAuditLogsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  sort: z.string().default("-createdAt"),
  q: z.string().trim().max(100).optional(),
  model: z.string().trim().optional(),
  action: z.string().trim().optional(),
  success: z.coerce.boolean().optional(),
});

auditLogsRouter.get(
  "/",
  requireAdmin,
  validate({ query: listAuditLogsSchema }),
  asyncHandler(async (req, res) => {
    const { page, limit, sort, q, model, action, success } = req.query as unknown as z.infer<
      typeof listAuditLogsSchema
    >;
    const filter: Record<string, unknown> = {};

    if (model) filter.model = model;
    if (action) filter.action = action;
    if (typeof success === "boolean") filter.success = success;

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ action: rx }, { actorEmail: rx }, { model: rx }, { ip: rx }];
    }

    const skip = (page - 1) * limit;
    const sortObj = parseSort(sort, ["createdAt", "action", "model", "actorEmail"]);

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("actor", "name email")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      data: logs,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  })
);

