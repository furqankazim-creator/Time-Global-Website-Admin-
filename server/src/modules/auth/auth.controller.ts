import type { Request, Response } from "express";
import { ApiError } from "../../lib/ApiError.js";
import { audit } from "../../lib/audit.js";
import {
  clearRefreshCookieOptions,
  REFRESH_COOKIE,
  refreshCookieOptions,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import { User } from "../../models/User.js";
import * as authService from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    audit(req, {
      action: "auth.login",
      actorId: String(user._id),
      actorEmail: user.email,
    });

    res.json({ accessToken, user: user.toJSON() });
  } catch (err) {
    // Record the attempt, then let the error handler shape the response.
    audit(req, { action: "auth.login", actorEmail: email, success: false });
    throw err;
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized("No refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const { user, accessToken, refreshToken } = await authService.refresh(payload);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.json({ accessToken, user: user.toJSON() });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await authService.revokeSessions(payload.sub);
      audit(req, { action: "auth.logout", actorId: payload.sub });
    } catch {
      // Already invalid — clearing the cookie is enough.
    }
  }
  res.clearCookie(REFRESH_COOKIE, clearRefreshCookieOptions);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  const user = await User.findOne({ _id: req.user!.sub, deletedAt: null });
  if (!user) throw ApiError.unauthorized("Account no longer exists");
  res.json({ user: user.toJSON() });
}
