
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useProjects, type CmsProject } from "@/lib/cms";

gsap.registerPlugin(ScrollTrigger);

type CaseStudy = {
  slug: string;
  tags: string[];
  title: string;
  description: string;
  accentColor: string;
  technologies: string[];
  numbers: { value: string; label: string }[];
  image: string;
};

// Verified modern software application, SaaS dashboard & cloud platform screenshots
const SOFTWARE_APP_IMAGES: Record<string, string> = {
  // CMS Slugs
  "orgpyur-technologies-mvp-governance-audit": "/assets/projects/orgpyur-cover.png",
  "toyotasure-used-car-portal": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
  "ontario-tennis-association": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  "amz-properties-dubai": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  "apta-enterprise-architecture": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200",
  "colliborate-tax-workspace": "/assets/projects/colliborate-case-study-img-1.jpg",
  "tampa-property-choice": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  "qtt-canada-fleet-dispatch": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  "mpc-enterprise-erp": "/assets/projects/mpc-case-study-img-2.jpg",
  "denbeaux-law-firm-portal": "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg",
  "culinabot-robotics": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
  "thank-you-plaque-ecommerce": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
  "mattressland-uk-retail": "/assets/projects/mattressland-case-study-img-1.png",
  "infotex-brand-identity": "/assets/projects/infotex-case-study-img-1.png",
  "dairy-farm-automation": "/assets/projects/dairy-farm-case-study-img-2.jpg",
  "reccon-engineering-profile": "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&q=80&w=1200",
  "rh-care-usa-motion": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
  "alstom-railops-fleet-operations": "/assets/projects/railops-alstom-case-study.html.png",
  "barkat-foundation-donor-portal": "/assets/projects/Barkat_Org_Foundation_Final__Project_Case_Study_v2.pdf.jpg.jpeg",
  "pcm-tool-cost-management-portal": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",

  // Keywords
  alstom: "/assets/projects/railops-alstom-case-study.html.png",
  barkat: "/assets/projects/Barkat_Org_Foundation_Final__Project_Case_Study_v2.pdf.jpg.jpeg",
  pcm: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  orgpyur: "/assets/projects/orgpyur-cover.png",
  toyota: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
  tennis: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  ontario: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  amz: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  apta: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200",
  colliborate: "/assets/projects/colliborate-case-study-img-1.jpg",
  tampa: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  taxi: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  poultry: "/assets/projects/mpc-case-study-img-2.jpg",
  denbeaux: "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg",
  culinabot: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
  plaque: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
  mattressland: "/assets/projects/mattressland-case-study-img-1.png",
  infotex: "/assets/projects/infotex-case-study-img-1.png",
  dairy: "/assets/projects/dairy-farm-case-study-img-2.jpg",
  reccon: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&q=80&w=1200",
};

// Generic stock photos that shouldn't represent software applications
const GENERIC_UNSPLASH_IDS = [
  "photo-1576091160550-2173dba999ef",
  "photo-1518770660439-4636190af475",
  "photo-1441986300917-64674bd600d8",
  "photo-1519003722824-194d4455a60c",
  "photo-1593941707882-a5bba14938c7",
  "photo-1563013544-824ae1b704d3",
  "photo-1560518883-ce09059eeffa",
  "photo-1601584115197-04ecc0da31d7",
  "photo-1542838132-92c53300491e",
  "photo-1523240795612-9a054b0db644",
];

function getSoftwareAppImage(p: CmsProject): string {
  const slugKey = (p.slug ?? "").toLowerCase();
  const clientKey = (p.client ?? "").toLowerCase();
  const titleKey = (p.title ?? "").toLowerCase();

  if (SOFTWARE_APP_IMAGES[slugKey]) return SOFTWARE_APP_IMAGES[slugKey];
  if (SOFTWARE_APP_IMAGES[clientKey]) return SOFTWARE_APP_IMAGES[clientKey];

  for (const [key, appImg] of Object.entries(SOFTWARE_APP_IMAGES)) {
    if (slugKey.includes(key) || clientKey.includes(key) || titleKey.includes(key)) {
      return appImg;
    }
  }

  const url = p.coverImage?.url ?? "";
  if (url && !GENERIC_UNSPLASH_IDS.some((id) => url.includes(id))) {
    return url;
  }

  return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
}

// Real case study data from Time Global projects (with software application images)
const studies: CaseStudy[] = [
  {
    slug: "orgpyur-technologies-mvp-governance-audit",
    tags: ["Strategy & Consulting", "Corporate Governance"],
    title: "Orgpyur Technologies — MVP Governance & Operational Audit",
    description: "Executive milestone tracking, board governance reporting, CIPO trademark dossier, and SaaS data architecture sync during a critical MVP development phase.",
    accentColor: "from-emerald-950/95 via-teal-900/40 to-transparent",
    technologies: ["Corporate Governance", "Enterprise SaaS", "CIPO Trademark", "Board Sync"],
    numbers: [
      { value: "66%", label: "MVP Milestone" },
      { value: "CIPO", label: "Trademark Dossier" },
      { value: "100%", label: "Board Sync" },
    ],
    image: "/assets/projects/orgpyur-cover.png",
  },
  {
    slug: "toyotasure-used-car-portal",
    tags: ["Web Apps", "Inspection Engine"],
    title: "Toyota Indus Motors — ToyotaSure Certified Used Car Portal",
    description: "Enterprise pre-owned vehicle trading platform, standardized 203-checkpoint technician inspection engine, and nationwide dealership network for Toyota Pakistan.",
    accentColor: "from-indigo-950/95 via-zinc-900/40 to-transparent",
    technologies: ["PHP / Laravel", "MySQL", "Inspection Engine", "PDF Generator", "Inventory API"],
    numbers: [
      { value: "203+", label: "Checkpoints Inspected" },
      { value: "Nationwide", label: "Dealerships" },
      { value: "48hr", label: "Cert. Turnaround" },
    ],
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "ontario-tennis-association",
    tags: ["Web Apps", "Sports Platform"],
    title: "Ontario Tennis Association — Unified Member & Tournament Portal",
    description: "Connected provincial sports administration platform uniting player registrations, club directories, automated tournament brackets, and dynamic rankings.",
    accentColor: "from-emerald-950/95 via-stone-900/30 to-transparent",
    technologies: ["React", "PostgreSQL", "Tournament Bracket Engine", "Stripe"],
    numbers: [
      { value: "250+", label: "Clubs Connected" },
      { value: "15k+", label: "Active Players" },
      { value: "-75%", label: "Manual Processing" },
    ],
    image: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  },
  {
    slug: "amz-properties-dubai",
    tags: ["Strategy", "Luxury Real Estate"],
    title: "AMZ Properties Dubai — Luxury Real Estate Branding & Investor Acquisition",
    description: "High-impact UAE National Day campaigns, localized investor pitch decks, and digital educational collateral generating record HNWI inbound inquiries.",
    accentColor: "from-orange-950/95 via-neutral-950/40 to-transparent",
    technologies: ["Brand Architecture", "Investor Kit", "Social Marketing", "Multi-Language"],
    numbers: [
      { value: "+185%", label: "HNWI Inquiries" },
      { value: "AED 45M+", label: "Pipeline Value" },
      { value: "4 Core", label: "Campaign Kits" },
    ],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "apta-enterprise-architecture",
    tags: ["Enterprise CMS", "Transit Systems"],
    title: "APTA — Enterprise Digital Overhaul & Intranet Architecture",
    description: "Complete digital unification across main association site, charitable foundation, staff intranet, and member portal for 1,500+ transit organizations.",
    accentColor: "from-indigo-950/95 via-neutral-900/30 to-transparent",
    technologies: ["Enterprise CMS", "SSO Authentication", "Intranet Portal", "REST APIs"],
    numbers: [
      { value: "1,500+", label: "Member Orgs" },
      { value: "4 Sites", label: "Unified Architecture" },
      { value: "-60%", label: "Admin Redundancy" },
    ],
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "colliborate-tax-workspace",
    tags: ["Cloud SaaS", "Tax Advisory"],
    title: "Colliborate (USA) — Cloud Collaboration Workspace for Tax Teams",
    description: "Refactored framework, secure cloud file sharing, integrated billing engine, and shared task scheduler for distributed accounting professionals.",
    accentColor: "from-pink-950/95 via-neutral-950/40 to-transparent",
    technologies: ["Angular", "Node.js", "AWS S3 Encryption", "Stripe API"],
    numbers: [
      { value: "4x", label: "Faster Sync" },
      { value: "256-bit", label: "AES Encryption" },
      { value: "0", label: "Data Leakage" },
    ],
    image: "/assets/projects/colliborate-case-study-img-1.jpg",
  },
  {
    slug: "tampa-property-choice",
    tags: ["Big Data", "Commercial PropTech"],
    title: "Tampa Property Choice — Commercial RE Analytics Portal & CRM",
    description: "Commercial property intelligence combining automated scrapers, Elasticsearch indexing, real-time Cap Rate calculations, and investor deal-matching pipelines.",
    accentColor: "from-teal-950/95 via-neutral-900/40 to-transparent",
    technologies: ["Python Scrapy", "Elasticsearch", "React", "FastAPI"],
    numbers: [
      { value: "10k+", label: "Properties Indexed" },
      { value: "< 50ms", label: "Search Latency" },
      { value: "Instant", label: "Cap Rate Valuation" },
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "qtt-canada-fleet-dispatch",
    tags: ["Mobile", "Fleet Dispatch"],
    title: "Quick Time Taxi (QTT Canada) — Fleet Dispatch & Ride Booking Platform",
    description: "Sub-second WebSocket driver telemetry and intelligent proximity-based auto-dispatch cutting manual phone dispatch time by 42%.",
    accentColor: "from-emerald-950/95 via-zinc-900/40 to-transparent",
    technologies: ["React Native", "Node.js", "WebSockets", "Google Maps API"],
    numbers: [
      { value: "< 120ms", label: "Dispatch Latency" },
      { value: "99.99%", label: "Uptime" },
      { value: "+34.8%", label: "Route Efficiency" },
    ],
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  },
];

/** Accent tints are decorative; cycle them so CMS cards keep the variety. */
const ACCENTS = [
  "from-indigo-950/95 via-zinc-900/40 to-transparent",
  "from-emerald-950/95 via-stone-900/30 to-transparent",
  "from-orange-950/95 via-neutral-950/40 to-transparent",
  "from-pink-950/95 via-neutral-950/40 to-transparent",
  "from-teal-950/95 via-neutral-900/40 to-transparent",
];

/** CMS project → the card shape this slider already renders. */
function toStudy(p: CmsProject, i: number): CaseStudy {
  const stripped = (p.result ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    slug: p.slug,
    tags: [p.category.replace("-", " "), p.client].filter(Boolean),
    title: p.title,
    // The card wants one line of outcome; the result chapter is the closest.
    description: stripped || p.title,
    accentColor: ACCENTS[i % ACCENTS.length],
    technologies: p.techStack ?? [],
    numbers: p.metrics ?? [],
    image: getSoftwareAppImage(p),
  };
}

function SplitText({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
          <span className="inline-block">
            {word.split("").map((c, ci) => (
              <span key={ci} className="char inline-block will-change-transform">
                {c}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

function StudyCard({ s }: { s: CaseStudy }) {
  return (
    <article className="study-card snap-center lg:snap-align-none group relative shrink-0 w-[85vw] sm:w-[50vw] md:w-[380px] lg:w-[440px] h-[480px] sm:h-[520px] lg:h-[540px] overflow-hidden bg-zinc-950 isolate border border-white/10 dark:border-white/15 hover:border-primary/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {s.image && (
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-top scale-[1.05] group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform opacity-80 group-hover:opacity-95"
            loading="eager"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
            }}
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${s.accentColor} opacity-40`} />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[72%] bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent" />
      </div>

      {/* Card Header Content */}
      <div className="relative z-10 flex items-start justify-between p-6 sm:p-7">
        <div className="flex flex-wrap gap-1.5 max-w-[80%]">
          {s.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono tracking-wider font-bold uppercase px-3 py-1 bg-black/80 border border-white/20 text-white backdrop-blur-md rounded-md shadow-md"
            >
              {t}
            </span>
          ))}
        </div>
        <Link
          href={`/work/${s.slug}`}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-black/60 text-primary hover:bg-primary hover:text-black transition-all duration-300 shadow-md transform group-hover:scale-110 group-hover:rotate-45"
          aria-label={`View ${s.title}`}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Card Body Content */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-6 sm:p-8 flex flex-col justify-end min-h-[52%]">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5 text-white line-clamp-2 drop-shadow-md group-hover:text-primary transition-colors duration-300">
          {s.title}
        </h3>
        <p className="text-sm text-gray-200/95 mb-4 leading-relaxed font-normal line-clamp-3 drop-shadow-sm">
          {s.description}
        </p>

        {/* Applied Technologies Pill Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {s.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono font-semibold text-emerald-300/95 bg-emerald-950/60 border border-emerald-500/35 px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Analytics Metadata Row */}
        {s.numbers.length > 0 && (
          <div className="grid grid-cols-3 gap-3 border-t border-white/15 bg-black/60 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 pb-6 pt-4 backdrop-blur-md">
            {s.numbers.map((n) => (
              <div key={n.label} className="overflow-hidden">
                <p className="text-base sm:text-lg font-mono font-extrabold text-primary truncate tracking-tight">{n.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-300 mt-1 block leading-tight">{n.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function CtaCard() {
  return (
    <article className="study-card snap-center lg:snap-align-none group relative shrink-0 w-[85vw] sm:w-[50vw] md:w-[380px] lg:w-[480px] h-[480px] sm:h-[520px] lg:h-[540px] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 dark:border-white/15 hover:border-primary/40 shadow-xl isolate flex flex-col justify-between rounded-2xl transition-all duration-300">
      <div className="p-6 sm:p-8">
        <span className="text-[10px] font-mono tracking-widest font-bold uppercase px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full">
          Next Step
        </span>
      </div>

      <div className="p-8 sm:p-10 md:p-14">
        <a
          href="/work"
          className="inline-flex items-center gap-4 group/link text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white hover:text-primary transition-colors duration-300"
        >
          <span>See all projects</span>
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary group-hover/link:bg-primary group-hover/link:text-black transition-all duration-300 shadow-md">
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </div>
        </a>
        <p className="text-sm text-gray-300/90 max-w-sm font-normal leading-relaxed mt-4">
          Explore our full production pipeline of digital designs built for elite industries globally.
        </p>
      </div>
    </article>
  );
}

export function CaseStudySlider() {
  // Published projects from the admin panel; the bundled studies only cover
  // an empty or unreachable CMS.
  const { data: cmsProjects } = useProjects();
  const shown: CaseStudy[] = cmsProjects.length > 0 ? cmsProjects.map(toStudy) : studies;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep animations isolated to the scoped element ref instance
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.querySelectorAll(".char"), {
          yPercent: 110,
          opacity: 0,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.018,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Eyebrow + intro copy rise with the heading, not after it
      gsap.from(".head-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      });

      // Cards stagger in from the right as the rail first enters the viewport
      gsap.from(".study-card", {
        x: 50,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: trackRef.current, start: "top 95%", once: true },
      });

      const track = trackRef.current;
      const section = sectionRef.current;

      // Horizontal pinning is desktop-only; only pin if screen has enough vertical height
      if (track && section && window.matchMedia("(min-width: 1024px)").matches && window.innerHeight >= 620) {
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const total = track.querySelectorAll(".study-card").length;

        const rail = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Progress bar + card counter ride the same trigger, so neither
            // can ever drift out of sync with the rail.
            onUpdate: (self) => {
              gsap.set(".slider-progress", { scaleX: self.progress });
              const count = document.querySelector(".slider-count");
              if (count) {
                count.textContent =
                  String(Math.min(total, Math.round(self.progress * (total - 1)) + 1)).padStart(2, "0") +
                  " / " +
                  String(total).padStart(2, "0");
              }
            },
          },
        });

        // Image parallax inside the horizontal scrub: each cover drifts
        // against the rail's motion (containerAnimation maps the trigger to
        // the tween instead of the vertical scroll), giving the cards depth
        // instead of sliding as flat tiles.
        gsap.utils.toArray<HTMLElement>(".study-card img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8, scale: 1.12 },
            {
              xPercent: 8,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".study-card") as Element,
                containerAnimation: rail,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
    // scrollWidth is captured when the tween is built; CMS data arriving
    // later would otherwise leave a stale scroll distance.
  }, [shown.length]);

  return (
    <section ref={sectionRef} className="relative bg-secondary/25 dark:bg-background text-foreground w-full py-12 md:py-16 lg:py-20 border-b border-border/50">
      <div className="flex flex-col justify-center">

        {/* Header Title Grid */}
        <div className="w-full px-4 sm:px-6 mb-8 lg:mb-10 shrink-0">
          <div className="max-w-7xl mx-auto lg:pl-10 grid lg:grid-cols-2 gap-8 items-end">
            <div>
              {/* Eyebrow chip matches every other section on the page */}
              <div className="head-reveal inline-block px-4 py-1.5 rounded-lg bg-primary/15 text-primary font-mono text-sm font-bold mb-6 border border-primary/30 shadow-sm shadow-primary/10">
                {"<Case Studies/>"}
              </div>
              <h2
                ref={headingRef}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground"
              >
                {/* Single line; accent on the second word per the site's
                    heading pattern */}
                <SplitText text="Featured" />{" "}
                <span className="text-primary drop-shadow-[0_0_24px_rgba(16,185,129,0.25)]">
                  <SplitText text="Case Studies" />
                </span>
              </h2>
            </div>

            <div className="head-reveal lg:pb-2">
              <p className="text-lg md:text-xl text-foreground/80 dark:text-neutral-200 max-w-md leading-relaxed font-normal">
                Real engagements, real numbers. Production systems we designed,
                built and shipped for clients across five industries.
              </p>
              {/* Desktop scroll progress + card counter, driven by the scrub */}
              <div className="hidden lg:flex items-center gap-4 mt-6 max-w-md">
                <div className="h-1.5 flex-1 bg-white/10 dark:bg-white/15 rounded-full overflow-hidden border border-white/5">
                  <div className="slider-progress h-full w-full bg-primary origin-left scale-x-0 rounded-full" />
                </div>
                <span className="slider-count font-mono text-sm text-foreground/90 tabular-nums shrink-0 font-bold">
                  01 / 07
                </span>
              </div>
              <p className="lg:hidden mt-4 text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Swipe to explore →
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Layout Container */}
        <div className="overflow-x-auto w-full shrink-0 snap-x snap-mandatory lg:snap-none scrollbar-none py-2">
          <div
            ref={trackRef}
            className="flex gap-5 pl-4 sm:pl-6 lg:pl-[max(4rem,calc((100vw-80rem)/2+4rem))] will-change-transform"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {shown.map((s) => (
              <StudyCard key={s.slug} s={s} />
            ))}
            <CtaCard />
          </div>
        </div>

      </div>
    </section>
  );
}