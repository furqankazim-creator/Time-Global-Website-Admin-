import { z } from "zod";
import type { FilterQuery, Model } from "mongoose";

/**
 * The one list contract every module shares:
 *   ?page=1&limit=20&sort=-createdAt&q=search
 */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  // Capped at 100: an uncapped limit is a trivial DoS / memory blowup.
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default("-createdAt"),
  q: z.string().trim().max(200).optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  includeDeleted: z.coerce.boolean().default(false),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

/** Whitelist sortable fields per module — otherwise `?sort=passwordHash` probes schema. */
export function parseSort(sort: string, allowed: string[]): Record<string, 1 | -1> {
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  if (!allowed.includes(field)) return { createdAt: -1 };
  return { [field]: desc ? -1 : 1 };
}

export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export async function paginate<T>(
  model: Model<any>,
  filter: FilterQuery<any>,
  query: ListQuery,
  opts: { sortable: string[]; populate?: string | string[] } = { sortable: [] }
): Promise<Paginated<T>> {
  const { page, limit } = query;
  const skip = (page - 1) * limit;
  const sort = parseSort(query.sort, [...opts.sortable, "createdAt", "updatedAt"]);

  let q = model.find(filter).sort(sort).skip(skip).limit(limit);
  if (opts.populate) q = q.populate(opts.populate as string);

  // countDocuments must use the same filter, else meta.total lies.
  const [data, total] = await Promise.all([q.lean(), model.countDocuments(filter)]);

  return {
    data: data as T[],
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

/** Escapes user input before it reaches a $regex — otherwise `.*` is a DoS. */
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Soft-delete aware base filter. */
export const baseFilter = (includeDeleted = false) =>
  includeDeleted ? {} : { deletedAt: null };
