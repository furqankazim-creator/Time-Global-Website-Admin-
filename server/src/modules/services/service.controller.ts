import type { Request, Response } from "express";
import { ApiError } from "../../lib/ApiError.js";
import { audit } from "../../lib/audit.js";
import { baseFilter, escapeRegex, paginate, type ListQuery } from "../../lib/pagination.js";
import { uniqueSlug } from "../../lib/slug.js";
import { Service } from "../../models/Service.js";

const SORTABLE = ["title", "order", "status", "publishedAt"];
const POPULATE = "image seo.ogImage";

export async function list(req: Request, res: Response) {
  const query = req.query as unknown as ListQuery & { featured?: string };
  const filter: Record<string, unknown> = { ...baseFilter(query.includeDeleted) };

  if (query.status) filter.status = query.status;
  if (query.featured !== undefined) filter.featured = query.featured === "true";
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ title: rx }, { shortDescription: rx }];
  }

  res.json(await paginate(Service, filter, query, { sortable: SORTABLE, populate: POPULATE }));
}

export async function getOne(req: Request, res: Response) {
  const doc = await Service.findOne({ _id: req.params.id, deletedAt: null }).populate(POPULATE);
  if (!doc) throw ApiError.notFound("Service not found");
  res.json({ data: doc });
}

export async function create(req: Request, res: Response) {
  const body = req.body;
  const slug = await uniqueSlug(Service, body.slug || body.title);

  // Publishing without an explicit date should still stamp one.
  const publishedAt =
    body.status === "published" && !body.publishedAt ? new Date() : body.publishedAt ?? null;

  const doc = await Service.create({
    ...body,
    slug,
    publishedAt,
    createdBy: req.user!.sub,
    updatedBy: req.user!.sub,
  });

  audit(req, { action: "service.create", model: "Service", docId: doc._id });
  res.status(201).json({ data: doc });
}

export async function update(req: Request, res: Response) {
  const doc = await Service.findOne({ _id: req.params.id, deletedAt: null });
  if (!doc) throw ApiError.notFound("Service not found");

  const body = req.body;

  // Re-slug only on explicit slug change — NOT on title change, which would
  // silently break the live URL. (Phase 6 adds a redirect on deliberate change.)
  if (body.slug && body.slug !== doc.slug) {
    body.slug = await uniqueSlug(Service, body.slug, doc.id);
  }

  if (body.status === "published" && !doc.publishedAt && !body.publishedAt) {
    body.publishedAt = new Date();
  }

  doc.set({ ...body, updatedBy: req.user!.sub });
  await doc.save(); // optimisticConcurrency → VersionError on a stale write

  audit(req, { action: "service.update", model: "Service", docId: doc._id, diff: body });
  res.json({ data: doc });
}

/** Soft delete → recoverable from Trash. */
export async function remove(req: Request, res: Response) {
  const doc = await Service.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { deletedAt: new Date(), updatedBy: req.user!.sub } },
    { new: true }
  );
  if (!doc) throw ApiError.notFound("Service not found");

  audit(req, { action: "service.delete", model: "Service", docId: doc._id });
  res.status(204).end();
}

export async function restore(req: Request, res: Response) {
  const doc = await Service.findOneAndUpdate(
    { _id: req.params.id, deletedAt: { $ne: null } },
    { $set: { deletedAt: null, updatedBy: req.user!.sub } },
    { new: true }
  );
  if (!doc) throw ApiError.notFound("No deleted service with that id");

  audit(req, { action: "service.restore", model: "Service", docId: doc._id });
  res.json({ data: doc });
}

/** Drag-and-drop reorder — one round trip, not N. */
export async function reorder(req: Request, res: Response) {
  const { items } = req.body as { items: { id: string; order: number }[] };

  await Service.bulkWrite(
    items.map((i) => ({
      updateOne: { filter: { _id: i.id, deletedAt: null }, update: { $set: { order: i.order } } },
    }))
  );

  audit(req, { action: "service.reorder", model: "Service", diff: { count: items.length } });
  res.json({ data: { updated: items.length } });
}
