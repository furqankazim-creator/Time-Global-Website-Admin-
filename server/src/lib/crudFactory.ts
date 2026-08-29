import type { Request, Response } from "express";
import type { Model } from "mongoose";
import { ApiError } from "./ApiError.js";
import { audit } from "./audit.js";
import { baseFilter, escapeRegex, paginate, type ListQuery } from "./pagination.js";
import { recordSlugChange } from "../models/Redirect.js";
import { uniqueSlug } from "./slug.js";

type Config = {
  /** Used for audit action names: `<name>.create` etc. */
  name: string;
  model: Model<any>;
  sortable: string[];
  /** Fields matched by `?q=` (regex, escaped). */
  searchable: string[];
  populate?: string;
  /** Omit for models without slugs (e.g. Testimonial, TeamMember). */
  slugFrom?: string;
  /**
   * Public URL prefix, e.g. "work" → /work/:slug. When set, a slug change on
   * a published doc records a 301 so inbound links keep working.
   */
  urlPrefix?: string;
  /** Extra `?key=value` filters, mapped to a Mongo filter fragment. */
  filters?: (query: Record<string, unknown>) => Record<string, unknown>;
};

/**
 * The CRUD pattern proven by Services, extracted once. Every module gets
 * identical soft-delete, slug, pagination, audit and concurrency behaviour —
 * so a fix here fixes all of them, rather than five copies drifting apart.
 */
export function crudFactory(cfg: Config) {
  const { name, model, sortable, searchable, populate, slugFrom, urlPrefix, filters } = cfg;

  const list = async (req: Request, res: Response) => {
    const query = req.query as unknown as ListQuery;
    const filter: Record<string, unknown> = {
      ...baseFilter(query.includeDeleted),
      ...(filters?.(req.query as Record<string, unknown>) ?? {}),
    };

    if (query.status) filter.status = query.status;
    if (query.q && searchable.length) {
      const rx = new RegExp(escapeRegex(query.q), "i");
      filter.$or = searchable.map((f) => ({ [f]: rx }));
    }

    res.json(await paginate(model, filter, query, { sortable, populate }));
  };

  const getOne = async (req: Request, res: Response) => {
    let q = model.findOne({ _id: req.params.id, deletedAt: null });
    if (populate) q = q.populate(populate);
    const doc = await q;
    if (!doc) throw ApiError.notFound(`${name} not found`);
    res.json({ data: doc });
  };

  const create = async (req: Request, res: Response) => {
    const body = { ...req.body };

    if (slugFrom) {
      body.slug = await uniqueSlug(model, body.slug || body[slugFrom]);
    }
    if (body.status === "published" && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const doc = await model.create({
      ...body,
      createdBy: req.user!.sub,
      updatedBy: req.user!.sub,
    });

    audit(req, { action: `${name}.create`, model: name, docId: doc._id });
    res.status(201).json({ data: doc });
  };

  const update = async (req: Request, res: Response) => {
    const doc = await model.findOne({ _id: req.params.id, deletedAt: null });
    if (!doc) throw ApiError.notFound(`${name} not found`);

    const body = { ...req.body };

    // Re-slug only on an explicit slug change — never on a title edit, which
    // would silently break the live URL.
    const previousSlug: string | undefined = doc.slug;
    const wasPublished = doc.status === "published";
    if (slugFrom && body.slug && body.slug !== doc.slug) {
      body.slug = await uniqueSlug(model, body.slug, doc.id);
    }
    if (body.status === "published" && !doc.publishedAt && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    doc.set({ ...body, updatedBy: req.user!.sub });
    await doc.save(); // optimisticConcurrency → VersionError on stale write

    // Only for content that was already live — a draft has no inbound links
    // or search ranking to preserve.
    if (urlPrefix && wasPublished && previousSlug && previousSlug !== doc.slug) {
      await recordSlugChange(urlPrefix, previousSlug, doc.slug, `${name} slug changed`);
    }

    audit(req, { action: `${name}.update`, model: name, docId: doc._id, diff: body });
    res.json({ data: doc });
  };

  const remove = async (req: Request, res: Response) => {
    const doc = await model.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date(), updatedBy: req.user!.sub } },
      { new: true }
    );
    if (!doc) throw ApiError.notFound(`${name} not found`);

    audit(req, { action: `${name}.delete`, model: name, docId: doc._id });
    res.status(204).end();
  };

  const restore = async (req: Request, res: Response) => {
    const doc = await model.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null, updatedBy: req.user!.sub } },
      { new: true }
    );
    if (!doc) throw ApiError.notFound(`No deleted ${name} with that id`);

    audit(req, { action: `${name}.restore`, model: name, docId: doc._id });
    res.json({ data: doc });
  };

  const reorder = async (req: Request, res: Response) => {
    const { items } = req.body as { items: { id: string; order: number }[] };
    await model.bulkWrite(
      items.map((i) => ({
        updateOne: { filter: { _id: i.id, deletedAt: null }, update: { $set: { order: i.order } } },
      }))
    );
    audit(req, { action: `${name}.reorder`, model: name, diff: { count: items.length } });
    res.json({ data: { updated: items.length } });
  };

  return { list, getOne, create, update, remove, restore, reorder };
}
