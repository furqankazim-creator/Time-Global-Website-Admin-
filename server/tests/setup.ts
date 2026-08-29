import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Real MongoDB, in memory. Mocking the DB would not have caught the bug where
 * `$set: { smtp: {...} }` replaced a whole subdocument — that is Mongo
 * semantics, not application logic.
 *
 * Env must be set before any module reads it at import time.
 */
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri("tgt_test");
  process.env.NODE_ENV = "test";
  process.env.JWT_ACCESS_SECRET = "test-access-secret-at-least-32-characters-long";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-different-and-32-chars-min";
  process.env.CORS_ORIGINS = "http://localhost:5173";
  process.env.STORAGE_DRIVER = "local";
  process.env.UPLOAD_DIR = "tests/.uploads";
  process.env.PUBLIC_API_URL = "http://localhost:4000";
  process.env.SITE_URL = "http://localhost:5173";
});

afterAll(async () => {
  const mongoose = (await import("mongoose")).default;
  await mongoose.disconnect().catch(() => {});
  await mongod?.stop();
});
