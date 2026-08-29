import { Schema, model, type Model, type HydratedDocument, type Types } from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = ["admin", "editor", "author", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const MAX_FAILED_ATTEMPTS = 10;
export const LOCK_MINUTES = 15;

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar: Types.ObjectId | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  tokenVersion: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  verifyPassword(plain: string): Promise<boolean>;
  isLocked(): boolean;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  hashPassword(plain: string): Promise<string>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false — the hash never rides along on an accidental find().
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "viewer", index: true },
    avatar: { type: Schema.Types.ObjectId, ref: "Media", default: null },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },

    // Brute-force protection
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockedUntil: { type: Date, default: null, select: false },

    // Bumped to invalidate every outstanding refresh token for this user.
    tokenVersion: { type: Number, default: 0, select: false },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

userSchema.method("verifyPassword", function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
});

userSchema.method("isLocked", function () {
  return !!this.lockedUntil && this.lockedUntil.getTime() > Date.now();
});

userSchema.static("hashPassword", function (plain: string) {
  return bcrypt.hash(plain, 12);
});

// Defence in depth: even if a query selects them, they never serialise out.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    delete r.passwordHash;
    delete r.tokenVersion;
    delete r.failedLoginAttempts;
    delete r.lockedUntil;
    return r;
  },
});

export type UserDoc = HydratedDocument<IUser, IUserMethods>;

export const User = model<IUser, UserModel>("User", userSchema);
