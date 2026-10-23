import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useProjects, type CmsProject } from "@/lib/cms";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesGrid from "@/components/ServicesGrid";
import TeamSnapshot from "@/components/TeamSnapshot";
import Awards from "@/components/Awards";
import FAQ from "@/components/FAQ";
import CollaborateCTA from "@/components/CollaborateCTA";
import { HeroAnimatedIcons } from "@/components/HeroAnimatedIcons";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { Search, Filter, Sparkles } from "lucide-react";

 
// ─── Project image placeholders (swap for real imports once you have the files) ─
const aviva        = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&q=80"; // CRM / analytics dashboard
const aidify       = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1024&q=80"; // AI / recommendation engine
const bnp          = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1024&q=80"; // mobile banking app
const brainly      = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1024&q=80"; // edtech code & learning platform
const caliber      = "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1024&q=80"; // candidate scoring & analytics dashboard
const brainlyTutor = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&q=80"; // 1-on-1 tutoring web platform
const fitly        = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1024&q=80"; // fitness telemetry & route tracker

gsap.registerPlugin(ScrollTrigger);

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "200+", label: "Projects Shipped" },
  { value: "40+", label: "Global Clients" },
  { value: "98%", label: "Client Retention" },
  { value: "12+", label: "Years Delivering" },
];

// ─── Case Studies ─────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  {
    tags: ["FinTech", "Cloud"],
    client: "FinTech EU",
    title: "99.98% Uptime, Zero Surprise Bills",
    outcome: "Reduced AWS costs by 42% while cutting deploy time from 3 hours to 8 minutes.",
    metrics: ["42% cost cut", "8 min deploys", "99.98% uptime"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #0f0c29, #302b63, #24243e)",
    span: "normal" as const,
  },
  {
    tags: ["Web Apps", "Migration"],
    client: "Retail Canada",
    title: "From Legacy Monolith to Micro-Frontend",
    outcome: "Rewrote a 7-year-old PHP platform into a React + Node microservice architecture.",
    metrics: ["0 downtime", "3× faster load", "62% less bugs"],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #0a2e1a, #0d4a28, #0a3d20)",
    span: "tall" as const,
  },
  {
    tags: ["Mobile", "Healthcare"],
    client: "Healthcare KSA",
    title: "Patient App Serving 500k+ Users",
    outcome: "End-to-end React Native app with HL7 FHIR integration, shipped in 14 weeks.",
    metrics: ["500k+ users", "4.8★ App Store", "14 wks shipped"],
    img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #1a0533, #3b0764, #2d0550)",
    span: "normal" as const,
  },
  {
    tags: ["Data & AI", "Logistics"],
    client: "Logistics EU",
    title: "Predictive Routing Saves $2M/Year",
    outcome: "Built an ML pipeline on top of the client's existing ERP — 28% reduction in fuel spend.",
    metrics: ["$2M saved", "28% less fuel", "Real-time ETAs"],
    img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #001a2e, #003052, #00213d)",
    span: "tall" as const,
  },
  {
    tags: ["E-Commerce", "Mobile"],
    client: "Fashion UAE",
    title: "D2C Store Hitting $1M GMV in Month 1",
    outcome: "Shopify Plus custom storefront with Arabic RTL support, launched 3 weeks before Ramadan.",
    metrics: ["$1M GMV/mo", "RTL + LTR", "3 wk delivery"],
    img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #2d0a1a, #5c1030, #450d24)",
    span: "normal" as const,
  },
  {
    tags: ["Web Apps", "EdTech"],
    client: "EdTech Australia",
    title: "LMS Scaling to 80k Concurrent Learners",
    outcome: "Video-first learning platform with adaptive quiz engine on serverless infrastructure.",
    metrics: ["80k concurrent", "2.1s p95", "Auto-scales"],
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=900",
    bgGradient: "linear-gradient(145deg, #0a1a2e, #102a47, #0c2038)",
    span: "normal" as const,
  },
];

type CaseStudy = typeof CASE_STUDIES[0];

// ─── Projects ─────────────────────────────────────────────────────────────────

const SOFTWARE_APP_IMAGES: Record<string, string> = {
  // CMS Slugs
  "canet-clinical-research-portal": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
  "helvar-iot-lighting-dashboard": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  "tiptop-b2b-marketplace": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  "spectec-fleet-maintenance-suite": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  "bonnet-ev-charging-platform": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
  "finpay-cross-border-payments-app": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
  "renlo-property-management-platform": "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200",
  "routewise-delivery-route-optimizer": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  "urbancart-same-day-grocery-marketplace": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
  "eduspark-cohort-based-learning-platform": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",

  // Keywords
  canet: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
  helvar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  tiptop: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  spectec: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  bonnet: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
  finpay: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
  renlo: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200",
  routewise: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  urbancart: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200",
  eduspark: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
};

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

function getProjectImage(p: CmsProject): string {
  const slugKey = (p.slug ?? "").toLowerCase();
  const clientKey = (p.client ?? "").toLowerCase();
  if (SOFTWARE_APP_IMAGES[slugKey]) return SOFTWARE_APP_IMAGES[slugKey];
  if (SOFTWARE_APP_IMAGES[clientKey]) return SOFTWARE_APP_IMAGES[clientKey];
  for (const [key, appImg] of Object.entries(SOFTWARE_APP_IMAGES)) {
    if (slugKey.includes(key) || clientKey.includes(key) || p.title.toLowerCase().includes(key)) {
      return appImg;
    }
  }
  const url = p.coverImage?.url ?? "";
  if (url && !GENERIC_UNSPLASH_IDS.some((id) => url.includes(id))) {
    return url;
  }
  return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
}

/** CMS project → the ProjectCard shape this page already renders. */
function toProjectCard(p: CmsProject, i: number): Omit<ProjectCardProps, "index"> {
  const categoryTag = p.category ? p.category.replace("-", " ") : "";
  const techTags = p.techStack ?? [];
  return {
    image: getProjectImage(p),
    title: p.title,
    description: p.client ? `${p.client} — ${categoryTag}` : p.title,
    tags: [categoryTag, ...techTags].filter(Boolean),
    technologies: techTags,
    // Card links to the case study; every third one spans wide for rhythm.
    liveUrl: `/work/${p.slug}`,
    wide: i % 3 === 0,
  };
}

const projects: Omit<ProjectCardProps, "index">[] = [
  {
    image: brainly,
    title: "Brainly",
    description: "Educational networking platform reimagined for the next generation of learners.",
    tags: ["EdTech", "Web"],
    technologies: ["React", "Tailwind", "Postgres"],
    wide: true,
  },
  {
    image: aviva,
    title: "Aviva",
    description: "CRM app for insurance agents",
    tags: ["FinTech", "Mobile"],
    technologies: ["React Native", "TypeScript", "Node.js"],
  },
  {
    image: aidify,
    title: "AIDIFY",
    description: "Content recommendation engine",
    tags: ["Other Industries", "AI"],
    technologies: ["Next.js", "Python", "TensorFlow"],
  },
  {
    image: bnp,
    title: "BNP Paribas",
    description: "Innovative mobile banking app",
    tags: ["FinTech", "Mobile"],
    technologies: ["Swift", "Kotlin", "GraphQL"],
  },
  {
    image: caliber,
    title: "Caliber",
    description: "Business candidate scoring tool",
    tags: ["HR Tech", "AI"],
    technologies: ["Next.js", "OpenAI", "Prisma"],
  },
  {
    image: fitly,
    title: "Fitly",
    description: "Personalised fitness tracking on the go",
    tags: ["Health", "Mobile"],
    technologies: ["Flutter", "Firebase", "Dart"],
  },
  {
    image: brainlyTutor,
    title: "Brainly Tutor",
    description: "Education association anytime, anywhere — one-on-one expert help in your pocket.",
    tags: ["EdTech", "Mobile"],
    technologies: ["React Native", "Node.js", "WebRTC"],
    wide: true,
  },
];

// ─── AnimatedCounter ──────────────────────────────────────────────────────────

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = numericPart;
    const duration = 1600;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;
      setDisplay((current % 1 === 0 ? Math.floor(current) : current.toFixed(0)) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, numericPart, suffix]);

  return <span ref={ref}>{display}</span>;
}

// ─── PortfolioCard ────────────────────────────────────────────────────────────

function PortfolioCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const isTall = cs.span === "tall";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: cs.bgGradient,
        gridRow: isTall ? "span 2" : "span 1",
        minHeight: isTall ? "480px" : "320px",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        transform: hovered ? "scale(1.018)" : "scale(1)",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Faded image overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={cs.img}
          alt={cs.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900";
          }}
          className="w-full h-full object-cover"
          style={{
            opacity: hovered ? 0.18 : 0.1,
            transition: "opacity 0.4s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
      </div>

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-5" style={{ minHeight: "inherit" }}>
        {/* Top row: tags + expand icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {cs.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                  border: "0.5px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <motion.div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              border: "0.5px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(6px)",
            }}
            animate={hovered ? { rotate: 45, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* Mockup image for tall cards */}
        {isTall && (
          <div className="flex-1 flex items-center justify-center py-6">
            <div
              className="w-full max-w-[240px] rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                aspectRatio: "16/10",
                backdropFilter: "blur(4px)",
              }}
            >
              <img
                src={cs.img}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900";
                }}
                className="w-full h-full object-cover"
                style={{ opacity: 0.7, borderRadius: "inherit" }}
              />
            </div>
          </div>
        )}

        {/* Bottom: client, title, description, metrics */}
        <div className="mt-auto">
          <div className="mb-4" style={{ height: "0.5px", background: "rgba(255,255,255,0.12)" }} />

          <p
            className="text-[10px] uppercase tracking-[0.18em] mb-1.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {cs.client}
          </p>

          <h3
            className="text-[17px] font-bold leading-snug mb-2"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {cs.title}
          </h3>

          <p
            className="text-[12px] leading-relaxed mb-4"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {cs.outcome}
          </p>

          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.25, delay: hovered ? 0.05 : 0 }}
          >
            {cs.metrics.map((m) => (
              <span
                key={m}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  border: "0.5px solid rgba(255,255,255,0.18)",
                }}
              >
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WorkPage ─────────────────────────────────────────────────────────────────

export default function WorkPage() {
  usePageMeta({ title: "Case Studies & Work", description: "Case studies with real numbers: platforms, apps and systems we designed, built and shipped." });

  // Published projects from the admin panel replace the bundled samples;
  // the bundled ones only cover an empty or unreachable CMS.
  const { data: cmsProjects } = useProjects();
  const shownProjects =
    (cmsProjects && cmsProjects.length > 0) ? cmsProjects.map(toProjectCard) : projects;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Web", "Mobile", "Custom Software", "E-Commerce", "FinTech", "AI"];

  const filteredProjects = shownProjects.filter((p) => {
    const matchesCat =
      selectedCategory === "All" ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (p.technologies ?? []).some((tech) => tech.toLowerCase().includes(selectedCategory.toLowerCase()));
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.technologies ?? []).some((tech) => tech.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".hero-sub", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.9,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground overflow-x-hidden">
        <div className="h-[72px] shrink-0" />

        <main id="main-content" className="flex-1" ref={containerRef}>

          {/* 1. HERO */}
          <section ref={heroRef} className="relative pt-32 pb-64 px-6 overflow-hidden min-h-[100vh] flex items-center">
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/12 rounded-full blur-[160px]"
                animate={{ y: [0, 30, 0], opacity: [0.12, 0.15, 0.12] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px]"
                animate={{ x: [0, 20, 0], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[150px]"
                animate={{ x: [0, -20, 0], opacity: [0.06, 0.1, 0.06] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.25) 100%)" }}
            />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ y: [0, -30, 0], x: [0, Math.random() * 20 - 10, 0], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                />
              ))}
            </div>

            <HeroAnimatedIcons />

            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto relative z-10 w-full">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-sm text-primary mb-8 tracking-[0.2em] uppercase"
              >
                Time Global · Our Work
              </motion.p>

              <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.0] tracking-tight mb-8 overflow-hidden">
                {["We", "Build", "Software"].map((w) => (
                  <span key={w} className="inline-block mr-[0.25em] hero-word">{w}</span>
                ))}
                <br />
                {["That", "Ships."].map((w) => (
                  <span key={w} className="inline-block mr-[0.25em] hero-word text-primary">{w}</span>
                ))}
              </h1>

              <p className="hero-sub text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Real results from real engagements — 200+ projects delivered across finance, healthcare, retail, and logistics since 2013.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-16 flex items-center gap-4"
              >
                <div className="flex items-center gap-3 rounded-full border border-neutral-500/10 bg-neutral-950/20 px-5 py-2.5 backdrop-blur-sm shadow-lg transition-colors hover:border-neutral-500/20">
                  <div className="flex h-5 w-3.5 justify-center rounded-full border border-muted-foreground/40 p-0.5">
                    <motion.div
                      animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="h-1.5 w-1 rounded-full bg-muted-foreground"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground select-none">
                    Scroll to explore
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* 2. STATS */}
          <section className="border-y mt-[-20px] border-border/60 bg-gradient-to-r from-secondary/30 via-secondary/20 to-secondary/30 py-16 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[100px]" />
              <div className="absolute top-1/2 right-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="relative mb-4">
                    <div className="absolute -inset-4 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                    <div className="relative text-4xl md:text-5xl font-black text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      <AnimatedCounter value={s.value} />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium tracking-widest uppercase group-hover:text-primary/80 transition-colors duration-300">
                    {s.label}
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </motion.div>
              ))}
            </div>
          </section>

        

          {/* 4. SELECTED WORK (ProjectCard grid) */}
          <section className="py-24 px-6 border-t border-border/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Case Studies & Portfolio
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
                    Products we've built,
                    <br />
                    <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
                      loved by millions.
                    </span>
                  </h2>
                  <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                    A curated portfolio of case studies, applications, and architectures shipped for ambitious companies worldwide.
                  </p>
                </motion.div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client or tech..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-xs focus:border-primary focus:outline-none shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 shrink-0">
                  <Filter size={14} className="text-muted-foreground mr-1" />
                  {categories.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
                            : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-muted-foreground font-mono shrink-0 hidden sm:block">
                  {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
                </span>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40 my-8">
                  <p className="text-sm font-semibold mb-1">No projects found</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    No case studies match "{searchQuery}" under {selectedCategory}.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {filteredProjects.map((p, i) => (
                    <ProjectCard key={p.title} index={i} {...p} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 6. TEAM SNAPSHOT */}
          <TeamSnapshot />

          {/* 7. TESTIMONIALS */}

          {/* 8. AWARDS */}
          <Awards />

          {/* 9. BLOG PREVIEW */}

          {/* 10. FAQ */}
          <FAQ />

          {/* 11. CTA */}
          <CollaborateCTA />

        </main>

        <Footer />
      </div>
    </>
  );
}