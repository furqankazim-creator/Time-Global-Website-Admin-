import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { env } from "../config/env.js";
import { Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { Redirect } from "../models/Redirect.js";
import { Settings } from "../models/Settings.js";

export const seoRouter = Router();

/** Static marketing routes that exist in the React app, not the CMS. */
const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/stories", priority: "0.7", changefreq: "monthly" },
  { path: "/awards", priority: "0.6", changefreq: "monthly" },
  { path: "/careers", priority: "0.6", changefreq: "weekly" },
  { path: "/privacy-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.2", changefreq: "yearly" },
];

/** & < > " ' are illegal raw in XML — an unescaped title breaks the document. */
const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

async function siteOrigin(): Promise<string> {
  const s = await Settings.findOne({ key: "site" }).select("siteUrl").lean();
  return (s as { siteUrl?: string } | null)?.siteUrl || env.SITE_URL;
}

seoRouter.get(
  "/sitemap.xml",
  asyncHandler(async (_req, res) => {
    const origin = (await siteOrigin()).replace(/\/$/, "");

    // noIndex pages must be excluded — listing a page we tell robots to ignore
    // is a contradictory signal to search engines.
    // Services have no detail route — advertising /services/:slug would hand
    // Google a list of 404s. Projects and posts have real detail pages.
    const [projects, posts] = await Promise.all([
      Project.find({ status: "published", deletedAt: null, "seo.noIndex": { $ne: true } })
        .select("slug updatedAt").lean(),
      Post.find({
        status: "published",
        deletedAt: null,
        "seo.noIndex": { $ne: true },
        $or: [{ publishedAt: null }, { publishedAt: { $lte: new Date() } }],
      }).select("slug updatedAt").lean(),
    ]);

    const url = (loc: string, lastmod?: Date, priority = "0.7", changefreq = "monthly") =>
      [
        "  <url>",
        `    <loc>${xmlEscape(origin + loc)}</loc>`,
        lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "",
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].filter(Boolean).join("\n");

    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...STATIC_PATHS.map((p) => url(p.path, undefined, p.priority, p.changefreq)),
      ...projects.map((p) => url(`/work/${p.slug}`, p.updatedAt, "0.8")),
      ...posts.map((p) => url(`/blog/${p.slug}`, p.updatedAt, "0.6", "weekly")),
      "</urlset>",
    ].join("\n");

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(body);
  })
);

seoRouter.get(
  "/robots.txt",
  asyncHandler(async (_req, res) => {
    const origin = (await siteOrigin()).replace(/\/$/, "");
    const s = await Settings.findOne({ key: "site" }).select("maintenanceMode").lean();

    // While in maintenance, block everything — otherwise crawlers index the
    // holding page and it can replace real results.
    const body = s?.maintenanceMode
      ? ["User-agent: *", "Disallow: /"].join("\n")
      : [
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /api/",
          "",
          `Sitemap: ${origin}/sitemap.xml`,
        ].join("\n");

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(body);
  })
);

/**
 * Resolves a path the SPA didn't recognise. The client calls this before
 * rendering a 404, so an old bookmarked URL still lands on the right page.
 */
seoRouter.get(
  "/api/v1/public/resolve",
  asyncHandler(async (req, res) => {
    const path = String(req.query.path ?? "");
    if (!path) return res.json({ data: null });

    const hit = await Redirect.findOneAndUpdate(
      { fromPath: path },
      { $inc: { hits: 1 } }, // shows which old URLs still get traffic
      { new: true }
    ).lean();

    res.set("Cache-Control", "public, max-age=300");
    res.json({ data: hit ? { toPath: hit.toPath, statusCode: hit.statusCode } : null });
  })
);
