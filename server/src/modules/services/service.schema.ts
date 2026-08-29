import { z } from "zod";
import { htmlField } from "../../lib/sanitize.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const seo = z
  .object({
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(170).optional(),
    ogImage: objectId.nullable().optional(),
    canonicalUrl: z.string().url().or(z.literal("")).optional(),
    noIndex: z.boolean().optional(),
  })
  .optional();

export const createServiceSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  // Optional: derived from title when omitted.
  slug: z.string().trim().max(160).optional(),
  icon: z.string().trim().max(80).optional(),
  image: objectId.nullable().optional(),
  shortDescription: z.string().trim().max(400).optional(),
  // Sanitized at the edge — nothing downstream ever sees raw client HTML.
  fullDescription: z.string().transform(htmlField).optional(),
  order: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seo,
});

/** Every field optional, but reject `{}` so a no-op PATCH is a clear 400. */
export const updateServiceSchema = createServiceSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

export const reorderSchema = z.object({
  items: z
    .array(z.object({ id: objectId, order: z.number().int().min(0) }))
    .min(1)
    .max(200),
});

export const idParamSchema = z.object({ id: objectId });
