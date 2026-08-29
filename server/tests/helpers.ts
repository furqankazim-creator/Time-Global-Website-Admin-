import mongoose from "mongoose";
import request from "supertest";
import type { Express } from "express";

/**
 * App and models are imported lazily: they read env at module scope, and
 * setup.ts must populate it first.
 */
export async function makeApp(): Promise<Express> {
  const { createApp } = await import("../src/app.js");
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
  return createApp();
}

export async function resetDb() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export async function makeUser(role: "admin" | "editor" | "author" | "viewer", email?: string) {
  const { User } = await import("../src/models/User.js");
  const addr = email ?? `${role}@test.com`;
  await User.deleteOne({ email: addr });
  return User.create({
    name: role,
    email: addr,
    passwordHash: await User.hashPassword("TestPass123!"),
    role,
    isActive: true,
  });
}

/** Logs in and returns the bearer token. */
export async function tokenFor(
  app: Express,
  role: "admin" | "editor" | "author" | "viewer"
): Promise<string> {
  await makeUser(role);
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: `${role}@test.com`, password: "TestPass123!" });
  return res.body.accessToken;
}

export const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
