import { useQuery } from "@tanstack/react-query";
import {
  STATIC_SERVICES,
  STATIC_PROJECTS,
  STATIC_POSTS,
  STATIC_TESTIMONIALS,
  STATIC_JOBS,
  STATIC_TEAM,
  STATIC_HOME,
} from "@/data/staticContent";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const CACHE_PREFIX = "tg_cms_cache_";

/**
 * Retrieves cached content saved from previous admin panel activity.
 */
export function getCachedCms<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return null;
}

/**
 * Saves fresh content received from the admin panel into the browser cache.
 */
export function setCachedCms<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
  } catch {}
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1/public${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`CMS ${path} → ${res.status}`);
  return (await res.json()).data as T;
}

/**
 * Public CMS reads with graceful static persistence & offline fallback.
 *
 * Rules:
 * 1. If fresh data arrives from the admin panel (API), automatically save it in browser storage.
 * 2. If the API is offline or not yet deployed, use previously saved admin data if available.
 * 3. If no admin data exists, seamlessly render the rich static default content.
 * 4. The website NEVER goes blank or broken without the admin backend.
 */
function useCms<T>(key: string, path: string, fallback: T) {
  const cached = getCachedCms<T>(key);
  const effectiveFallback = cached ?? fallback;

  const q = useQuery({
    queryKey: ["cms", key],
    queryFn: async (): Promise<T> => {
      try {
        const data = await get<T>(path);
        if (data && (!Array.isArray(data) || data.length > 0)) {
          setCachedCms<T>(key, data);
          return data;
        }
        return effectiveFallback;
      } catch {
        return effectiveFallback;
      }
    },
    initialData: effectiveFallback,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const finalData = q.data ?? effectiveFallback;

  return {
    data: finalData as T,
    isFallback: !q.data || (Array.isArray(q.data) && q.data.length === 0),
    isLoading: q.isLoading,
  };
}

/* -------------------------------- Types ------------------------------- */
export type CmsImage = { url: string; alt: string; width?: number; height?: number };

export type CmsHome = {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl: string;
    backgroundMedia: CmsImage | null;
  };
  featuredServices: { _id: string; title: string; slug: string; shortDescription: string; icon: string }[];
  featuredProjects: { _id: string; title: string; slug: string; client: string; category: string }[];
  featuredTestimonials: {
    _id: string; clientName: string; company: string; position: string; quote: string; rating: number;
  }[];
  stats: { label: string; value: string; suffix: string }[];
};

export type CmsService = {
  _id: string; title: string; slug: string; icon: string;
  shortDescription: string; fullDescription: string; image: CmsImage | null;
};

export type CmsTestimonial = {
  _id: string; clientName: string; company: string; position: string;
  quote: string; rating: number; caseStudyUrl: string;
  photo: CmsImage | null; companyLogo: CmsImage | null;
};

export type CmsProject = {
  _id: string; title: string; slug: string; client: string;
  category: string; techStack: string[]; coverImage: CmsImage | null;
  metrics?: { value: string; label: string }[];
  problem?: string; solution?: string; result?: string;
  liveUrl?: string;
  gallery?: CmsImage[];
};

export type CmsPost = {
  _id: string; title: string; slug: string; excerpt: string;
  content?: string;
  publishedAt: string | null; readingTime: number;
  featuredImage: CmsImage | null;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  author: { name: string } | null;
};

export type CmsJob = {
  _id: string; title: string; slug: string; department: string;
  location: string; type: string; description: string; applyEmail: string;
  closesAt: string | null;
};

export type CmsTeamMember = {
  _id: string; name: string; role: string; bio: string;
  department: string; photo: CmsImage | null;
  socials: { linkedin: string; twitter: string; github: string; website: string };
};

export type CmsStory = {
  _id: string;
  title: string;
  slug: string;
  type: "success" | "lesson";
  tag: string;
  desc: string;
  impact?: string;
  lesson?: string;
  challenge: string;
  solution?: string;
  fix?: string;
  color?: string;
  image?: CmsImage | null;
  imageUrl?: string;
  order?: number;
  status?: "draft" | "published" | "archived";
};

export const STATIC_STORIES: CmsStory[] = [
  {
    _id: "success-1",
    title: "From Crash-Prone Prototype to 100K Downloads",
    slug: "from-crash-prone-prototype-to-100k-downloads",
    type: "success",
    tag: "Mobile App",
    desc: "A health startup came to us with a half-built React Native app — 40+ crash reports open, no Android version, and an investor demo in 6 weeks. We took full ownership, rebuilt the core architecture, and shipped both iOS and Android on time. Within 60 days of launch, the app charted in the App Store's top 10 for Health & Fitness.",
    impact: "100K Downloads · Top 10 App Store",
    challenge: "Unstable codebase, no Android build, and a non-negotiable investor demo deadline threatening the next funding round.",
    solution: "Complete React Native rebuild with shared cross-platform logic, offline support, and a performance overhaul that cut load time by 65%.",
    color: "from-emerald-500/20 to-teal-500/20",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    order: 1,
    status: "published",
  },
  {
    _id: "success-2",
    title: "A Checkout Redesign That Tripled Revenue",
    slug: "a-checkout-redesign-that-tripled-revenue",
    type: "success",
    tag: "E-commerce & UI/UX",
    desc: "A fashion retailer had strong brand recognition and steady traffic — but was bleeding customers at checkout. We redesigned the end-to-end shopping experience, from product discovery to payment confirmation, with a relentless focus on mobile. The numbers changed within the first month.",
    impact: "3× Conversion Rate · 58% Drop in Abandonment",
    challenge: "A 6-step desktop-only checkout that was losing 74% of mobile visitors before they ever reached payment.",
    solution: "Mobile-first Shopify redesign with one-tap checkout, smart product recommendations, and a streamlined 2-step purchase flow.",
    color: "from-blue-500/20 to-indigo-500/20",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
    order: 2,
    status: "published",
  },
  {
    _id: "failure-1",
    title: "The Launch That Went Down in 11 Minutes",
    slug: "the-launch-that-went-down-in-11-minutes",
    type: "lesson",
    tag: "Web Development",
    desc: "A client pushed hard to launch their web platform ahead of schedule. We agreed — and skipped the load testing phase to make the deadline. On launch day, a traffic spike eight times our projected peak took the entire backend offline in under 11 minutes. The client lost thousands in sales. We lost sleep.",
    lesson: "Speed without resilience isn't delivery — it's a delayed disaster.",
    challenge: "No autoscaling configured, single-region deployment, and zero buffer for real-world traffic patterns.",
    solution: "We rebuilt the infrastructure with auto-scaling groups, multi-region failover, and CDN-level caching. Pre-launch stress testing is now mandatory on every project we ship.",
    fix: "We rebuilt the infrastructure with auto-scaling groups, multi-region failover, and CDN-level caching. Pre-launch stress testing is now mandatory on every project we ship.",
    color: "from-rose-500/20 to-orange-500/20",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    order: 3,
    status: "published",
  },
  {
    _id: "failure-2",
    title: "The Beautiful Interface Nobody Could Use",
    slug: "the-beautiful-interface-nobody-could-use",
    type: "lesson",
    tag: "UI/UX Design",
    desc: "We were proud of a dashboard redesign we delivered for an operations client. Visually, it was our best work to date. We were so confident we skipped formal user testing. Within days of launch, every power user was confused. Workflows they'd relied on for years had moved or disappeared. The client rolled back within a week.",
    lesson: "Great design is invisible. If users notice it, something is wrong.",
    challenge: "We optimised for aesthetics and modern patterns — ignoring the deeply ingrained mental models of users who had worked in the old UI for three years.",
    solution: "We rebuilt the design with real usability testing from the start. Now, no major UI ships without sessions with at least five actual users validating the flows.",
    fix: "We rebuilt the design with real usability testing from the start. Now, no major UI ships without sessions with at least five actual users validating the flows.",
    color: "from-amber-500/20 to-yellow-500/20",
    imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=1200",
    order: 4,
    status: "published",
  },
];

/* -------------------------------- Hooks ------------------------------- */
export const useHome = (fallback: CmsHome = STATIC_HOME) =>
  useCms<CmsHome>("home", "/home", fallback);

export const useServices = (fallback: CmsService[] = STATIC_SERVICES) =>
  useCms<CmsService[]>("services", "/services", fallback);

export const useStories = (fallback: CmsStory[] = STATIC_STORIES) =>
  useCms<CmsStory[]>("stories", "/stories", fallback);

export const useTestimonials = (fallback: CmsTestimonial[] = STATIC_TESTIMONIALS) =>
  useCms<CmsTestimonial[]>("testimonials", "/testimonials", fallback);

export const useProjects = (fallback: CmsProject[] = STATIC_PROJECTS) =>
  useCms<CmsProject[]>("projects", "/projects", fallback);

export const usePosts = (fallback: CmsPost[] = STATIC_POSTS) =>
  useCms<CmsPost[]>("posts", "/posts", fallback);

export const useJobs = (fallback: CmsJob[] = STATIC_JOBS) =>
  useCms<CmsJob[]>("jobs", "/jobs", fallback);

export const useTeam = (fallback: CmsTeamMember[] = STATIC_TEAM) =>
  useCms<CmsTeamMember[]>("team", "/team", fallback);

/* -------------------------------- Helpers ----------------------------- */

const LEGACY_PROJECT_SLUG_MAP: Record<string, string> = {
  "fintech-eu-uptime": "finpay-cross-border-payments-app",
  "retail-canada-migration": "tiptop-b2b-marketplace",
  "healthcare-ksa-patient-app": "canet-clinical-research-portal",
  "logistics-eu-predictive": "routewise-delivery-route-optimizer",
  "fashion-uae-ecommerce": "urbancart-same-day-grocery-marketplace",
  "edtech-australia-lms": "eduspark-cohort-based-learning-platform",
};

/**
 * Resolves a project by slug offline, from cache or static library.
 */
export function getStaticProject(slug: string) {
  const norm = slug.toLowerCase();
  const mapped = LEGACY_PROJECT_SLUG_MAP[norm] ?? norm;
  return (
    STATIC_PROJECTS.find(
      (p) =>
        p.slug.toLowerCase() === mapped ||
        p.slug.toLowerCase() === norm ||
        mapped.includes(p.slug.toLowerCase()) ||
        p.slug.toLowerCase().includes(mapped)
    ) ?? null
  );
}

/**
 * Resolves a blog post by slug offline, from cache or static library.
 */
export function getStaticPost(slug: string) {
  const norm = slug.toLowerCase();
  return (
    STATIC_POSTS.find(
      (p) =>
        p.slug.toLowerCase() === norm ||
        norm.includes(p.slug.toLowerCase()) ||
        p.slug.toLowerCase().includes(norm)
    ) ?? null
  );
}

/**
 * Looks up a redirect for an unmatched path. Returns null when there is none,
 * or when the API is unreachable — a dead CMS degrades to a normal 404.
 */
export async function resolveRedirect(
  path: string
): Promise<{ toPath: string; statusCode: number } | null> {
  try {
    return await get<{ toPath: string; statusCode: number } | null>(
      `/resolve?path=${encodeURIComponent(path)}`
    );
  } catch {
    return null;
  }
}
