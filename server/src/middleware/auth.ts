import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/ApiError.js";
import { verifyAccessToken, type AccessPayload } from "../lib/jwt.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

/** Requires a valid, unexpired access token in `Authorization: Bearer <t>`. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing bearer token"));
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    // Don't leak whether it was malformed vs expired.
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
