import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../lib/logger.js";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  // Reject unknown keys instead of silently dropping them — makes typos loud.
  mongoose.set("strict", "throw");

  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  logger.info("MongoDB connected");

  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB error"));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
}

export async function disconnectDb() {
  await mongoose.connection.close();
}
