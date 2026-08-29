import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { audit } from "../../lib/audit.js";
import { crudFactory } from "../../lib/crudFactory.js";
import { listQuerySchema } from "../../lib/pagination.js";
import { uniqueSlug } from "../../lib/slug.js";
import { requireEditor } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { getHomePage, HomePage } from "../../models/HomePage.js";
import { Category, Post, Tag, type TaxonomyModel } from "../../models/Post.js";
import { Project, PROJECT_CATEGORIES } from "../../models/Project.js";
import { TeamMember } from "../../models/TeamMember.js";
import { Testimonial } from "../../models/Testimonial.js";
import * as S from "./content.schemas.js";

/** Wires a crudFactory into a router with the standard route shape. */
function crudRouter(
  ctrl: ReturnType<typeof crudFactory>,
  createSchema: z.ZodTypeAny,
  updateSchema: z.ZodTypeAny,
  listSchema: z.ZodTypeAny = listQuerySchema
) {
  const r = Router();
  r.get("/", validate({ query: listSchema }), asyncHandler(ctrl.list));
  // Must precede "/:id" or "reorder" parses as an id.
  r.patch("/reorder", requireEditor, validate({ body: S.reorderSchema }), asyncHandler(ctrl.reorder));
  r.get("/:id", validate({ params: S.idParamSchema }), asyncHandler(ctrl.getOne));
  r.post("/", requireEditor, validate({ body: createSchema }), asyncHandler(ctrl.create));
  r.patch("/:id", requireEditor, validate({ params: S.idParamSchema, body: updateSchema }), asyncHandler(ctrl.update));
  r.delete("/:id", requireEditor, validate({ params: S.idParamSchema }), asyncHandler(ctrl.remove));
  r.post("/:id/restore", requireEditor, validate({ params: S.idParamSchema }), asyncHandler(ctrl.restore));
  return r;
}

/* ----------------------------- Portfolio ------------------------------ */
export const projectsRouter = crudRouter(
  crudFactory({
    name: "project",
    model: Project,
    slugFrom: "title",
    urlPrefix: "work",
    sortable: ["title", "client", "order", "status", "publishedAt"],
    searchable: ["title", "client"],
    populate: "coverImage clientLogo",
    filters: (q) => (q.category ? { category: q.category } : {}),
  }),
  S.createProjectSchema,
  S.updateProjectSchema,
  listQuerySchema.extend({ category: z.enum(PROJECT_CATEGORIES).optional() })
);

/* -------------------------------- Blog -------------------------------- */
export const postsRouter = crudRouter(
  crudFactory({
    name: "post",
    model: Post,
    slugFrom: "title",
    urlPrefix: "blog",
    sortable: ["title", "status", "publishedAt"],
    searchable: ["title", "excerpt"],
    populate: "featuredImage category tags author",
    filters: (q) => ({
      ...(q.category ? { category: q.category } : {}),
      ...(q.author ? { author: q.author } : {}),
    }),
  }),
  S.createPostSchema,
  S.updatePostSchema,
  listQuerySchema.extend({ category: S.objectId.optional(), author: S.objectId.optional() })
);

/* ----------------------------- Testimonials --------------------------- */
export const testimonialsRouter = crudRouter(
  crudFactory({
    name: "testimonial",
    model: Testimonial,
    sortable: ["clientName", "company", "rating", "order"],
    searchable: ["clientName", "company", "quote"],
    populate: "photo companyLogo project",
    filters: (q) => (q.approvalStatus ? { approvalStatus: q.approvalStatus } : {}),
  }),
  S.createTestimonialSchema,
  S.updateTestimonialSchema,
  // Testimonials use approvalStatus, not the publish `status` enum.
  listQuerySchema
    .omit({ status: true })
    .extend({ approvalStatus: z.enum(["pending", "approved", "rejected"]).optional() })
);

/* -------------------------------- Team -------------------------------- */
export const teamRouter = crudRouter(
  crudFactory({
    name: "team",
    model: TeamMember,
    sortable: ["name", "role", "order", "department"],
    searchable: ["name", "role"],
    populate: "photo",
    filters: (q) => (q.department ? { department: q.department } : {}),
  }),
  S.createTeamSchema,
  S.updateTeamSchema,
  listQuerySchema
    .omit({ status: true })
    .extend({
      status: z.enum(["draft", "published"]).optional(),
      department: z.string().optional(),
    })
);

/* --------------------------- Categories/Tags -------------------------- */
function taxonomyRouter(model: TaxonomyModel, name: string) {
  const r = Router();
  r.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json({ data: await model.find().sort({ name: 1 }).lean() });
    })
  );
  r.post(
    "/",
    requireEditor,
    validate({ body: S.taxonomySchema }),
    asyncHandler(async (req, res) => {
      const slug = await uniqueSlug(model, req.body.slug || req.body.name);
      const doc = await model.create({ ...req.body, slug });
      audit(req, { action: `${name}.create`, model: name, docId: doc._id });
      res.status(201).json({ data: doc });
    })
  );
  r.delete(
    "/:id",
    requireEditor,
    validate({ params: S.idParamSchema }),
    asyncHandler(async (req, res) => {
      await model.deleteOne({ _id: req.params.id });
      audit(req, { action: `${name}.delete`, model: name, docId: req.params.id });
      res.status(204).end();
    })
  );
  return r;
}

export const categoriesRouter = taxonomyRouter(Category, "category");
export const tagsRouter = taxonomyRouter(Tag, "tag");

/* ------------------------------ Home Page ----------------------------- */
export const homeRouter = Router();

homeRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const doc = await getHomePage();
    await doc!.populate([
      { path: "hero.backgroundMedia" },
      { path: "featuredServices", select: "title slug status" },
      { path: "featuredProjects", select: "title slug status" },
      { path: "featuredTestimonials", select: "clientName company approvalStatus" },
    ]);
    res.json({ data: doc });
  })
);

homeRouter.put(
  "/",
  requireEditor,
  validate({ body: S.updateHomeSchema }),
  asyncHandler(async (req, res) => {
    const doc = await HomePage.findOneAndUpdate(
      { key: "home" },
      { $set: { ...req.body, updatedBy: req.user!.sub } },
      { new: true, upsert: true, runValidators: true }
    );
    audit(req, { action: "home.update", model: "HomePage", docId: doc!._id, diff: req.body });
    res.json({ data: doc });
  })
);
