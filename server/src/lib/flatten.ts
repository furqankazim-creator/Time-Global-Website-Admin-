/**
 * Flattens nested objects into Mongo dot-notation paths:
 *   { smtp: { host: "x" } }  →  { "smtp.host": "x" }
 *
 * Why this exists: `$set: { smtp: {...} }` REPLACES the whole subdocument, so
 * any field absent from the payload is silently reset to its default. That
 * quietly wiped the stored SMTP password whenever another SMTP field was
 * saved. Dot paths update only the keys actually provided.
 *
 * Arrays are set wholesale — for menus and lists, replacement is the intent.
 */
export function flattenForSet(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;

    const isPlainObject =
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      !(v instanceof Date) &&
      Object.getPrototypeOf(v) === Object.prototype;

    if (isPlainObject) {
      Object.assign(out, flattenForSet(v as Record<string, unknown>, path));
    } else {
      out[path] = v;
    }
  }

  return out;
}
