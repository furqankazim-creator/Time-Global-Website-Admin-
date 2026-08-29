import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import path from "node:path";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin.router.js";
import { publicRouter } from "./modules/public.router.js";
import { seoRouter } from "./modules/seo.routes.js";

/** Express rewrites req.url inside routers; originalUrl keeps the real path. */
const fullUrl = (req: { url: string; originalUrl?: string }) => req.originalUrl ?? req.url;

export function createApp() {
  const app = express();

  // Behind a proxy (Render/Railway/nginx), trust exactly one hop so
  // req.ip is the real client — rate limiting depends on this being right.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      /**
       * Production: strict allowlist, never "*" — credentialed requests
       * require an exact origin anyway.
       * Development: also accept any localhost port, because Vite silently
       * hops to 5174/5175 when a port is taken and a hardcoded list then
       * fails as an opaque CORS error.
       */
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl / same-origin
        if (env.corsOrigins.includes(origin)) return cb(null, true);
        if (!env.isProd && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
          return cb(null, true);
        }
        cb(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    pinoHttp({
      logger,
      /**
       * originalUrl, not url: Express rewrites req.url to be relative to a
       * router's mount point, so by the time the response finishes,
       * /api/v1/auth/login has become just "/login".
       */
      customSuccessMessage: (req, res, responseTime) =>
        `${req.method} ${fullUrl(req)} → ${res.statusCode} ${responseTime}ms`,
      customErrorMessage: (req, res, err) =>
        `${req.method} ${fullUrl(req)} → ${res.statusCode} ${err.message}`,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        // 304s are cache hits working correctly — not worth a line each.
        if (res.statusCode === 304) return "debug";
        return "info";
      },
      // Health checks would otherwise flood the log once deployed.
      autoLogging: { ignore: (req) => req.url === "/health" },
    })
  );
  app.use(globalLimiter);

  // Liveness + DB readiness
  app.get("/health", (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({
      status: dbUp ? "ok" : "degraded",
      db: dbUp ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  });

  // Locally-stored media. `crossOriginResourcePolicy` off would let helmet's
  // CORP header block the Vite site from loading these images.
  if (env.STORAGE_DRIVER === "local") {
    app.use(
      `/${env.UPLOAD_DIR}`,
      express.static(path.resolve(process.cwd(), env.UPLOAD_DIR), {
        maxAge: "7d",
        index: false,
        // Never let an uploaded file be interpreted as HTML/JS by the browser.
        setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
      })
    );
  }

  // Mounted at root: sitemap.xml and robots.txt must live at the origin.
  app.use("/", seoRouter);

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/public", publicRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
