import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1/public${path}`);
  if (!res.ok) throw new Error(`CMS ${path} → ${res.status}`);
  return (await res.json()).data as T;
}

/**
 * Public CMS reads.
 *
 * Design rule: the marketing site must NEVER go blank because the API is
 * down. Every hook returns `data ?? fallback`, so components render their
 * existing hardcoded content until the CMS has something better to say.
 * That also keeps the site deployable before the CMS is populated.
 */
function useCms<T>(key: string, path: string, fallback: T) {
  const q = useQuery({
    queryKey: ["cms", key],
    queryFn: () => get<T>(path),
    staleTime: 60_000,
    retry: 1,
    // A failed CMS fetch is not worth a retry storm on every focus.
    refetchOnWindowFocus: false,
  });
  return {
    data: (q.data ?? fallback) as T,
    /** True when we're showing fallback content, not CMS content. */
    isFallback: !q.data,
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
};

export type CmsPost = {
  _id: string; title: string; slug: string; excerpt: string;
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
export const useHome = (fallback: CmsHome) => useCms<CmsHome>("home", "/home", fallback);

export const useServices = (fallback: CmsService[] = []) =>
  useCms<CmsService[]>("services", "/services", fallback);

export const useTestimonials = (fallback: CmsTestimonial[] = []) =>
  useCms<CmsTestimonial[]>("testimonials", "/testimonials", fallback);

export const useProjects = (fallback: CmsProject[] = []) =>
  useCms<CmsProject[]>("projects", "/projects", fallback);

export const usePosts = (fallback: CmsPost[] = []) =>
  useCms<CmsPost[]>("posts", "/posts", fallback);

export const useJobs = (fallback: CmsJob[] = []) =>
  useCms<CmsJob[]>("jobs", "/jobs", fallback);

export const useTeam = (fallback: CmsTeamMember[] = []) =>
  useCms<CmsTeamMember[]>("team", "/team", fallback);

/**
 * Looks up a redirect for an unmatched path. Returns null when there is none,
 * or when the API is unreachable — a dead CMS must degrade to a normal 404,
 * never to a hang or a wrong destination.
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
