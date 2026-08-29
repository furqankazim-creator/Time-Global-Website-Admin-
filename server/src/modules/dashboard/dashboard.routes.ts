import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { AuditLog } from "../../models/AuditLog.js";
import { Media } from "../../models/Media.js";
import { Post } from "../../models/Post.js";
import { Project } from "../../models/Project.js";
import { Lead } from "../../models/Lead.js";
import { Service } from "../../models/Service.js";
import { TeamMember } from "../../models/TeamMember.js";
import { Testimonial } from "../../models/Testimonial.js";

export const dashboardRouter = Router();

/** Summary cards + recent activity feed for the landing page. */
dashboardRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Counts run in parallel — serially this would be N round trips.
    const [
      services, publishedServices, media, projects, activeProjects,
      posts, publishedPosts, pendingTestimonials, testimonials, team,
      leadsToday, newLeads, activity,
    ] = await Promise.all([
      Service.countDocuments({ deletedAt: null }),
      Service.countDocuments({ deletedAt: null, status: "published" }),
      Media.countDocuments({ deletedAt: null }),
      Project.countDocuments({ deletedAt: null }),
      Project.countDocuments({ deletedAt: null, status: "published" }),
      Post.countDocuments({ deletedAt: null }),
      Post.countDocuments({ deletedAt: null, status: "published" }),
      Testimonial.countDocuments({ deletedAt: null, approvalStatus: "pending" }),
      Testimonial.countDocuments({ deletedAt: null }),
      TeamMember.countDocuments({ deletedAt: null }),
      Lead.countDocuments({ deletedAt: null, createdAt: { $gte: startOfToday } }),
      Lead.countDocuments({ deletedAt: null, status: "new" }),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(12).lean(),
    ]);

    res.json({
      data: {
        cards: {
          leadsToday,
          newLeads,
          services,
          publishedServices,
          media,
          projects,
          activeProjects,
          posts,
          publishedPosts,
          pendingTestimonials,
          testimonials,
          team,
        },
        activity,
      },
    });
  })
);
