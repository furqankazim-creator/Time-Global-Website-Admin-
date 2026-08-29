import { Schema, model, type Model, type Types } from "mongoose";

export const APPROVAL = ["pending", "approved", "rejected"] as const;
export type Approval = (typeof APPROVAL)[number];

export interface ITestimonial {
  clientName: string;
  company: string;
  position: string;
  photo: Types.ObjectId | null;
  companyLogo: Types.ObjectId | null;
  quote: string;
  rating: number;
  project: Types.ObjectId | null;
  caseStudyUrl: string;
  featured: boolean;
  order: number;
  /** Form-submitted testimonials land as `pending` and must be approved. */
  approvalStatus: Approval;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial, Model<ITestimonial>>(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: "", trim: true, maxlength: 120 },
    position: { type: String, default: "", trim: true, maxlength: 120 },
    photo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    companyLogo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    // Plain text, not HTML — a quote has no need for markup, so we avoid the
    // XSS surface entirely rather than sanitizing it.
    quote: { type: String, required: true, trim: true, maxlength: 400 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    project: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    caseStudyUrl: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    approvalStatus: { type: String, enum: APPROVAL, default: "approved", index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

testimonialSchema.index({ clientName: "text", company: "text", quote: "text" });

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
