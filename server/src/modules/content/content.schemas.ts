import { z } from "zod";
import { htmlField } from "../../lib/sanitize.js";
import { PROJECT_CATEGORIES } from "../../models/Project.js";
import { DEPARTMENTS } from "../../models/TeamMember.js";
import { APPROVAL } from "../../models/Testimonial.js";

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
export const idParamSchema = z.object({ id: objectId });

export const reorderSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int().min(0) })).min(1).max(200),
});

const status = z.enum(["draft", "published", "scheduled", "archived"]);

const seo = z
  .object({
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(170).optional(),
    ogImage: objectId.nullable().optional(),
    canonicalUrl: z.string().url().or(z.literal("")).optional(),
    noIndex: z.boolean().optional(),
  })
  .optional();

/** Empty string is a valid "cleared" URL; z.string().url() alone rejects it. */
const urlOrEmpty = z.string().url("Must be a valid URL").or(z.literal("")).optional();

/* ------------------------------ Project ------------------------------ */
export const createProjectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z.string().trim().max(200).optional(),
  client: z.string().trim().max(160).optional(),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  coverImage: objectId.nullable().optional(),
  gallery: z.array(objectId).max(50).optional(),
  problem: z.string().transform(htmlField).optional(),
  solution: z.string().transform(htmlField).optional(),
  result: z.string().transform(htmlField).optional(),
  techStack: z.array(z.string().trim().max(40)).max(40).optional(),
  // Three reads best on the card; the model tolerates more.
  metrics: z
    .array(z.object({ value: z.string().trim().max(20), label: z.string().trim().max(40) }))
    .max(6)
    .optional(),
  clientLogo: objectId.nullable().optional(),
  liveUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  status: status.optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seo,
});
export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

/* -------------------------------- Post -------------------------------- */
export const createPostSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().transform(htmlField).optional(),
  featuredImage: objectId.nullable().optional(),
  category: objectId.nullable().optional(),
  tags: z.array(objectId).max(20).optional(),
  author: objectId.nullable().optional(),
  status: status.optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seo,
});
export const updatePostSchema = createPostSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

export const taxonomySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(300).optional(),
});

/* ----------------------------- Testimonial ---------------------------- */

/** Keeps the carousel cards a consistent height. See QUOTE_LIMITS in the UI. */
export const QUOTE_MIN_WORDS = 8;
export const QUOTE_MAX_WORDS = 40;

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export const createTestimonialSchema = z.object({
  clientName: z.string().trim().min(2, "Client name is required").max(120),
  company: z.string().trim().max(120).optional(),
  position: z.string().trim().max(120).optional(),
  photo: objectId.nullable().optional(),
  companyLogo: objectId.nullable().optional(),
  quote: z
    .string()
    .trim()
    .min(4, "Quote is required")
    .max(400)
    // Word bounds, not just characters: a 6-word quote and a 300-word one
    // render as wildly different card heights in the same carousel.
    .refine((v) => countWords(v) >= QUOTE_MIN_WORDS, {
      message: `Too short — use at least ${QUOTE_MIN_WORDS} words`,
    })
    .refine((v) => countWords(v) <= QUOTE_MAX_WORDS, {
      message: `Too long — keep it under ${QUOTE_MAX_WORDS} words`,
    }),
  rating: z.number().int().min(1).max(5).optional(),
  project: objectId.nullable().optional(),
  caseStudyUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  approvalStatus: z.enum(APPROVAL).optional(),
});
export const updateTestimonialSchema = createTestimonialSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

/* ------------------------------- Team --------------------------------- */
const bioWords = (html: string) =>
  html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;

export const createTeamSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  role: z.string().trim().max(120).optional(),
  photo: objectId.nullable().optional(),
  // Rendered as a quote card on the Careers page — same word bounds as
  // testimonial quotes, so the marquee cards stay a consistent height.
  bio: z
    .string()
    .transform(htmlField)
    .refine((v) => !v.trim() || bioWords(v) >= QUOTE_MIN_WORDS, {
      message: `Too short — use at least ${QUOTE_MIN_WORDS} words (or leave blank)`,
    })
    .refine((v) => bioWords(v) <= QUOTE_MAX_WORDS, {
      message: `Too long — keep it under ${QUOTE_MAX_WORDS} words`,
    })
    .optional(),
  department: z.enum(DEPARTMENTS).optional(),
  socials: z
    .object({
      linkedin: urlOrEmpty,
      twitter: urlOrEmpty,
      github: urlOrEmpty,
      website: urlOrEmpty,
    })
    .optional(),
  order: z.number().int().min(0).optional(),
  status: z.enum(["draft", "published"]).optional(),
});
export const updateTeamSchema = createTeamSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

/* ----------------------------- Home Page ------------------------------ */
export const updateHomeSchema = z.object({
  hero: z
    .object({
      headline: z.string().trim().max(200).optional(),
      subheadline: z.string().trim().max(400).optional(),
      ctaText: z.string().trim().max(60).optional(),
      ctaUrl: z.string().trim().max(300).optional(),
      backgroundMedia: objectId.nullable().optional(),
    })
    .optional(),
  featuredServices: z.array(objectId).max(12).optional(),
  featuredProjects: z.array(objectId).max(12).optional(),
  featuredTestimonials: z.array(objectId).max(12).optional(),
  stats: z
    .array(
      z.object({
        label: z.string().trim().max(80),
        value: z.string().trim().max(20),
        suffix: z.string().trim().max(10).optional(),
      })
    )
    .max(8)
    .optional(),
});

/* -------------------------------- Story ------------------------------- */
export const createStorySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().max(200).optional(),
  type: z.enum(["success", "lesson"]).default("success"),
  tag: z.string().trim().max(100).optional(),
  desc: z.string().trim().optional(),
  impact: z.string().trim().max(200).optional(),
  challenge: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  image: objectId.nullable().optional(),
  imageUrl: z.string().trim().optional(),
  order: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  status: status.optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});
export const updateStorySchema = createStorySchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });
