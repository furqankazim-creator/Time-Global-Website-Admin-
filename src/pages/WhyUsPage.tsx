import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollaborateCTA from "@/components/CollaborateCTA";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import {
  ShieldCheck,
  Zap,
  Globe,
  HeartHandshake,
  Clock,
  Code2,
  Users,
  TrendingUp,
  CheckCircle2,
  Star,
  Award,
  Lightbulb,
  Lock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIFFERENTIATORS = [
  {
    icon: <Clock className="text-primary" size={28} />,
    title: "We Save Your Time",
    desc: "Our core motive. We architect automated workflows and CI/CD pipelines that eliminate repetitive tasks — saving clients thousands of engineering hours every year.",
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <ShieldCheck className="text-primary" size={28} />,
    title: "Precision Engineering",
    desc: "Every deliverable is code-reviewed, tested, and documented to production standards before it leaves our hands. We ship once, correctly.",
    color: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: <Globe className="text-primary" size={28} />,
    title: "Global Reach, Local Insight",
    desc: "Clients across Europe, North America, the UAE, and Australia trust us because we understand regional markets and compliance requirements — not just the tech stack.",
    color: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: <HeartHandshake className="text-primary" size={28} />,
    title: "98% Client Retention",
    desc: "We don't treat projects as transactions. Long-term partnerships built on consistent delivery and honest communication are why clients stay for 3, 5, even 10+ years.",
    color: "from-rose-500/10 to-pink-500/10",
  },
  {
    icon: <Zap className="text-primary" size={28} />,
    title: "Rapid Iteration",
    desc: "Our lean 'discover → build → ship → refine' loop gets your product in front of real users faster, letting data — not assumptions — drive what we build next.",
    color: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: <Lock className="text-primary" size={28} />,
    title: "Security-First by Default",
    desc: "Penetration-tested deployments, encrypted data pipelines, and OWASP-compliant code aren't add-ons — they're baked into every project from day one.",
    color: "from-indigo-500/10 to-blue-500/10",
  },
];

const STATS = [
  { value: "200+", label: "Projects Delivered", icon: <Code2 size={20} /> },
  { value: "98%",  label: "Client Retention",   icon: <Star size={20} /> },
  { value: "16+",  label: "Countries Served",   icon: <Globe size={20} /> },
  { value: "13+",  label: "Years in Business",  icon: <Award size={20} /> },
];

const TRUST_POINTS = [
  "Dedicated project manager on every engagement",
  "Weekly progress reports — no surprises",
  "Code ownership transferred at project close",
  "NDA and IP protection as standard",
  "Post-launch support included, not upsold",
  "Transparent pricing with fixed-scope options",
];

const TECH_PHILOSOPHY = [
  {
    icon: <Lightbulb size={24} className="text-primary" />,
    title: "Right Tool, Right Job",
    desc: "We don't have a favourite framework. We pick the stack that best serves your use case, performance targets, and team's long-term ability to maintain it.",
  },
  {
    icon: <TrendingUp size={24} className="text-primary" />,
    title: "Built to Scale",
    desc: "Architecture decisions are made for where you're going, not just where you are. Horizontal scaling, event-driven patterns, and cloud-native design are our baseline.",
  },
  {
    icon: <Users size={24} className="text-primary" />,
    title: "Your Team's Extension",
    desc: "We integrate with your workflows — stand-ups, Jira, GitHub, Slack. You always have full visibility and control over what's being built.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhyUsPage() {
  usePageMeta({
    title: "Why Us",
    description:
      "13 years, 200+ projects, 16 countries — what makes Time Global the right engineering partner for your next product.",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".diff-card", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".diff-grid",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".stat-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-band",
          start: "top 85%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground"
        ref={containerRef}
      >
        <div className="h-[72px] shrink-0" />

        <main id="main-content" className="flex-1">

          {/* ── Hero ──────────────────────────────────────────────────────────── */}
          <section className="pt-24 pb-24 px-6 relative overflow-hidden bg-secondary">
            <HeroBackdrop />
            <div className="max-w-7xl mx-auto relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="hero-text inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20"
              >
                {"<Why Time Global/>"}
              </motion.div>

              <h1 className="hero-text text-5xl md:text-7xl font-bold mb-8 leading-[1.05] tracking-tight">
                Built on Trust. <br />
                <span className="text-primary italic">Proven by Results.</span>
              </h1>

              <p className="hero-text text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                Since 2013 we've helped startups, scale-ups, and enterprises across four continents
                turn complex ideas into software that ships on time and scales without limits.
              </p>
            </div>
          </section>

          {/* ── Stats Band ────────────────────────────────────────────────────── */}
          <section className="py-16 border-y border-border/50 bg-background stats-band">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((s, i) => (
                  <div key={i} className="stat-item flex flex-col items-center text-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      {s.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                      {s.value}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Six Differentiators ───────────────────────────────────────────── */}
          <section className="py-32 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20"
                >
                  {"<What Sets Us Apart/>"}
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Six Reasons Clients <span className="text-primary italic">Stay</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Not promises — patterns we've proved across 200+ projects and 13 years of engineering.
                </p>
              </div>

              <div className="diff-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DIFFERENTIATORS.map((d, i) => (
                  <div
                    key={i}
                    className={`diff-card group p-8 rounded-2xl bg-gradient-to-br ${d.color} border border-border/30 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-background/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {d.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {d.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Trust Checklist ───────────────────────────────────────────────── */}
          <section className="py-32 px-6 bg-secondary border-y border-border/50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20"
                  >
                    {"<How We Work With You/>"}
                  </motion.div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                    No hidden fees. <br />
                    <span className="text-primary italic">No surprises.</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                    Every engagement follows the same commitment: transparent communication,
                    full IP handover, and support that doesn't disappear after launch.
                  </p>

                  <ul className="space-y-4">
                    {TRUST_POINTS.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={14} className="text-primary" />
                        </div>
                        <span className="text-foreground font-medium">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Visual — floating quote card */}
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200"
                      alt="Time Global team working together"
                      width="1200"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Floating quote */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 p-6 rounded-2xl bg-background/85 backdrop-blur-md border border-white/10 shadow-xl">
                      <p className="text-base font-bold italic leading-snug mb-3">
                        "They feel less like a vendor and more like a co-founder who happens to be a genius engineer."
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">— Sarah Chen, VP Engineering, TechBridge</p>
                    </div>
                  </div>
                  <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border-2 border-primary/20 rounded-2xl" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Tech Philosophy ───────────────────────────────────────────────── */}
          <section className="py-32 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20"
                >
                  {"<Our Engineering Philosophy/>"}
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  How We Think About Technology
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Tools change. Principles don't. These are the engineering convictions we bring to every project.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TECH_PHILOSOPHY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group p-8 rounded-2xl bg-card border border-border/30 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl text-left"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <CollaborateCTA />
        </main>

        <Footer />
      </div>
    </>
  );
}
