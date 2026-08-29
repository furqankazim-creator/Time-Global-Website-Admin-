import { useEffect } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PostCard, toPost, type BlogCard } from "@/components/BlogPreview";
import { usePosts } from "@/lib/cms";

/**
 * The newest post gets a full-width feature card; the rest flow into the
 * grid. One big visual anchor is what stops a listing page reading as a
 * plain index.
 */
function FeaturedPost({ post }: { post: BlogCard }) {
  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group grid lg:grid-cols-2 rounded-3xl bg-card border border-border/50 hover:border-primary/60 hover:ring-1 hover:ring-primary/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-[border-color,box-shadow] duration-300"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-muted">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary" />
        )}
        <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-border text-primary text-xs font-mono font-bold">
          {post.category}
        </span>
        <span className="absolute top-5 right-5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
          Latest
        </span>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          {post.date && (
            <>
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            </>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed line-clamp-4 mb-8">{post.excerpt}</p>

        <span className="inline-flex items-center gap-2 text-primary font-semibold">
          <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Read the article
          </span>
          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </span>
      </div>
    </motion.article>
  );

  return post.slug ? (
    <Link href={`/blog/${post.slug}`} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function BlogPage() {
  usePageMeta({ title: "Blog", description: "Engineering lessons, product thinking and honest takes from a team that ships every week." });

  const { data: cms, isLoading } = usePosts([]);
  const posts = cms.map(toPost);
  const [featured, ...rest] = posts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-secondary text-foreground overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[140px]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20">
                {"<Blog/>"}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5">
                Insights from the <span className="text-primary italic">build</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Engineering lessons, product thinking and honest takes from a team
                that ships software every week.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          {isLoading && (
            <p className="text-center text-muted-foreground py-16">Loading articles…</p>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="font-semibold mb-1">No articles yet</p>
              <p className="text-muted-foreground text-sm">
                Posts published in the admin panel appear here.
              </p>
            </div>
          )}

          {featured && (
            <div className="mb-14">
              <FeaturedPost post={featured} />
            </div>
          )}

          {rest.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-10"
              >
                <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground shrink-0">
                  More articles
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {String(rest.length).padStart(2, "0")}
                </span>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {rest.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
