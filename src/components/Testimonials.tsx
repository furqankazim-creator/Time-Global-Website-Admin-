import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import gsap from "gsap";
import { useTestimonials, type CmsTestimonial } from "@/lib/cms";

const TESTIMONIALS = [
  {
    name: "James Mitchell",
    title: "CTO, NovaCorp Health",
    tag: "<HealthTech/>",
    quote: "Time Global rebuilt our patient scheduling platform from the ground up. Appointment no-shows dropped by 40% and our staff saves 15 hours a week thanks to the intelligent automation they engineered.",
    color: "bg-emerald-100 text-emerald-700",
    location: "New York, USA",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Sarah Chen",
    title: "VP Engineering, TechBridge",
    tag: "<FinTech/>",
    quote: "Their team integrated open banking APIs into our product in half the time we expected. The code quality was exceptional and the documentation made our internal team self-sufficient from day one.",
    color: "bg-blue-100 text-blue-700",
    location: "London, UK",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Khalid Al-Rashidi",
    title: "CEO, AlphaStream Digital",
    tag: "<E-commerce/>",
    quote: "We scaled from 5,000 to 200,000 daily transactions without a single downtime incident. Their cloud architecture is bulletproof — and so is their communication throughout every phase.",
    color: "bg-amber-100 text-amber-700",
    location: "Dubai, UAE",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Emma Thompson",
    title: "Head of Product, DataSync",
    tag: "<EdTech/>",
    quote: "Time Global turned a complex LMS vision into a polished product in just 4 months. Learner engagement went up 55% and educators love how intuitive the interface feels.",
    color: "bg-purple-100 text-purple-700",
    location: "Toronto, Canada",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Liam O'Brien",
    title: "COO, CloudPeak Systems",
    tag: "<AgriTech/>",
    quote: "They built a real-time crop monitoring dashboard that farmers can actually use. Data from 3,000+ IoT sensors is now visualized beautifully — and it works offline in remote areas.",
    color: "bg-lime-100 text-lime-700",
    location: "Sydney, Australia",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Priya Sharma",
    title: "Innovation Director, NextWave",
    tag: "<GigEconomy/>",
    quote: "Our freelancer marketplace went live on schedule with zero post-launch bugs. The escrow and dispute resolution features they built cut payment conflicts by 65% in the first quarter.",
    color: "bg-cyan-100 text-cyan-700",
    location: "Singapore",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Marco Rossi",
    title: "Founder, DigitalForge",
    tag: "<EnergyTech/>",
    quote: "They delivered a smart grid management portal integrating 7 different hardware vendors. The custom firmware layer was a breakthrough our own engineers had struggled with for months.",
    color: "bg-orange-100 text-orange-700",
    location: "Milan, Italy",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Aisha Williams",
    title: "Program Director, SafeRoute Inc",
    tag: "<CivicTech/>",
    quote: "The incident reporting app they built handles 10,000+ submissions a month for our city partnership. Response time by local services improved by 30% in the first quarter alone.",
    color: "bg-rose-100 text-rose-700",
    location: "Houston, USA",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "David Park",
    title: "CEO, Studio Prime",
    tag: "<CreativeTech/>",
    quote: "Our creative teams now collaborate in real time across three time zones thanks to the platform Time Global engineered. Asset delivery time went from 3 days to same-day.",
    color: "bg-indigo-100 text-indigo-700",
    location: "Los Angeles, USA",
    avatar: "/assets/avatars/neutral.svg"
  },
  {
    name: "Dr. Lisa Mueller",
    title: "Lead AI Researcher, Nexus Labs",
    tag: "<AI/ML/>",
    quote: "They fine-tuned a domain-specific LLM for our clinical research pipeline. Accuracy improved to 91% and inference latency dropped by 60% — production-ready in just 6 weeks.",
    color: "bg-fuchsia-100 text-fuchsia-700",
    location: "Berlin, Germany",
    avatar: "/assets/avatars/neutral.svg"
  }
];

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-lg"
        >
          {i < rating ? "⭐" : "☆"}
        </motion.span>
      ))}
    </div>
  );
}

/** Bundled cards have no rating; CMS ones do, so it stays optional. */
type Card = (typeof TESTIMONIALS)[0] & { rating?: number };

/**
 * Map a CMS testimonial onto the card shape this component already renders.
 * The CMS has no `location`/`tag`/`color`, so those degrade gracefully rather
 * than forcing a schema change for purely decorative fields.
 */
function toCard(t: CmsTestimonial): Card {
  return {
    name: t.clientName,
    title: [t.position, t.company].filter(Boolean).join(", "),
    tag: t.company ? `<${t.company}/>` : "",
    quote: t.quote,
    rating: t.rating,
    color: "bg-emerald-100 text-emerald-700",
    location: "",
    avatar: t.photo?.url?.trim() || `/assets/avatars/${t.gender === "male" || t.gender === "female" ? t.gender : "neutral"}.svg`,
  };
}

function TestimonialCard({ test }: { test: Card }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      /**
       * Fixed height + flex column: quote lengths vary, and without this a
       * one-line quote sits beside a ten-line one and the rail looks broken.
       * The author block is pinned to the bottom by mt-auto so it aligns
       * across every card regardless of quote length.
       */
      className="inline-flex flex-col w-[450px] h-[400px] whitespace-normal group p-7 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/40 hover:border-primary/60 transition-all duration-500 relative shadow-lg hover:shadow-2xl hover:shadow-primary/20 align-top"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur"
        style={{ background: "radial-gradient(400px circle at 50% 50%, var(--primary) / 0.15, transparent 80%)" }}
      />

      <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors">
        <Quote size={48} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Star Rating */}
        <StarRating rating={test.rating ?? 5} />

        {/* The admin caps quotes at 40 words, and 7 lines is what 40 words
            occupies at this width — so the clamp only ever bites on legacy
            rows written before the cap, never on new ones. */}
        <p className="text-[17px] text-foreground leading-relaxed italic font-light mt-5 line-clamp-7">
          "{test.quote}"
        </p>

        {/* mt-auto pins everything below to the card's bottom edge, so authors
            line up across cards no matter how long the quote is. */}
        <div className="mt-auto pt-5 space-y-5">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {/* Author Info */}
          <div className="flex items-center gap-4">
          <motion.img
            src={test.avatar}
            alt={test.name}
            width="48"
            height="48"
            className="w-12 h-12 rounded-xl object-cover border border-primary/30 group-hover:border-primary/60 group-hover:scale-110 transition-all duration-500"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {test.name}
            </h4>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {test.title}
            </p>
              {test.location && (
                <p className="text-xs text-muted-foreground/60 mt-0.5">{test.location}</p>
              )}
            </div>
          </div>

          {/* Category Tag */}
          {test.tag && (
            <div>
              <span className="inline-block px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20">
                {test.tag}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  // Approved CMS testimonials replace the bundled ones; if the CMS is empty
  // or unreachable we keep shipping the originals rather than an empty rail.
  const { data: cms, isFallback } = useTestimonials();
  const items: Card[] = (!isFallback || cms.length > 0) ? cms.map(toCard) : TESTIMONIALS;

  useEffect(() => {
    const marquee = marqueeRef.current;
    const viewport = viewportRef.current;
    if (!marquee || !viewport || !items.length) return;

    let width = 0;
    let x = 0;
    let speed = 0;
    let targetSpeed = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let previousX = 0;
    const setX = gsap.quickSetter(marquee, "x", "px");
    const wrap = () => {
      if (width > 0) x = gsap.utils.wrap(-2 * width, -width, x);
      setX(x);
    };
    const measure = () => {
      const first = marquee.children[0] as HTMLElement;
      const nextCopy = marquee.children[items.length] as HTMLElement;
      const previousWidth = width;
      width = nextCopy.offsetLeft - first.offsetLeft;
      x = previousWidth ? x * width / previousWidth : -width;
      targetSpeed = -width / 80;
      wrap();
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    marquee.style.willChange = "transform";

    const tick = (_time: number, deltaMs: number) => {
      if (dragging) return;
      const dt = Math.min(deltaMs, 64) / 1000;
      speed += (targetSpeed - speed) * (1 - Math.exp(-10 * dt));
      x += speed * dt;
      wrap();
    };
    gsap.ticker.add(tick);

    const steer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = viewport.getBoundingClientRect();
      const position = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetSpeed = Math.abs(position) < 0.15 ? 0 : position * 240;
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      previousX = event.clientX;
      speed = 0;
      viewport.setPointerCapture(event.pointerId);
      viewport.style.cursor = "grabbing";
    };
    const move = (event: PointerEvent) => {
      if (dragging && event.pointerId === pointerId) {
        x += event.clientX - previousX;
        previousX = event.clientX;
        wrap();
      } else if (!dragging) steer(event);
    };
    const resume = () => { targetSpeed = -width / 80; };
    const release = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      viewport.style.cursor = "";
      resume();
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      x += event.key === "ArrowLeft" ? -482 : 482;
      wrap();
    };
    const preventImageDrag = (event: DragEvent) => event.preventDefault();
    viewport.addEventListener("pointerenter", steer);
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("pointerup", release);
    viewport.addEventListener("pointercancel", release);
    viewport.addEventListener("lostpointercapture", release);
    viewport.addEventListener("pointerleave", resume);
    viewport.addEventListener("keydown", keydown);
    viewport.addEventListener("dragstart", preventImageDrag);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      marquee.style.willChange = "auto";
      viewport.style.cursor = "";
      viewport.removeEventListener("pointerenter", steer);
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("pointerup", release);
      viewport.removeEventListener("pointercancel", release);
      viewport.removeEventListener("lostpointercapture", release);
      viewport.removeEventListener("pointerleave", resume);
      viewport.removeEventListener("keydown", keydown);
      viewport.removeEventListener("dragstart", preventImageDrag);
    };
  }, [items.length]);

  return (
    <section className="py-32 bg-secondary border-y border-border/50 overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20"
          >
            {'<Global Clients. Real Results/>'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-foreground"
          >
            Trusted by Teams Around the World
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Industry leaders across the globe rely on us to deliver research-backed software solutions that drive measurable growth.
          </motion.p>
        </div>
      </div>

      <div ref={viewportRef} role="region" aria-label="Client testimonials. Drag or use left and right arrow keys to move." tabIndex={0} className="relative cursor-grab select-none touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />

        <div
          ref={marqueeRef}
          className="flex gap-8 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {[...items, ...items, ...items].map((test, i) => (
            <TestimonialCard key={i} test={test} />
          ))}
        </div>
      </div>
    </section>
  );
}
