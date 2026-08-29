import { Schema, model, type Model, type Types } from "mongoose";

export const JOB_TYPES = ["full-time", "part-time", "contract", "internship"] as const;
export const JOB_DEPARTMENTS = ["design", "development", "marketing", "management"] as const;

export interface IJob {
  title: string;
  slug: string;
  department: (typeof JOB_DEPARTMENTS)[number];
  location: string;
  type: (typeof JOB_TYPES)[number];
  description: string;
  applyEmail: string;
  status: "draft" | "published" | "scheduled" | "archived";
  publishedAt: Date | null;
  closesAt: Date | null;
  order: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob, Model<IJob>>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true },
    department: { type: String, enum: JOB_DEPARTMENTS, default: "development", index: true },
    location: { type: String, default: "Remote", trim: true, maxlength: 120 },
    type: { type: String, enum: JOB_TYPES, default: "full-time", index: true },
    description: { type: String, default: "" }, // sanitized HTML
    applyEmail: { type: String, default: "", trim: true },

    status: { type: String, enum: ["draft", "published", "scheduled", "archived"], default: "published", index: true },
    publishedAt: { type: Date, default: null },
    /** A posting past its close date drops off the public list automatically. */
    closesAt: { type: Date, default: null, index: true },
    order: { type: Number, default: 0, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

jobSchema.index({ title: "text", location: "text" });

export const Job = model<IJob>("Job", jobSchema);
