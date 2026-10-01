import { useEffect, useState, useMemo } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Clock, Search, Sparkles, Filter,
  BookOpen, ChevronRight, Share2, Tag, Calendar, User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PostCard, toPost, type BlogCard } from "@/components/BlogPreview";
import { usePosts } from "@/lib/cms";

function FeaturedPost({ post }: { post: BlogCard }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-3xl bg-gradient-to-b from-card to-card/60 border border-border/80 hover:border-primary/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
    >
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Cover image container */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] overflow-hidden bg-muted">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent lg:hidden" />
          
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-primary text-xs font-mono font-bold tracking-wide">
              {post.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg flex items-center gap-1">
              <Sparkles size={12} /> Featured Insight
            </span>
          </div>
        </div>

        {/* Content column */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 lg:p-12 relative z-10">
          <div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mb-4">
              {post.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" /> {post.date}
                </span>
              )}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="inline-flex items-center gap-1">
                <Clock size={13} className="text-primary" /> {post.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed line-clamp-4 text-sm sm:text-base mb-8">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-border/50 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Read Full Article</span>
              <ArrowRight size={16} />
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Engineering Deep Dive
            </span>
          </div>
        </div>
      </div>

      {post.slug && (
        <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20">
          <span className="sr-only">Read {post.title}</span>
        </Link>
      )}
    </motion.article>
  );
}

function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-4 animate-pulse">
      <div className="aspect-[16/9] w-full rounded-xl bg-muted" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-6 bg-muted rounded w-4/5" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  );
}

export default function BlogPage() {
  usePageMeta({
    title: "Blog & Engineering Insights",
    description: "Architectural lessons, product strategy, and technical insights from the Time Global team.",
  });

  const { data: cms, isLoading } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allPosts = useMemo(() => cms.map(toPost), [cms]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [allPosts]);

  // Filter posts based on category & search
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCat =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const [featured, ...rest] = filteredPosts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-secondary/80 border-b border-border/50 py-20 sm:py-28 overflow-hidden">
          {/* Subtle Ambient Lighting */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
            <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] bg-primary/8 rounded-full blur-[140px]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold mb-6 border border-primary/20 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>// ENGINEERING & PRODUCT INSIGHTS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 max-w-4xl mx-auto">
                Real code, real scale,{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                  battle-tested
                </span>{" "}
                lessons.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light mb-10">
                Architectural post-mortems, scalable patterns, and pragmatic product insights written directly by the engineers building mission-critical software.
              </p>

              {/* Search & Topic Filters Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title, topic, or keyword..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-card/90 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm shadow-lg backdrop-blur-md transition-all outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-xs text-muted-foreground hover:text-foreground px-2 py-1 bg-muted rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-4 pb-8 mb-10 border-b border-border/50 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={15} className="text-muted-foreground mr-1" />
              {categories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                        : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground font-mono shrink-0 hidden sm:block">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center max-w-xl mx-auto my-12 bg-card/40">
              <BookOpen size={36} className="mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-bold text-lg mb-1">No articles match your criteria</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Try searching for different keywords or select a different category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Featured Post (Only when not in specific search mode) */}
          {!isLoading && featured && !searchQuery && selectedCategory === "All" && (
            <div className="mb-14">
              <FeaturedPost post={featured} />
            </div>
          )}

          {/* Grid of Articles */}
          {!isLoading && (
            <>
              {(!searchQuery && selectedCategory === "All" && rest.length > 0) && (
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    Latest Publications
                  </h2>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {(!searchQuery && selectedCategory === "All" ? rest : filteredPosts).map(
                  (post, i) => (
                    <PostCard key={post.slug || post.title} post={post} index={i} />
                  )
                )}
              </div>
            </>
          )}

          {/* Newsletter Box */}
          <div className="mt-24 rounded-3xl bg-gradient-to-r from-card via-secondary to-card border border-border/80 p-8 sm:p-12 relative overflow-hidden shadow-xl">
            <div className="max-w-2xl relative z-10">
              <span className="text-primary font-mono text-xs font-bold uppercase tracking-wider block mb-2">
                Stay Ahead
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                Get our engineering breakdowns directly to your inbox.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                No spam, no vendor pitches. Just clean technical write-ups and product case studies whenever we publish something new.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to Time Global Insights!");
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your work email"
                  className="h-11 px-4 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary flex-1"
                />
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
