import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import CollaborateCTA from "@/components/CollaborateCTA";
import {
  Trophy,
  Frown,
  Lightbulb,
  Rocket,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Globe,
  Quote,
  Search,
  Code2,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Palette,
  CalendarCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const SUCCESS_STORIES = [
  {
    id: "success-1",
    tag: "Mobile App",
    title: "From Crash-Prone Prototype to 100K Downloads",
    desc: "A health startup came to us with a half-built React Native app — 40+ crash reports open, no Android version, and an investor demo in 6 weeks. We took full ownership, rebuilt the core architecture, and shipped both iOS and Android on time. Within 60 days of launch, the app charted in the App Store's top 10 for Health & Fitness.",
    impact: "100K Downloads · Top 10 App Store",
    challenge: "Unstable codebase, no Android build, and a non-negotiable investor demo deadline threatening the next funding round.",
    solution: "Complete React Native rebuild with shared cross-platform logic, offline support, and a performance overhaul that cut load time by 65%.",
    color: "from-emerald-500/20 to-teal-500/20",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    icon: <Trophy className="text-emerald-500" size={32} />,
  },
  {
    id: "success-2",
    tag: "E-commerce & UI/UX",
    title: "A Checkout Redesign That Tripled Revenue",
    desc: "A fashion retailer had strong brand recognition and steady traffic — but was bleeding customers at checkout. We redesigned the end-to-end shopping experience, from product discovery to payment confirmation, with a relentless focus on mobile. The numbers changed within the first month.",
    impact: "3× Conversion Rate · 58% Drop in Abandonment",
    challenge: "A 6-step desktop-only checkout that was losing 74% of mobile visitors before they ever reached payment.",
    solution: "Mobile-first Shopify redesign with one-tap checkout, smart product recommendations, and a streamlined 2-step purchase flow.",
    color: "from-blue-500/20 to-indigo-500/20",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
    icon: <Rocket className="text-blue-500" size={32} />,
  },
];

const FAILURE_STORIES = [
  {
    id: "failure-1",
    tag: "Web Development",
    title: "The Launch That Went Down in 11 Minutes",
    desc: "A client pushed hard to launch their web platform ahead of schedule. We agreed — and skipped the load testing phase to make the deadline. On launch day, a traffic spike eight times our projected peak took the entire backend offline in under 11 minutes. The client lost thousands in sales. We lost sleep.",
    lesson: "Speed without resilience isn't delivery — it's a delayed disaster.",
    challenge: "No autoscaling configured, single-region deployment, and zero buffer for real-world traffic patterns.",
    fix: "We rebuilt the infrastructure with auto-scaling groups, multi-region failover, and CDN-level caching. Pre-launch stress testing is now mandatory on every project we ship.",
    color: "from-rose-500/20 to-orange-500/20",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    icon: <Frown className="text-rose-500" size={32} />,
  },
  {
    id: "failure-2",
    tag: "UI/UX Design",
    title: "The Beautiful Interface Nobody Could Use",
    desc: "We were proud of a dashboard redesign we delivered for an operations client. Visually, it was our best work to date. We were so confident we skipped formal user testing. Within days of launch, every power user was confused. Workflows they'd relied on for years had moved or disappeared. The client rolled back within a week.",
    lesson: "Great design is invisible. If users notice it, something is wrong.",
    challenge: "We optimised for aesthetics and modern patterns — ignoring the deeply ingrained mental models of users who had worked in the old UI for three years.",
    fix: "We rebuilt the design with real usability testing from the start. Now, no major UI ships without sessions with at least five actual users validating the flows.",
    color: "from-amber-500/20 to-yellow-500/20",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=1200",
    icon: <AlertCircle className="text-amber-500" size={32} />,
  },
];

const GLOBAL_STATS = [
  { label: "Projects Delivered",   value: 60, suffix: "+", icon: <Rocket size={24} /> },
  { label: "Client Retention Rate", value: 94, suffix: "%", icon: <Users size={24} /> },
  { label: "Countries Served",      value: 16,  suffix: "+", icon: <Globe size={24} /> },
  { label: "Years in Business",     value: 13,  suffix: "+", icon: <CalendarCheck size={24} /> },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    desc: "We map your goals, users, and constraints before writing a single line of code. No assumptions. No wasted sprints.",
    icon: <Search className="text-primary" size={24} />,
    color: "bg-blue-500/10",
  },
  {
    title: "Design",
    desc: "UI/UX built around how your users actually think — not what looks good in a portfolio. Every screen is validated before it is built.",
    icon: <Palette className="text-primary" size={24} />,
    color: "bg-violet-500/10",
  },
  {
    title: "Engineering",
    desc: "Web platforms, mobile apps, e-commerce stores — precision code built for where you are going, not just where you are today.",
    icon: <Code2 className="text-primary" size={24} />,
    color: "bg-emerald-500/10",
  },
  {
    title: "Launch & Scale",
    desc: "We don't disappear after go-live. Performance monitoring, AI integrations, and continuous improvement are part of every engagement.",
    icon: <BrainCircuit className="text-primary" size={24} />,
    color: "bg-amber-500/10",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function StoriesPage() {
  usePageMeta({ title: "Stories", description: "Wins we're proud of and lessons we earned — the honest record of a decade of shipping software." });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    const ctx = gsap.context(() => {
      // Hero
      gsap.fromTo(
        ".hero-text",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
      );

      // Story cards — fix: use data attribute instead of classList for direction
      const cards = gsap.utils.toArray(".story-anim-card");
      cards.forEach((card: any) => {
        const image   = card.querySelector(".story-image-box");
        const imgEl   = card.querySelector("img");
        const content = card.querySelector(".story-content-box");
        const dir     = card.dataset.dir === "reverse" ? 1 : -1;

        if (imgEl) {
          gsap.to(imgEl, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        if (image) {
          gsap.fromTo(image,
            { x: 120 * -dir, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: "power3.out",
              /**
               * play none none reverse: slide in on enter and stay put while
               * the card is on screen. The old "play reverse play reverse"
               * reversed the tween as soon as the card's top crossed 20% of
               * the viewport — cards visibly slid away while being read.
               * It only rewinds now when scrolling back above the card.
               */
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        }
        if (content) {
          gsap.fromTo(content,
            { x: 120 * dir, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        }
      });

      // Section headers: badge, heading and intro cascade in together.
      // Animating the parent's children (not just the badge) is what makes
      // each section open with one coherent motion instead of a lone chip.
      gsap.utils.toArray(".reveal-up").forEach((badge: any) => {
        const head = badge.parentElement;
        if (!head) return;
        gsap.fromTo(
          head.children,
          { y: 36, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: head, start: "top 85%" },
          }
        );
      });

      // Stat tiles rise in sequence before their counters start ticking.
      gsap.fromTo(
        ".stat-tile",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".stats-section", start: "top 85%" },
        }
      );

      // Counters
      gsap.utils.toArray(".stat-counter").forEach((stat: any) => {
        const target    = parseFloat(stat.dataset.value || "0");
        const isDecimal = stat.dataset.value?.includes(".");
        gsap.fromTo(stat,
          { innerText: 0 },
          {
            innerText: target, duration: 2, ease: "power2.out",
            scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
            onUpdate() {
              const v = parseFloat(this.targets()[0].innerText);
              stat.innerText = isDecimal ? v.toFixed(1) : Math.floor(v);
            },
          }
        );
      });

      // Process cards
      gsap.fromTo(".process-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: ".process-section", start: "top 90%" } }
      );

      // DNA
      gsap.fromTo(".dna-item",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".dna-section", start: "top 90%" } }
      );
    }, containerRef);

    return () => { clearTimeout(timer); ctx.revert(); };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col" ref={containerRef}>
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="pt-24 pb-20 px-6 relative bg-secondary overflow-hidden">
          <HeroBackdrop />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div className="hero-text inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20">
              {"<Our Work, Unfiltered/>"}
            </motion.div>
            <h1 className="hero-text text-5xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight">
              Wins We're Proud Of. <br />
              <span className="text-primary italic">Lessons We Earned.</span>
            </h1>
            <p className="hero-text text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              We design, build, and ship digital products across web, mobile, e-commerce, and AI. Here's the honest record — the successes that defined us and the failures that made us better.
            </p>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="py-24 stats-section border-y border-border/50 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {GLOBAL_STATS.map((stat, i) => (
                <div key={i} className="stat-tile flex flex-col items-center text-center space-y-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground flex items-center justify-center">
                      <span className="stat-counter" data-value={stat.value}>0</span>
                      <span>{stat.suffix}</span>
                    </div>
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Success Stories ──────────────────────────────────── */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-32">
              <div className="reveal-up inline-block px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-sm font-bold mb-6 border border-emerald-500/20">
                {"<Success Stories/>"}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Wins Worth Sharing</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Projects that changed how our clients operate — measurable results, not just good-looking deliverables.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-48">
              {SUCCESS_STORIES.map((story, i) => (
                <div
                  key={story.id}
                  data-dir={i % 2 === 0 ? "normal" : "reverse"}
                  className={`story-anim-card flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="story-image-box flex-1 w-full relative group">
                    <div className="relative h-[500px] md:h-[620px] overflow-hidden border border-border/30 shadow-2xl bg-card dark:bg-secondary">
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-40 group-hover:opacity-10 transition-opacity duration-500 z-10`} />
                      <img
                        src={story.image} alt={story.title}
                        width="1200" height="620"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1.5s] ease-out will-change-transform"
                        loading="lazy"
                      />
                      <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-white/10 text-primary font-mono text-sm font-bold z-20">
                        {story.tag}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="story-content-box flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                        {story.icon}
                      </div>
                      <span className="text-emerald-400 flex items-center gap-2 font-mono text-sm font-bold">
                        <Zap size={14} /> {story.impact}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">{story.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">{story.desc}</p>

                    <div className="space-y-6 pt-8 border-t border-border/50">
                      <div className="flex gap-5">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Target className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-[0.2em] font-mono">The Challenge</p>
                          <p className="text-base font-medium leading-relaxed">{story.challenge}</p>
                        </div>
                      </div>
                      <div className="flex gap-5">
                        <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="text-emerald-500" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-[0.2em] font-mono">What We Built</p>
                          <p className="text-base font-medium leading-relaxed">{story.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────── */}
        <section className="py-40 px-6 process-section border-b border-border/50 bg-background relative z-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="reveal-up inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20">
              {"<How We Work/>"}
            </div>
            <h2 className="text-4xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              From Brief to <span className="text-primary italic">Live</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-24 leading-relaxed">
              Four stages. No surprises. You always know exactly where your project stands.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="process-item group p-10 rounded-3xl bg-card dark:bg-secondary border border-border/30 hover:border-primary/50 transition-all duration-500 text-left space-y-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-500" />
                  <span className="text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors font-mono leading-none block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {step.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Failure Stories ──────────────────────────────────── */}
        <section className="py-32 px-6 failure-section bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-32">
              <div className="reveal-up inline-block px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 font-mono text-sm font-bold mb-8 border border-rose-500/20">
                {"<Hard Lessons/>"}
              </div>
              <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">Wisdom from Failure</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Most agencies only show their wins. We show both — because the mistakes are where the real character is.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-48">
              {FAILURE_STORIES.map((story, i) => (
                <div
                  key={story.id}
                  data-dir={i % 2 !== 0 ? "normal" : "reverse"}
                  className={`story-anim-card flex flex-col ${i % 2 !== 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="story-image-box flex-1 w-full group">
                    <div className="relative h-[500px] md:h-[620px] overflow-hidden border border-border/30 shadow-2xl bg-card dark:bg-secondary">
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-60 group-hover:opacity-20 transition-opacity duration-500 z-10`} />
                      <img
                        src={story.image} alt={story.title}
                        width="1200" height="620"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 grayscale-[80%] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out will-change-transform"
                        loading="lazy"
                      />
                      <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-white/10 text-rose-400 font-mono text-sm font-bold z-20">
                        {story.tag}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="story-content-box flex-1 space-y-8">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                      {story.icon}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">{story.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">{story.desc}</p>

                    <div className="space-y-6 pt-8 border-t border-border/50">
                      <div className="flex gap-5">
                        <div className="w-11 h-11 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="text-rose-500" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-[0.2em] font-mono">What Went Wrong</p>
                          <p className="text-base font-medium leading-relaxed">{story.challenge}</p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="text-emerald-500" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-[0.2em] font-mono">How We Fixed It</p>
                          <p className="text-base font-medium leading-relaxed">{story.fix}</p>
                        </div>
                      </div>

                      <div className="flex gap-5 relative pt-2">
                        <div className="absolute -left-1 -top-1 text-primary/10">
                          <Quote size={40} />
                        </div>
                        <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 relative z-10 mt-0.5">
                          <Lightbulb className="text-amber-500" size={20} />
                        </div>
                        <div className="relative z-10">
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-[0.2em] font-mono">The Lesson</p>
                          <p className="text-xl font-bold leading-relaxed italic text-foreground/90">"{story.lesson}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DNA Section ──────────────────────────────────────── */}
        <section className="py-40 px-6 dna-section border-t border-border bg-background relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="reveal-up inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20">
              {"<Our Values/>"}
            </div>
            <h2 className="text-5xl md:text-8xl font-bold mb-6 leading-tight tracking-tighter">How We Operate</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-32">
              Three principles that show up in every project — whether it's a mobile app, a web platform, or an AI integration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
              <div className="hidden md:block absolute top-20 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />

              {[
                {
                  icon: <Target size={52} className="text-primary relative z-10" />,
                  label: "Precision",
                  desc: "We scope honestly. No padding estimates. No vague timelines. Every commitment is built from data, not optimism.",
                },
                {
                  icon: <Users size={52} className="text-primary relative z-10" />,
                  label: "Transparency",
                  desc: "You see everything — progress, blockers, and trade-offs. No surprises at the end of a sprint.",
                },
                {
                  icon: <TrendingUp size={52} className="text-primary relative z-10" />,
                  label: "Ownership",
                  desc: "We treat your product like it's ours. That means speaking up when something won't work, not just building what's asked.",
                },
              ].map((item, i) => (
                <div key={i} className="dna-item group">
                  <div className="w-36 h-36 rounded-3xl bg-card dark:bg-secondary border-2 border-primary/20 flex items-center justify-center mx-auto mb-10 group-hover:rotate-[8deg] group-hover:border-primary group-hover:shadow-[0_0_50px_-12px_rgba(0,163,117,0.3)] transition-all duration-500 shadow-2xl relative">
                    <div className="absolute inset-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    {item.icon}
                  </div>
                  <h4 className="text-3xl font-bold mb-5 uppercase tracking-tighter group-hover:text-primary transition-colors">{item.label}</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CollaborateCTA />
      </main>

      <Footer />
    </div>
  );
}