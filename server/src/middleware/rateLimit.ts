import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const handler = (_req: unknown, res: any) =>
  res.status(429).json({
    error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." },
  });

/**
 * Limiters count per IP, and an entire test run shares one. Leaving them on
 * would throttle the suite itself (every login shares the 5/15min budget),
 * producing 429s that look like auth failures.
 *
 * Brute-force protection is still covered under test by account lockout,
 * which is application logic rather than an IP counter.
 */
const skip = () => env.NODE_ENV === "test";

/** Baseline for the whole API. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler,
  skip,
});

/** Login: the credential-stuffing gate. Counts failures per IP. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler,
  skip,
});

/** Password reset: prevents mailbox flooding. */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler,
  skip,
});

/**
 * Public writes (contact form, subscribe).
 *
 * skipFailedRequests: only *successful* submissions count. Otherwise a user
 * who mistypes their email three times is locked out for an hour — the
 * limiter runs before validation, so a 400 would consume their quota.
 * Garbage requests are still capped by globalLimiter, and the honeypot's
 * fake 201 deliberately does count, so bots burn their budget.
 */
export const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  skipFailedRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler,
  skip,
});
