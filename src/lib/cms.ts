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
const CACHE_PREFIX = "tg_cms_cache_v5_";

// Proactively clear stale legacy caches so browsers always show real portfolio case studies
if (typeof window !== "undefined") {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("tg_cms_cache_") || k.startsWith("tg_project_")) && !k.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
}

/**
 * Retrieves cached content saved from previous admin panel activity.
 */
export function getCachedCms<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If cached projects contains old dummy projects like bonnet, invalidate cache
      if (key === "projects" && Array.isArray(parsed)) {
        const hasDummy = parsed.some((p: any) => p.slug === "bonnet-ev-charging-platform" || p.slug === "finpay-cross-border-payments-app");
        if (hasDummy) {
          localStorage.removeItem(`${CACHE_PREFIX}${key}`);
          return null;
        }
      }
      // If cached stories contains checkout redesign, invalidate cache
      if (key === "stories" && Array.isArray(parsed)) {
        const hasDummy = parsed.some((s: any) => s.slug === "a-checkout-redesign-that-tripled-revenue");
        if (hasDummy) {
          localStorage.removeItem(`${CACHE_PREFIX}${key}`);
          return null;
        }
      }
      return parsed as T;
    }
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
    title: "Quick Time Taxi (QTT Canada) — Dispatch Latency Slashed by 42%",
    slug: "qtt-canada-dispatch-latency-slashed",
    type: "success",
    tag: "Mobile App & Fleet Dispatch",
    desc: "A Canadian taxi fleet operator faced severe radio dispatch delays, inaccurate winter ETAs, and lost bookings. Time Global Tech built a unified mobile booking ecosystem (rider + driver) with sub-second WebSocket telemetry and automated geospatial dispatch algorithms, dropping latency below 120ms.",
    impact: "<120ms Latency · +34.8% Route Efficiency",
    challenge: "Manual radio dispatch workflows causing driver confusion, delayed customer pickups, and lost rides during peak Canadian winter commutes.",
    solution: "Engineered a dual-app mobile ecosystem (rider + driver) with sub-second WebSocket telemetry and automated geospatial driver-matching algorithms.",
    color: "from-emerald-500/20 to-teal-500/20",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
    order: 1,
    status: "published",
  },
  {
    _id: "success-2",
    title: "ToyotaSure — Nationwide 203-Point Certified Inspection Engine",
    slug: "toyotasure-nationwide-inspection-engine",
    type: "success",
    tag: "Enterprise Automotive Portal",
    desc: "Toyota Indus Motors needed to establish nationwide consumer trust in Pakistan's certified pre-owned vehicle market. We built a standardized 203-checkpoint technician inspection engine, tamper-evident digital certificate generation, and nationwide real-time dealer marketplace portal.",
    impact: "203 Checkpoints · Nationwide Dealership Network",
    challenge: "Manual paper inspection checklists across disparate dealerships with zero unified transparency for used car buyers.",
    solution: "Built a centralized 203-point vehicle grading algorithm, digital inspection certification pipeline, and real-time dealer marketplace portal.",
    color: "from-blue-500/20 to-indigo-500/20",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    order: 2,
    status: "published",
  },
  {
    _id: "success-3",
    title: "Ontario Tennis Association — Unified Tournament & Club Ecosystem",
    slug: "ontario-tennis-association-unified-ecosystem",
    type: "success",
    tag: "Sports Management & Member Portal",
    desc: "Provincial tennis operations were bottlenecked by disconnected club records, paper tournament entries, and manual ranking computations. We engineered an integrated digital platform connecting player profiles, automated tournament draw brackets, and live provincial rankings.",
    impact: "250+ Clubs · 15k+ Players · -75% Manual Work",
    challenge: "Fragmented club directories, manual paper draws, and siloed tournament registrations causing delays and administrative overhead.",
    solution: "Built a connected digital operations platform uniting player ratings, automated tournament bracket scheduling, and club membership management.",
    color: "from-teal-500/20 to-emerald-500/20",
    imageUrl: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
    order: 3,
    status: "published",
  },
  {
    _id: "success-4",
    title: "Tampa Property Choice — Instant Cap Rate & Commercial RE Analytics",
    slug: "tampa-property-choice-commercial-analytics",
    type: "success",
    tag: "Big Data & Commercial PropTech",
    desc: "Commercial real estate brokers were losing valuable acquisition hours manually parsing county filings and spreadsheets. We engineered automated Python scrapers feeding an Elasticsearch index with on-the-fly mathematical Cap Rate valuations and integrated investor CRM pipelines.",
    impact: "10k+ Properties · <50ms Valuation Latency",
    challenge: "Commercial real estate brokers spending hours cross-referencing MLS listings, county tax records, and zoning laws to compute simple capitalization rates.",
    solution: "Automated distributed Python scrapers feeding an Elasticsearch index with live mathematical investment modeling and automated investor CRM pipelines.",
    color: "from-indigo-500/20 to-purple-500/20",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    order: 4,
    status: "published",
  },
  {
    _id: "lesson-1",
    title: "Mega Poultry Company (MPC) — Why Process Architecture Must Precede Code",
    slug: "mpc-why-process-architecture-must-precede-code",
    type: "lesson",
    tag: "Enterprise Architecture",
    desc: "A massive agricultural enterprise pushed to fast-track commercial off-the-shelf ERP software across five hubs without formal cross-departmental process mapping. We intervened to pause software procurement and conduct exhaustive on-ground workflow audits from hatcheries to cold chain distribution.",
    impact: "Architecture First · Zero ERP Rework",
    lesson: "Software cannot fix an operational process that has not been defined on paper first.",
    challenge: "A rapid urge to deploy commercial off-the-shelf ERP software across 5 operational hubs without formal cross-departmental process mapping.",
    solution: "We paused software procurement to conduct exhaustive on-ground workflow audits from hatcheries to cold storage, preventing millions in mismatched software licensing.",
    fix: "We paused software procurement to conduct exhaustive on-ground workflow audits from hatcheries to cold storage, preventing millions in mismatched software licensing.",
    color: "from-rose-500/20 to-orange-500/20",
    imageUrl: "/assets/projects/mpc-case-study-img-2.jpg",
    order: 5,
    status: "published",
  },
  {
    _id: "lesson-2",
    title: "Colliborate USA — Data Privacy & Compliance in Distributed Tax Advisory",
    slug: "colliborate-usa-data-privacy-compliance",
    type: "lesson",
    tag: "FinTech Compliance & Cloud Security",
    desc: "Distributed accounting advisory teams were relying on ad-hoc cloud file sharing links for sensitive IRS tax filings. We re-architected the file exchange system into zero-trust client vaults with cryptographic audit trails, granular role permissions, and auto-expiring document access.",
    impact: "Zero Data Leakage · 256-bit AES Vault",
    lesson: "In financial and tax software, user convenience must never compromise cryptographic auditability.",
    challenge: "Distributed accounting teams sharing sensitive IRS filings via ad-hoc cloud links, risking regulatory non-compliance.",
    solution: "Re-architected cloud storage into zero-trust client vaults with cryptographic audit trails, granular role permissions, and auto-expiring document access.",
    fix: "Re-architected cloud storage into zero-trust client vaults with cryptographic audit trails, granular role permissions, and auto-expiring document access.",
    color: "from-amber-500/20 to-yellow-500/20",
    imageUrl: "/assets/projects/colliborate-case-study-img-1.jpg",
    order: 6,
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
  "fintech-eu-uptime": "toyotasure-used-car-portal",
  "retail-canada-migration": "ontario-tennis-association",
  "healthcare-ksa-patient-app": "qtt-canada-fleet-dispatch",
  "logistics-eu-predictive": "tampa-property-choice",
  "fashion-uae-ecommerce": "thank-you-plaque-ecommerce",
  "edtech-australia-lms": "amz-properties-dubai",
  "bonnet-ev-charging-platform": "qtt-canada-fleet-dispatch",
  "canet-clinical-research-portal": "ontario-tennis-association",
  "helvar-iot-lighting-dashboard": "toyotasure-used-car-portal",
  "tiptop-b2b-marketplace": "amz-properties-dubai",
  "spectec-fleet-maintenance-suite": "mpc-enterprise-erp",
  "finpay-cross-border-payments-app": "colliborate-tax-workspace",
  "renlo-property-management-platform": "tampa-property-choice",
  "routewise-delivery-route-optimizer": "qtt-canada-fleet-dispatch",
  "urbancart-same-day-grocery-marketplace": "thank-you-plaque-ecommerce",
  "eduspark-cohort-based-learning-platform": "apta-enterprise-architecture",
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
