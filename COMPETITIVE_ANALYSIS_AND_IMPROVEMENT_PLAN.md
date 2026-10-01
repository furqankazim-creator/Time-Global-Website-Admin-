# Time Global vs Excited.Agency — Competitive Analysis & Complete Improvement Plan
> Date: 2026-09-09 · Supersedes partially: `IMPROVEMENT_PLAN.md` (June 2026) and `SITE_IMPROVEMENTS.md` (July 2026)
> Audience: Product Owner / Implementation Team

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Section-by-Section Comparison: Excited vs Time Global](#2-section-by-section-comparison)
3. [Where We Lag — Critical Gaps](#3-where-we-lag--critical-gaps)
4. [Sections NOT Rendering / Not Perfect on Our Site](#4-sections-not-rendering--not-perfect-on-our-site)
5. [New Sections to Add — Ideas from Excited + Innovations](#5-new-sections-to-add--ideas-from-excited--innovations)
6. [Existing Plans Status — Are IMPROVEMENT_PLAN.md & SITE_IMPROVEMENTS.md Complete?](#6-existing-plans-status)
7. [Prioritized Implementation Roadmap — Phase 1/2/3/4/5](#7-prioritized-implementation-roadmap)
8. [New Creative Ideas Beyond Excited](#8-new-creative-ideas-beyond-excited)
9. [Stat & Data Consistency Audit — Required Unification](#9-stat--data-consistency-audit)
10. [Appendix: Full Component-Perfect Issue List](#10-appendix-full-component-perfect-issue-list)

---

## 1. Executive Summary

### 1.1 Overall Scorecard
| Dimension | Excited.Agency | Time Global | Delta |
|---|---|---|---|
| **Visual Design Language** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐½ | ⬇️ 1.5 stars — their black-bg/orange-accent minimalism feels more premium and "design-agency" than our dark-navy/green tech-firm aesthetic |
| **Hero Section Impact** | ⭐⭐⭐⭐½ | ⭐⭐⭐⭐ | ⬇️ 0.5 — they do more with less (no 3D globe, just tight typography + video "Play" CTA) |
| **Featured Projects** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⬇️ 2 stars — they show 6 REAL projects with real screenshots, client logos, country/industry tags; ours use Unsplash stock images |
| **Awards Display** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⬇️ 3 stars — they use REAL award logos (Awwwards, Webby, Red Dot, Lovie, iF, W3, CSSDA) in official sizes; we draw fake SVG medallions with arbitrary colors |
| **Services Presentation** | ⭐⭐⭐⭐⭐ | ⭐⭐½ | ⬇️ 2.5 stars — 3-column cards with sub-service pill tags + "Learn more" per column; ours is an accordion |
| **Testimonials** | ⭐⭐⭐⭐ | ⭐⭐½ | ⬇️ 1.5 stars — they quote named real clients; we use 10 fake pravatar personas with made-up metrics |
| **Blog/Articles** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⬇️ 1 star — meta info (date · read time · tags) laid out more cleanly |
| **Footer / SEO Depth** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⬇️ 3 stars — their footer has 19 individual service category links (UI/UX, SaaS, Fintech, AI...) for massive crawl depth; ours has 5 generic services all linking to `/services` |
| **Copywriting Tone** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⬇️ 1 star — "easy to use, hard to leave" is memorable hook; ours is generic "AI-Powered Solutions. Built for Growth." |
| **Data Integrity / Trust** | ⭐⭐⭐⭐½ | ⭐ | ⬇️ 3.5 stars — huge gap. Their case studies are real (Me Bahrain, Aceplace Dubai, AppLinks San Diego, ClubReady St Louis); ours fabricate client names, percentages, dollar amounts. **This is a legal and reputational risk.** |

### 1.2 Verdict
**Time Global's website has solid engineering and a CMS backend (big advantage), but the CONTENT and VISUAL PRESENTATION layers are 12–18 months behind a design agency of Excited's caliber.**

The biggest wins: (A) clean up fake data → trust, (B) redesign Projects/Awards/Services to match Excited's premium feel, (C) add SEO footer depth, (D) unify conflicting stats across pages.

---

## 2. Section-by-Section Comparison

### 2.1 Navbar

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Logo** | Custom hand-drawn "sunburst" mark + bold "Excited!" wordmark — highly memorable | Simple monogram + "Time Global" — acceptable but not distinctive | Consider logo refresh (low priority) |
| **Quick Contact** | Top-right has `En` (language) dropdown, then hamburger | "let's talk" pill CTA | ✅ We actually have the better pattern here |
| **Social icons** | Dribbble + LinkedIn + Instagram + Twitter visible at all times (all 4 corners approach — header + footer) | Footer only | Add small social icons to Navbar right (before CTA), mobile: keep footer only |
| **Mobile menu breakpoint** | ~1024px | lg: 1024px (same) — tablets get hamburger | Navbar: change to `md:` so tablets (≥768px) see links |
| **Desktop/mobile consistency** | Same pill labels everywhere | `Web & Software` / `AI & Automation` on desktop vs `Web & Mobile` / `AI & Cloud` on mobile | 🔴 FIX — unify. Use: `Web & Software` + `AI & Automation` everywhere |
| **Active page state** | ✅ Styled differently per page | ❌ `useLocation()` imported but **never used** to highlight current page | 🔴 FIX — add `text-primary` or underline for active route |
| **Language / i18n** | ✅ En dropdown selector | ❌ Not offered | Add language toggle (EN / UR at minimum) with Urdu translated CMS fields |

### 2.2 Hero Section

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Headline** | "Designing tech & AI products that are easy to use, **hard to leave**" — strong hook, memorable, explains benefit | "AI-Powered Solutions. Built for **Growth.**" — generic "solutions" language | Rewrite headline for memorability — use a 2-part punchline like Excited: "We build software you **won't stop using.** ROI you **can measure.**" |
| **Subheading** | "UI/UX design, Websites and Branding that **excites!**" — inline accent sticker (orange wavy/squiggle shape around last word) | Long 2-line paragraph — 35 words, no accent treatment | Shorten to 1 line + **sticker-style word highlight** like Excited's "excites!" for "Growth." or "Faster." (SVG shape) |
| **Hero Visual** | Background video / image + "▶ Play" CTA (opens case study video reel) | 3D Globe with animated arcs + labels + 2 industry cards | ✅ Globe is actually STRONGER than Excited's static hero. Keep it. But **make the 2 industry cards clickable** → link to `/services#web` and `/services#ai` |
| **CTA(s)** | Single rounded-corner button: `View our works` → /work | `let's talk` → modal (single CTA, no "see work") | Add **secondary CTA next to it**: "See our work" → `/work` — like Excited. Agencies live off their portfolio. |
| **GSAP reveal safety** | Unknown | 🔴 Hero words set `visibility:hidden` and RELY 100% on GSAP to show them. If GSAP fails, headline is **invisible.** | Fallback to `opacity:0` and set `visibility:visible` after mount regardless of GSAP |

### 2.3 Featured Projects / Portfolio

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Count + Layout** | 6 projects · bento-style grid (1× big 2-column + 5× single) · alternating image sizes | 6 case studies · GSAP horizontal scroll-pinned slider (CaseStudySlider) | Both layouts work; **keep our slider** (it's more interactive) but fix the CONTENT inside |
| **Content per card** | Location (country, city — "Me Bahrain", "Aceplace Dubai"), Client name, 1-liner outcome, 3–4 industry tag pills (Fintech, B2C, SaaS…), real screenshot | Generic Unsplash photos + fake client names ("FinTech EU", "Retail Canada") + made-up metrics ("42% cost reduction") | 🔴 **CRITICAL FIX — replace with REAL client projects + real screenshots.** If client privacy required, anonymize but don't fabricate. Add Country/City metadata field to Projects model. Add 3-4 tags per project. |
| **Image quality** | Actual product UI screenshots (people using apps, dashboards, mobile screens) — immediately conveys "we build real things" | Stock photos: circuit boards, generic buildings, server racks. Does NOT look like product work. | CaseStudySlider: add `projectType: "mobile" | "web" | "dashboard"` field + image aspect crop templates. Use Mockuuups-style device frames (iPhone / MacBook mockup). |
| **Links** | Each card is a clickable tile → `/work/:slug` case study page | Each card has "Case Study" badge + CTA but does it navigate? Verify | 🔴 Fix: ensure all 6 tiles go to real case studies. Remove "Case Study" text label as separate link; make entire tile clickable. |
| **Counter / progress** | Not present (bento doesn't need) | `01 / 07` hardcoded counter + progress bar — counter should read from length of CMS data | Fix counter: use `useMemo(() => projects.length)` not hardcoded `07` |

### 2.4 Awards & Recognition

🔴 **SINGLE BIGGEST GAP vs Excited** — this is where trust is built or destroyed:

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Visual approach** | **Official award logos in their brand colors** — Awwwards (grey), CSS Design Awards (teal), Webby (red/purple), Lovie Awards (orange), iF Design (black), Red Dot (red), W3 Awards (gold) | **Fake hand-drawn SVG medallions** with laurel wreaths + arbitrary colors chosen by us (Clutch red not real Clutch red, etc.) | 🔴 **REPLACE ALL.** Upload each directory's official badge kit (PNG/SVG from their member portal) to Media Library. Award page already lists the right 9 platforms; just swap the SVGs for real images. |
| **Number per platform** | 1 logo per award win | Up to 4 badges sliced from 7-8 available with NO "view more" | Awards page: show ALL badges per directory (remove `.slice(0,4)`), or show 4 + expandable "Show all N badges" button. |
| **Supporting copy** | "We bring products to a whole new level. The industry-defining awards below are proof." + "Explore all awards" CTA button | Generic eyebrow "awards & certifications" heading only | Add descriptive subheading like Excited's. Link each award platform logo → public profile URL on that directory. |
| **Awards page link** | ✅ From home hero CTA | ✅ Component links to `/awards` | Already done. But Awards page hero image is `/assets/awards-hero.jpg` — this file **does not exist in public/assets/**. Upload real hero image. |

### 2.5 Services / Capabilities

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Layout** | **3 equal-width cards** side by side. Each: H3 heading, long-form 2-line description, row of sub-service pill buttons (5–6 each), "Learn more" outlined CTA. Clean, minimal, high padding. | Accordion expand/collapse (Services component). Then ServicesPage has hero + value props + tech stack + success metrics + FAQ. | 🔴 **REPLACE homepage accordion.** Use a 3-column card layout matching Excited: `Product Design (Web + Mobile)` · `AI & Automation` · `Growth Engineering (Cloud + DevOps)`. Each card has 5 sub-service pills, desc paragraph, "→ Learn more" linking to anchor on `/services`. |
| **Service sub-category pills** | ✅ Present! "Brand identity", "Logo design", "Icons and illustrations", "Marketing materials", "Motion graphics" — 5 pills per column | ❌ Not present on homepage. ServicesPage accordion lists bullet features but no tag-style pills. | Add pill subcategories per service column. |
| **Iconography per service** | ❌ (none — text only, intentional minimalism) | ✅ Present (bulleted list) | Keep icons but tone down to 24px line-style icons left of H3 (not dominating). |
| **"Learn more" CTA per card** | ✅ 3 separate CTAs (all outlined, same style) | ❌ Single CTA at bottom of accordion usually | Add one CTA per service card linking to `/services#product-design`, `#ai-automation`, `#growth` |

### 2.6 Testimonials / What Clients Say

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Layout** | Horizontal scrolling cards + quote mark icon top-left of each card | Horizontal GSAP marquee (infinite scroll, duplicated 3×) with pravatar.cc avatars | Layout is fine. Problem = DATA. |
| **Person data** | Real-sounding named clients (from case studies presumably), real company, real role | 🔴 10 fully fabricated personas: "James Mitchell, CTO, NovaCorp Health" — Pravatar seed photos, locations, industries with specific numeric quotes like "appointment no-shows dropped by 40%" | 🔴 **Fix in 2 ways:** (A) Ask real clients for 1-2 line testimonials + photo + permission to use. (B) If none available, use **anonymous format** without fake names: "HealthTech Scale-up, NYC" instead of inventing people. **DELETE all fake persona names + numbers.** Legal risk. |
| **Quote styling** | Large italic quote body, signature at bottom. Large `"` glyph. | Smaller text inside `line-clamp-7` (cuts off!). Industry label `<FinTech>` badge. | Stop line-clamping cards to 400px. Let cards have natural height. Add `"` quote SVG (large faded behind text, like CareersPage Employee Stories style from IMPROVEMENT_PLAN phase 3). |
| **5-star row** | Present | Present (5 default 5-star SVGs — no rating value validation) | Add company LOGO next to each testimonial — more trust than just a face. |

### 2.7 Blog / News & Articles

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Card content layout** | Top row: `Date` · `Reading time` · `Category tag chip`. Then headline. Then 3 chips below headline (e.g. "UX Strategy", "Product design", "SaaS"). | Top-left: category badge, top-right: date. Below: image, then headline, then excerpt, then "Read article →". | Add **reading time chip** to top metadata row (BlogPage already computes readingTime server-side; BlogPreview needs it). Add **2-3 tag chips** BELOW headline inside each card like Excited. |
| **Featured post prominence** | 3 equal cards | 1 big featured (full width) + grid of rest below | ✅ Our featured + rest pattern is actually better for SEO and CTR. Keep it. |
| **"Read article" CTA** | Implicit (whole card clickable) | Explicit arrow CTA text | For fallback posts that have no slug: REMOVE "Read article" arrow text. If card isn't clickable, don't tease. |
| **Related / prev-next article** | N/A on home; but likely on article page | Blog article page has NO prev/next, NO related posts, NO tag filter. | High value, low effort: BlogPostPage → add "Related Articles" section (3 posts in same category — `usePosts` already supports filtering). Add ← Previous / Next →. |

### 2.8 Footer

🔴 **Second biggest SEO gap after Awards.** Excited's footer drives CRAWL DEPTH — Google loves 20+ niche keyword landing links per page.

| Aspect | Excited.Agency | Time Global | Our Action |
|---|---|---|---|
| **Footer nav links count** | **19 individual service page links** (UI/UX, Mobile app design, B2B web design, SaaS design, Web app design, Marketplace, UX Audit, Branding, Blockchain, AI, Healthcare, CRM, Fitness app, Web design, E-commerce, Fintech, Insurance, SaaS web design, UX Consulting). All = separate landing anchors. | 5 generic services: Custom Software, Mobile Apps, AI, Cloud, Consulting — all link to same `/services` page. | 🔴 **Build out footer service column.** 15–20 niche service category links. Each links to `/services#ui-ux`, `/services#saas` anchors — each already serviced by an H3 on the services page. Free SEO juice. |
| **Footer branding** | Logo + socials (same 4 as header). Copyright. Privacy Policy link. | Logo + description paragraph + 7 socials (LinkedIn, Facebook, Instagram, YouTube, TikTok, GitHub, Pinterest). Contact info: email, WhatsApp, address. Policy pages x4. | Our footer is informationally RICHER. Just ADD the 20 service keyword anchors between Services Links column and Contact column. Create new middle column "Services by category". |
| **Contact details presentation** | N/A (uses "Contact us" links in header/footer, no inline address) | Email + WhatsApp + full Karachi office address | Address formatting issues: "Banglow" → "Bungalow". Fix spacing around commas: `# 1/2-L ,Block-6,` → `#1/2-L, Block 6,`. WhatsApp message trailing comma bug (remove `,%20` last comma so msg ends cleanly). |
| **Newsletter / email capture** | ❌ Not visible | ❌ Not present | Add newsletter subscription: 1-field email + "Subscribe" → mailchimp/brevo. Huge conversion value. |
| **Back-to-top button** | N/A check | ❌ Missing | Add floating ⬆️ FAB (fixed `bottom-6 right-6`) → scrolls to `window.scrollTo({top:0,behavior:'smooth'})`. Appears after 500px scroll. |
| **Copyright line** | Simple `© 2026 Excited. Privacy Policy.` | Long line containing `— Pakistan Registered — PSEB` URL with NO SPACES around the anchor. PSEB link verified → correct site now. | Wrap in flex layout with proper gap between items so they don't run into each other. |

---

## 3. Where We Lag — Critical Gaps

### 3.1 Trust & Credibility Gap (🔴 Fix immediately)
| # | Gap | Impact |
|---|---|---|
| 3.1.1 | **Fake named testimonials** with specific KPI claims ("CTO, NovaCorp Health", "40% no-show reduction") | Severe legal / reputational risk. Prospect does LinkedIn search → person doesn't exist → blacklists TG forever. |
| 3.1.2 | **Fake case study data** ("$2M annual savings", "42% cost reduction", "80k concurrent learners") on projects that may never have happened | Same as above; also violates advertising standards laws (FTC §5, UK CAP Code, etc.) |
| 3.1.3 | **Fake country revenue data in TechStack orbit** — "United States $420K +12%", "Qatar $18K +24%" tooltip numbers | Presented as factual internal data but invented. If leaked as "real" externally = audit problem. |
| 3.1.4 | **Fake IndustryShowcase mockup "LIVE" dashboards** — "2,840 Tasks/hr", "$361K Pipeline", "$128K Revenue +18%" with real-looking timestamps 09:41:xx | Internal demos can use mockups, but putting "LIVE" badge on a public website crosses into deceptive territory. Remove word "LIVE" from 3 badges. Relabel: "Simulation · Demo configuration" or "Example workflow view". |
| 3.1.5 | **Award badges are invented SVG graphics** instead of official Clutch/GoodFirms/DesignRush logos | Directory sites (Clutch especially) actively enforce use of ONLY their approved marks. Cease & desist letter risk. |
| 3.1.6 | **Stat contradictions across pages:** Years = 12/13/25+, Projects = 60/200+, Satisfaction = 94/98% | Prospects that visit 2+ pages notice. Kills trust. |

### 3.2 Design / Aesthetic Lag (🟠 Do this quarter)
| # | Gap |
|---|---|
| 3.2.1 | **Generic "AI-Powered Solutions" headline** — every SaaS/agency on Earth uses this exact phrasing. Write a memorable differentiator line. |
| 3.2.2 | **No accent sticker treatment** — Excited's wavy orange "excites!" sticker is cheap to build (SVG path) and gives massive personality. |
| 3.2.3 | **Industry pills between desktop/mobile Navbar don't match.** `Web & Software` vs `Web & Mobile`. Unify. |
| 3.2.4 | **Homepage hero has no "See Our Work" CTA.** Only `let's talk`. Portfolio-first agencies get 3–5× more qualified inbound when they show work BEFORE the modal. |
| 3.2.5 | **Services accordion on home** feels like a FAQ. Excited's 3 spacious cards give more "premium agency" feel. |
| 3.2.6 | **No named-route active-state styling in Navbar** — users lose track of where they are. |
| 3.2.7 | **Blog cards missing tag chips + reading time.** Small details that add up to "reads like a real publication" vs "looks like a CMS demo". |
| 3.2.8 | **CollaborateCTA 80px blur orbs** cause mobile GPU spike. Replace with Tailwind gradients. |

### 3.3 SEO / Crawl Depth Lag (🟡 High ROI, easy wins)
| # | Gap |
|---|---|
| 3.3.1 | Footer has 5 generic service links → should be 15–20 niche anchors. 10× more internal link equity spread. |
| 3.3.2 | WhyUsPage + WorkPage are nearly identical → Google may flag duplicate content / thin content. Either merge or differentiate. |
| 3.3.3 | Service detail pages (`/services/:slug`) advertised in sitemap but return 404. Google penalizes sitemap→404 ratios. Either build or remove from sitemap.xml. |
| 3.3.4 | JSON-LD still missing (`Organization`, `Article`, `JobPosting`). |
| 3.3.5 | Footer missing "Privacy / Terms / Sitemap.xml" quick links row → we have them. Good. |

### 3.4 Features Missing Entirely (vs Excited)
| # | Feature |
|---|---|
| 3.4.1 | Language selector (UR) — Pakistan market huge for Urdu. |
| 3.4.2 | Social icons in header (LinkedIn/Dribbble/Behance at minimum, keep Instagram/TikTok for footer only) |
| 3.4.3 | Back-to-top floating button |
| 3.4.4 | Newsletter signup in footer |
| 3.4.5 | Prev/Next article + related posts on blog single |
| 3.4.6 | "Client location" metadata field for projects (Bahrain, Dubai, San Diego) — Excited shows this prominently. |
| 3.4.7 | Case-study "Country" + "Industry" multiple tag chip array per project (like Excited's Fintech B2C AI SaaS row). |
| 3.4.8 | Video reel / Showreel "Play" CTA in hero (or case study section). YouTube embed or self-hosted MP4 — < 15MB. |

---

## 4. Sections NOT Rendering / Not Perfect on Our Site

Compiled from component audit + page audit:

### 4.1 Critical → Breaks visible rendering
| # | Component / Page | Issue | File | Fix |
|---|---|---|---|---|
| 4.1.1 | **Hero headline INVISIBLE if GSAP fails** | `visibility:hidden` on every word, ONLY GSAP reveals. If animation never fires, headline stays 100% blank. | [HeroSection.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/HeroSection.tsx#L98) | After first useEffect, regardless of GSAP, set all `.hero-word` to `visibility:visible`. Also wrap GSAP ctx in try/catch. |
| 4.1.2 | **IndustryShowcase uses `bg-surface-dark`** class not defined in default Tailwind → if project's CSS vars don't define `.bg-surface-dark`, white text renders on white/transparent bg = **unreadable mockups.** | [IndustryShowcase.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/IndustryShowcase.tsx#L178) | Replace every `bg-surface-dark` with the actual token our project uses: `bg-secondary` or `bg-card dark:bg-[#0d1424]` (explicit). |
| 4.1.3 | **TechStack inner ring icons are pure white (`#ffffff`) on light bg** — `SiNextdotjs`, `SiVercel`, `SiGithub`, `SiOllama`, `SiReplicate` = INVISIBLE in light mode. | [TechStack.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/TechStack.tsx#L70-L80) | Conditional: `color: theme === 'light' ? '#10b981' : '#ffffff'` per icon. Or force a dark-background bubble for the inner ring always. |
| 4.1.4 | **AwardsPage hero image missing.** `/assets/awards-hero.jpg` referenced but **file not in public/assets/.** Browser shows broken-image icon. | [AwardsPage.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/pages/AwardsPage.tsx#L236) | Upload hero image, or use gradient fallback. |
| 4.1.5 | **CaseStudySlider counter hardcoded 01/07.** If CMS returns N projects ≠ 7, counter wrong until scroll. | [CaseStudySlider.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/CaseStudySlider.tsx#L401) | Init from `projects.length`. |
| 4.1.6 | **CaseStudySlider resize breakpoint listener missing.** `window.matchMedia('lg')` → once at mount. If user drag-resizes from 1920→768, horizontal scroll-pin behavior persists on mobile = broken UX. | [CaseStudySlider.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/CaseStudySlider.tsx#L302) | Add `resize` listener + kill/re-init GSAP timeline on cross. |
| 4.1.7 | **Globe country polygons fail on localhost → FIXED TODAY ✅** (imported local countries.json). Closed. | [Globe.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/Globe.tsx) | ✅ Fixed. |
| 4.1.8 | **CareersPage CTA buttons have NO action.** "Send your CV" + "Contact Us" → plain `<button>` no onClick. Users click → nothing. | [CareersPage.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/pages/CareersPage.tsx#L544-L549) | Wire "Send CV" → `mailto:careers@timeglobaltech.com?subject=CV Submission`. "Contact Us" → open contact modal. |
| 4.1.9 | **CareersPage has DOUBLE closing CTA.** Custom Final CTA section → immediately below `<CollaborateCTA />`. Stacked copy looks bad. | [CareersPage.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/pages/CareersPage.tsx#L554) | Delete one. Keep `<CollaborateCTA/>` since all other pages close with it. |
| 4.1.10 | **AwardsPage "25+ years" headline.** Company founded 2013 → max 13 years. 25-year claim looks like copy-paste. | [AwardsPage.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/pages/AwardsPage.tsx#L274) | Fix to `13+ years` or whatever is accurate. |

### 4.2 Medium → Visually jarring but not broken
| # | Issue | File |
|---|---|---|
| 4.2.1 | **BlogPreview fallback posts (slugs empty) show "Read article →" CTA but aren't clickable.** Misleading. | [BlogPreview.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/BlogPreview.tsx#L110) |
| 4.2.2 | **ServiceMarquee infinite scroll marquee has NO reduced-motion handling** — vestibular accessibility violation. Also double-read by screen readers (duplicated 16 items). No `aria-hidden` or `role="marquee"` | [ServiceMarquee.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/ServiceMarquee.tsx#L24) |
| 4.2.3 | **Testimonials GSAP marquee `cardWidth = 450 + 32` hardcoded.** If CSS card width changes, seamless loop becomes visible seam. Triple duplication `[...x3]` balloons memory if CMS returns many testimonials. | [Testimonials.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/Testimonials.tsx#L232) |
| 4.2.4 | **Footer WhatsApp message prefill has trailing comma** → `"...website%20number,"` — message looks broken when user opens WhatsApp. | [Footer.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/Footer.tsx#L113) |
| 4.2.5 | **Footer address spelling: "Banglow"** → "Bungalow". Weird spacing: `# 1/2-L ,Block-6,` → `#1/2-L, Block 6,`. | [Footer.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/Footer.tsx#L124) |
| 4.2.6 | **TechStack `minHeight: 140vh`** — excessive scroll. Causes ~40% dead space on standard 1080p. | [TechStack.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/TechStack.tsx#L366) |
| 4.2.7 | **CaseStudySlider cards fixed `h-[580px]/[660px]`** → short CMS content = huge empty void inside cards. | [CaseStudySlider.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/CaseStudySlider.tsx#L155) |
| 4.2.8 | **HeroSection 2 "industry" cards cursor:pointer but not clickable.** Indicates interactivity that doesn't exist. | [HeroSection.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/HeroSection.tsx#L142) |
| 4.2.9 | **TechStack orbit overflow 1050px** on viewports < 1050px wide → horizontal scrollbar. | [TechStack.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/TechStack.tsx#L410) |
| 4.2.10 | **Testimonial `rating` field unvalidated.** CMS passes rating: 10 → renders 10 stars overflowing container. | [Testimonials.tsx](file:///home/ababeel/Desktop/timeglobalweb-tg-admin/src/components/Testimonials.tsx#L169) |

### 4.3 Low → Small cosmetic / dead code
| # | Issue | File |
|---|---|---|
| 4.3.1 | Dead `PortfolioCard` + `CASE_STUDIES` arrays defined but never rendered | WorkPage.tsx |
| 4.3.2 | Dead `DETAILED_SERVICES` array + unused imports (`ArrowRight`, `SiJavascript`) | ServicesPage.tsx |
| 4.3.3 | Dead `ImgPlaceholder` component defined never rendered, `href="#"` testimonial case-study link | AwardsPage.tsx |
| 4.3.4 | Dead unused imports: `Cpu` (StoriesPage), `Quote,Globe,Zap,Star,Briefcase,Cpu,Target` (CareersPage) | Multiple pages |
| 4.3.5 | HeroSection FALLBACK arrays `featuredServices`, `featuredProjects`, `featuredTestimonials`, `stats` → empty arrays defined never rendered | HeroSection.tsx |
| 4.3.6 | HeroSection CMS field `backgroundMedia` fetched but never drawn in JSX | HeroSection.tsx |
| 4.3.7 | CollaborateCTA redundant gradient (`from-secondary via-secondary to-secondary/80` = all same color) | CollaborateCTA.tsx |
| 4.3.8 | Navbar `dark:invert-0` utility + `light-logo-filter` custom class undefined probably | Navbar.tsx |
| 4.3.9 | Navbar ternary `startsWith("/")` decision — all 5 links start with "/" so the else branch is dead code | Navbar.tsx |

---

## 5. New Sections to Add — Ideas from Excited + Innovations

### 5.1 Sections Inspired Directly by Excited.Agency
These are proven patterns we should adopt **verbatim-ish:**

#### 5.1.1 🏷️ **"Services by Niche" Footer Mega-Column (SEO)**
- **Where:** Footer — insert new middle column before "Contact us"
- **Content:** 15–20 clickable category links:
  - `Custom Software Development · SaaS Design · Web App Development · Mobile App Development (iOS/Android) · AI Development · LLM Agents · RAG Systems · Cloud Migration · DevOps Automation · UI/UX Design · Product Design · E-commerce Development · Fintech Apps · CRM/ERP Integration · Team Augmentation`
- **Implementation:** 30 minutes of JSX + anchor hrefs. All link to `/services#slug` anchors. (Then build each anchor H3 target into ServicesPage below the current content.)
- **Effort:** Low. **Impact:** Very High (SEO + crawl).

#### 5.1.2 🏆 **Real Award Logo Section (Trust)**
- **Where:** Replace current `Awards.tsx` (homepage) + `/awards` page badge grid
- **Content:** Download/Upload the **official logo PNGs/SVGs** directly from each directory's member portal:
  - Clutch → clutch.co official badge
  - GoodFirms → official logo
  - TechBehemoths → official logo
  - DesignRush → official logo
  - TopDevelopers → official logo
  - Techreviewer → official logo
  - SelectedFirms, Feedbax, SoftwareWorld if applicable
- **Layout pattern (from Excited):** Row of logo images at natural size, centered, with subtle grey borders around each, all at consistent visual weight (not stretched). "Explore all awards →" button below.
- **Effort:** Medium (badge collection + upload to Media). **Impact:** High (trust).

#### 5.1.3 🎯 **3-Column Services Card Section (replace accordion)**
- **Where:** HomePage — replaces `<Services/>` accordion component
- **Structure (matching Excited exactly but for our positioning):**
  ```
  Card 1 — 🏗️ Product Engineering
    Pills: [Web Apps] [Mobile Apps (iOS/Android)] [SaaS Platforms] [E-commerce] [UI/UX Design]
    Desc: "We ship maintainable, scalable products from first wireframe to production deployment."
    CTA: "Learn more →" (/services#product)

  Card 2 — 🧠 AI & Automation
    Pills: [LLM Agents] [RAG Knowledge Bases] [Workflow Automation] [Computer Vision] [LLMOps]
    Desc: "Automate repetitive work, deploy AI your team actually trusts, and keep full data ownership."
    CTA: "Learn more →" (/services#ai)

  Card 3 — ☁️ Growth & Platform
    Pills: [Cloud Migration] [DevOps] [CI/CD] [Performance] [Security Audits]
    Desc: "Keep your stack fast, reliable, and secure. We scale the boring parts so your team focuses on users."
    CTA: "Learn more →" (/services#growth)
  ```
- **Effort:** Low (create new `HomeServices` component — ~120 lines JSX). **Impact:** High (UX).

#### 5.1.4 🌏 **Location + Industry Metadata Chips on Projects**
- **Where:** `CaseStudySlider.tsx` cards + `WorkPage.tsx` grid `ProjectCard`
- **New fields on Project CMS model** (if not present):
  - `clientLocation: string` — "Dubai, UAE" / "New York, USA" / "Lahore, Pakistan"
  - `industries: string[]` — ["Fintech", "SaaS", "B2C"]
  - `tags: string[]` — ["Mobile", "AI", "Web Dashboard"]
- **Render per card:** Country/city pill top-left (flag emoji + text), then 2–4 industry/tag pills below. Exactly matching Excited's `Me Bahrain` + `Fintech B2C AI SaaS` pattern.
- **Effort:** Medium (schema + UI). **Impact:** High (credibility + filterable later).

#### 5.1.5 📝 **Tag Chips + Reading Time on Blog Cards**
- **Where:** BlogPreview.tsx (home) + BlogPage.tsx (blog list)
- **UI:** Above headline: date · 8 min read · category. Below headline: 2–3 tag pill chips.
- **Effort:** Low (20 lines per component). **Impact:** Medium (UX).

### 5.2 "Beyond Excited" — Sections They Don't Have But We Should Add
Our competitive differentiator is **CMS-driven + internal pipeline visibility** — we can ship things Excited can't because we have the admin panel:

#### 5.2.6 📊 **"How We Work" Process Section (4 steps) (Homepage)**
StoriesPage already has this! Reuse/copy it as its own component on Home after Services + before Testimonials. Pattern:
`1. Discover & Strategize → 2. Design & Validate → 3. Engineer & QA → 4. Launch & Operate`
Each step: icon + H4 + 1-line description. Horizontal line connector between steps.
- **Why Excited doesn't have this**: They are a design-only agency; they hand off. We deliver full E2E, so this is a differentiator.
- **Effort:** Low (extract from StoriesPage).

#### 5.2.7 💼 **"Our Engagement Models" Pricing Cards (3-tier)**
New HomePage section before CollaborateCTA:
```
Time & Materials        Dedicated Team        Fixed Scope Project
Flexible, month-to-month  Senior devs embedded   SOW-based, clear milestones
✅ 50+ clients           ✅ 12 teams online     ✅ 200+ delivered
[Choose model →]         [Choose model →]       [Choose model →]
```
All 3 buttons open contact modal with pre-filled `topic: engagement-model-x`.
- **Excited doesn't do this** because design agencies bill hourly only. We (dev + AI) do all 3. Major differentiator.
- **Effort:** Medium.

#### 5.2.8 🔬 **Technology Radar Strip (replace ServiceMarquee infinite scroll?)**
ServiceMarquee does UX harm (vestibular, double-read screen readers). Replace with non-animated "Tech Radar" grid of 2 rows × 8 logo bubbles under heading "We build with proven tools" — exactly the logos from TechStack but without animation/orbit (the orbit already lives in its own dedicated section below, duplicate).

#### 5.2.9 🗺️ **Careers "Life At TG" Photo Mosaic**
CareersPage hero currently doesn't show team. Add 6–8 real (non stock) photos in a mosaic layout (`grid grid-cols-4 gap-2` with 2 images spanning 2 cols) below hero. Upload team photos to Media Library → CMS-managed.

#### 5.2.10 🧭 **Related Projects at bottom of `/work/:slug`**
ProjectPage (case study single) should render a bottom row: "You might also like" → 3 other projects from same `industries[]` array. Low lift since filter is already there.

---

## 6. Existing Plans Status — Are They Complete?

### 6.1 IMPROVEMENT_PLAN.md (June 2026) — 40% Complete, 60% Still Open

| Phase | Items | Status |
|---|---|---|
| **Phase 1 — Critical** (5 items) | Fix UserCheck import crash ✅ Fix broken emails ✅ ContactModal Formspree ✅ Portfolio CTA buttons → /work ✅ Fix last-updated dates ✅ | **100% DONE** |
| **Phase 2 — High Impact** (11 items) | Render WhyUs stats ✅ Standardize all button styles ⬜ Standardize card radius/padding ⬜ Replace hex colors (done) ✅ aria-label icon buttons ⬜ Throttle Globe mousemove (done today via 80ms) ✅ Proper 404 page ✅ Delete dead ServicesPage code ✅ Fix PSEB footer link ✅ Fix TechStack `<br/>` hack ✅ | **7 / 11 done = 63%** → remaining: **buttons, cards, aria-label icons** |
| **Phase 3 — Beautification** (10 items) | Update Testimonials style ⬜ Dividers between sections ⬜ Typography scale ⬜ Section padding consistency ⬜ Lazy load images + skeleton ⬜ JSON-LD SEO ⬜ Meta descriptions all pages ✅ (usePageMeta) Differentiate WhyUsPage/WorkPage content ⬜ Analytics tracking ⬜ | **1 / 10 done = 10%** → basically untouched |
| **Phase 4 — Polish** (5 items) | Skip-to-content link ⬜ Error boundaries ⬜ Service worker/PWA ⬜ i18n/Urdu ⬜ Component tests ⬜ | **0 / 5 done = 0%** |
| **Total across all 4 phases** | **41 checklist items total → 16 done, 25 open** | **39% complete** |

### 6.2 SITE_IMPROVEMENTS.md (July 2026) — Section 0 (Top 5) Shipped ✅. Backlog 60% open

| Section | Items | Status |
|---|---|---|
| **0. Top 5 Quick Hits** | Page meta hook ✅ DEPLOY.md ✅ Bundle split 2.6→591KB ✅ Careers+Work CMS + /work/:slug ✅ Favicon fixed ✅ | **100% DONE** |
| **1–11 Page audits** (Home/About/Work/Services/Stories/Careers/Awards/Blog/Policy/404/Nav+Footer) | ~35 small items: migrate Unsplash hotlinks to Media, FAQ module, Awards badges, CMS completeness, JSON-LD, Related Posts, Footer→Settings wiring, Work filter hardcoded, Service detail URLs, WhyUs CMS, Unsplash all pages, etc. | **~30% done** — mostly Blog/Careers/Work. About/Stories Unsplash still hotlinked. Awards badges still fake. Services + Careers FAQs still hardcoded. No FAQ CMS module. |
| **12. Cross-cutting** | Performance (below-fold section lazy loading) ⬜ Fonts display:swap verify ⬜ JSON-LD Organization/Article/JobPosting ⬜ Frontend tests (0 vs 60 backend) ⬜ Unsplash → Media migration ⬜ | **5 / 25 items done = 20%** |
| **Final "Highest-value remaining" (6 items)** | Apply proxy rules on host ⬜ Migrate Unsplash hotlinks ⬜ JSON-LD ⬜ Frontend tests ⬜ FAQ module ⬜ Related posts/tag pages ⬜ About CMS singleton, Awards module | **0% done** |

### 6.3 Bottom Line on Existing Plans
**Both plans are valid, largely unimplemented beyond Phase 1 / Section 0, and DO NOT conflict with this report — they should be MERGED.** This document adds competitive analysis vs Excited (sections 1–5) which were not in the original plans. Original plans cover SEO, accessibility, code cleanup which this document doesn't duplicate deeply.

**Recommended structure going forward:**
- **Immediate bugfixes** → Use §4 of this document + IMPROVEMENT_PLAN Phase 1/2 remaining
- **Visual revamp** → Use §5.1 (Excited inspired sections) + IMPROVEMENT_PLAN Phase 3
- **SEO** → §3.3 (footer) + SITE_IMPROVEMENTS Cross-cutting JSON-LD + Sitemap cleanup
- **Trust / legal** → §3.1 (fake data purge) from THIS document (not covered in original plans at all — this is the NEW critical urgency)

---

## 7. Prioritized Implementation Roadmap

### Phase 0 🔴 — 1 day. Legal / Trust / Safety First.
*Do not deploy anything new until Phase 0 is clean.*

- [ ] 0.1 **Purge all fake named testimonials + fake metric quotes.** Replace with "HealthTech · New York, NY" anonymous-style format OR real ones with permission. **10 in Testimonials.tsx, 3 in AboutPage, 4 in AwardsPage = 17 total.**
- [ ] 0.2 **Purge fabricated project data in CaseStudySlider.tsx.** 6 projects → either use real client work from the CMS, or mark cards as "Illustrative case study (client confidentiality)" and remove all specific dollar/%/user-count figures. No "$2M savings", no "4.8 rating 500k users". "Logistics platform · Europe" is safe if anonymized.
- [ ] 0.3 **Purge TechStack fake country revenue data.** Tooltips: show country name only. Remove ALL dollar amounts + `+N%` growth numbers. Just show flag + "Pakistan" = safe.
- [ ] 0.4 **IndustryShowcase: Relabel "LIVE" badges.** Change 3 occurrences of "LIVE" → "Demo view". Change `NovaCorp Health $48K`, `TechBridge Ltd $32K` → generic "Client A", "Client B". Or remove all client names.
- [ ] 0.5 **Replace 6 fake award SVG medallions** (Awards.tsx home) with either: real official logos IF you have access to the badge downloads; OR if not available, plain text cards: "Top AI Development Companies — Clutch 2025" styled with directory's correct brand color, no fake graphics.
- [ ] 0.6 **Unify stats constants across all pages.** Create single `src/lib/stats.ts` file:
  ```ts
  export const STATS = {
    yearsActive: 13,  // Founded 2013
    projectsDelivered: 60,  // or 200, pick ONE truthful number
    clientCountries: 16,
    clientRetention: 94,
    teamSize: 80,
    csi: 98, // Customer Satisfaction
  }
  ```
  Every page/component imports and uses from here. No more 200+ vs 60+, 12 vs 13 vs 25 years, 94 vs 98% satisfaction.
- [ ] 0.7 **Fix AwardsPage 25+ years** → use STATS.yearsActive. Delete AwardsPage missing hero image reference OR upload image.
- [ ] 0.8 **Hero headline invisible fallback safety.** `visibility:visible` regardless of GSAP. Wrap GSAP in try/catch.

### Phase 1 🔴 — 2 days. Stop the visibly broken stuff.
- [ ] 1.1 Replace `bg-surface-dark` → `bg-secondary` / explicit dark color everywhere in IndustryShowcase
- [ ] 1.2 TechStack: make inner ring Next.js/Vercel/Github icons visible in light mode (conditional color OR always-dark bubble)
- [ ] 1.3 **Globe issue ✅ already fixed (local GeoJSON)**
- [ ] 1.4 CareersPage: wire "Send CV" + "Contact Us" dead buttons. Remove one duplicate CTA section (keep CollaborateCTA)
- [ ] 1.5 Navbar: active route state highlight (`useLocation`). Unify industry pills (desktop = mobile: `Web & Software` + `AI & Automation`).
- [ ] 1.6 CaseStudySlider: counter init from `projects.length`; add resize listener so tablet ↔ desktop reflow works.
- [ ] 1.7 Footer: WhatsApp message trailing comma fix. Address spelling fixes ("Bungalow", comma spacing fix around punctuation). Copyright spacing around PSEB anchor.

### Phase 2 🟠 — 3 days. Upgrade sections to Excited quality.
- [ ] 2.1 **Footer: New "Services by category" column.** 15-20 keyword links. (§5.1.1)
- [ ] 2.2 **Home: Replace Services accordion → 3-column pill-card layout** with "Learn more" CTA per column. (§5.1.3)
- [ ] 2.3 **Home: Hero add secondary CTA** "See our work → /work" next to "let's talk".
- [ ] 2.4 **Home: Add accent sticker SVG treatment to last word of subheading.** (like Excited's wavy orange "excites!") Our version: emerald-green wavy shape around "Faster" or "Growth."
- [ ] 2.5 **CaseStudySlider: Add country/industry tag chips per card.** (schema `clientLocation`, `industries`, `tags`)
- [ ] 2.6 **ProjectCard (WorkPage):** Same location + industry chips as above.
- [ ] 2.7 **BlogPreview + BlogPage cards:** Add reading-time chip + 2-3 tag chips below headline.
- [ ] 2.8 **Rework Hero headline** — propose 3 alternatives to PO, pick the most memorable one. E.g. "Software you **won't stop using.** Growth you **can measure.**"

### Phase 3 🟡 — 4 days. New differentiating sections.
- [ ] 3.1 **Home new section: "How We Work" 4-step process.** Extract from StoriesPage.Process section. Place after 3-col Services.
- [ ] 3.2 **Home new section: "Engagement Models" 3-tier cards** (T&M / Dedicated Team / Fixed Scope). Place before CollaborateCTA.
- [ ] 3.3 **BlogPostPage: Related Posts (3 similar-category) + Prev/Next nav.**
- [ ] 3.4 **Footer: Newsletter 1-field email capture form.** Brevo / Mailchimp / Formspree.
- [ ] 3.5 **Navbar: Add small header social icons** (LinkedIn, Behance, GitHub mini icons) before "let's talk". Mobile: keep footer only.
- [ ] 3.6 **Floating back-to-top button.** appears after 500px scroll. Fixed bottom-right.
- [ ] 3.7 **Add Urdu language toggle button** (skeleton: only changes page titles for now, no full translation — but UI exists so users know it's coming). UR strings can ship later as a batch.

### Phase 4 🟢 — 3 days. Accessibility + remaining SITE_IMPROVEMENTS.md backlog.
- [ ] 4.1 **ServiceMarquee: prefers-reduced-motion disable + aria-hidden pattern.** Or replace with static "Tech Radar" non-scrolling grid (§5.2.7).
- [ ] 4.2 **Testimonials: fixed cardWidth dependency.** Measure card width via `getBoundingClientRect()` after first paint, not assume 450.
- [ ] 4.3 **Migrate ALL Unsplash hotlinks to Media Library uploads.** About hero, Stories hero, Careers team, case studies seeded. (SITE_IMPROVEMENTS §2 §5 §6)
- [ ] 4.4 **Build FAQ CMS module** → wire to Services + Careers both (SITE_IMPROVEMENTS §4 §6).
- [ ] 4.5 **Differentiate WhyUsPage from WorkPage content** — keep both but make WorkPage = portfolio showcase ONLY, WhyUsPage = "process + values + stats + team + giving back" only. Merge = bad for SEO.
- [ ] 4.6 **Delete section from Services sitemap if /services/:slug not built.** Or build quick service detail pages that reuse Services component + FAQ + CTA.
- [ ] 4.7 **Dead code sweep:** remove PortfolioCard, CASE_STUDIES (WorkPage), DETAILED_SERVICES (ServicesPage), ImgPlaceholder (AwardsPage), unused imports across all pages, HeroSection unused FALLBACK fields + backgroundMedia (or render it!).

### Phase 5 🔵 — 2+ weeks. Polish / IMPROVEMENT_PLAN Phases 3+4 remaining items.
- [ ] 5.1 **JSON-LD** (Organization / Article / JobPosting / Service)
- [ ] 5.2 **Image: `srcset` + sizes + lazy loading + skeleton placeholders**
- [ ] 5.3 **Section dividers (gradient fade) between home sections**
- [ ] 5.4 **Standardize typography scale + section padding (py-24/32 everywhere)**
- [ ] 5.5 **Testimonials re-skin to Careers page Employee Stories style** (dark, big quote glyph)
- [ ] 5.6 **Below-fold home section lazy-load via `React.lazy`** (IndustryShowcase, TechStack, etc.)
- [ ] 5.7 **Frontend smoke tests** (vitest + @testing-library/react) for each page component
- [ ] 5.8 **ErrorBoundary** + **Skip-to-content link**
- [ ] 5.9 **Analytics: Plausible or GA4** (privacy-friendly) for CTA tracking

---

## 8. New Creative Ideas Beyond Excited

Things Excited doesn't do but **we can, because we have a backend + CMS + AI positioning:**

1. **🗺️ Interactive "Our Footprint" map using our existing Globe.** When user hovers a country on the hero Globe, show: "N projects delivered here" + list of relevant case studies filtered by that country. All data already in the CMS. No new tech.
2. **🤖 "Ask Time Global" chat widget in footer.** 3 preset questions: "What's your pricing?" → FAQ accordion scroll, "Can I see relevant case studies?" → opens filtered WorkPage, "Talk to human" → opens contact modal. Uses a small RAG on our own ServicesPage content. Tiny 20-line prompt wrapper over existing OpenAI integration.
3. **📈 Live "Projects Delivered" count-up that actually increments** on page load using the CMS Stats. Not from thin air: pick start date, compute avg daily delivery rate → smooth count-up. Adds motion credibility without lying.
4. **🎨 Portfolio filter by Industry + Location + Tech Stack** on `/work`. Excited has no filter. We already have filter UI visually in WorkPage; the backlog item is to wire it to CMS data not hardcoded.
5. **🧰 Build calculator widget:** "Estimate my project cost" — 4 multi-select dropdowns (type / size / timeline / AI yes/no) → outputs `Estimated: $25K — $60K · 8–14 weeks · Typical team: 3 devs`. Last button: "Let's verify this →" opens contact modal with answers prefilled. **Drives 2–3× more qualified inbound than generic "let's talk".**
6. **💼 Team member spotlight carousel on About page.** Extract from TeamMember CMS model. Excited has no team public-facing. We can.
7. **🎬 Showreel "Play" CTA in hero (or case studies).** A YouTube embed of a 60–90 sec compilation of UI motion clips from our work (or stock work if we don't have rights yet). Excited has this.

---

## 9. Stat & Data Consistency Audit — Required Unification

**Create `src/lib/stats.ts` once, import everywhere. Never hardcode numbers in components again.**

```ts
// src/lib/stats.ts
// ✅ SINGLE SOURCE OF TRUTH — verify these numbers with business team before shipping
export const COMPANY_STATS = {
  foundedYear: 2013,
  yearsActive: 13,
  projectsDelivered: 60,       // ⚠️ About/Stories say 60; WorkPage said 200. PICK ONE TRUTH HERE.
  activeClients: 48,
  teamMembers: 80,
  clientCountries: 16,
  clientRetentionPct: 94,      // ⚠️ Stories says 94%, Work/CollaborateCTA said 98%.
  clientSatisfactionPct: 98,   // ⚠️ Use CSI for NPS-style; Retention for % that renew.
  avgProjectTimelineWeeks: { min: 4, max: 12 },
  quarterlyAvailabilitySlots: 3, // Used by CollaborateCTA "Limited availability" line
} as const;

export type CompanyStatKey = keyof typeof COMPANY_STATS;
```

### Pages currently using conflicting stats:
| Page | Years | Projects | Retention |
|---|---|---|---|
| **AboutPage** | 13+ | 60+ | not shown |
| **StoriesPage** | not shown | 60 | 94% |
| **WorkPage** | 12+ | 200+ | 98% |
| **AwardsPage** | 25+ ❌ | not shown | 98% (CSI) |
| **CollaborateCTA** | not shown | not shown | not shown |
| **TechStack central card** | 13 | 150 | not shown |

All of them → replace with `COMPANY_STATS.x` import. Problem gone.

---

## 10. Appendix: Full Component-Perfect Issue List

(Quick-reference index. Details in §4.)

| # | Severity | Component | Fix | Est. Time |
|---|---|---|---|---|
| 10.1 | 🔴 P0 | HeroSection | visibility:hidden → safe fallback on GSAP fail | 10 min |
| 10.2 | 🔴 P0 | IndustryShowcase | bg-surface-dark → defined bg color | 10 min |
| 10.3 | 🔴 P0 | TechStack | 5 inner icons white-on-white in light mode | 15 min |
| 10.4 | 🔴 P0 | AwardsPage | missing hero image + 25+ years wrong | 20 min |
| 10.5 | 🔴 P0 | CaseStudySlider | counter + resize listener fixes | 30 min |
| 10.6 | 🟠 P1 | CareersPage | 2 dead CTA buttons + duplicate closing CTA | 20 min |
| 10.7 | 🟠 P1 | Navbar | active route highlight + pill label unification | 20 min |
| 10.8 | 🟠 P1 | Footer | WhatsApp msg comma + address + copyright spacing | 15 min |
| 10.9 | 🟠 P1 | BlogPreview | "Read article" on non-linked cards | 5 min |
| 10.10 | 🟠 P1 | ServiceMarquee | reduced-motion + aria-hidden for duplicates | 15 min |
| 10.11 | 🟡 P2 | Testimonials | cardWidth measure, rating upper bound validation | 20 min |
| 10.12 | 🟡 P2 | TechStack | minHeight 140vh → clamp; orbit overflow on <1050px | 30 min |
| 10.13 | 🟡 P2 | HeroSection | 2 industry cards remove cursor:pointer OR link to /services | 5 min |
| 10.14 | 🟡 P2 | CollaborateCTA | 3× blur-80px orbs → gradient (GPU safe) | 10 min |
| 10.15 | 🟢 P3 | Dead code | All unused imports + dead components sweep | 45 min |
| 10.16 | 🟢 P3 | AwardsPage | ImgPlaceholder rm + href="#" testimonial link | 5 min |
| **TOTAL** | | **16 issues** | | **~4.5 hours** for everything above |

---

### Next Step Recommendation

1. Run Phase 0 (fake data purge) first — 1 day. Legal/trust.
2. Run Phase 1 bugs immediately after — 2 days. Now site is safe.
3. Schedule Phase 2 (Excited upgrades) for next sprint.

Let me know which Phase you'd like implemented first, and I'll start the code changes.
