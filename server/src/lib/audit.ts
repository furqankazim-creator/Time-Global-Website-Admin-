import type { Request } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { logger } from "./logger.js";

type AuditInput = {
  action: string;
  model?: string;
  docId?: unknown;
  diff?: unknown;
  success?: boolean;
  actorId?: string | null;
  actorEmail?: string | null;
};

/**
 * Fire-and-forget: an audit write must never fail the request it describes.
 * We log the failure instead so a broken audit trail is still visible.
 */
export function audit(req: Request, input: AuditInput) {
  const actorId = input.actorId ?? req.user?.sub ?? null;
  const actorEmail = input.actorEmail ?? req.user?.email ?? null;

  AuditLog.create({
    actor: actorId,
    actorEmail,
    action: input.action,
    model: input.model ?? null,
    docId: input.docId ?? null,
    diff: input.diff ?? null,
    success: input.success ?? true,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? null,
  }).catch((err) => logger.error({ err, action: input.action }, "audit write failed"));
}
