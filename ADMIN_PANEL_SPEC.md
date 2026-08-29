# Admin Panel — Specification & Build Plan

**Project:** Time Global Tech website CMS
**Stack:** Express + MongoDB (Mongoose) API · React admin SPA · existing Vite public site
**Status:** Phases 1–7 built and verified against a live database
**Last updated:** 2026-07-16 (updated after Phase 7)

---

## 0. Review of the original spec

The draft is **well above average**: the content modules are close to complete, the lead
pipeline has real status tracking, and including an activity log + backups from day one is
something most specs forget. It is a good skeleton.

But it is written as a **feature list, not a system**. Nine things are missing that will
each cause rework if discovered mid-build. They are listed here in priority order.

### 🔴 Critical gaps (will cause rework)

| # | Gap | Why it matters |
|---|-----|----------------|
| 1 | **No Media Library** | Every single module uploads images (hero bg, project galleries, blog covers, team photos, badges). Without one central asset store you get duplicate uploads, no reuse, no alt text, and orphaned files. This is the most-used screen in any CMS and it isn't in the spec. |
| 2 | **The public site has no API layer** | All content today is hardcoded in `.tsx` files. A CMS is worthless until the site *reads* from it. Refactoring the frontend to fetch is roughly **40% of total effort** and is invisible in the current spec. |
| 3 | **No Awards / Certifications / Partners manager** | We literally just built `/awards`. It's hardcoded. It needs a module or it can never be edited. |
| 4 | **No revision history or preview** | "Publish" with no undo and no way to see a draft before it goes live is how a live site gets broken at 5pm on a Friday. |
| 5 | **Slug changes silently 404** | Changing a published blog/project slug kills its Google ranking and inbound links. Needs an automatic 301 redirect map. |

### 🟠 Security gaps

| # | Gap | Why it matters |
|---|-----|----------------|
| 6 | **Rich text = stored XSS** | The blog/project editors accept HTML. Unsanitized, any author (or attacker with a session) can inject `<script>` that runs for every visitor. Must sanitize **server-side** — client-side is not a control. |
| 7 | **Contact form has no spam protection** | A public unprotected POST endpoint will be filled with bot spam within days, and can be abused to send email through your SMTP. Needs rate limiting + honeypot/captcha. |
| 8 | **No GDPR handling** | You serve EU clients (Germany/France on the awards page). Leads are personal data: you need retention limits, export, and delete-on-request. This is a legal requirement, not a feature. |
| 9 | **Login has no brute-force protection** | Email+password with unlimited attempts is credential-stuffing bait. Needs rate limiting + lockout. |

### 🟡 Recommended additions

- **Roles are too coarse.** Admin/Viewer only means a blog writer can change SMTP settings.
  Add `Editor` (content, no settings) and `Author` (own posts only).
- **Soft delete / Trash + restore** — hard `DELETE` on a case study is unrecoverable.
- **Global SEO** — sitemap.xml, robots.txt, canonical tags, JSON-LD structured data, OG defaults.
  Per-page meta fields (already specced) are only half the job.
- **List conventions** — pagination, search, sort, and bulk actions should be one shared
  contract across every module, not reinvented per screen.
- **Edit conflicts** — two admins on one post: last-write-wins silently destroys work. Use `version` field.
- **Observability** — health check, structured logs, error tracking. You can't fix what you can't see.
- **Newsletter subscribers** — trivial to add now, annoying to retrofit.

### ⚪ Scope challenge — cut these for v1

- **2FA** — real value, but ~3 days. Defer to Phase 5 unless you have >3 admins.
- **Comment moderation** — only if you actually want blog comments. Most agency blogs don't;
  they're a spam magnet. Recommend **cutting entirely**.
- **Theme/font customization from the panel** — the site uses a Tailwind design system.
  Exposing fonts/colors to a GUI invites brand drift for near-zero benefit. Recommend cutting.
- **Backup UI** — use managed MongoDB Atlas automated backups instead of building this. Saves ~4 days.
- **Low disk space notification** — that's infrastructure monitoring, not a CMS feature.

---

## 1. Architecture

```
┌────────────────┐        ┌─────────────────────┐        ┌──────────────┐
│  Public site   │        │   Express API       │        │   MongoDB    │
│  (Vite/React)  │──GET──▶│                     │───────▶│   (Atlas)    │
│  timeglobal... │        │  /api/v1/public/*   │        └──────────────┘
└────────────────┘        │      (read-only)    │
                          │                     │        ┌──────────────┐
┌────────────────┐        │  /api/v1/admin/*    │───────▶│  S3/Cloudinary│
│  Admin SPA     │◀─JWT──▶│      (auth'd)       │        │   (media)     │
│  /admin        │        └─────────────────────┘        └──────────────┘
└────────────────┘
```

**Two API surfaces, one server.**
- `/api/v1/public/*` — unauthenticated, read-only, cached, returns **published** content only.
- `/api/v1/admin/*` — JWT-protected, full CRUD, returns drafts too.

This split is deliberate: it makes it structurally impossible to leak a draft to the public
site, and lets us cache the public API aggressively without touching admin auth.

### Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Node 20 + Express 4 | As requested |
| DB | MongoDB + Mongoose 8 | As requested; schema validation at the model layer |
| Auth | JWT access (15m) + refresh (7d, httpOnly cookie) | Refresh rotation; access token never in localStorage |
| Validation | Zod | Same schemas shareable with the frontend |
| Sanitize | `isomorphic-dompurify` | Server-side HTML sanitization (gap #6) |
| Uploads | Multer → Cloudinary/S3 | Never store binaries in Mongo |
| Security | helmet, cors, express-rate-limit, bcrypt | Baseline hardening |
| Logs | pino + pino-http | Structured JSON logs |
| Admin UI | React + Vite + TanStack Query + shadcn/ui | **Reuses the site's existing `ui/` components and React Query** |
| Editor | TipTap | Outputs clean HTML, easy to sanitize |
| Testing | Vitest + Supertest | Same runner as frontend |

---

## 2. Data models

Shared conventions on **every** collection:

```js
{
  _id, createdAt, updatedAt,          // timestamps: true
  createdBy, updatedBy,               // ref: User
  deletedAt: Date | null,             // soft delete (gap: Trash)
  version: Number,                    // optimistic concurrency
}
```

Publishable content additionally carries:

```js
{
  status: 'draft' | 'published' | 'scheduled' | 'archived',
  publishedAt: Date | null,
  slug: { type: String, unique: true, index: true },
  seo: { metaTitle, metaDescription, ogImage: ref Media, canonicalUrl, noIndex: Boolean },
}
```

### Collections

```
User            name, email(unique), passwordHash, role, avatar, lastLoginAt,
                failedLoginAttempts, lockedUntil, twoFactorSecret?, isActive

Media           filename, url, thumbnailUrl, mimeType, size, width, height,
                alt (required — a11y), caption, folder, usedIn[{model, docId}]

Service         title, slug, icon, image→Media, shortDescription,
                fullDescription(html), order, featured, status, seo

Project         title, slug, client, category, coverImage→Media, gallery[→Media],
                problem(html), solution(html), result(html), techStack[String],
                clientLogo→Media, liveUrl, featured, order, status, seo

Post            title, slug, excerpt, content(html), featuredImage→Media,
                category→Category, tags[→Tag], author→User,
                status, publishedAt, readingTime, seo

Category        name, slug, description                 (shared: posts/projects)
Tag             name, slug

Testimonial     clientName, company, photo→Media, companyLogo→Media, quote,
                rating(1-5), project→Project?, caseStudyUrl, featured, order,
                approvalStatus: 'pending'|'approved'|'rejected'

TeamMember      name, role, photo→Media, bio, department, socials{}, order, status

Job             title, department, location, type, description(html),
                applyEmail, status, closesAt
Application     job→Job, name, email, phone, resume→Media, coverLetter,
                status: 'new'|'reviewing'|'interviewed'|'rejected'|'hired'

Award           name, issuer, badges[{label, year, image→Media}], description,
                order, status                            ← gap #3
Certification   name, badge→Media, tags[String], description, order
Partner         name, logo→Media, url, order
Industry        name, image→Media, order

Lead            name, email, phone, company, message, sourcePage, ipAddress,
                status: 'new'|'contacted'|'qualified'|'converted'|'closed',
                notes[{ body, author→User, createdAt }],
                consentGivenAt, retentionExpiresAt      ← gap #8 (GDPR)

Subscriber      email(unique), confirmedAt, unsubscribedAt, source

HomePage        (singleton) hero{headline, subheadline, ctaText, ctaUrl, bgMedia→Media},
                featuredServices[→Service], featuredProjects[→Project],
                featuredTestimonials[→Testimonial],
                stats[{ label, value, suffix }]

Settings        (singleton) siteName, logo→Media, favicon→Media, contact{},
                socials{}, headerMenu[], footerMenu[], smtp{}, maintenanceMode,
                defaultSeo{}

Redirect        fromPath(unique), toPath, statusCode(301), createdReason
                                                          ← gap #5

Revision        model, docId, snapshot(Mixed), author→User, createdAt
                                                          ← gap #4

AuditLog        actor→User, action, model, docId, diff, ip, userAgent, createdAt
Notification    type, title, body, link, readAt, forRole
```

---

## 3. API surface

### Conventions

All list endpoints share one contract:

```
GET /api/v1/admin/<resource>
  ?page=1&limit=20&sort=-createdAt&q=search&status=draft&category=<id>

→ { data: [...], meta: { page, limit, total, totalPages } }
```

All errors share one shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "email": "Invalid" } } }
```

### Auth

```
POST   /api/v1/auth/login            → { accessToken } + refresh cookie   [rate limited 5/15m]
POST   /api/v1/auth/refresh          → { accessToken }                    (rotates refresh)
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password  [rate limited 3/hr]
POST   /api/v1/auth/reset-password
```

### Admin (JWT required)

```
GET    /api/v1/admin/dashboard                 summary cards + activity feed

CRUD   /api/v1/admin/{services|projects|posts|testimonials|team|jobs
                      |awards|certifications|partners|industries
                      |categories|tags|media|users|leads|subscribers}

PATCH  /api/v1/admin/{resource}/reorder        bulk order update (drag-drop)
POST   /api/v1/admin/{resource}/bulk           bulk publish/delete/restore
GET    /api/v1/admin/{resource}/:id/revisions
POST   /api/v1/admin/{resource}/:id/revisions/:revId/restore
GET    /api/v1/admin/trash                     soft-deleted across models
POST   /api/v1/admin/media/upload              multipart, ≤10MB, image/pdf only

GET    /api/v1/admin/home                      singleton
PUT    /api/v1/admin/home
GET    /api/v1/admin/settings
PUT    /api/v1/admin/settings                  [admin role only]

GET    /api/v1/admin/leads/export.csv
POST   /api/v1/admin/leads/:id/notes
DELETE /api/v1/admin/leads/:id/pii             GDPR erasure

GET    /api/v1/admin/audit-log
GET    /api/v1/admin/notifications
```

### Public (no auth, cached)

```
GET /api/v1/public/home
GET /api/v1/public/services            /services/:slug
GET /api/v1/public/projects            /projects/:slug
GET /api/v1/public/posts               /posts/:slug
GET /api/v1/public/testimonials
GET /api/v1/public/team
GET /api/v1/public/awards
GET /api/v1/public/jobs                /jobs/:slug
GET /api/v1/public/settings            nav, logo, contact, social
POST /api/v1/public/leads              [rate limited 3/hr/IP + honeypot]
POST /api/v1/public/subscribe          [rate limited]
POST /api/v1/public/applications       multipart resume
GET  /sitemap.xml                      generated
GET  /robots.txt
```

---

## 4. Security checklist

- [ ] bcrypt (cost 12) — never store or log plaintext passwords
- [ ] Access token 15m in memory; refresh 7d in `httpOnly; Secure; SameSite=Strict` cookie
- [ ] Refresh token rotation + reuse detection
- [ ] Login rate limit 5/15min + account lockout after 10 fails
- [ ] `express-rate-limit` global 100/15min; stricter on auth + public POST
- [ ] **Server-side DOMPurify on every rich-text field** (gap #6)
- [ ] Zod validation on every body/query — reject unknown keys
- [ ] Mongoose `strict: true`; never pass `req.body` straight into `update()` (mass-assignment)
- [ ] helmet + CORS allowlist (no `*`)
- [ ] Upload: MIME sniff (not just extension), 10MB cap, randomized filenames, no SVG upload
      unless sanitized (SVG carries JS)
- [ ] Honeypot field + rate limit on contact form (gap #7)
- [ ] Secrets in env only — never committed
- [ ] Audit log every mutation
- [ ] GDPR: lead retention TTL, export, erasure endpoint (gap #8)

---

## 5. Repo structure

Monorepo, keeping the existing site untouched at `/src`:

```
timeglobaltecherrorsolve/
├─ src/                     ← existing public site (refactor to fetch API)
├─ server/
│  ├─ src/
│  │  ├─ config/            env, db, cloudinary
│  │  ├─ models/            mongoose schemas
│  │  ├─ modules/           <resource>.{routes,controller,service,schema}.ts
│  │  ├─ middleware/        auth, rbac, validate, rateLimit, error, audit
│  │  ├─ lib/               sanitize, slug, mailer, pagination
│  │  ├─ app.ts
│  │  └─ index.ts
│  ├─ tests/
│  └─ package.json
├─ admin/                   ← admin SPA (React + Vite + shadcn)
│  └─ src/{pages,components,api,hooks,lib}
└─ ADMIN_PANEL_SPEC.md
```

---

## 6. Phased roadmap

Estimates assume one developer. **Each phase ships something usable.**

| Phase | Scope | Est. |
|-------|-------|------|
| **1 — Foundation** | Express skeleton, Mongo connection, User model, auth (login/refresh/me), RBAC, error handling, rate limiting, audit log, seed admin user | 4–5 d |
| **2 — Media + first module** | Media library (upload, list, alt text, picker UI), Services CRUD end-to-end. Proves the vertical slice. | 4–5 d |
| **3 — Admin shell** | Admin SPA: layout, nav, auth guard, login, dashboard, shared DataTable (pagination/search/sort/bulk), form primitives | 5–6 d |
| **4 — Content modules** | Projects, Posts (+TipTap, categories, tags, scheduling), Testimonials, Team, Awards, Home Page manager, reorder | 8–10 d |
| **5 — Leads + settings** | Lead inbox, statuses, notes, CSV export, email notify, SMTP settings, menu builder, GDPR endpoints | 4–5 d |
| **6 — Public API + site refactor** | Public endpoints, caching, **rewire the React site to fetch instead of hardcode**, sitemap, redirects | 6–8 d |
| **7 — Hardening** | Revisions/preview, trash/restore, notifications, tests, 2FA (optional), deploy | 4–6 d |

**Total ≈ 7–9 weeks.** Phase 6 is the one people underestimate — flagging it loudly.

---

## 7. Decisions needed before Phase 1

1. **Media storage** — Cloudinary (fastest: transforms + CDN free tier) vs AWS S3 vs local disk?
   → *Recommend Cloudinary.*
2. **Hosting** — where does the API live? (Railway/Render/VPS/Vercel functions) Mongo Atlas?
3. **Admin location** — `/admin` on the same domain, or `admin.timeglobaltech.com`?
   → *Recommend same domain, avoids CORS/cookie pain.*
4. **Blog comments** — build, or cut? → *Recommend cut.*
5. **Site refactor appetite** — is Phase 6 in scope now, or does the panel run ahead of the
   site for a while? This is the biggest scope question.
6. **How many admin users?** Drives whether 2FA and granular roles matter for v1.
7. **Language** — TypeScript for the server (consistent with the site) or plain JS?
   → *Recommend TypeScript.*

---

## 8. Summary of changes to the original spec

**Added:** Media Library · Awards/Certifications/Partners/Industries manager · Revisions +
preview · Trash/restore · Redirect manager · Global SEO (sitemap/robots/JSON-LD) ·
Subscribers · Editor/Author roles · GDPR endpoints · Spam protection · Server-side
sanitization · Brute-force protection · List/error conventions · Optimistic concurrency ·
Observability · **Public API + site refactor (the hidden 40%)**

**Cut / deferred:** Blog comments (spam magnet) · Theme & font customization (brand drift) ·
Backup UI (use Atlas) · Disk-space alerts (infra, not CMS) · 2FA (deferred to Phase 7)


---

## 9. Build log — what actually shipped

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Express+Mongo, JWT auth, RBAC, rate limiting, audit log, seed | ✅ `fbe4f5d` |
| 2 | Media library (magic-number sniffing), Services CRUD | ✅ `318738b` |
| 3 | Admin SPA at `/admin` (lazy chunk), dashboard, DataTable | ✅ `fd6934c` |
| 4 | Portfolio, Blog, Testimonials, Team, Home Page manager | ✅ `58a868f` |
| 5 | Leads inbox (CSV, GDPR), Settings (SMTP write-only) | ✅ `49e2c04` |
| 6 | Public CMS API + site wired to it | ✅ `135d682` |
| 7 | Slug redirects, sitemap.xml, robots.txt, dev-server fix | ✅ this commit |

### Deviations from the original plan

- **Storage is local-disk, not Cloudinary.** No credentials were provided. The
  driver interface exists; Cloudinary drops in behind it with no caller changes.
- **Rich text is a textarea, not TipTap.** Sanitization is active, so it is
  safe — just not WYSIWYG. Deliberately deferred.
- **Revision history / preview not built.** Soft-delete + restore covers the
  common "undo" case; full versioning was cut to ship the rest.
- **Automated tests not written.** Every phase was verified end-to-end against
  a live MongoDB by hand. This is the biggest remaining gap.
- **Comments, theme customization, backup UI, 2FA** — cut per §0, still cut.

### Bugs found by testing that types/builds could not catch

1. Honeypot returned a Zod field error, telling bots which field caught them.
2. `$set: { smtp: {…} }` replaced the whole subdocument, silently wiping the
   stored SMTP password whenever another SMTP field was saved.
3. Hero GSAP reveal ran once on mount; CMS copy arriving later would have
   rendered a permanently invisible headline.
4. Testimonial marquee derived its loop width from the bundled array length,
   desyncing when the CMS returned a different count.
5. `tsx watch` raced into EADDRINUSE on every save — 14 crashes per session.

### Remaining work

- Automated test suite (Vitest + Supertest) — the top gap
- Revision history + draft preview
- TipTap rich text
- Careers module + applicant inbox
- Notifications centre
- Cloudinary driver implementation
