import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: "01",
    title: "Ideate",
    description: "Verify the product-market fit, capture new business opportunities, and make your bold visions take shape.",
    tags: ["Product Strategy", "Workshops", "Research"],
  },
  {
    id: "02",
    title: "Design",
    description: "Create designs that are not just seen but felt. Build an immersive experience that drives user loyalty.",
    tags: ["UX", "UI", "UX Audits"],
  },
  {
    id: "03",
    title: "Develop",
    description: "Redefine your business agility with software that scales to meet evolving customer needs and market dynamics.",
    tags: ["Mobile", "Web", "Team Extension"],
  },
  {
    id: "04",
    title: "Maintain",
    description: "Maximise the value of your investment by embracing a mindset of continuous improvement.",
    tags: ["Legacy App Modernization", "Cloud Services"],
  },
  {
    id: "05",
    title: "Scale",
    description: "Advance into the future with resilient scaling strategies. Handle increased load, embrace new markets.",
    tags: ["AI", "Digital Transformation"],
  },
];

const ArrowIcon = ({ className = "" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M5.7077 19L5 18.2923L16.2923 7H9V6H18V15H17V7.7077L5.7077 19Z"
      fill="currentColor"
    />
  </svg>
);

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Media query matching ensures animations scale perfectly on small screens
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // 1. Header Entrance Animations
      const chars = gsap.utils.toArray<Element>(".char-animate");
      if (chars.length > 0) {
        gsap.fromTo(
          chars,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        ".header-paragraph",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // 2. Row Interactions 
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;

        // Entry fade scroll trigger
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: Math.min(idx * 0.08, 0.4),
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              once: true,
            },
          }
        );

        const innerContainer = item.querySelector(".inner-row-wrapper");
        const bgHover = item.querySelector(".bg-hover-panel");
        const titleElement = item.querySelector(".service-title");
        const arrowCircle = item.querySelector(".arrow-circle");
        const tags = item.querySelectorAll(".service-tag");
        const description = item.querySelector(".service-desc");

        // Hover rules responsive execution
        mm.add({
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)"
        }, (context) => {
          const { isDesktop } = context.conditions ?? {};

          const onMouseEnter = () => {
            const isDark = document.documentElement.classList.contains("dark") || 
                           sectionRef.current?.classList.contains("dark");

            if (innerContainer && isDesktop) {
              gsap.to(innerContainer, {
                paddingTop: "5.5rem",
                paddingBottom: "5.5rem",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            if (bgHover) {
              gsap.to(bgHover, {
                opacity: 1,
                backgroundColor: isDark ? "rgba(23, 23, 23, 0.6)" : "#f5f5f5",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            gsap.to([titleElement, description, arrowCircle, ...tags], {
              y: isDesktop ? 6 : 0,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });

            if (titleElement) {
              gsap.to(titleElement, { 
                color: isDark ? "#ffffff" : "#0a0a0a",
                scale: isDesktop ? 1.02 : 1, 
                x: isDesktop ? 6 : 0,
                duration: 0.4, 
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            if (arrowCircle) {
              gsap.to(arrowCircle, { 
                scale: 1.1, 
                borderColor: isDark ? "#ffffff" : "#0a0a0a", 
                backgroundColor: isDark ? "#ffffff" : "#0a0a0a",
                color: isDark ? "#050505" : "#ffffff", 
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            tags.forEach((tag) => {
              gsap.to(tag, { 
                borderColor: isDark ? "#525252" : "#d4d4d4", 
                color: isDark ? "#ffffff" : "#0a0a0a", 
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                duration: 0.3,
                overwrite: "auto"
              });
            });
          };

          const onMouseLeave = () => {
            const isDark = document.documentElement.classList.contains("dark") || 
                           sectionRef.current?.classList.contains("dark");

            if (innerContainer && isDesktop) {
              gsap.to(innerContainer, {
                paddingTop: "3.5rem",
                paddingBottom: "3.5rem",
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            if (bgHover) {
              gsap.to(bgHover, {
                opacity: 0,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            gsap.to([titleElement, description, arrowCircle, ...tags], {
              y: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto"
            });

            if (titleElement) {
              gsap.to(titleElement, { 
                scale: 1,
                x: 0,
                color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(10, 10, 10, 0.9)",
                duration: 0.35, 
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            if (arrowCircle) {
              gsap.to(arrowCircle, { 
                scale: 1, 
                borderColor: isDark ? "#262626" : "#e5e5e5", 
                backgroundColor: "transparent",
                color: isDark ? "#737373" : "#a3a3a3", 
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            tags.forEach((tag) => {
              gsap.to(tag, { 
                borderColor: isDark ? "#171717" : "#f5f5f5", 
                color: isDark ? "#525252" : "#737373", 
                backgroundColor: "transparent",
                duration: 0.3,
                overwrite: "auto"
              });
            });
          };

          item.addEventListener("mouseenter", onMouseEnter);
          item.addEventListener("mouseleave", onMouseLeave);

          return () => {
            item.removeEventListener("mouseenter", onMouseEnter);
            item.removeEventListener("mouseleave", onMouseLeave);
          };
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      /* FIXED MARGINS: Replaced unsafe mt-[-120px] with responsive offset structure.
        - Negative margins are contextually handled across mobile vs desktop.
        - Clean inner padding balances navigation heights safely.
      */
      className="w-full min-h-screen -mt-16 md:-mt-24 lg:-mt-32 bg-muted dark:bg-background text-foreground dark:text-white pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 font-sans overflow-hidden transition-colors duration-500"
    >
      {/* Edge-to-Edge Top Border Line */}
      <div className="w-full border-t border-neutral-200 dark:border-neutral-900">
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 mx-auto max-w-[1720px] pt-12 sm:pt-16">
          <div ref={headerRef} className="mb-16 sm:mb-24 flex flex-col gap-4 sm:gap-6 max-w-4xl">
            <h2 className="text-4xl ml-14  sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter overflow-hidden flex flex-wrap text-neutral-900 dark:text-white">
              {"Our Services".split(" ").map((word, wIdx) => (
                <span key={wIdx} className="flex mr-[0.25em] overflow-hidden py-1">
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} className="char-animate inline-block will-change-transform opacity-0">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            
            <p className="header-paragraph ml-14 text-neutral-500 dark:text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed opacity-0 will-change-transform">
              Push boundaries with our tech. Turn your bold business ideas into outstanding digital products that redefine industries.
            </p>
          </div>
        </div>
      </div>

      {/* Services List Grid Container */}
      <div className="w-full flex flex-col border-b border-neutral-200 dark:border-neutral-900">
        {SERVICES.map((service, idx) => (
          <div
            key={service.id}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
            className="w-full border-t border-neutral-200 dark:border-neutral-900 group relative overflow-hidden"
          >
            <div className="bg-hover-panel absolute inset-0 opacity-0 pointer-events-none z-0" />

            {/* Inner Row Grid Layout */}
            <div className="inner-row-wrapper relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 mx-auto max-w-[1720px] py-10 sm:py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 lg:gap-12 items-start">
              
              {/* 1. ID & Main Title */}
              <div className="flex flex-col gap-1 sm:gap-2 md:col-span-4 lg:col-span-3 select-none">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground dark:text-neutral-600">
                  {service.id}
                </span>
                <h3 className="service-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white/90 will-change-transform origin-left transition-colors duration-300">
                  {service.title}
                </h3>
              </div>

              {/* 2. Middle Content Description */}
              <div className="md:col-span-5 lg:col-span-5 md:pt-5 lg:pt-6">
                <p className="service-desc text-xs sm:text-sm md:text-base leading-relaxed text-neutral-500 dark:text-muted-foreground will-change-transform group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300">
                  {service.description}
                </p>
              </div>

              {/* 3. Outer Tag Pill Badges and Arrow Circle */}
              <div className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-4 md:col-span-3 lg:col-span-4 md:pt-4 lg:pt-5 w-full">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-start md:justify-end max-w-[75%] md:max-w-none">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="service-tag text-[10px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-neutral-200 dark:border-neutral-900 text-muted-foreground dark:text-neutral-600 bg-transparent cursor-default whitespace-nowrap will-change-transform"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="arrow-circle flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-neutral-200 dark:border-neutral-900 text-neutral-300 dark:text-neutral-600 shrink-0 select-none nominated-transition will-change-transform">
                  <ArrowIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}