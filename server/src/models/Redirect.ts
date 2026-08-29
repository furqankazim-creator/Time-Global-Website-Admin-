import { Schema, model, type Model } from "mongoose";

export interface IRedirect {
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  reason: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}

const redirectSchema = new Schema<IRedirect, Model<IRedirect>>(
  {
    fromPath: { type: String, required: true, unique: true, trim: true },
    toPath: { type: String, required: true, trim: true },
    // 301 by default: a permanent redirect is what transfers search ranking.
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    reason: { type: String, default: "", maxlength: 200 },
    hits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Redirect = model<IRedirect>("Redirect", redirectSchema);

/**
 * Records that `fromPath` should now serve `toPath`.
 *
 * Called whenever a published document's slug changes. Without this, every
 * inbound link and search result pointing at the old URL 404s — which quietly
 * destroys the page's accumulated ranking.
 */
export async function recordSlugChange(
  prefix: string,
  oldSlug: string,
  newSlug: string,
  reason = "slug changed"
) {
  if (!oldSlug || oldSlug === newSlug) return;

  const fromPath = `/${prefix}/${oldSlug}`;
  const toPath = `/${prefix}/${newSlug}`;

  // Repoint any existing chain (A→B, then B→C) straight at the final target.
  // Chained redirects leak ranking and can loop.
  await Redirect.updateMany({ toPath: fromPath }, { $set: { toPath } });

  await Redirect.findOneAndUpdate(
    { fromPath },
    { $set: { toPath, statusCode: 301, reason } },
    { upsert: true }
  );

  // A slug that returns to a previous value would otherwise redirect to itself.
  await Redirect.deleteOne({ fromPath: toPath });
}
