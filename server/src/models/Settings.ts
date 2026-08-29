import { Schema, model, type Model, type Types } from "mongoose";

export interface IMenuItem {
  label: string;
  url: string;
  order: number;
  children: { label: string; url: string; order: number }[];
}

export interface ISettings {
  key: "site";
  siteName: string;
  siteUrl: string;
  logo: Types.ObjectId | null;
  favicon: Types.ObjectId | null;
  contact: { email: string; phone: string; address: string };
  socials: { linkedin: string; twitter: string; facebook: string; instagram: string; youtube: string };
  headerMenu: IMenuItem[];
  footerMenu: IMenuItem[];
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    /** Write-only: never returned by the API. See settings.routes.ts. */
    password: string;
    fromName: string;
    fromEmail: string;
    notifyOnLead: boolean;
    notifyTo: string;
  };
  maintenanceMode: boolean;
  defaultSeo: { metaTitle: string; metaDescription: string; ogImage: Types.ObjectId | null };
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

/** One level of nesting — matches the header/footer menu builder UI. */
const childItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    url: { type: String, required: true, trim: true, maxlength: 300 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const menuItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    url: { type: String, required: true, trim: true, maxlength: 300 },
    order: { type: Number, default: 0 },
    children: { type: [childItemSchema], default: [] },
  },
  { _id: false }
);

const settingsSchema = new Schema<ISettings, Model<ISettings>>(
  {
    key: { type: String, default: "site", unique: true, immutable: true },
    siteName: { type: String, default: "Time Global Tech", trim: true, maxlength: 120 },
    /** Canonical public origin. Overrides SITE_URL when set. */
    siteUrl: { type: String, default: "", trim: true, maxlength: 300 },
    logo: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    favicon: { type: Schema.Types.ObjectId, ref: "Media", default: null },

    contact: {
      email: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true, maxlength: 400 },
    },
    socials: {
      linkedin: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      facebook: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
    },

    headerMenu: [menuItemSchema],
    footerMenu: [menuItemSchema],

    smtp: {
      host: { type: String, default: "", trim: true },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: false },
      user: { type: String, default: "", trim: true },
      // select:false — an SMTP password is a live credential; it must never
      // ride along on a routine settings read.
      password: { type: String, default: "", select: false },
      fromName: { type: String, default: "", trim: true },
      fromEmail: { type: String, default: "", trim: true },
      notifyOnLead: { type: Boolean, default: true },
      notifyTo: { type: String, default: "", trim: true },
    },

    maintenanceMode: { type: Boolean, default: false },
    defaultSeo: {
      metaTitle: { type: String, default: "", maxlength: 70 },
      metaDescription: { type: String, default: "", maxlength: 170 },
      ogImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },
    },

    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>("Settings", settingsSchema);

/** Upsert-on-read so a fresh install never 404s. */
export async function getSettings() {
  return Settings.findOneAndUpdate(
    { key: "site" },
    { $setOnInsert: { key: "site" } },
    { new: true, upsert: true }
  );
}
