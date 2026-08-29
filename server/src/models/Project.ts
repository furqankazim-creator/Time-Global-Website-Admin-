import { Schema, model, type Model, type Types } from "mongoose";
import { STATUSES, seoSchema, type Status } from "./Service.js";

export const PROJECT_CATEGORIES = ["web", "mobile", "custom-software", "ecommerce"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface IProject {
  title: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  coverImage: Types.ObjectId | null;
  gallery: Types.ObjectId[];
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  /** Headline outcomes shown on the case-study card, e.g. 42% / Cost Reduction. */
  metrics: { value: string; label: string }[];
  clientLogo: Types.ObjectId | null;
  liveUrl: string;
  featured: boolean;
  order: number;
  status: Status;
  publishedAt: Date | null;
  seo: Record<string, unknown>;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject, Model<IProject>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    client: { type: String, default: "", trim: true, maxlength: 160 },
    category: { type: String, enum: PROJECT_CATEGORIES, default: "web", index: true },

    coverImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    gallery: [{ type: Schema.Types.ObjectId, ref: "Media" }],

    // Sanitized HTML (Problem → Solution → Result write-up)
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    result: { type: String, default: "" },

    techStack: [{ type: String, trim: true, maxlength: 40 }],
    metrics: [
      {
        _id: false,
        value: { type: String, required: true, trim: true, maxlength: 20 },
        label: { type: String, required: true, trim: true, maxlength: 40 },
      },
    ],
    clientLogo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    liveUrl: { type: String, default: "", trim: true },

    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: STATUSES, default: "published", index: true },
    publishedAt: { type: Date, default: null },
    seo: { type: seoSchema, default: () => ({}) },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

projectSchema.index({ title: "text", client: "text" });

export const Project = model<IProject>("Project", projectSchema);
