import type { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../../lib/ApiError.js";
import { audit } from "../../lib/audit.js";
import { baseFilter, escapeRegex, paginate, type ListQuery } from "../../lib/pagination.js";
import { storage } from "../../lib/storage.js";
import { Media } from "../../models/Media.js";

export const updateMediaSchema = z.object({
  alt: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
  folder: z.string().trim().max(80).optional(),
});

export async function list(req: Request, res: Response) {
  const query = req.query as unknown as ListQuery & { folder?: string; type?: string };
  const filter: Record<string, unknown> = { ...baseFilter(query.includeDeleted) };

  if (query.folder) filter.folder = query.folder;
  if (query.type) filter.mimeType = new RegExp(`^${escapeRegex(query.type)}`);
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ filename: rx }, { alt: rx }];
  }

  const result = await paginate(Media, filter, query, {
    sortable: ["filename", "size", "folder"],
  });
  res.json(result);
}

export async function upload(req: Request, res: Response) {
  if (!req.file) throw ApiError.badRequest("No file provided (field name must be 'file')");

  const folder = String(req.body?.folder ?? "general")
    .replace(/[^a-z0-9-_]/gi, "")
    .slice(0, 80) || "general";

  // detectType() inside save() sniffs magic numbers and throws on mismatch.
  const stored = await storage.save(req.file, folder);

  const media = await Media.create({
    ...stored,
    folder,
    alt: String(req.body?.alt ?? "").slice(0, 300),
    caption: String(req.body?.caption ?? "").slice(0, 500),
    uploadedBy: req.user!.sub,
  });

  audit(req, { action: "media.upload", model: "Media", docId: media._id });
  res.status(201).json({ data: media });
}

export async function update(req: Request, res: Response) {
  const media = await Media.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!media) throw ApiError.notFound("Media not found");

  audit(req, { action: "media.update", model: "Media", docId: media._id, diff: req.body });
  res.json({ data: media });
}

/**
 * Soft delete by default so a mis-click is recoverable. `?permanent=true`
 * also removes the blob — that one is irreversible.
 */
export async function remove(req: Request, res: Response) {
  const permanent = req.query.permanent === "true";
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound("Media not found");

  if (permanent) {
    await storage.remove(media.key);
    await media.deleteOne();
    audit(req, { action: "media.destroy", model: "Media", docId: media._id });
  } else {
    media.deletedAt = new Date();
    await media.save();
    audit(req, { action: "media.delete", model: "Media", docId: media._id });
  }
  res.status(204).end();
}
