import { ApiError } from "../../lib/ApiError.js";
import { signAccessToken, signRefreshToken, type RefreshPayload } from "../../lib/jwt.js";
import { LOCK_MINUTES, MAX_FAILED_ATTEMPTS, User, type Role } from "../../models/User.js";

/**
 * Deliberately identical for "no such user" and "wrong password" — anything
 * else turns the login form into a user-enumeration oracle.
 */
const INVALID_CREDENTIALS = "Incorrect email or password";

export async function login(email: string, password: string) {
  const user = await User.findOne({ email, deletedAt: null }).select(
    "+passwordHash +failedLoginAttempts +lockedUntil +tokenVersion"
  );

  if (!user) throw ApiError.unauthorized(INVALID_CREDENTIALS);

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
    throw ApiError.locked(`Account locked. Try again in ${mins} minute(s).`);
  }

  if (!user.isActive) throw ApiError.forbidden("This account has been deactivated");

  const ok = await user.verifyPassword(password);

  if (!ok) {
    const attempts = (user.failedLoginAttempts ?? 0) + 1;
    const update: Record<string, unknown> = { failedLoginAttempts: attempts };
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      update.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
      update.failedLoginAttempts = 0; // reset the counter alongside the lock
    }
    await User.updateOne({ _id: user._id }, { $set: update });
    throw ApiError.unauthorized(INVALID_CREDENTIALS);
  }

  // Success — clear the failure state.
  await User.updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } }
  );

  return {
    user,
    accessToken: signAccessToken({
      sub: String(user._id),
      role: user.role as Role,
      email: user.email,
    }),
    refreshToken: signRefreshToken({
      sub: String(user._id),
      tv: user.tokenVersion ?? 0,
    }),
  };
}

/** Rotates the refresh token; rejects if tokenVersion moved (logout/reset). */
export async function refresh(payload: RefreshPayload) {
  const user = await User.findOne({ _id: payload.sub, deletedAt: null }).select("+tokenVersion");
  if (!user || !user.isActive) throw ApiError.unauthorized("Session no longer valid");

  if ((user.tokenVersion ?? 0) !== payload.tv) {
    throw ApiError.unauthorized("Session has been revoked");
  }

  return {
    user,
    accessToken: signAccessToken({
      sub: String(user._id),
      role: user.role as Role,
      email: user.email,
    }),
    refreshToken: signRefreshToken({ sub: String(user._id), tv: user.tokenVersion ?? 0 }),
  };
}

/** Invalidates every outstanding refresh token for the user. */
export async function revokeSessions(userId: string) {
  await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
}
