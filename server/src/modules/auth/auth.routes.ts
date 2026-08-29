import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { loginLimiter } from "../../middleware/rateLimit.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./auth.controller.js";
import { loginSchema } from "./auth.schema.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginLimiter,
  validate({ body: loginSchema }),
  asyncHandler(ctrl.login)
);
authRouter.post("/refresh", asyncHandler(ctrl.refresh));
authRouter.post("/logout", asyncHandler(ctrl.logout));
authRouter.get("/me", requireAuth, asyncHandler(ctrl.me));
