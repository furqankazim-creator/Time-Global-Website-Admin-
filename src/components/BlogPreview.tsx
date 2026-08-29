import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";
import { usePosts, type CmsPost } from "@/lib/cms";

const BLOG_POSTS = [
  {
    slug: "",
    title: "Scaling to 10M Users Without Breaking the Bank",
    category: "Architecture",
    date: "Mar 15, 2024",
    readTime: "8 min read",
    excerpt: "How we architected a serverless system that handles massive scale with minimal operational overhead.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "",
    title: "The AI Hype Cycle vs. Real Business Impact",
    category: "Strategy",
    date: "Mar 8, 2024",
    readTime: "6 min read",
    excerpt: "Cutting through the noise: which AI investments actually move the needle for businesses.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "",
    title: "Zero-Downtime Migrations at Scale",
    category: "DevOps",
    date: "Feb 28, 2024",
    readTime: "10 min read",
    excerpt: "Battle-tested patterns for migrating databases and infrastructure without losing a single user request.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
  },
];

export type BlogCard = (typeof BLOG_POSTS)[0];

/** ~200 wpm is the usual reading-speed convention. */
const readingTime = (p: CmsPost) => {
  const words = (p.excerpt ?? "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

export function toPost(p: CmsPost): BlogCard {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category?.name ?? "Article",
    date: p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    readTime: p.readingTime ? `${p.readingTime} min read` : readingTime(p),
    excerpt: p.excerpt ?? "",
    image: p.featuredImage?.url ?? "",
  };
}

/** Image-led card shared by the preview section and the /blog listing. */
export function PostCard({ post, index = 0 }: { post: BlogCard; index?: number }) {
  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      // Spring hover from framer, not CSS — settles with weight instead of easing linearly
      whileHover={{ y: -8 }}
      className="group flex flex-col h-full rounded-2xl bg-card border border-border/50 hover:border-primary/60 hover:ring-1 hover:ring-primary/30 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/15 transition-[border-color,box-shadow] duration-300"
    >
      {/* Featured image is the card's anchor, not an afterthought */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary" />
        )}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-primary text-xs font-mono font-bold">
          {post.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6 sm:p-7">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
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

        <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {/* underline grows in from the left on hover */}
          <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Read article
          </span>
          <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </span>
      </div>
    </motion.article>
  );

  // Bundled fallback posts have no slug — render unlinked, never a dead link.
  return post.slug ? (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function BlogPreview() {
  // Published CMS posts replace the bundled previews; a scheduled post stays
  // hidden until its publish date, enforced server-side.
  const { data: cms } = usePosts([]);
  const posts: BlogCard[] = cms.length > 0 ? cms.slice(0, 3).map(toPost) : BLOG_POSTS;

  return (
    <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16"
        >
          <div>
            <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-4">Latest Insights</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              From the <span className="text-primary italic">blog</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Expert insights and industry trends to help you stay ahead of the curve.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:gap-3 transition-all px-4 py-2 rounded-full hover:bg-primary/5"
          >
            View all posts <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, i) => (
            <PostCard key={post.slug || post.title} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
