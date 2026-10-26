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

/* -------------------------------- Hooks ------------------------------- */
export const useHome = (fallback: CmsHome = STATIC_HOME) =>
  useCms<CmsHome>("home", "/home", fallback);

export const useServices = (fallback: CmsService[] = STATIC_SERVICES) =>
  useCms<CmsService[]>("services", "/services", fallback);

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
