import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CtaButton } from "@/components/ui/cta-button";
import type { CmsImage } from "@/lib/cms";
import { usePageMeta } from "@/lib/usePageMeta";

type FullPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Sanitized server-side (DOMPurify) before it is ever stored. */
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
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["cms", "post", slug],
    queryFn: async (): Promise<FullPost> => {
      const res = await fetch(`${BASE}/api/v1/public/posts/${slug}`);
      if (!res.ok) throw new Error(`Post not found (${res.status})`);
      return (await res.json()).data;
    },
    retry: 1,
  });

  // Article pages carry their own meta — title, excerpt and the featured
  // image as the share card. Falls back to a generic title while loading.
  usePageMeta({
    title: post?.title ?? "Blog",
    description: post?.excerpt || undefined,
    ogImage: post?.featuredImage?.url || undefined,
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
          <p className="text-center text-muted-foreground py-32">Loading article…</p>
        )}

        {error && (
          <div className="max-w-xl mx-auto px-6 py-32 text-center">
            <h1 className="text-3xl font-bold mb-3">Article not found</h1>
            <p className="text-muted-foreground mb-8">
              It may have been unpublished or its address changed.
            </p>
            <CtaButton href="/blog">
              <ArrowLeft size={16} /> All articles
            </CtaButton>
          </div>
        )}

        {post && (
          <article>
            {/* Header */}
            <header className="relative bg-secondary text-foreground overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
              </div>
              <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                      <ArrowLeft size={15} /> Blog
                    </Link>
                    {post.category && (
                      <>
                        <span>/</span>
                        <span className="text-primary font-mono text-xs">{post.category.name}</span>
                      </>
                    )}
                  </nav>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {post.author && (
                      <span className="inline-flex items-center gap-1.5">
                        <User size={14} /> {post.author.name}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} /> {post.readingTime || 5} min read
                    </span>
                  </div>
                </motion.div>
              </div>
            </header>

            {/* Featured image bridges the dark header and the body */}
            {post.featuredImage?.url && (
              <div className="max-w-4xl mx-auto px-6 -mt-0">
                <motion.img
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full aspect-[16/8] object-cover rounded-b-2xl border-x border-b border-border/40 shadow-2xl"
                />
              </div>
            )}

            {/* Body — content is sanitized server-side before storage, which is
                what makes dangerouslySetInnerHTML acceptable here. */}
            <div
              className="max-w-3xl mx-auto px-6 py-14 sm:py-20 text-lg leading-relaxed text-foreground/85
                [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:mb-6 [&_a]:text-primary [&_a]:underline
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
                [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40
                [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                [&_img]:rounded-xl [&_img]:my-8 [&_code]:font-mono [&_code]:text-sm
                [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags + back link */}
            <footer className="max-w-3xl mx-auto px-6 pb-20">
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10">
                  {post.tags.map((t) => (
                    <span key={t.slug} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} /> All articles
              </Link>
            </footer>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
