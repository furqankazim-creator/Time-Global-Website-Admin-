import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollaborateCTA from "@/components/CollaborateCTA";
import { CtaButton } from "@/components/ui/cta-button";
import { usePageMeta } from "@/lib/usePageMeta";
import type { CmsImage } from "@/lib/cms";

type FullProject = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  techStack: string[];
  liveUrl: string;
  /** All three are sanitized server-side before storage. */
  problem: string;
  solution: string;
  result: string;
  coverImage: CmsImage | null;
  clientLogo: CmsImage | null;
  gallery: CmsImage[];
};

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

/** Shared prose styling for the sanitized case-study HTML. */
const PROSE =
  "text-lg leading-relaxed text-foreground/85 " +
  "[&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline";

function Chapter({
  label, body, index,
}: { label: string; body: string; index: number }) {
  if (!body?.trim()) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-10 py-10 border-t border-border/50 first:border-t-0"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-primary md:pt-2">
        {label}
      </h2>
      <div className={PROSE} dangerouslySetInnerHTML={{ __html: body }} />
    </motion.section>
  );
}

export default function ProjectPage({ slug }: { slug: string }) {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["cms", "project", slug],
    queryFn: async (): Promise<FullProject> => {
      const res = await fetch(`${BASE}/api/v1/public/projects/${slug}`);
      if (!res.ok) throw new Error(`Project not found (${res.status})`);
      return (await res.json()).data;
    },
    retry: 1,
  });

  usePageMeta({
    title: project?.title ?? "Case Study",
    description: project?.client
      ? `${project.title} — a case study for ${project.client}.`
      : undefined,
    ogImage: project?.coverImage?.url || undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">
        {isLoading && (
          <p className="text-center text-muted-foreground py-32">Loading case study…</p>
        )}

        {error && (
          <div className="max-w-xl mx-auto px-6 py-32 text-center">
            <h1 className="text-3xl font-bold mb-3">Case study not found</h1>
            <p className="text-muted-foreground mb-8">
              It may have been unpublished or its address changed.
            </p>
            <CtaButton href="/work">
              <ArrowLeft size={16} /> All work
            </CtaButton>
          </div>
        )}

        {project && (
          <article>
            {/* Header */}
            <header className="relative bg-secondary text-foreground overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
              </div>
              <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/work" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                      <ArrowLeft size={15} /> Work
                    </Link>
                    <span>/</span>
                    <span className="text-primary font-mono text-xs capitalize">
                      {project.category.replace("-", " ")}
                    </span>
                  </nav>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] mb-5">
                    {project.title}
                  </h1>

                  {project.client && (
                    <p className="text-muted-foreground text-lg">
                      for <span className="text-foreground font-semibold">{project.client}</span>
                    </p>
                  )}

                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                      {project.techStack.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </header>

            {/* Cover bridges the dark header into the body */}
            {project.coverImage?.url && (
              <div className="max-w-5xl mx-auto px-6">
                <motion.img
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.title}
                  className="w-full aspect-[16/8] object-cover rounded-b-2xl border-x border-b border-border/40 shadow-2xl"
                />
              </div>
            )}

            {/* Problem → Solution → Result */}
            <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
              <Chapter label="The problem" body={project.problem} index={0} />
              <Chapter label="Our solution" body={project.solution} index={1} />
              <Chapter label="The result" body={project.result} index={2} />

              {project.liveUrl && (
                <div className="pt-10 border-t border-border/50">
                  <CtaButton href={project.liveUrl} size="lg">
                    Visit the live site <ExternalLink size={16} />
                  </CtaButton>
                </div>
              )}
            </div>

            {/* Gallery */}
            {project.gallery?.length > 0 && (
              <div className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <motion.img
                    key={img.url}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                    src={img.url}
                    alt={img.alt || `${project.title} screenshot ${i + 1}`}
                    className="w-full rounded-xl border border-border/40 shadow-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            <div className="max-w-4xl mx-auto px-6 pb-16">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} /> All case studies
              </Link>
            </div>

            <CollaborateCTA />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
