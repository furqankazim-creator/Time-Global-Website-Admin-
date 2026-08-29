import { Schema, model, type Model, type Types } from "mongoose";

export const STATUSES = ["draft", "published", "scheduled", "archived"] as const;
export type Status = (typeof STATUSES)[number];

/** Reused by every publishable module (Project, Post, …). */
export const seoSchema = new Schema(
  {
    metaTitle: { type: String, default: "", trim: true, maxlength: 70 },
    metaDescription: { type: String, default: "", trim: true, maxlength: 170 },
    ogImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    canonicalUrl: { type: String, default: "", trim: true },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

export interface IService {
  title: string;
  slug: string;
  icon: string;
  image: Types.ObjectId | null;
  shortDescription: string;
  fullDescription: string;
  order: number;
  featured: boolean;
  status: Status;
  publishedAt: Date | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: Types.ObjectId | null;
    canonicalUrl: string;
    noIndex: boolean;
  };
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService, Model<IService>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "", trim: true },
    image: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    shortDescription: { type: String, default: "", trim: true, maxlength: 400 },
    /** Sanitized HTML — see lib/sanitize.ts. Never store raw client HTML. */
    fullDescription: { type: String, default: "" },

    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: STATUSES, default: "published", index: true },
    publishedAt: { type: Date, default: null },

    seo: { type: seoSchema, default: () => ({}) },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  {
    timestamps: true,
    // Mongoose's built-in optimistic concurrency: a stale update throws
    // VersionError instead of silently clobbering a colleague's edit.
    optimisticConcurrency: true,
  }
);

serviceSchema.index({ title: "text", shortDescription: "text" });
serviceSchema.index({ status: 1, order: 1 });

export const Service = model<IService>("Service", serviceSchema);
