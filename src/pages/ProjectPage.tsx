import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ExternalLink, ShieldCheck,
  Zap, TrendingUp, Layers, CheckCircle2, Globe, Cpu, Sparkles,
  Share2, Check, X, Maximize2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollaborateCTA from "@/components/CollaborateCTA";
import { CtaButton } from "@/components/ui/cta-button";
import { usePageMeta } from "@/lib/usePageMeta";
import { useProjects, getStaticProject, type CmsImage, type CmsProject } from "@/lib/cms";
import { useContactModal } from "@/hooks/use-contact-modal";
import { toast } from "@/hooks/use-toast";

type FullProject = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  techStack: string[];
  liveUrl: string;
  problem: string;
  solution: string;
  result: string;
  coverImage: CmsImage | null;
  clientLogo: CmsImage | null;
  gallery: CmsImage[];
};

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const PROSE =
  "text-base sm:text-lg leading-relaxed text-foreground/85 font-normal " +
  "[&_p]:mb-6 [&_p]:leading-relaxed " +
  "[&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-10 [&_h3]:mb-4 " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_li]:text-foreground/85 " +
  "[&_a]:text-primary [&_a]:underline font-medium hover:[&_a]:text-primary/80 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/30 [&_blockquote]:p-5 [&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:italic";

function CaseStudyChapter({
  label,
  subtitle,
  icon: Icon,
  body,
  index,
}: {
  label: string;
  subtitle: string;
  icon: any;
  body: string;
  index: number;
}) {
  if (!body?.trim()) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="py-12 border-t border-border/60 first:border-t-0"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold block">
            {label}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
            {subtitle}
          </h2>
        </div>
      </div>

      <div className={`mt-6 pl-0 sm:pl-11 ${PROSE}`} dangerouslySetInnerHTML={{ __html: body }} />
    </motion.section>
  );
}

export default function ProjectPage({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const { openModal } = useContactModal();

  const staticFallback = getStaticProject(slug);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["cms", "project", slug],
    queryFn: async (): Promise<FullProject> => {
      // 1. Check live admin backend API
      try {
        const res = await fetch(`${BASE}/api/v1/public/projects/${slug}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            // Save admin work into local cache
            try {
              localStorage.setItem(`tg_project_${slug}`, JSON.stringify(json.data));
            } catch {}
            return json.data;
          }
        }
      } catch {}

      // 2. Check previously cached admin work
      try {
        const cached = localStorage.getItem(`tg_project_${slug}`);
        if (cached) return JSON.parse(cached);
      } catch {}

      // 3. Fallback to rich static project library
      if (staticFallback) return staticFallback as unknown as FullProject;

      throw new Error(`Project not found (${slug})`);
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem(`tg_project_${slug}`);
        if (cached) return JSON.parse(cached);
      } catch {}
      return (staticFallback as unknown as FullProject) || undefined;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });

  const { data: allProjects } = useProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  usePageMeta({
    title: project?.title ? `${project.title} — Case Study` : "Case Study",
    description: project?.client
      ? `${project.title} — an enterprise case study for ${project.client}.`
      : undefined,
    ogImage: project?.coverImage?.url || undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Case study link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {isLoading && (
          <div className="max-w-3xl mx-auto px-6 py-32 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-muted-foreground text-sm font-mono">Loading case study…</p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto px-6 py-32 text-center">
            <h1 className="text-3xl font-bold mb-3">Case study not found</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              It may have been unpublished or its address updated.
            </p>
            <CtaButton href="/work">
              <ArrowLeft size={16} /> All work
            </CtaButton>
          </div>
        )}

        {project && (
          <article>
            {/* Header Hero */}
            <header className="relative bg-secondary/80 border-b border-border/50 text-foreground pt-14 pb-16 sm:pb-24 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8">
                    <Link
                      href="/work"
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
                    >
                      <ArrowLeft size={13} /> Work & Portfolio
                    </Link>
                    <span>/</span>
                    <span className="text-primary font-bold capitalize">
                      {project.category.replace("-", " ")}
                    </span>
                  </nav>

                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-4">
                        <Sparkles size={12} /> Case Study
                      </div>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                        {project.title}
                      </h1>
                      {project.client && (
                        <p className="text-lg sm:text-xl text-muted-foreground mt-4 font-light">
                          Engineered for{" "}
                          <span className="text-foreground font-semibold">
                            {project.client}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={copyUrl}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-card border border-border text-xs font-semibold hover:border-primary/50 transition-colors shadow-sm"
                      >
                        {copied ? <Check size={14} className="text-primary" /> : <Share2 size={14} />}
                        <span>{copied ? "Link Copied" : "Share"}</span>
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                          <span>Live Site</span>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </header>

            {/* Hero Cover Image */}
            {project.coverImage?.url && (
              <div className="max-w-7xl mx-auto px-6 -mt-12 sm:-mt-16 relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-card"
                >
                  <img
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
                    }}
                    className="w-full aspect-[16/9] lg:aspect-[21/9] object-cover"
                  />
                </motion.div>
              </div>
            )}

            {/* Impact Metric KPI Strip */}
            <div className="max-w-7xl mx-auto px-6 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-card border border-border/70 p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block">
                      Performance
                    </span>
                    <span className="text-lg font-bold text-foreground">3x Faster Delivery</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-card border border-border/70 p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block">
                      Reliability
                    </span>
                    <span className="text-lg font-bold text-foreground">99.98% System Uptime</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-card border border-border/70 p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Zap size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block">
                      Efficiency
                    </span>
                    <span className="text-lg font-bold text-foreground">Cloud Cost Reduction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Showcase Layout */}
            <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Left Column: Chapters Narrative */}
                <div className="lg:col-span-8 space-y-2">
                  <CaseStudyChapter
                    label="The Challenge"
                    subtitle="Background & Problem Statement"
                    icon={Zap}
                    body={project.problem}
                    index={0}
                  />

                  <CaseStudyChapter
                    label="Our Solution"
                    subtitle="Architecture, Strategy & Execution"
                    icon={Cpu}
                    body={project.solution}
                    index={1}
                  />

                  <CaseStudyChapter
                    label="Impact & Outcomes"
                    subtitle="Quantifiable Results Delivered"
                    icon={TrendingUp}
                    body={project.result}
                    index={2}
                  />
                </div>

                {/* Right Column: Sticky Project Meta Specs */}
                <div className="lg:col-span-4">
                  <div className="sticky top-28 space-y-6">
                    <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
                      <h3 className="font-bold text-base mb-6 pb-4 border-b border-border/60 flex items-center gap-2">
                        <Layers size={16} className="text-primary" /> Project Metadata
                      </h3>

                      <div className="space-y-5 text-sm">
                        {project.client && (
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1">
                              Client
                            </span>
                            <span className="font-semibold text-foreground">{project.client}</span>
                          </div>
                        )}

                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1">
                            Domain & Category
                          </span>
                          <span className="font-medium text-foreground capitalize">
                            {project.category.replace("-", " ")}
                          </span>
                        </div>

                        {project.techStack?.length > 0 && (
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-2">
                              Technologies & Tools
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {project.techStack.map((tech: string) => (
                                <span
                                  key={tech}
                                  className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xs font-mono font-medium text-foreground/90"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.liveUrl && (
                          <div className="pt-4 border-t border-border/50">
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground transition-colors"
                            >
                              <Globe size={14} className="text-primary" />
                              <span>View Live Website</span>
                              <ExternalLink size={12} className="text-muted-foreground" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Consultation Callout Box */}
                    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 p-6">
                      <h4 className="font-bold text-sm mb-2">Building something similar?</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        Let's discuss how we can design and ship a tailored solution for your product requirements.
                      </p>
                      <button
                        onClick={openModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                      >
                        Start Your Project <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Screenshots */}
            {project.gallery?.length > 0 && (
              <section className="bg-secondary/40 border-t border-border py-20 px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="max-w-xl mb-12">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary font-bold block mb-2">
                      Visual Showcase
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold">
                      Interface & Product Architecture
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                    {project.gallery.map((img: CmsImage, i: number) => (
                      <motion.div
                        key={img.url}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                        onClick={() => setLightboxImg(img.url)}
                        className="rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-card group relative cursor-pointer"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${project.title} showcase ${i + 1}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
                          }}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5">
                            <Maximize2 size={13} /> Click to enlarge
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Image Lightbox Modal */}
            <AnimatePresence>
              {lightboxImg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setLightboxImg(null)}
                  className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
                >
                  <button
                    onClick={() => setLightboxImg(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <img
                    src={lightboxImg}
                    alt="Enlarged screenshot"
                    className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Case Study Navigation */}
            {nextProject && nextProject.slug && (
              <section className="border-t border-border py-16 px-6 bg-card/50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Up Next
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold hover:text-primary transition-colors">
                      {nextProject.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextProject.client ? `for ${nextProject.client}` : "Explore Case Study"}
                    </p>
                  </div>
                  <Link
                    href={`/work/${nextProject.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground border border-border text-xs font-semibold transition-all shrink-0"
                  >
                    <span>Read Next Case Study</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </section>
            )}

            <CollaborateCTA />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
