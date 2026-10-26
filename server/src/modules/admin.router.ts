import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { denyReadOnly } from "../middleware/rbac.js";
import {
  categoriesRouter, homeRouter, postsRouter, projectsRouter,
  storiesRouter, tagsRouter, teamRouter, testimonialsRouter,
} from "./content/content.routes.js";
import { jobsRouter, notificationsRouter } from "./careers.routes.js";
import { dashboardRouter } from "./dashboard/dashboard.routes.js";
import { leadsRouter } from "./leads/leads.routes.js";
import { settingsRouter } from "./settings/settings.routes.js";
import { mediaRouter } from "./media/media.routes.js";
import { servicesRouter } from "./services/service.routes.js";
import { usersRouter } from "./users/users.routes.js";
import { redirectsRouter } from "./redirects/redirects.routes.js";
import { auditLogsRouter } from "./audit/audit.routes.js";

/**
 * Everything under /api/v1/admin is authenticated. Viewers may read but
 * never mutate. Individual routes add their own role gates on top.
 */
export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(denyReadOnly);

adminRouter.use("/dashboard", dashboardRouter);
adminRouter.use("/media", mediaRouter);
adminRouter.use("/services", servicesRouter);
adminRouter.use("/projects", projectsRouter);
adminRouter.use("/stories", storiesRouter);
adminRouter.use("/posts", postsRouter);
adminRouter.use("/categories", categoriesRouter);
adminRouter.use("/tags", tagsRouter);
adminRouter.use("/testimonials", testimonialsRouter);
adminRouter.use("/team", teamRouter);
adminRouter.use("/home", homeRouter);
adminRouter.use("/jobs", jobsRouter);
adminRouter.use("/notifications", notificationsRouter);
adminRouter.use("/leads", leadsRouter);
adminRouter.use("/settings", settingsRouter);
adminRouter.use("/users", usersRouter);
adminRouter.use("/redirects", redirectsRouter);
adminRouter.use("/audit-logs", auditLogsRouter);

