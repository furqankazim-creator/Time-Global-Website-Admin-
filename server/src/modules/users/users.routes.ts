import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import { audit } from "../../lib/audit.js";
import { escapeRegex, parseSort } from "../../lib/pagination.js";
import { requireAdmin } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { ROLES, User, type Role } from "../../models/User.js";

export const usersRouter = Router();

const listUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default("-createdAt"),
  q: z.string().trim().max(100).optional(),
  role: z.enum(ROLES).optional(),
});

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES).default("editor"),
});

const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

usersRouter.get(
  "/",
  requireAdmin,
  validate({ query: listUsersSchema }),
  asyncHandler(async (req, res) => {
    const { page, limit, sort, q, role } = req.query as unknown as z.infer<typeof listUsersSchema>;
    const filter: Record<string, unknown> = { deletedAt: null };

    if (role) filter.role = role;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const skip = (page - 1) * limit;
    const sortObj = parseSort(sort, ["name", "email", "role", "lastLoginAt", "createdAt"]);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-passwordHash")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      data: users,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  })
);

usersRouter.post(
  "/",
  requireAdmin,
  validate({ body: createUserSchema }),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body as z.infer<typeof createUserSchema>;

    const exists = await User.findOne({ email });
    if (exists) {
      throw ApiError.badRequest("A user with this email address already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      isActive: true,
    });

    audit(req, { action: "user.create", model: "user", docId: user._id });

    const safeUser = user.toObject();
    delete (safeUser as any).passwordHash;

    res.status(201).json({ data: safeUser });
  })
);

usersRouter.patch(
  "/:id",
  requireAdmin,
  validate({ body: updateUserSchema }),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null });
    if (!user) throw ApiError.notFound("User not found");

    const updates = req.body as z.infer<typeof updateUserSchema>;
    if (req.user?.sub === user.id) {
      if (updates.role && updates.role !== "admin") {
        throw ApiError.badRequest("Cannot demote your own admin account");
      }
      if (updates.isActive === false) {
        throw ApiError.badRequest("Cannot deactivate your own account");
      }
    }

    user.set(updates);
    await user.save();

    audit(req, { action: "user.update", model: "user", docId: user._id });

    const safeUser = user.toObject();
    delete (safeUser as any).passwordHash;

    res.json({ data: safeUser });
  })
);

usersRouter.post(
  "/:id/reset-password",
  requireAdmin,
  validate({ body: resetPasswordSchema }),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null });
    if (!user) throw ApiError.notFound("User not found");

    const { password } = req.body as z.infer<typeof resetPasswordSchema>;
    user.passwordHash = await bcrypt.hash(password, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    audit(req, { action: "user.reset-password", model: "user", docId: user._id });

    res.json({ message: "Password updated successfully" });
  })
);

usersRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null });
    if (!user) throw ApiError.notFound("User not found");

    if (req.user?.sub === user.id) {
      throw ApiError.badRequest("You cannot delete your own account");
    }

    user.deletedAt = new Date();
    user.isActive = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    audit(req, { action: "user.delete", model: "user", docId: user._id });

    res.json({ message: "User deleted" });
  })
);

