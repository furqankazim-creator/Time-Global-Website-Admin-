import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactModal } from "@/hooks/use-contact-modal";
import { useHome, type CmsHome } from "@/lib/cms";
import { Shape3D } from "./Shape3D";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * three.js + three-globe is ~600 KB — the largest thing on the site, used by
 * one component on one page. Lazy so it never blocks first paint.
 */
const Globe = lazy(() => import("./Globe"));

gsap.registerPlugin(ScrollTrigger);

/**
 * The copy that ships in the bundle. Rendered until (or unless) the CMS
 * returns something, so the site never goes blank if the API is unreachable.
 */
const FALLBACK: CmsHome = {
  hero: {
    // Newlines are meaningful: each becomes its own line in the hero, and the
    // last line takes the accent colour. This is what preserves the stacked
    // layout the design relies on instead of letting text wrap arbitrarily.
    headline: "AI-Powered Solutions.\nBuilt for\nGrowth.",
    subheadline:
      "We help businesses save time, automate workflows, and launch digital solutions faster with AI-powered software and modern technology.",
    ctaText: "let's talk",
    ctaUrl: "",
    backgroundMedia: null,
  },
  featuredServices: [],
  featuredProjects: [],
  featuredTestimonials: [],
  stats: [],
};

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { openModal } = useContactModal();
  const { data: home } = useHome(FALLBACK);

  const hero = home.hero?.headline ? home.hero : FALLBACK.hero;

  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll(".hero-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, headingRef);

    return () => ctx.revert();
    // Must re-run when the headline changes. wrapWords() renders each word
    // with visibility:hidden and relies on GSAP to reveal it — if CMS copy
    // arrives after this ran once, the new words would stay invisible.
  }, [hero.headline]);

  /**
   * Split the headline so the final word keeps the accent colour the design
   * relies on ("…Built for Growth."). Works for any CMS-supplied string.
   */
  /**
   * Each newline in the headline is a rendered line, and the final line takes
   * the accent colour — so editing the words never changes the layout.
   *
   * If the CMS text has no newlines we fall back to accenting the last word,
   * which keeps a single-line headline looking deliberate rather than flat.
   */
  const headLines = (() => {
    const raw = (hero.headline || FALLBACK.hero.headline).trim();
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

    if (lines.length > 1) return lines;

    const words = raw.split(/\s+/);
    if (words.length < 2) return [raw];
    return [words.slice(0, -1).join(" "), words[words.length - 1]];
  })();

  const wrapWords = (text: string, colorClass = "") => {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        className={`hero-word inline-block mr-3 ${colorClass}`}
        style={{ visibility: "hidden" }}
      >
        {word}
      </span>
    ));
  };

  return (
    <section className="pb-12 md:pb-24 min-h-[calc(100vh-108px)] flex flex-col relative overflow-hidden px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 mb-12 md:mb-20 pt-8 md:pt-16">
        <div className="text-center lg:text-left order-last lg:order-first">
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 md:mb-8"
          >
            {/* One div per line preserves the stacked pattern; only the words
                change when the headline is edited in the admin panel. */}
            {headLines.map((line, i) => {
              const isLast = i === headLines.length - 1;
              return (
                <div
                  key={`${i}-${line}`}
                  className={`overflow-hidden mb-1 md:mb-2 ${isLast ? "text-primary" : ""}`}
                >
                  {wrapWords(line, isLast ? "text-primary" : "")}
                </div>
              );
            })}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            {hero.subheadline || FALLBACK.hero.subheadline}
          </p>
          <div className="flex justify-center lg:justify-start gap-4 mb-12 md:mb-16 flex-wrap items-center">
            {/* Primary CTA */}
            <CtaButton
              size="lg"
              href={hero.ctaUrl || undefined}
              onClick={hero.ctaUrl ? undefined : openModal}
              data-testid="button-hero-cta"
              arrow
            >
              {hero.ctaText || FALLBACK.hero.ctaText}
            </CtaButton>

            {/* Secondary Glass CTA */}
            <CtaButton
              size="lg"
              variant="glass"
              href="/work"
              data-testid="button-hero-work"
            >
              Explore Case Studies
            </CtaButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
            <Link href="/services" className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden hover:-translate-y-1 duration-200 text-left block">
              <div className="font-mono text-[10px] md:text-xs font-semibold text-primary mb-2 md:mb-3">
                {"<industry/>"}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1">Web & Software</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Scalable applications for growing businesses.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-30 group-hover:opacity-80 transition-all group-hover:scale-110">
                <Shape3D type="cube" className="w-16 md:w-20 h-16 md:h-20" />
              </div>
            </Link>
            <Link href="/services" className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden hover:-translate-y-1 duration-200 text-left block">
              <div className="font-mono text-[10px] md:text-xs font-semibold text-primary mb-2 md:mb-3">
                {"<industry/>"}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1">AI & Automation</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Smart automation and reliable infrastructure.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-30 group-hover:opacity-80 transition-all group-hover:scale-110">
                <Shape3D type="half-round" className="w-16 md:w-20 h-16 md:h-20" />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center relative h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px] xl:h-[600px] order-first lg:order-last w-full mx-auto lg:mx-0 overflow-hidden lg:overflow-visible -mt-14 sm:-mt-16 lg:-mt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[80px] animate-pulse" />
          {/* Single instance: the globe auto-fits whatever box it's given. */}
          <div className="relative w-full h-full z-10">
            {/* Placeholder keeps the layout stable while the chunk arrives */}
            <Suspense
              fallback={
                <div className="w-full h-full grid place-items-center">
                  <div className="w-2/3 aspect-square rounded-full border border-primary/20 bg-primary/5 animate-pulse" />
                </div>
              }
            >
              <Globe />
            </Suspense>
          </div>
        </div>
      </div>

    </section>
  );
}
