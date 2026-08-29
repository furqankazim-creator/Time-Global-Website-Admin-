import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { listQuerySchema } from "../../lib/pagination.js";
import { requireEditor } from "../../middleware/rbac.js";
import { handleUploadErrors, singleFile } from "../../middleware/upload.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./media.controller.js";

export const mediaRouter = Router();

const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id") });

mediaRouter.get(
  "/",
  validate({
    query: listQuerySchema.extend({
      folder: z.string().trim().max(80).optional(),
      type: z.string().trim().max(40).optional(),
    }),
  }),
  asyncHandler(ctrl.list)
);

mediaRouter.post(
  "/upload",
  requireEditor,
  singleFile,
  handleUploadErrors,
  asyncHandler(ctrl.upload)
);

mediaRouter.patch(
  "/:id",
  requireEditor,
  validate({ params: idParam, body: ctrl.updateMediaSchema }),
  asyncHandler(ctrl.update)
);

mediaRouter.delete(
  "/:id",
  requireEditor,
  validate({ params: idParam }),
  asyncHandler(ctrl.remove)
);
