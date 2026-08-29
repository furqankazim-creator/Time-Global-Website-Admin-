import type { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "../lib/ApiError.js";
import { logger } from "../lib/logger.js";
import { env } from "../config/env.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound("Endpoint not found"));
}

/** Single funnel for every error, so responses always share one shape. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known, intentional errors
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.fields && { fields: err.fields }) },
    });
  }

  // Mongoose schema validation
  if (err instanceof MongooseError.ValidationError) {
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(err.errors)) fields[k] = v.message;
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Validation failed", fields },
    });
  }

  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: `Invalid ${err.path}` },
    });
  }

  // Duplicate key → which field, without dumping the raw driver error
  if (typeof err === "object" && err !== null && (err as { code?: number }).code === 11000) {
    const key = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      error: { code: "CONFLICT", message: `That ${key} is already in use`, fields: { [key]: "Already exists" } },
    });
  }

  // Unknown: log it in full, tell the client nothing.
  logger.error({ err }, "unhandled error");
  res.status(500).json({
    error: {
      code: "INTERNAL",
      message: env.isProd ? "Something went wrong" : String((err as Error)?.message ?? err),
    },
  });
}
