# Time Global — Site Review & Improvement Plan

> Page-by-page audit of the public site, admin panel and infrastructure.
> Every claim below was verified against the code, not assumed.
> Date: 2026-07-18 · Supersedes `IMPROVEMENT_PLAN.md` (June, pre-CMS)

**Legend:** 🔴 fix soon (bug / real cost) · 🟠 high value · 🟡 nice to have · ✅ done

> **Status 2026-07-19:** steps 1–5 of the plan are shipped (commits
> `f719d3b` … `39ebf7e`). Items below are marked ✅ as they land; the
> remaining backlog is unchanged and still accurate.

---

## 0. The five things I'd do first — all shipped ✅

| # | Item | What shipped |
|---|------|--------------------------------|
| 1 | ✅ **Per-page titles & meta** | `usePageMeta` on all 13 pages; blog articles emit their own title, excerpt and featured image as the share card. |
| 2 | ✅ **`DEPLOY.md` written** | Proxy rules for sitemap/robots/api/uploads, env, first boot, pre-DNS checklist. ⚠️ Still must be applied on the host. |
| 3 | ✅ **Entry 2.6 MB → 591 KB** | Globe (1.7 MB) lazy-loaded; react/motion/gsap split into cacheable vendor chunks. Beat the < 900 KB target. |
| 4 | ✅ **Careers + Work wired to the CMS** | Both read their modules; `/work/:slug` case-study pages added. Admin edits now change the site. |
| 5 | ✅ **Favicon path fixed** | `./public/assets/…` → `/assets/…`; the old path did not exist in a built site. |

---

## 1. Home `/`

Strong page after recent work (CMS hero, pinned portfolio rail, medallion awards, unified CTAs). Remaining:

- ✅ **Globe lazy-loaded** — own 1.7 MB chunk behind Suspense, so it never blocks first paint. A static poster below `sm` is still an option.
- ✅ **Blog preview removed from Work** — it also runs on the home page.
- 🟡 IndustryShowcase's "Live project activity" mockup lists fictional client names (NovaCorp, TechBridge) — same names we deleted from the old ticker. Fine as a stylised mock, but consider real (anonymised) data or clearly decorative styling.
- 🟡 Hero "industry" cards are `cursor-pointer` but not clickable — either link them (`/services`) or drop the pointer.

## 2. About `/about`

Recently rebuilt; hero matches Stories, counters run, marquee + testimonials + blog CMS-wired.

- 🟠 **Our Story image is a hotlinked Unsplash URL** hardcoded in JSX. Move to the media library (upload once, serve from own origin) — same for every Unsplash reference below.
- 🟡 Mission/Vision/Values/Why-Us copy is hardcoded. Fine editorially, but a `Settings`-style singleton ("About page" manager) would complete the CMS story.
- 🟡 Stats (13+/60+/16+/12) are duplicated in three places (About, Stories, seeds). Single source — the Home Page manager's stats — would stop drift.

## 3. Work `/work`

- ✅ **Work grid reads `/public/projects`**, with the bundled samples as fallback.
- ✅ **`/work/:slug` case-study page built** — problem → solution → result chapters, cover, tech stack, gallery, own meta/OG.
- ✅ Duplicated `BlogPreview` removed.
- 🟡 Category filter buttons exist visually but filter hardcoded data; wiring to CMS gives filtering for free (`?category=`).

## 4. Services `/services`

- 🟠 The services grid itself is CMS-wired via the `Services` component, but `DETAILED_SERVICES`, `VALUE_PROPS`, `FAQS`, `TECH_LIST` are all hardcoded. FAQs in particular are classic CMS content — a small FAQ module (question/answer/order) would pay for itself.
- 🟡 No service detail page either (`/services/:slug` is in the sitemap; router 404s → the redirect resolver then correctly falls through to a 404, but the sitemap advertises URLs that don't resolve). **Either build the detail page or stop listing service/project detail URLs in the sitemap** — advertising 404s to Google is worse than not listing them.

## 5. Stories `/stories`

In good shape after the animation fixes. 

- 🟡 Success/failure stories are hardcoded — they're really "case studies with a lesson field"; could become Projects with a `kind` flag, but low urgency.
- 🟡 Hero images: Unsplash hotlinks again.

## 6. Careers `/careers`

- ✅ **Openings read `/public/jobs`** — filters derive from the data, and the empty state invites a speculative CV.
- ✅ "Apply Now" is a real `mailto:` built from the job's `applyEmail`.
- 🟡 `CAREER_FAQS` → same future FAQ module as Services.

## 7. Awards `/awards`

- 🟠 Still placeholder-art by design (hotlink-blocked badges). The page reads well, but the "swap in official badge kits via Media" step from the original plan is still open — needs the actual files from each directory's member portal.
- 🟡 No closing CTA — the only page besides Blog without one. One-line `CollaborateCTA` add if wanted.

## 8. Blog `/blog` + `/blog/:slug`

Fresh feature layout + springy cards. Remaining:

- ✅ **`readingTime` computed server-side** when an editor leaves it unset; the two 0-minute posts were backfilled. 🟡 Those two still have no featured image — worth adding via admin.
- 🟡 No category filter/tag pages; tags render but link nowhere.
- 🟡 No prev/next or "related posts" on the article page — cheap retention win (3 same-category posts, API already filterable).
- ✅ Article OG image emitted from the post's featured image.

## 9. Policy pages (Privacy / Terms / Cookie / Refund)

- 🟡 Consistent and fine. Verify `info@timeglobaltech.com` is the real inbox (contact form notifications go to the Settings address — these pages are hardcoded).
- 🟡 They're not in the sitemap consistently (Privacy/Terms are; Cookie/Refund aren't) — minor.

## 10. 404 page

- Works, resolves redirects first, unified buttons. 🟡 Could log unresolved 404 paths to the API (one `notify()` call) so you *see* what's breaking in the wild.

## 11. Navbar & Footer

- ✅ **Footer navigation mirrors the navbar** (about/blog/awards added); service entries are links now, not plain text.
- 🟡 Navbar hides all links behind the hamburger below `lg` (1024px) — tablets get the mobile menu; consider `md` breakpoint.
- 🟡 Footer contact details are hardcoded; the public `/settings` endpoint already serves address/socials — wiring it would make Settings→General actually control the footer.

## 12. Contact modal

- 🟠 Background video: ensure it's compressed (< 2 MB) and `preload="none"`; it loads for every visitor who opens the modal.
- 🟡 Topic select options are hardcoded English strings stored into the message — fine, but if topics matter for triage, a `topic` field on Lead would let the inbox filter by it.

## 13. Cross-cutting

### Performance 🔴→🟠
- ✅ Entry split: lazy globe + `manualChunks` (react/motion/gsap) → 2.6 MB to 591 KB. 🟡 Below-the-fold section lazy-loading is a further win.
- Unsplash images: request sized variants (`&w=800` exists on some, not all) and add `sizes/srcset`; better, migrate to owned media.
- Fonts: check `font-display: swap`.

### SEO 🔴
- ✅ `usePageMeta` implemented and called on every page.
- ✅ Documented in `DEPLOY.md` — ⚠️ still needs applying on the host to take effect.
- Emit JSON-LD: `Organization` (site-wide), `Article` (blog posts), `JobPosting` (careers — free Google Jobs listing once Careers is CMS-wired).

### Accessibility 🟡
- ✅ `prefers-reduced-motion` respected site-wide via a blanket CSS rule (covers CSS, Tailwind, framer and GSAP).
- Icon-only buttons are mostly labelled; sweep once with axe.
- ✅ Slider body text bumped neutral-500 → 400. 🟡 Footer muted text worth a second look.

### CMS completeness 🟡
- Awards/Certifications/Partners admin modules were specced (§ADMIN_PANEL_SPEC) but the Awards *page* still renders hardcoded data — the models/routes were never built. Decide: build the module, or accept the page as hand-maintained.
- Rich text is still a `<textarea>` (TipTap deferred), applicant inbox deferred, Cloudinary driver stubbed — unchanged from the spec's build log.

### Ops 🟠
- **Nothing is pushed.** ~30 local commits on `main` with an auto-deploy workflow waiting. Decide deploy timing deliberately.
- ✅ `DEPLOY.md` written: proxy rules, env, first boot, pre-DNS checklist.
- Frontend has zero tests (backend: 60). At minimum, smoke-render each page with vitest + testing-library.

---

## Order of attack — progress

1. ✅ **SEO trio** — page-meta hook, favicon, `DEPLOY.md`, sitemap cleanup (`f719d3b`)
2. ✅ **Careers + Work CMS wiring** + `/work/:slug` case studies (`98488b6`)
3. ✅ **Bundle split** — lazy globe, vendor chunks (`b714afe`)
4. ✅ **Small wins** — footer links, duplicate preview, reading time (`529394f`)
5. ✅ **Reduced-motion + contrast** (`39ebf7e`)
6. ⬜ The 🟡 backlog as appetite allows.

### What's left, honestly

The highest-value remaining items, roughly in order:

- **Apply the proxy rules on the host** — `DEPLOY.md` documents them, but
  until the host config exists, sitemap/robots stay invisible in production.
- **Migrate Unsplash hotlinks to the media library** (About, Stories, seeds).
- **JSON-LD** — `Organization`, `Article`, and now that Careers is CMS-wired,
  `JobPosting` for a free Google Jobs listing.
- **Frontend tests** — still zero against 61 on the backend.
- **FAQ module** — would un-hardcode both Services and Careers FAQs.
- **Related posts / tag pages**, About-page CMS singleton, Awards module.
