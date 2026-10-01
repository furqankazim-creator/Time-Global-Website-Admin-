import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft, Clock, User, Share2, Copy, Check,
  Linkedin, Twitter, Bookmark, ArrowRight, Sparkles, BookOpen
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CtaButton } from "@/components/ui/cta-button";
import { JsonLd, type ArticleSchema } from "@/components/JsonLd";
import type { CmsImage } from "@/lib/cms";
import { usePageMeta } from "@/lib/usePageMeta";
import { usePosts, getStaticPost, type CmsPost } from "@/lib/cms";
import { toPost } from "@/components/BlogPreview";
import { toast } from "@/hooks/use-toast";

type FullPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  readingTime: number;
  featuredImage: CmsImage | null;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  author: { name: string } | null;
};

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export default function BlogPostPage({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  // Top reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const staticFallback = getStaticPost(slug);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["cms", "post", slug],
    queryFn: async (): Promise<FullPost> => {
      // 1. Check live admin backend API
      try {
        const res = await fetch(`${BASE}/api/v1/public/posts/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            // Save admin work into local cache
            try {
              localStorage.setItem(`tg_post_${slug}`, JSON.stringify(json.data));
            } catch {}
            return json.data;
          }
        }
      } catch {}

      // 2. Check previously cached admin work
      try {
        const cached = localStorage.getItem(`tg_post_${slug}`);
        if (cached) return JSON.parse(cached);
      } catch {}

      // 3. Fallback to rich static post library
      if (staticFallback) return staticFallback as unknown as FullPost;

      throw new Error(`Post not found (${slug})`);
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem(`tg_post_${slug}`);
        if (cached) return JSON.parse(cached);
      } catch {}
      return (staticFallback as unknown as FullPost) || undefined;
    },
    retry: 0,
  });

  // Fetch more articles for the "Keep Reading" section
  const { data: morePosts } = usePosts();
  const relatedArticles = morePosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map(toPost);

  usePageMeta({
    title: post?.title ?? "Blog",
    description: post?.excerpt || undefined,
    ogImage: post?.featuredImage?.url || undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`${post?.title} — by Time Global`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {isLoading && (
          <div className="max-w-3xl mx-auto px-6 py-32 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-muted-foreground text-sm font-mono">Loading technical article…</p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto px-6 py-32 text-center">
            <h1 className="text-3xl font-bold mb-3">Article not found</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              It may have been unpublished or its address updated.
            </p>
            <CtaButton href="/blog">
              <ArrowLeft size={16} /> All articles
            </CtaButton>
          </div>
        )}

        {post && (
          <article>
            {/* Article JSON-LD for Search Engines */}
            <JsonLd
              schema={{
                type: "Article",
                headline: post.title,
                description: post.excerpt ?? "",
                url: `https://timeglobaltech.com/blog/${post.slug}`,
                datePublished: post.publishedAt ?? new Date().toISOString(),
                dateModified: post.publishedAt ?? undefined,
                author: post.author?.name,
                image: post.featuredImage?.url,
              } satisfies ArticleSchema}
            />

            {/* Article Header */}
            <header className="relative bg-secondary/80 border-b border-border/50 text-foreground pt-14 pb-16 sm:pb-20 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                  }}
                />
              </div>

              <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
                    >
                      <ArrowLeft size={13} /> Blog
                    </Link>
                    <span>/</span>
                    <span className="text-primary font-bold">
                      {post.category?.name || "Architecture"}
                    </span>
                  </nav>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] mb-6 tracking-tight">
                    {post.title}
                  </h1>

                  <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/60">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                          {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "TG"}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">
                            {post.author?.name || "Time Global Engineering"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">Author</span>
                        </div>
                      </div>

                      <div className="h-4 w-px bg-border hidden sm:block" />

                      {post.publishedAt && (
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}

                      <div className="h-4 w-px bg-border hidden sm:block" />

                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock size={13} className="text-primary" /> {post.readingTime || 5} min read
                      </span>
                    </div>

                    {/* Social Share Pills */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={copyUrl}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        title="Copy Article Link"
                      >
                        {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={shareTwitter}
                        className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
                        title="Share on X"
                      >
                        <Twitter size={14} />
                      </button>
                      <button
                        onClick={shareLinkedIn}
                        className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage?.url && (
              <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-card"
                >
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </motion.div>
              </div>
            )}

            {/* Article Content Body */}
            <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
              <div
                className="text-base sm:text-lg leading-relaxed text-foreground/90 font-normal
                  [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:tracking-tight
                  [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-10 [&_h3]:mb-4
                  [&_p]:mb-6 [&_p]:leading-relaxed
                  [&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:text-primary/80
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                  [&_li]:text-foreground/85
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/30
                  [&_blockquote]:p-5 [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-foreground
                  [&_img]:rounded-2xl [&_img]:my-10 [&_img]:border [&_img]:border-border/60 [&_img]:shadow-xl
                  [&_pre]:bg-secondary [&_pre]:p-5 [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border/80 [&_pre]:overflow-x-auto [&_pre]:my-6
                  [&_code]:font-mono [&_code]:text-sm [&_code]:text-primary
                  [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_th]:border-b [&_th]:border-border [&_th]:p-3 [&_th]:text-left [&_td]:border-b [&_td]:border-border/50 [&_td]:p-3"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground mr-2">Tags:</span>
                  {post.tags.map((t: { name: string; slug: string }) => (
                    <span
                      key={t.slug}
                      className="px-3 py-1 rounded-lg bg-card border border-border/80 text-foreground/80 text-xs font-mono"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Bio Card */}
              <div className="mt-14 rounded-2xl bg-secondary/60 border border-border p-6 sm:p-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base shrink-0">
                  {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "TG"}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    Written by {post.author?.name || "Time Global Engineering"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Time Global builds resilient web platforms, cloud architectures, and machine learning infrastructure for high-growth enterprises worldwide.
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-3 hover:underline"
                  >
                    Learn more about our team <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Articles / Keep Reading */}
            {relatedArticles.length > 0 && (
              <section className="bg-secondary/40 border-t border-border py-20 px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-bold">Keep Reading</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        More architectural insights and product essays
                      </p>
                    </div>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                    >
                      All articles <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedArticles.map((rel, idx) => (
                      <Link
                        key={rel.slug || idx}
                        href={`/blog/${rel.slug}`}
                        className="group flex flex-col rounded-2xl bg-card border border-border/80 p-5 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
                      >
                        <span className="text-[11px] font-mono text-primary font-bold mb-2">
                          {rel.category}
                        </span>
                        <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 mb-4">
                          {rel.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                          <span>{rel.readTime}</span>
                          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Read <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
