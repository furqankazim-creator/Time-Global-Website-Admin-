import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../models/User.js";

export type AccessPayload = { sub: string; role: Role; email: string };
/** `tv` = tokenVersion — bumped on logout/password-reset to revoke old refreshes. */
export type RefreshPayload = { sub: string; tv: number };

export const signAccessToken = (p: AccessPayload) =>
  jwt.sign(p, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL } as SignOptions);

export const signRefreshToken = (p: RefreshPayload) =>
  jwt.sign(p, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL } as SignOptions);

export const verifyAccessToken = (t: string) =>
  jwt.verify(t, env.JWT_ACCESS_SECRET) as AccessPayload;

export const verifyRefreshToken = (t: string) =>
  jwt.verify(t, env.JWT_REFRESH_SECRET) as RefreshPayload;

export const REFRESH_COOKIE = "tgt_rt";

/**
 * httpOnly so XSS can't read it; SameSite=strict so CSRF can't ride it.
 * Path must match between set and clear, or the browser treats them as
 * different cookies and the clear silently does nothing.
 */
const baseCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict" as const,
  path: "/api/v1/auth",
};

export const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * clearCookie must NOT receive maxAge — Express deprecates it there (it sets
 * the expiry itself), and v5 will ignore the option entirely.
 */
export const clearRefreshCookieOptions = baseCookieOptions;
