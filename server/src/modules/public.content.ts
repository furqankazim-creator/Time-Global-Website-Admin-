import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { getHomePage } from "../models/HomePage.js";
import { Job } from "../models/Job.js";
import { Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { TeamMember } from "../models/TeamMember.js";
import { Testimonial } from "../models/Testimonial.js";
import { Story } from "../models/Story.js";

/**
 * Read-only public content. Every query hardcodes its published/approved
 * filter, so a draft cannot reach the live site even if an admin-side filter
 * is wrong. Never `.find()` without one.
 */
export const publicContentRouter = Router();

const PUB = { status: "published", deletedAt: null } as const;
const HIDE = "-createdBy -updatedBy -deletedAt -__v";

/* ------------------------------ Projects ------------------------------ */
publicContentRouter.get(
  "/projects",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { ...PUB };
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.featured === "true") filter.featured = true;

    const data = await Project.find(filter)
      .select(HIDE)
      .sort({ order: 1, publishedAt: -1 })
      .limit(Math.min(Number(req.query.limit) || 50, 100))
      .populate("coverImage clientLogo", "url alt width height")
      .lean();
    res.json({ data });
  })
);

publicContentRouter.get(
  "/projects/:slug",
  asyncHandler(async (req, res) => {
    const doc = await Project.findOne({ ...PUB, slug: req.params.slug })
      .select(HIDE)
      .populate("coverImage clientLogo gallery seo.ogImage", "url alt width height")
      .lean();
    if (!doc) throw ApiError.notFound("Project not found");
    res.json({ data: doc });
  })
);

/* -------------------------------- Posts ------------------------------- */
/**
 * `publishedAt <= now` matters: a scheduled post has status=published with a
 * future date, and must stay invisible until that moment arrives.
 */
const postsLive = () => ({
  ...PUB,
  $or: [{ publishedAt: null }, { publishedAt: { $lte: new Date() } }],
});

publicContentRouter.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const data = await Post.find(postsLive())
      .select(HIDE + " -content") // list view never needs full bodies
      .sort({ publishedAt: -1 })
      .limit(Math.min(Number(req.query.limit) || 20, 50))
      .populate("featuredImage", "url alt width height")
      .populate("category tags", "name slug")
      .populate("author", "name")
      .lean();
    res.json({ data });
  })
);

publicContentRouter.get(
  "/posts/:slug",
  asyncHandler(async (req, res) => {
    const doc = await Post.findOne({ ...postsLive(), slug: req.params.slug })
      .select(HIDE)
      .populate("featuredImage seo.ogImage", "url alt width height")
      .populate("category tags", "name slug")
      .populate("author", "name")
      .lean();
    if (!doc) throw ApiError.notFound("Post not found");
    res.json({ data: doc });
  })
);

/* ----------------------------- Testimonials --------------------------- */
publicContentRouter.get(
  "/testimonials",
  asyncHandler(async (req, res) => {
    // Approved only — a pending testimonial is unvetted content.
    const filter: Record<string, unknown> = { approvalStatus: "approved", deletedAt: null };
    if (req.query.featured === "true") filter.featured = true;

    const data = await Testimonial.find(filter)
      .select(HIDE)
      .sort({ order: 1, createdAt: -1 })
      .limit(Math.min(Number(req.query.limit) || 20, 50))
      .populate("photo companyLogo", "url alt width height")
      .populate("project", "title slug")
      .lean();
    res.json({ data });
  })
);

/* -------------------------------- Team -------------------------------- */
publicContentRouter.get(
  "/team",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { status: "published", deletedAt: null };
    if (req.query.department) filter.department = String(req.query.department);

    const data = await TeamMember.find(filter)
      .select(HIDE)
      .sort({ order: 1, name: 1 })
      .populate("photo", "url alt width height")
      .lean();
    res.json({ data });
  })
);

/* -------------------------------- Jobs -------------------------------- */
publicContentRouter.get(
  "/jobs",
  asyncHandler(async (_req, res) => {
    const data = await Job.find({
      ...PUB,
      // A close date in the past silently retires the posting.
      $or: [{ closesAt: null }, { closesAt: { $gte: new Date() } }],
    })
      .select(HIDE)
      .sort({ order: 1, publishedAt: -1 })
      .lean();
    res.json({ data });
  })
);

/* ------------------------------ Home page ----------------------------- */
publicContentRouter.get(
  "/home",
  asyncHandler(async (_req, res) => {
    const doc = await getHomePage();
    await doc!.populate([
      { path: "hero.backgroundMedia", select: "url alt width height" },
      // Populate only what's publicly visible; a featured item that was later
      // unpublished must not resurface here.
      { path: "featuredServices", match: PUB, select: "title slug shortDescription icon" },
      { path: "featuredProjects", match: PUB, select: "title slug client category coverImage" },
      {
        path: "featuredTestimonials",
        match: { approvalStatus: "approved", deletedAt: null },
        select: "clientName company position quote rating",
      },
    ]);

    const json = doc!.toJSON() as Record<string, any>;
    // `match` yields null for filtered-out refs — strip them.
    for (const k of ["featuredServices", "featuredProjects", "featuredTestimonials"]) {
      json[k] = (json[k] ?? []).filter(Boolean);
    }
    res.json({ data: json });
  })
);

/* ------------------------------- Stories ------------------------------ */
publicContentRouter.get(
  "/stories",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { ...PUB };
    if (req.query.type) filter.type = String(req.query.type);

    const data = await Story.find(filter)
      .select(HIDE)
      .sort({ order: 1, createdAt: 1 })
      .populate("image", "url alt width height")
      .lean();
    res.json({ data });
  })
);
