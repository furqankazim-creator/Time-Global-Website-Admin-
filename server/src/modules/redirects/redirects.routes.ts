import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import { audit } from "../../lib/audit.js";
import { escapeRegex, parseSort } from "../../lib/pagination.js";
import { requireEditor } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { Redirect } from "../../models/Redirect.js";

export const redirectsRouter = Router();

const listRedirectsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default("-createdAt"),
  q: z.string().trim().max(100).optional(),
});

const createRedirectSchema = z.object({
  fromPath: z.string().trim().min(1).startsWith("/"),
  toPath: z.string().trim().min(1),
  statusCode: z.union([z.literal(301), z.literal(302), z.literal("301"), z.literal("302")]).transform(Number).pipe(z.union([z.literal(301), z.literal(302)])).default(301),
  reason: z.string().trim().max(200).default("Manual redirect"),
});

const updateRedirectSchema = z.object({
  fromPath: z.string().trim().min(1).startsWith("/").optional(),
  toPath: z.string().trim().min(1).optional(),
  statusCode: z.union([z.literal(301), z.literal(302)]).optional(),
  reason: z.string().trim().max(200).optional(),
});

redirectsRouter.get(
  "/",
  validate({ query: listRedirectsSchema }),
  asyncHandler(async (req, res) => {
    const { page, limit, sort, q } = req.query as unknown as z.infer<typeof listRedirectsSchema>;
    const filter: Record<string, unknown> = {};

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ fromPath: rx }, { toPath: rx }, { reason: rx }];
    }

    const skip = (page - 1) * limit;
    const sortObj = parseSort(sort, ["fromPath", "toPath", "hits", "createdAt", "statusCode"]);

    const [redirects, total] = await Promise.all([
      Redirect.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Redirect.countDocuments(filter),
    ]);

    res.json({
      data: redirects,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  })
);

redirectsRouter.post(
  "/",
  requireEditor,
  validate({ body: createRedirectSchema }),
  asyncHandler(async (req, res) => {
    const { fromPath, toPath, statusCode, reason } = req.body as z.infer<typeof createRedirectSchema>;

    if (fromPath === toPath) {
      throw ApiError.badRequest("Cannot redirect a path to itself");
    }

    const redirect = await Redirect.findOneAndUpdate(
      { fromPath },
      { $set: { toPath, statusCode, reason } },
      { upsert: true, new: true }
    );

    audit(req, { action: "redirect.create", model: "redirect", docId: redirect._id });
    res.status(201).json({ data: redirect });
  })
);

redirectsRouter.patch(
  "/:id",
  requireEditor,
  validate({ body: updateRedirectSchema }),
  asyncHandler(async (req, res) => {
    const redirect = await Redirect.findById(req.params.id);
    if (!redirect) throw ApiError.notFound("Redirect not found");

    const updates = req.body as z.infer<typeof updateRedirectSchema>;
    if (updates.fromPath && updates.toPath && updates.fromPath === updates.toPath) {
      throw ApiError.badRequest("Cannot redirect a path to itself");
    }

    redirect.set(updates);
    await redirect.save();

    audit(req, { action: "redirect.update", model: "redirect", docId: redirect._id });
    res.json({ data: redirect });
  })
);

redirectsRouter.delete(
  "/:id",
  requireEditor,
  asyncHandler(async (req, res) => {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);
    if (!redirect) throw ApiError.notFound("Redirect not found");

    audit(req, { action: "redirect.delete", model: "redirect", docId: redirect._id });
    res.json({ message: "Redirect deleted" });
  })
);

