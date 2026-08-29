import type { Model } from "mongoose";

/** URL-safe slug. Handles accents (Crédit → credit) since we serve EU clients. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slug unique within a collection, appending -2, -3… on collision.
 * `excludeId` lets a document keep its own slug when updating.
 */
export async function uniqueSlug(
  model: Model<any>,
  desired: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(desired) || "item";
  let candidate = base;
  let n = 1;

  // Bounded: a runaway loop here would hang the request.
  while (n < 100) {
    const clash = await model.exists({
      slug: candidate,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });
    if (!clash) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}
