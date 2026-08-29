# Time Global Tech — Website Improvement Plan

> Full codebase audit & beautification roadmap  
> Generated: June 2026

---

## Table of Contents

1. [Critical Bugs (Fix Immediately)](#1-critical-bugs)
2. [Broken Links & Emails](#2-broken-links--emails)
3. [UI / Design Inconsistencies](#3-ui--design-inconsistencies)
4. [Component-by-Component Issues](#4-component-by-component-issues)
5. [Page-by-Page Issues](#5-page-by-page-issues)
6. [Performance Problems](#6-performance-problems)
7. [Accessibility Gaps](#7-accessibility-gaps)
8. [SEO Improvements](#8-seo-improvements)
9. [Missing Features](#9-missing-features)
10. [Code Quality Cleanup](#10-code-quality-cleanup)
11. [Beautification Checklist](#11-beautification-checklist)
12. [Priority Order Summary](#12-priority-order-summary)

---

## 1. Critical Bugs

These will break the website or frustrate users right now.

### 1.1 Contact Form Does Nothing
- **File**: `src/components/ContactModal.tsx` lines 30–37
- **Problem**: The `handleSubmit` function shows a success state but never sends data anywhere. Users think they submitted but nothing is received.
- **Fix**: Integrate [Formspree](https://formspree.io) or a backend API. At minimum, add a visible disclaimer "We'll contact you via email."

### 1.2 Missing Icon Import — Runtime Crash
- **File**: `src/pages/TermsAndConditions.tsx` line 41
- **Problem**: `UserCheck` is used but not imported from `lucide-react`. Page will crash on load.
- **Fix**: Add `UserCheck` to the lucide-react import at the top of the file.

### 1.3 Privacy Policy Email is Broken
- **File**: `src/pages/PrivacyPolicy.tsx` line 226
- **Problem**: Email is written as `info (at) timeglobaltech.com` — this is not a clickable link.
- **Fix**: Change to `<a href="mailto:info@timeglobaltech.com">info@timeglobaltech.com</a>`

### 1.4 Footer Email is Broken
- **File**: `src/components/Footer.tsx` line 99
- **Problem**: Same issue — `info (at) timeglobaltech.com` instead of a real `mailto:` link.
- **Fix**: Use `href="mailto:info@timeglobaltech.com"` with the proper address displayed.

### 1.5 Portfolio "Learn More" Links Go Nowhere
- **File**: `src/components/Portfolio.tsx` line 122
- **Problem**: All case study buttons use `href="#"` — clicking does nothing.
- **Fix**: Either link to `/work` or individual case pages, or remove the button if no destination exists.

---

## 2. Broken Links & Emails

| Location | Issue | Fix |
|---|---|---|
| ~~`Footer.tsx:99`~~ | ~~`info (at)` not a real link~~ | ✅ Fixed |
| ~~`PrivacyPolicy.tsx:226`~~ | ~~Same broken email format~~ | ✅ Fixed |
| ~~`Portfolio.tsx:122`~~ | ~~`href="#"` on every case card~~ | ✅ Fixed → `/work` |
| ~~`ContactModal.tsx:178`~~ | ~~Privacy policy link is `href="#"`~~ | ✅ Fixed → `/privacy-policy` |
| ~~`Footer.tsx:153`~~ | ~~PSEB link points to wrong site~~ | ✅ Fixed → `pseb.org.pk` |
| ~~`CareersPage.tsx`~~ | ~~"View Openings" button scrolls nowhere~~ | ✅ Fixed → `#openings` |
| ~~`CareersPage.tsx`~~ | ~~"Our Culture" button has no action~~ | ✅ Fixed → `#culture` |

---

## 3. UI / Design Inconsistencies ✅ COMPLETED

### 3.1 Color Chaos ✅
- All `#00A375` → `to-emerald-600` in CollaborateCTA, HeroSection, Navbar (desktop + mobile)
- All `#00ff99` in Globe.tsx → `BRAND_GREEN` constant (`#00C48C`)
- Globe THREE.js DirectionalLight `0x00ff99` → `0x00C48C`
- Footer `text-[#00C48C]` / `hover:text-[#00C48C]` → `text-primary` / `hover:text-primary`

### 3.2 Border Radius Inconsistency ✅
- Bulk replaced all `rounded-[2rem]`, `rounded-[2.5rem]`, `rounded-[3rem]` → `rounded-3xl` across all pages and components

### 3.3 Button Style Inconsistency ✅
- CareersPage "View Openings" and "Send your CV" `hover:scale-105` → `hover:opacity-90`
- Portfolio CTA `rounded-full hover:scale-105` → `rounded-xl hover:opacity-90`
- CollaborateCTA, HeroSection `rounded-lg` → `rounded-xl`

### 3.4 TechStack Spacing Hack ✅
- Replaced `<br/><br/><br/><br/>` with `<div className="pb-16" />`

### 3.5 Dark/Light Section Mixing ✅
- `bg-[#0A0A0B]` → `bg-secondary` in CareersPage and StoriesPage
- `border-white/5` → `border-border/30` in dark section cards

---

## 4. Component-by-Component Issues

### Navbar (`src/components/Navbar.tsx`)
- [x] Line 44: Logo filter `light-logo-filter` with `invert(1)` may not render correctly on all browsers. Test and fix with a dedicated light/dark logo image if needed.
- [x] Line 91: Hardcoded `#00A375` gradient button — replace with `bg-gradient-to-r from-primary to-emerald-500`.
- [x] Mobile menu doesn't scroll to top on navigation. Add `window.scrollTo(0,0)` to Link onClick.

### HeroSection (`src/components/HeroSection.tsx`)
- [x] Line 101–111: Globe has `marginTop="-40px"` vs `marginTop="0"` depending on breakpoint — can cause layout shift on tablet. Add a `md:` breakpoint intermediate fix.
- [x] Shape3D is only 26 lines of pure CSS — lazy loading adds boilerplate with no measurable bundle gain. Skipped.

### Services (`src/components/Services.tsx`)
- [x] Line 163: Inline `style={{ paddingLeft: "52px" }}` — replaced with Tailwind `pl-[52px]`.
- [x] Accordion open/close lacks `aria-expanded` attribute — added.

### Footer (`src/components/Footer.tsx`)
- [x] Fix broken email (see §2 above).
- [x] All social icons already have `aria-label` and `target="_blank" rel="noopener noreferrer"` — verified, no changes needed.

### ContactModal (`src/components/ContactModal.tsx`)
- [x] Form submission is non-functional (see §1.1 above).
- [x] Line 178: Privacy policy `href="#"` broken (see §2).
- [x] Line 88: Heading "Hi, Time Global team!" reads from the wrong perspective. Changed to "Tell us about your project".
- [x] Spam protection added: honeypot (`_gotcha`), 3-second fill-time check, 60-second rate limit via localStorage.

### Portfolio (`src/components/Portfolio.tsx`)
- [x] Line 122: All CTA buttons point to `#` (see §1.5 above).
- [x] Portfolio uses fake UI mockup divs — no real images exist. Image optimization N/A for current implementation.

### Globe (`src/components/Globe.tsx`)
- [x] Line 235: `document.addEventListener("mousemove", ...)` fires on every pixel of movement — no throttle. Throttled with `requestAnimationFrame`.
- [x] Line 182–193: Fetches country GeoJSON from GitHub on every mount — added module-level `geoJsonCache` variable.

### Testimonials (`src/components/Testimonials.tsx`)
- [x] Line 198: `willChange = "transform"` is set but never removed in cleanup. Added `marquee.style.willChange = "auto"` in the cleanup function.
- [x] Cards tripled (`[...TESTIMONIALS × 3]`) — comment already present: "Duplicate for seamless infinite scroll".

### TechStack (`src/components/TechStack.tsx`)
- [x] Lines 430–432: `<br/><br/><br/><br/>` spacing hack — replaced with `<div className="pb-16" />`.
- [x] Icons were sliced by array index — added `ring: "inner" | "middle" | "outer"` property to each entry; rings now use `.filter()` instead of `.slice()`. Safe to add/remove icons anywhere.

### WhyUs (`src/components/WhyUs.tsx`)
- [x] Stats bar (the `STATS` array) is defined but never rendered in the component — rendered below cards grid.

### AnnouncementBar (`src/components/AnnouncementBar.tsx`)
- [x] Added dismiss button (X icon) with localStorage persistence — bar stays dismissed on reload.

---

## 5. Page-by-Page Issues

### HomePage (`src/pages/HomePage.tsx`)
- Good overall. Missing: transition between sections could use subtle dividers or gradient fades instead of hard cuts.

### WorkPage (`src/pages/WorkPage.tsx`)
- Line 141: `<main ref={containerRef}>` — `ref` should be on the outer container div, not `<main>`, to prevent footer spacing issues on short pages.
- Mostly duplicates content from WhyUsPage — consider merging or differentiating.

### ServicesPage (`src/pages/ServicesPage.tsx`)
- Lines 195–228: Large block of commented-out "Detailed Services Grid" — dead code that creates confusion. Remove or implement.
- Line 152: Button uses `rounded-lg` — inconsistent with rest of site that uses `rounded-xl`.

### StoriesPage (`src/pages/StoriesPage.tsx`)
- Line 196: Counter animation `data-value` parsing assumes number format — fails for numbers like `"1,000+"`. Sanitize the string before parsing.
- Three different section background colors (`#0A0A0B`, `background`, `bg-background`) — consolidate.
- Grayscale images (line 431) on the failure story section may jank on mobile — add `will-change: filter`.

### CareersPage (`src/pages/CareersPage.tsx`)
- Line 182: `activeDept` doesn't read from URL params. If a user shares `/careers?dept=Engineering` the filter defaults to "All".
- FAQ items lack `aria-expanded` on the toggle button — accessibility issue.
- "Apply Now" and "Send your CV" buttons have no actual action/link attached.

### WhyUsPage (`src/pages/WhyUsPage.tsx`)
- Nearly identical to WorkPage — either differentiate the content/purpose or merge into one page.

### PrivacyPolicy (`src/pages/PrivacyPolicy.tsx`)
- Line 181: `"Last Updated: June 2024"` is hardcoded. Update to current date or use a constant.
- Missing GDPR / CCPA sections for international compliance.
- Fix broken email (see §1.3).

### TermsAndConditions (`src/pages/TermsAndConditions.tsx`)
- Missing `UserCheck` import (see §1.2) — will crash.
- Ensure "Last Updated" date is accurate.

### CookiePolicy & RefundPolicy
- Ensure they follow the same layout structure as PrivacyPolicy for consistency.
- Verify all email links use proper `mailto:` format.

---

## 6. Performance Problems

| Issue | File | Impact | Fix |
|---|---|---|---|
| Unthrottled mousemove | `Globe.tsx:235` | High CPU | Throttle to rAF |
| GeoJSON fetched on every mount | `Globe.tsx:182` | Network req each visit | Import as static file |
| No image `srcset` | Multiple | Slow load, CLS | Add responsive image attributes |
| No `loading="lazy"` on below-fold images | Multiple | Slow LCP | Add lazy loading |
| Three.js bundle not code-split | `Globe.tsx` | Large initial JS | Use `React.lazy` + `Suspense` |
| `willChange` not cleaned up | `Testimonials.tsx:198` | Memory leak | Reset to `"auto"` in cleanup |
| Multiple simultaneous GSAP timelines | Multiple pages | Jank risk | Stagger initialization |

---

## 7. Accessibility Gaps

| Issue | Location | Fix |
|---|---|---|
| No `aria-label` on icon-only buttons | Navbar, Footer, Social icons | Add descriptive `aria-label` |
| No `aria-expanded` on accordions | Services, CareersPage FAQ | Add `aria-expanded={isOpen}` |
| No `aria-expanded` on mobile menu | Navbar | Add to hamburger button |
| Focus not trapped in ContactModal | `ContactModal.tsx` | Use Radix `Dialog` focus lock |
| Color contrast not verified | Entire site | Run WAVE or axe audit |
| Images missing descriptive `alt` text | Portfolio, Stories | Add meaningful alt text |
| Skip-to-content link missing | All pages | Add `<a href="#main">Skip to content</a>` |

---

## 8. SEO Improvements

| Issue | Fix |
|---|---|
| Only HomePage has meta description | Add `<meta name="description">` to every page via React Helmet |
| No structured data (JSON-LD) | Add `Organization`, `Service`, `FAQPage` schemas |
| Multiple H1s per page | Audit and ensure exactly one H1 per page |
| No canonical URLs | Add `<link rel="canonical">` to each page |
| Portfolio/case images missing alt | Add descriptive alt attributes |
| Sitemap exists but may be outdated | Verify `public/sitemap.xml` includes all routes |

---

## 9. Missing Features

### 9.1 Contact Form Backend
The form in `ContactModal.tsx` shows a fake success. Users are not actually contacted.
- **Quick fix**: Use [Formspree](https://formspree.io) (free tier, no backend needed).
- **Better**: Use an email API like SendGrid, Resend, or EmailJS.

### 9.2 Proper 404 Page
- **File**: `src/App.tsx` lines 35–37 has inline text for 404.
- **Fix**: Create `src/pages/NotFoundPage.tsx` with branded design and a "Go Home" button.

### 9.3 Error Boundaries
- No `ErrorBoundary` component exists. Any JS error crashes the entire app.
- **Fix**: Wrap `<main>` in a `<ErrorBoundary>` component.

### 9.4 Image Skeleton Loading
- No skeleton/placeholder while images load — causes layout shift.
- **Fix**: Use a blurred placeholder or Tailwind `animate-pulse` skeleton.

### 9.5 Analytics
- No user behavior tracking.
- **Fix**: Add Google Analytics 4 or Plausible (privacy-friendly) to track page views, CTA clicks, and form submissions.

### 9.6 WhyUs Stats Section Not Rendered
- `STATS` array is defined in `WhyUs.tsx` but the stats bar is not rendered in the JSX.
- **Fix**: Add the stats bar back below the cards grid (was likely accidentally removed).

---

## 10. Code Quality Cleanup

| Issue | File | Fix |
|---|---|---|
| 4× `<br/>` for spacing | `TechStack.tsx:430` | Replace with `py-20` |
| Dead commented code (service grid) | `ServicesPage.tsx:195–228` | Delete it |
| `STATS` defined but never used | `WhyUs.tsx` | Render it or delete |
| Hardcoded `#00A375` color | `Navbar.tsx:91` | Use `primary` CSS variable |
| Inline `paddingLeft: "52px"` | `Services.tsx:163` | Use `pl-14` Tailwind class |
| `"Last Updated: June 2024"` hardcoded | `PrivacyPolicy.tsx:181` | Update or use a constant |
| WhyUsPage duplicates WorkPage | Both pages | Differentiate content |
| Magic hex colors in Globe | `Globe.tsx:140` | Extract to named constants |

---

## 11. Beautification Checklist

Visual improvements that will elevate the overall look and feel.

### Typography
- [ ] Standardize heading scale: use `text-5xl` → `text-6xl` → `text-7xl` progression consistently across pages
- [ ] Ensure `font-bold` is used for all headings (some use `font-black` which looks heavy)
- [ ] Body text should consistently use `text-muted-foreground` — some places use `text-gray-400` (hardcoded)

### Cards
- [ ] Standardize all cards to: `rounded-2xl`, `border border-border`, `bg-card`, `p-8`, `shadow-sm hover:shadow-xl`
- [ ] Add consistent hover lift: `hover:-translate-y-1 transition-transform duration-300`
- [ ] Remove mixed use of `bg-[#16161A]` and `bg-card` — pick one per section context

### Sections
- [ ] Add section dividers or subtle gradient fades between sections instead of abrupt cuts
- [ ] Ensure every section has consistent top/bottom padding: `py-24` or `py-32` — no mixing of `py-16`, `py-20`, `py-28`, `py-32`
- [ ] Section label badges (the `<our work>` style chips) should all use the same size and style

### Buttons
- [ ] Primary button: `bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity`
- [ ] Secondary button: `bg-secondary border border-border px-8 py-4 rounded-xl font-bold hover:bg-secondary/80`
- [ ] Remove `hover:scale-105` on buttons — can feel jumpy; prefer `hover:opacity-90`

### Testimonials (Homepage vs Careers Style)
- [ ] Update homepage `Testimonials.tsx` to match the careers page "Employee Stories" style:
  - Dark section background `bg-[#0A0A0B]`
  - Large `Quote` icon from lucide-react in top-right of each card
  - Cards: `w-[450px]`, `rounded-[2.5rem]`, `bg-[#16161A]`
  - Quote text: `text-2xl text-gray-300 italic font-light`
  - Author photo + name + role at bottom with `border-t`

### Spacing Consistency
- [ ] Section horizontal padding: always `px-6` at section level
- [ ] Max content width: always `max-w-7xl mx-auto`
- [ ] Card internal padding: always `p-8` (not `p-5`, `p-6`, `p-10` mixed)

### Animations
- [ ] Reduce animation distance from `y: 60` to `y: 30` for subtler entrance effects
- [ ] Ensure all scroll-triggered animations use `once: true` to avoid re-triggering
- [ ] Add `will-change: transform` only to actively animating elements, remove after animation completes

---

## 12. Priority Order Summary

### Phase 1 — Critical (Do This Week)
- [x] Fix `TermsAndConditions` missing `UserCheck` import → prevents crash
- [x] Fix all broken email links (`Footer`, `PrivacyPolicy`)
- [x] Fix `ContactModal` — Formspree integration with loading/error states, fixed heading & privacy link
- [x] Fix Portfolio CTA buttons (now link to `/work`)
- [x] Fix Privacy/Terms "last updated" dates (updated to June 2026)

### Phase 2 — High Impact (Do This Month)
- [x] Render missing `STATS` section in `WhyUs.tsx`
- [ ] Standardize all button styles site-wide
- [ ] Standardize card `border-radius` and padding
- [x] Replace hardcoded `#00C48C` / `#00A375` hex colors with `text-primary` / `to-emerald-600`
- [ ] Add `aria-label` to all icon-only buttons
- [ ] Throttle Globe `mousemove` listener
- [x] Create proper 404 page component (`NotFoundPage.tsx`)
- [x] Remove dead code in `ServicesPage.tsx` (commented service grid deleted)
- [x] Fix PSEB footer link → `pseb.org.pk`
- [x] Fix TechStack `<br/>` spacing hack → `pb-16`

### Phase 3 — Beautification (Do This Quarter)
- [ ] Update Testimonials component to careers-page style
- [ ] Add section gradient dividers between sections
- [ ] Standardize typography scale across all pages
- [ ] Standardize section padding (`py-24` or `py-32` everywhere)
- [ ] Add image lazy loading and skeleton placeholders
- [ ] Add JSON-LD structured data for SEO
- [ ] Add meta descriptions to all pages
- [ ] Differentiate WhyUsPage from WorkPage content
- [ ] Add analytics tracking

### Phase 4 — Polish (Nice to Have)
- [ ] Add skip-to-content link for accessibility
- [ ] Add error boundaries around main content
- [ ] Add service worker / PWA manifest
- [ ] Add i18n support (Urdu at minimum)
- [ ] Implement proper component testing

---

> **Total Issues Found**: 40+  
> **Critical**: 5 | **High**: 15 | **Medium**: 12 | **Low/Beautification**: 10+  
> **Estimated time to fix Phase 1+2**: 2–3 days  
> **Estimated time for full Phase 1–3**: 1–2 weeks
