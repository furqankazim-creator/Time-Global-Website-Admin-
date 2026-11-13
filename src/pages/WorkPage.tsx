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

import { STATIC_PROJECTS } from "@/data/staticContent";

// ─── Projects ─────────────────────────────────────────────────────────────────

const SOFTWARE_APP_IMAGES: Record<string, string> = {
  // CMS Slugs - Authentic images matched to each client, website, and industry
  "toyotasure-used-car-portal": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1200",
  "orgpyur-technologies-mvp-governance-audit": "/assets/projects/orgpyur-creative-card.jpg",
  "ontario-tennis-association": "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  "amz-properties-dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
  "apta-enterprise-architecture": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
  "colliborate-tax-workspace": "/assets/projects/colliborate-case-study-img-1.jpg",
  "tampa-property-choice": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  "qtt-canada-fleet-dispatch": "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=1200",
  "mpc-enterprise-erp": "/assets/projects/mpc-case-study-img-2.jpg",
  "denbeaux-law-firm-portal": "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg",
  "culinabot-robotics": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=1200",
  "thank-you-plaque-ecommerce": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200",
  "mattressland-uk-retail": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
  "infotex-brand-identity": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  "dairy-farm-automation": "/assets/projects/dairy-farm-case-study-img-2.jpg",
  "reccon-engineering-profile": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
  "rh-care-usa-motion": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
  "alstom-railops-fleet-operations": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1200",
  "barkat-foundation-donor-portal": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
  "pcm-tool-cost-management-portal": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",

  // Keywords
  alstom: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1200",
  barkat: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
  pcm: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
  orgpyur: "/assets/projects/orgpyur-creative-card.jpg",
  toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1200",
  tennis: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  ontario: "/assets/projects/Ontario_Tennis_Association_Case_Study_Updated-img-2.webp",
  amz: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
  apta: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
  colliborate: "/assets/projects/colliborate-case-study-img-1.jpg",
  tampa: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  taxi: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=1200",
  poultry: "/assets/projects/mpc-case-study-img-2.jpg",
  denbeaux: "/assets/projects/denbeaux-law-firm-case-study-img-2.jpg",
  culinabot: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=1200",
  plaque: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200",
  mattressland: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
  infotex: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  dairy: "/assets/projects/dairy-farm-case-study-img-2.jpg",
  reccon: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
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

function isWideCard(i: number, total: number): boolean {
  // 7-card cycle across 3 rows:
  // Row A: [Wide(2), Normal(1)] -> i % 7 === 0 is wide
  // Row B: [Normal(1), Wide(2)] -> i % 7 === 3 is wide
  // Row C: [Normal(1), Normal(1), Normal(1)] -> 3 cards in row!
  // If the last row of the list has 2 items left (total % 7 === 6), make the second-to-last item wide so the final row is also 100% full (2 + 1 = 3).
  if (total % 7 === 6 && i === total - 2) return true;
  if (total % 7 === 5 && i === total - 1) return true;
  const mod = i % 7;
  return mod === 0 || mod === 3;
}

/** CMS project → the ProjectCard shape this page already renders. */
function toProjectCard(p: CmsProject, i: number, arr?: CmsProject[]): Omit<ProjectCardProps, "index"> {
  const categoryTag = p.category ? p.category.replace("-", " ") : "";
  const techTags = p.techStack ?? [];
  const total = arr ? arr.length : STATIC_PROJECTS.length;
  return {
    image: getProjectImage(p),
    title: p.title,
    description: p.client ? `${p.client} — ${categoryTag}` : p.title,
    tags: [categoryTag, ...techTags].filter(Boolean),
    technologies: techTags,
    liveUrl: `/work/${p.slug}`,
    wide: isWideCard(i, total),
  };
}

const fallbackProjects: Omit<ProjectCardProps, "index">[] = STATIC_PROJECTS.map(toProjectCard);

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

// ─── WorkPage ─────────────────────────────────────────────────────────────────

export default function WorkPage() {
  usePageMeta({ title: "Our Work", description: "Case studies with real numbers: platforms, apps and systems we designed, built and shipped." });

  // Published projects from the admin panel replace the bundled samples;
  // the bundled ones only cover an empty or unreachable CMS.
  const { data: cmsProjects, isFallback } = useProjects();
  const shownProjects =
    (cmsProjects && (!isFallback || cmsProjects.length > 0)) ? cmsProjects.map(toProjectCard) : fallbackProjects;

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
          <section ref={heroRef} className="work-hero relative pt-24 pb-32 md:pt-32 md:pb-48 px-6 overflow-hidden min-h-[85svh] md:min-h-[100svh] flex items-center">
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
              className="work-hero-grid absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
            <div
              className="work-hero-vignette absolute inset-0 pointer-events-none"
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

            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto relative z-10 w-full pointer-events-none [&_a]:pointer-events-auto">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20"
              >
                {"<our work>"}
              </motion.p>

              <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
                {["We", "Build", "Software"].map((w) => (
                  <span key={w} className="inline-block mr-[0.25em] hero-word">{w}</span>
                ))}
                <br />
                {["That", "Ships."].map((w) => (
                  <span key={w} className="inline-block mr-[0.25em] hero-word text-primary italic">{w}</span>
                ))}
              </h1>

              <p className="hero-sub text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
                Real results from real engagements — 200+ projects delivered across finance, healthcare, retail, and logistics since 2013.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-16 flex items-center gap-4"
              >
                <a href="#selected-work" className="work-hero-explore flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-sm transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  <div className="flex h-5 w-3.5 justify-center rounded-full border border-muted-foreground/40 p-0.5">
                    <motion.div
                      animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="h-1.5 w-1 rounded-full bg-muted-foreground"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground select-none">
                    Explore our work
                  </span>
                </a>
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
          <section id="selected-work" className="scroll-mt-24 py-24 px-6 border-t border-border/40">
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
                    Our Work
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
                    No projects match "{searchQuery}" under {selectedCategory}.
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
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:grid-flow-row-dense">
                  {filteredProjects.map((p, i) => (
                    <ProjectCard
                      key={p.title}
                      index={i}
                      {...p}
                      wide={isWideCard(i, filteredProjects.length)}
                    />
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