import { Schema, model, type Model, type Types } from "mongoose";

export interface IMedia {
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  /** Required for a11y — an image with no alt text is invisible to screen readers. */
  alt: string;
  caption: string;
  folder: string;
  uploadedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia, Model<IMedia>>(
  {
    key: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true, index: true },
    size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    alt: { type: String, default: "", trim: true, maxlength: 300 },
    caption: { type: String, default: "", trim: true, maxlength: 500 },
    folder: { type: String, default: "general", index: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

mediaSchema.index({ filename: "text", alt: "text" });

export const Media = model<IMedia>("Media", mediaSchema);
