import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../lib/ApiError.js";

type Schemas = { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny };

/**
 * Validates and REPLACES req.body/query/params with the parsed result, so
 * downstream code can only ever see stripped, typed data. This is the
 * mass-assignment guard: unknown keys never reach Mongoose.
 */
export const validate =
  (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
    for (const key of ["body", "query", "params"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const fields: Record<string, string> = {};
        for (const issue of result.error.issues) {
          fields[issue.path.join(".") || key] = issue.message;
        }
        return next(ApiError.badRequest("Validation failed", fields));
      }
      // req.query/params have only getters in Express 5; assign defensively.
      Object.defineProperty(req, key, { value: result.data, writable: true });
    }
    next();
  };
