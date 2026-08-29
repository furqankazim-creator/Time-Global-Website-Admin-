import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";

/**
 * Memory storage so we can sniff magic numbers BEFORE anything touches disk.
 * The real type check lives in lib/storage.ts#detectType — this filter is only
 * a cheap first pass, since mimetype here is client-supplied and forgeable.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
    fields: 10,
  },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|gif|webp)|application\/pdf)$/.test(file.mimetype);
    cb(null, ok);
  },
});

export const singleFile = upload.single("file");

/** Translates multer's errors into our standard error shape. */
export function handleUploadErrors(
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(ApiError.badRequest(`File exceeds ${env.MAX_UPLOAD_MB}MB limit`));
    }
    return next(ApiError.badRequest(`Upload failed: ${err.message}`));
  }
  next(err);
}
