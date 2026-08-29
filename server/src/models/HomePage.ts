import { Schema, model, type Model, type Types } from "mongoose";

export interface IHomePage {
  /** Singleton discriminator — unique index makes a second doc impossible. */
  key: "home";
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl: string;
    backgroundMedia: Types.ObjectId | null;
  };
  featuredServices: Types.ObjectId[];
  featuredProjects: Types.ObjectId[];
  featuredTestimonials: Types.ObjectId[];
  stats: { label: string; value: string; suffix: string }[];
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const homePageSchema = new Schema<IHomePage, Model<IHomePage>>(
  {
    key: { type: String, default: "home", unique: true, immutable: true },
    hero: {
      headline: { type: String, default: "", trim: true, maxlength: 200 },
      subheadline: { type: String, default: "", trim: true, maxlength: 400 },
      ctaText: { type: String, default: "", trim: true, maxlength: 60 },
      ctaUrl: { type: String, default: "", trim: true, maxlength: 300 },
      backgroundMedia: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    },
    // Order of these arrays IS the display order — drag-drop just reorders them.
    featuredServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    featuredProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    featuredTestimonials: [{ type: Schema.Types.ObjectId, ref: "Testimonial" }],
    stats: [
      {
        _id: false,
        label: { type: String, default: "", trim: true, maxlength: 80 },
        value: { type: String, default: "", trim: true, maxlength: 20 },
        suffix: { type: String, default: "", trim: true, maxlength: 10 },
      },
    ],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const HomePage = model<IHomePage>("HomePage", homePageSchema);

/** Upsert-on-read so the editor never 404s on a fresh install. */
export async function getHomePage() {
  return HomePage.findOneAndUpdate(
    { key: "home" },
    { $setOnInsert: { key: "home" } },
    { new: true, upsert: true }
  );
}
