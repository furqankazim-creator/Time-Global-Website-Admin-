import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { listQuerySchema } from "../../lib/pagination.js";
import { requireEditor } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./service.controller.js";
import {
  createServiceSchema,
  idParamSchema,
  reorderSchema,
  updateServiceSchema,
} from "./service.schema.js";

export const servicesRouter = Router();

servicesRouter.get(
  "/",
  validate({ query: listQuerySchema.extend({ featured: z.enum(["true", "false"]).optional() }) }),
  asyncHandler(ctrl.list)
);

// Must precede "/:id" or "reorder" would be parsed as an id.
servicesRouter.patch(
  "/reorder",
  requireEditor,
  validate({ body: reorderSchema }),
  asyncHandler(ctrl.reorder)
);

servicesRouter.get("/:id", validate({ params: idParamSchema }), asyncHandler(ctrl.getOne));

servicesRouter.post(
  "/",
  requireEditor,
  validate({ body: createServiceSchema }),
  asyncHandler(ctrl.create)
);

servicesRouter.patch(
  "/:id",
  requireEditor,
  validate({ params: idParamSchema, body: updateServiceSchema }),
  asyncHandler(ctrl.update)
);

servicesRouter.delete(
  "/:id",
  requireEditor,
  validate({ params: idParamSchema }),
  asyncHandler(ctrl.remove)
);

servicesRouter.post(
  "/:id/restore",
  requireEditor,
  validate({ params: idParamSchema }),
  asyncHandler(ctrl.restore)
);
