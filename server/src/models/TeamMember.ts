import { Schema, model, type Model, type Types } from "mongoose";

export const DEPARTMENTS = ["design", "development", "marketing", "management"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export interface ITeamMember {
  name: string;
  role: string;
  photo: Types.ObjectId | null;
  bio: string;
  department: Department;
  socials: { linkedin: string; twitter: string; github: string; website: string };
  order: number;
  status: "draft" | "published";
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember, Model<ITeamMember>>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, default: "", trim: true, maxlength: 120 },
    photo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    bio: { type: String, default: "" }, // sanitized HTML
    department: { type: String, enum: DEPARTMENTS, default: "development", index: true },
    socials: {
      linkedin: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      website: { type: String, default: "", trim: true },
    },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

teamMemberSchema.index({ name: "text", role: "text" });

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
