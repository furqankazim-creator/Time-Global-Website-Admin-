import { Schema, model, type Model, type Types } from "mongoose";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** GDPR: leads are personal data. Default retention window. */
export const RETENTION_DAYS = 730; // 2 years

export interface ILead {
  name: string;
  email: string;
  phone: string;
  company: string;
  /** Free text from the form's Industry dropdown. */
  industry: string;
  /** One of the fixed budget bands, or "" if the visitor skipped it. */
  budgetRange: string;
  /** Email | Phone | WhatsApp | SMS — how the visitor wants to be reached. */
  preferredContact: string;
  message: string;
  sourcePage: string;
  ipAddress: string | null;
  status: LeadStatus;
  notes: { body: string; author: Types.ObjectId | null; createdAt: Date }[];
  consentGivenAt: Date | null;
  retentionExpiresAt: Date;
  /** Set when PII is erased on request; the row stays for reporting counts. */
  anonymizedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead, Model<ILead>>(
  {
    // All plain text — a contact form has no need for markup, so there is
    // no HTML to sanitize and no XSS surface.
    name: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200, index: true },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    company: { type: String, default: "", trim: true, maxlength: 160 },
    industry: { type: String, default: "", trim: true, maxlength: 120 },
    budgetRange: { type: String, default: "", trim: true, maxlength: 60 },
    preferredContact: { type: String, default: "", trim: true, maxlength: 20 },
    message: { type: String, default: "", trim: true, maxlength: 5000 },
    sourcePage: { type: String, default: "", trim: true, maxlength: 300 },
    ipAddress: { type: String, default: null },

    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    notes: [
      {
        _id: false,
        body: { type: String, required: true, maxlength: 2000 },
        author: { type: Schema.Types.ObjectId, ref: "User", default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    consentGivenAt: { type: Date, default: null },
    retentionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + RETENTION_DAYS * 86400_000),
      index: true,
    },
    anonymizedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text", company: "text" });
leadSchema.index({ createdAt: -1 });

export const Lead = model<ILead>("Lead", leadSchema);
