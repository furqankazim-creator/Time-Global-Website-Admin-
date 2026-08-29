import { Schema, model, type Model } from "mongoose";

export interface INotification {
  type: "lead" | "testimonial" | "application" | "system";
  title: string;
  body: string;
  /** Admin route the bell entry links to, e.g. /admin/leads. */
  link: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification, Model<INotification>>(
  {
    type: { type: String, enum: ["lead", "testimonial", "application", "system"], required: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, default: "", maxlength: 500 },
    link: { type: String, default: "", maxlength: 300 },
    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

export const Notification = model<INotification>("Notification", notificationSchema);

/** Fire-and-forget: a notification must never fail the action it describes. */
export function notify(input: Pick<INotification, "type" | "title"> & Partial<INotification>) {
  Notification.create(input).catch(() => {});
}
