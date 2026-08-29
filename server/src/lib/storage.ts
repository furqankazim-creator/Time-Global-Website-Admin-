import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

export type StoredFile = {
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
};

export interface StorageDriver {
  save(file: Express.Multer.File, folder: string): Promise<StoredFile>;
  remove(key: string): Promise<void>;
}

/**
 * Magic-number sniffing. Extension and the client-supplied Content-Type are
 * both attacker-controlled, so neither is evidence of what a file actually is.
 */
const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/gif", ext: "gif", test: (b) => b.subarray(0, 3).toString("ascii") === "GIF" },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  { mime: "application/pdf", ext: "pdf", test: (b) => b.subarray(0, 4).toString("ascii") === "%PDF" },
];

/**
 * NOTE: SVG is deliberately unsupported. An SVG is a document that can carry
 * <script>, so serving user-uploaded SVGs from our origin is stored XSS.
 */
export function detectType(buf: Buffer): { mime: string; ext: string } {
  const hit = SIGNATURES.find((s) => s.test(buf));
  if (!hit) {
    throw ApiError.badRequest(
      "Unsupported file type. Allowed: JPEG, PNG, GIF, WebP, PDF."
    );
  }
  return { mime: hit.mime, ext: hit.ext };
}

/** Random name: never trust the client filename (path traversal, overwrite). */
const safeKey = (folder: string, ext: string) =>
  `${folder}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

class LocalDriver implements StorageDriver {
  private root = path.resolve(process.cwd(), env.UPLOAD_DIR);

  async save(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    const { mime, ext } = detectType(file.buffer);
    const key = safeKey(folder, ext);
    const dest = path.join(this.root, key);

    // Defence in depth: the resolved path must stay inside the upload root.
    if (!dest.startsWith(this.root + path.sep)) {
      throw ApiError.badRequest("Invalid upload path");
    }

    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, file.buffer);

    return {
      key,
      url: `${env.PUBLIC_API_URL}/${env.UPLOAD_DIR}/${key}`,
      filename: file.originalname,
      mimeType: mime,
      size: file.size,
    };
  }

  async remove(key: string): Promise<void> {
    const target = path.join(this.root, key);
    if (!target.startsWith(this.root + path.sep)) return;
    await fs.rm(target, { force: true });
  }
}

/**
 * Cloudinary slot. Implement `save`/`remove` with the SDK and set
 * STORAGE_DRIVER=cloudinary — no calling code changes.
 */
class CloudinaryDriver implements StorageDriver {
  constructor() {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new Error("STORAGE_DRIVER=cloudinary requires CLOUDINARY_* env vars");
    }
  }
  async save(): Promise<StoredFile> {
    throw new Error("Cloudinary driver not implemented yet — use STORAGE_DRIVER=local");
  }
  async remove(): Promise<void> {
    throw new Error("Cloudinary driver not implemented yet");
  }
}

export const storage: StorageDriver =
  env.STORAGE_DRIVER === "cloudinary" ? new CloudinaryDriver() : new LocalDriver();
