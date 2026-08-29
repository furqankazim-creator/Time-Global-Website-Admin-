import { Schema, model, type Model, type Types } from "mongoose";
import { STATUSES, seoSchema, type Status } from "./Service.js";

/** Shared shape for Category and Tag. */
export interface ITaxonomy {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaxonomyModel = Model<ITaxonomy>;

const taxonomyFields = {
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "", maxlength: 300 },
} as const;

// Separate Schema instances, not clone() — a cloned schema loses its generics
// and a shared one would collide on the unique slug index across collections.
export const Category = model<ITaxonomy>(
  "Category",
  new Schema<ITaxonomy, TaxonomyModel>({ ...taxonomyFields }, { timestamps: true })
);

export const Tag = model<ITaxonomy>(
  "Tag",
  new Schema<ITaxonomy, TaxonomyModel>({ ...taxonomyFields }, { timestamps: true })
);

export interface IPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: Types.ObjectId | null;
  category: Types.ObjectId | null;
  tags: Types.ObjectId[];
  author: Types.ObjectId | null;
  status: Status;
  publishedAt: Date | null;
  readingTime: number;
  seo: Record<string, unknown>;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost, Model<IPost>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "", trim: true, maxlength: 400 },
    content: { type: String, default: "" }, // sanitized HTML
    featuredImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },

    status: { type: String, enum: STATUSES, default: "published", index: true },
    /** For status=scheduled this is a future date; the public API filters on it. */
    publishedAt: { type: Date, default: null, index: true },
    readingTime: { type: Number, default: 0 },

    seo: { type: seoSchema, default: () => ({}) },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

/**
 * Compute reading time from the body when the editor leaves it at 0.
 * Cards showing "0 min read" is the visible symptom; ~200 wpm is the
 * usual convention, and stripping tags keeps markup out of the count.
 */
postSchema.pre("save", function (next) {
  if (!this.readingTime && this.content) {
    const words = this.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

postSchema.index({ title: "text", excerpt: "text" });
postSchema.index({ status: 1, publishedAt: -1 });

export const Post = model<IPost>("Post", postSchema);
