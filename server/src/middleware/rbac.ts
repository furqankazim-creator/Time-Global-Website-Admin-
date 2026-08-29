import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/ApiError.js";
import type { Role } from "../models/User.js";

/**
 * Role gate. Deny-by-default: an unknown or absent role never passes.
 *
 *   admin  — everything, including settings & users
 *   editor — all content, no settings/users
 *   author — own posts only (ownership enforced in the service layer)
 *   viewer — read-only
 */
export const requireRole =
  (...allowed: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowed.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${allowed.join(" or ")}`));
    }
    next();
  };

/** Convenience gates matching the module map in the spec. */
export const requireAdmin = requireRole("admin");
export const requireEditor = requireRole("admin", "editor");
export const requireWriter = requireRole("admin", "editor", "author");

/** Blocks mutations for read-only roles while still allowing GET. */
export function denyReadOnly(req: Request, _res: Response, next: NextFunction) {
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (isMutation && req.user?.role === "viewer") {
    return next(ApiError.forbidden("Viewer accounts are read-only"));
  }
  next();
}
