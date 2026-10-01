import { useEffect, useRef, useState } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { motion, useInView } from "framer-motion";
import {
  Code2, Smartphone, Layers, Workflow, Lightbulb, Users, HeartHandshake,
  Award, Globe2, Rocket, Target, Eye, Quote, Leaf, GraduationCap,
  Sprout, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamMarquee from "@/components/TeamMarquee";
import CollaborateCTA from "@/components/CollaborateCTA";
import { useTestimonials, type CmsTestimonial } from "@/lib/cms";

/* ------------------------------- Content ------------------------------- */

const SERVICES = [
  { icon: Code2, title: "Custom Software", desc: "Purpose-built platforms engineered around your workflows — not the other way around." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Android, iOS, Flutter and React Native apps with native performance and polished UI." },
  { icon: Layers, title: "ERP / CRM / HRM", desc: "Business systems that unify operations, customers and people in one source of truth." },
  { icon: Workflow, title: "Digital Transformation", desc: "Automation, integration and consulting that modernise how your business runs." },
];

const VALUES = [
  { icon: Lightbulb, title: "Innovation", desc: "We reach for the newest tools only when they serve the problem — and master them when they do." },
  { icon: Users, title: "Collaboration", desc: "Clients work with our engineers directly. No layers, no telephone game, no surprises." },
  { icon: HeartHandshake, title: "Client-First Delivery", desc: "Success is measured by your outcomes — shipped, adopted and paying for itself." },
];

const WHY_US = [
  { title: "A decade-plus of shipping", desc: "Founded in 2013, we've delivered software through every platform shift since — and our clients are still with us." },
  { title: "Breadth without shallowness", desc: "Web, mobile, ERP, cloud, AI — one team that can own the whole stack instead of five vendors who can't talk to each other." },
  { title: "Custom, not cookie-cutter", desc: "Generic tools force your business to bend around them. We build systems shaped to how you actually operate." },
];

const STATS = [
  { value: "13+", label: "Years Active" },
  { value: "60+", label: "Projects Delivered" },
  { value: "16+", label: "Countries Served" },
  { value: "12", label: "Industries" },
];

type QuoteCard = Pick<CmsTestimonial, "clientName" | "company" | "position" | "quote"> &
  Partial<Pick<CmsTestimonial, "_id" | "rating" | "photo">>;

const FALLBACK_QUOTES: QuoteCard[] = [
  { clientName: "Patrick Reich", company: "Bonnet", position: "Co-Founder & CEO", quote: "The expectations for quality were very high and the developers delivered the vision. Communication stayed transparent throughout." },
  { clientName: "Dimitri Popolov", company: "CANet", position: "Research Data Manager", quote: "We had a tight deadline and they found another developer overnight. When the partner is good, things just get done." },
  { clientName: "Tim Rosenberger", company: "SpecTec", position: "Director, Global R&D", quote: "Impressed by the skillset and the flexibility to ramp up quickly, scaling the team on short notice without losing quality." },
];

/* ------------------------------ Helpers -------------------------------- */

const rise = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

/**
 * Counts from 0 to its value the first time it scrolls into view.
 * Parses "16+" into 16 and "+" so STATS stays plain strings.
 */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  const target = parseInt(value, 10) || 0;
  const suffix = value.replace(/^\d+/, "");

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-display text-primary tabular-nums">
        {display}
        {suffix}
      </div>
      <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20">
      {children}
    </div>
  );
}

/* -------------------------------- Page --------------------------------- */

export default function AboutPage() {
  usePageMeta({ title: "About Us", description: "Founded 2013 in Karachi, serving 16+ countries. Custom software, mobile apps and ERP/CRM systems — the Time Global story." });

  // Approved CMS testimonials replace the bundled three when available.
  // Capped at six cards (two rows of three). The public API sorts by order
  // then newest-first, and a freshly added testimonial defaults to order 0 —
  // so a new entry from the admin panel enters the six and the oldest of the
  // ordered ones drops off. Bundled quotes only cover an empty CMS.
  const { data: cmsQuotes } = useTestimonials();
  const quotes: QuoteCard[] = (cmsQuotes.length > 0 ? cmsQuotes : FALLBACK_QUOTES).slice(0, 6);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative bg-secondary text-foreground overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Eyebrow>{"<About Us/>"}</Eyebrow>
              {/* Same type treatment as the Stories hero: 8xl tracking-tight,
                  accent line in italic primary. Content unchanged. */}
              <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight">
                Empowering Digital <br />
                <span className="text-primary italic">Transformation.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                Since 2013, Time Global has turned ambitious ideas into software that
                businesses around the world run on — from Karachi to everywhere.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Our Story ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...rise}>
              <Eyebrow>{"<Our Story/>"}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Built in Karachi.<br />
                <span className="text-primary">Trusted worldwide.</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Time Global started in 2013 as a small team of engineers in Karachi,
                  Pakistan with a simple conviction: businesses shouldn't have to bend
                  around their software.
                </p>
                <p>
                  A decade later, that conviction has carried our work into 16+
                  countries — custom platforms, mobile apps, and the ERP, CRM and HRM
                  systems that companies quietly depend on every day.
                </p>
                <p>
                  We've grown, but the way we work hasn't changed: small senior teams,
                  direct communication, and code we're proud to put our name on.
                </p>
              </div>
            </motion.div>

            <motion.div {...rise} className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                  alt="The Time Global team collaborating"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl bg-primary text-primary-foreground shadow-xl">
                <div className="text-3xl font-black font-display">2013</div>
                <div className="text-xs font-mono uppercase tracking-wider opacity-80">Founded</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Mission & Vision ─────────────────────────────────────────── */}
        <section className="bg-secondary/[0.03] dark:bg-white/[0.02] border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: Target, title: "Our Mission",
                body: "To empower businesses of every size with technology that removes friction — custom software, intelligent automation and systems that let people do their best work.",
              },
              {
                icon: Eye, title: "Our Vision",
                body: "A world where geography is no barrier to world-class engineering — where a company anywhere can transform how it operates with a partner it genuinely trusts.",
              },
            ].map((m, i) => (
              <motion.div
                key={m.title}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.12 }}
                className="p-8 sm:p-10 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-6">
                  <m.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{m.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What We Do ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <motion.div {...rise} className="text-center mb-14">
            <Eyebrow>{"<What We Do/>"}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              One partner, <span className="text-primary">whole stack.</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.08 }}
                className="group p-7 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:scale-110 transition-transform">
                  <s.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Our Values ───────────────────────────────────────────────── */}
        <section className="bg-secondary text-foreground border-y border-border/40 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 relative z-10">
            <motion.div {...rise} className="text-center mb-14">
              <Eyebrow>{"<Our Values/>"}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">What we won't compromise on</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-white/[0.04] border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary grid place-items-center mb-5">
                    <v.icon size={22} />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div {...rise}>
              <Eyebrow>{"<Why Choose Us/>"}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-[1.1]">
                Experience you can<br />
                <span className="text-primary">measure in shipped work.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Plenty of agencies can write code. Far fewer have spent a decade
                accountable for what happens after launch.
              </p>
            </motion.div>
            <div className="space-y-5">
              {WHY_US.map((w, i) => (
                <motion.div
                  key={w.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-colors"
                >
                  <CheckCircle2 size={22} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg mb-1.5">{w.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────── */}
        <section className="bg-secondary text-foreground border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...rise} transition={{ ...rise.transition, delay: i * 0.08 }}>
                <StatCounter value={s.value} label={s.label} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Life at Time Global (team voices, from the admin panel) ──── */}
        <TeamMarquee />

        {/* ── Social Responsibility ────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <motion.div {...rise} className="text-center mb-14">
            <Eyebrow>{"<Giving Back/>"}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Technology with a <span className="text-primary">conscience</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap, title: "Growing local talent",
                desc: "Internships, mentorship and training for young engineers in Pakistan — many of our best people started as our students.",
              },
              {
                icon: Sprout, title: "Backing entrepreneurs",
                desc: "Discounted engineering and honest technical guidance for early-stage founders building their first product.",
              },
              {
                icon: Leaf, title: "Sustainable by default",
                desc: "Remote-first operations, efficient cloud architecture and a bias against wasteful computation — greener software is better software.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-5">
                  <c.icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-3">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <section className="bg-secondary/[0.03] dark:bg-white/[0.02] border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
            <motion.div {...rise} className="text-center mb-14">
              <Eyebrow>{"<Client Voices/>"}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">In their words</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {quotes.map((t, i) => (
                <motion.div
                  key={t._id ?? t.clientName}
                  {...rise}
                  transition={{ ...rise.transition, delay: (i % 3) * 0.1 }}
                  className="flex flex-col p-8 rounded-2xl bg-card border border-border/50 shadow-sm relative"
                >
                  <Quote size={32} className="text-primary/20 absolute top-6 right-6" />

                  {/* Real rating from the admin panel */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <span
                        key={si}
                        className={si < (t.rating ?? 5) ? "text-amber-400" : "text-muted-foreground/30"}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-foreground/80 leading-relaxed italic font-light flex-1">
                    "{t.quote}"
                  </p>

                  <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-3">
                    {t.photo?.url ? (
                      <img
                        src={t.photo.url}
                        alt={t.clientName}
                        width="40"
                        height="40"
                        className="w-10 h-10 rounded-full object-cover border border-border/50 shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      /* Initials fallback — testimonials without an uploaded
                         photo shouldn't get a stranger's stock face. */
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold shrink-0">
                        {t.clientName.split(/\s+/).map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold truncate">{t.clientName}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                        {[t.position, t.company].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA — the same component every other page ends on ── */}
        <CollaborateCTA />
      </main>

      <Footer />
    </div>
  );
}
