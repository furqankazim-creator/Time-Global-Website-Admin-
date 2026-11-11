import { Schema, model, type Model, type Types } from "mongoose";

export const APPLICATION_STATUSES = ["new", "reviewed", "shortlisted", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface IJobApplication {
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  education: string;
  jobTitle: string;
  jobSlug: string;
  experience: string;
  coverLetter: string;
  portfolioUrl: string;
  resume: {
    filename: string;
    size: number;
    mimeType: string;
    dataUrl?: string;
  };
  status: ApplicationStatus;
  notes: { body: string; author: Types.ObjectId | null; createdAt: Date }[];
  ipAddress: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication, Model<IJobApplication>>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    fatherName: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    education: { type: String, required: true, trim: true, maxlength: 200 },
    jobTitle: { type: String, required: true, trim: true, maxlength: 200, index: true },
    jobSlug: { type: String, default: "", trim: true, maxlength: 200 },
    experience: { type: String, required: true, trim: true, maxlength: 3000 },
    coverLetter: { type: String, default: "", trim: true, maxlength: 5000 },
    portfolioUrl: { type: String, default: "", trim: true, maxlength: 300 },
    resume: {
      filename: { type: String, required: true },
      size: { type: Number, required: true },
      mimeType: { type: String, default: "application/pdf" },
      dataUrl: { type: String, default: "" },
    },
    status: { type: String, enum: APPLICATION_STATUSES, default: "new", index: true },
    notes: [
      {
        _id: false,
        body: { type: String, required: true, maxlength: 2000 },
        author: { type: Schema.Types.ObjectId, ref: "User", default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: { type: String, default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ name: "text", email: "text", jobTitle: "text", education: "text" });

export const JobApplication = model<IJobApplication>("JobApplication", jobApplicationSchema);
