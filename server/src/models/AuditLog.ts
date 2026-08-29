import { Schema, model } from "mongoose";

const auditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    actorEmail: { type: String, default: null }, // denormalised: survives user deletion
    action: { type: String, required: true, index: true }, // e.g. "auth.login", "service.update"
    model: { type: String, default: null, index: true },
    docId: { type: Schema.Types.ObjectId, default: null },
    diff: { type: Schema.Types.Mixed, default: null },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    success: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model("AuditLog", auditLogSchema);
