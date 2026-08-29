import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export function HeroAnimatedIcons() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Basic entrance animation
      gsap.from(".hai-card", {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
      });

      // --- UI/UX Animation ---
      gsap.to(".hai-uiux-screen", {
        x: (i) => (i === 0 ? -4 : 4),
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });

      // --- Marketing Animation ---
      gsap.fromTo(
        ".hai-marketing-path",
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 2.5,
          repeat: -1,
          ease: "power2.inOut",
        }
      );

      // --- SEO Animation ---
      gsap.to(".hai-seo-resultsline", {
        opacity: 0.2,
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
        duration: 0.8,
        ease: "sine.inOut",
      });

      // --- AI Automation Animation ---
      gsap.to(".hai-automation-gear", {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 6,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".hai-automation-node", {
        scale: 1.3,
        transformOrigin: "50% 50%",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "sine.inOut",
      });

      // --- Time Saving Animation ---
      gsap.to(".hai-time-bolt", {
        opacity: 0.4,
        scale: 1.1,
        transformOrigin: "50% 50%",
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hai-clock-hand", {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 4,
        repeat: -1,
        ease: "none",
      });

      // --- Globe Animation ---
      gsap.to(".hai-globe-rotate", {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      // --- AI Chip Animation ---
      gsap.to(".hai-ai-core", {
        scale: 1.2,
        transformOrigin: "50% 50%",
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // --- Code Animation ---
      gsap.to(".hai-code-cursor", {
        opacity: 0,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      // --- Graphic Design Animation ---
      gsap.to(".hai-design-handle", {
        y: (i) => (i === 0 ? -3 : 3),
        x: (i) => (i === 0 ? 2 : -2),
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        stagger: 0.2,
        ease: "sine.inOut",
      });

      // --- DevOps Animation ---
      gsap.fromTo(
        ".hai-devops-flow",
        { strokeDashoffset: 40 },
        {
          strokeDashoffset: 0,
          duration: 3,
          repeat: -1,
          ease: "none",
        }
      );
      gsap.to(".hai-devops-server", {
        opacity: 0.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        duration: 1,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 hidden md:block pointer-events-none"
      aria-hidden="true"
    >
      {/* FIXED: Added "pointer-events-auto z-10 hover:z-50" classes to the motion outer shell wrappers 
        so stacked elements no longer block mouse capture lines.
      */}

      {/* ================= TOP ROW ================= */}
      <motion.div
        className="hai-card absolute left-[35%] top-[80%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconShell 
          label="AI" 
          size={110} 
          colorClass="text-cyan-400 border-cyan-500/10"
          popupTitle="Next-Gen Models"
          popupDescription="Custom neural LLMs tailored completely to specific business paradigms."
        >
          <AIChipSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute right-[32%] top-[50%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <IconShell 
          label="AI Automation" 
          size={140} 
          colorClass="text-purple-400 border-purple-500/10"
          popupTitle="Autonomous Workflows"
          popupDescription="Eliminate tedious operational patterns using automated agent loops."
        >
          <AIAutomationSVG />
        </IconShell>
      </motion.div>

      {/* ================= LEFT SIDE LAYOUT ================= */}
      <motion.div
        className="hai-card absolute left-[6%] top-[18%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <IconShell 
          label="UI/UX" 
          size={130} 
          colorClass="text-pink-400 border-pink-500/10"
          popupTitle="High-Fidelity Product Design"
          popupDescription="Immersive interfaces crafted for optimal conversion matrices and seamless human interaction."
        >
          <UiUxSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute left-[65%] top-[16%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      >
        <IconShell 
          label="Graphic Design" 
          colorClass="text-amber-400 border-amber-500/10"
          popupTitle="Brand Systematics"
          popupDescription="Crisp visual architecture, typography patterns, and asset kits that capture attention."
        >
          <GraphicDesignSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute left-[10%] top-[48%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <IconShell 
          label="Development" 
          colorClass="text-emerald-400 border-emerald-500/10"
          popupTitle="Full-Stack Engineering"
          popupDescription="Ultra-fast web platforms developed using scalable TypeScript frameworks."
        >
          <CodeSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute left-[4%] top-[76%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <IconShell 
          label="Marketing" 
          colorClass="text-red-400 border-red-500/10"
          popupTitle="Performance Marketing"
          popupDescription="Data-driven programmatic acquisition models maximizing direct returns on spending."
        >
          <MarketingSVG />
        </IconShell>
      </motion.div>

      {/* ================= RIGHT SIDE LAYOUT ================= */}
      <motion.div
        className="hai-card absolute right-[8%] top-[16%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <IconShell 
          label="Time Saving" 
          size={125} 
          colorClass="text-sky-400 border-sky-500/10"
          popupTitle="Accelerated Delivery"
          popupDescription="Optimize go-to-market pipelines by dropping legacy bottlenecks."
        >
          <TimeSavingSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute right-[44%] top-[72%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, 14, 0], x: [0, -4, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <IconShell 
          label="DevOps" 
          colorClass="text-indigo-400 border-indigo-500/10"
          popupTitle="Infrastructure Automation"
          popupDescription="Deterministic zero-downtime microservice clusters deployed securely."
        >
          <DevOpsSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute right-[14%] top-[42%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <IconShell 
          label="Global" 
          size={130} 
          colorClass="text-blue-400 border-blue-400/10"
          popupTitle="Edge Content Distribution"
          popupDescription="Deploy regional latency optimizations keeping platforms instant anywhere globally."
        >
          <GlobeSVG />
        </IconShell>
      </motion.div>

      <motion.div
        className="hai-card absolute right-[8%] top-[80%] pointer-events-auto z-10 hover:z-50"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <IconShell 
          label="SEO" 
          colorClass="text-teal-400 border-teal-500/10"
          popupTitle="Organic Discoverability"
          popupDescription="Technical search positioning engine targeted at high-intent commercial keywords."
        >
          <SeoSVG />
        </IconShell>
      </motion.div>
    </div>
  );
}

// --- Container Shell Component ---
interface IconShellProps {
  children: React.ReactNode;
  label: string;
  size?: number;
  colorClass?: string;
  popupTitle: string;
  popupDescription: string;
}

function IconShell({
  children,
  label,
  size = 120,
  colorClass = "text-purple-400 border-purple-500/10",
  popupTitle,
  popupDescription,
}: IconShellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPopupPosition(rect.top > window.innerHeight / 2 ? "top" : "bottom");
    }
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl border bg-neutral-950/40 backdrop-blur-md shadow-2xl cursor-help transition-all duration-300 ${
        isHovered ? "scale-105 border-current/40" : "scale-100"
      } ${colorClass}`}
      style={{
        width: size,
        height: size,
        boxShadow: isHovered
          ? "0 25px 60px -10px color-mix(in oklab, currentColor 50%, transparent), inset 0 0 20px 4px color-mix(in oklab, currentColor 20%, transparent)"
          : "0 15px 50px -15px color-mix(in oklab, currentColor 35%, transparent), inset 0 0 15px 2px color-mix(in oklab, currentColor 10%, transparent)",
      }}
    >
      {/* SVG Content wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-5">
        {children}
      </div>

      {/* Under-card label text */}
      <span className="absolute -bottom-7 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground whitespace-nowrap transition-colors duration-300">
        {label}
      </span>

      {/* AnimatePresence for clean mount/unmount animations */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: popupPosition === "bottom" ? 15 : -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: popupPosition === "bottom" ? 8 : -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={`absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950/98 p-4 text-left shadow-2xl backdrop-blur-xl ${
              popupPosition === "bottom"
                ? "top-[calc(100%+12px)]"
                : "bottom-[calc(100%+12px)]"
            }`}
            style={{
              boxShadow: "0 20px 50px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
              zIndex: 9999,
            }}
          >
            {/* Context accent bar top indicator */}
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />

            {/* Popup content formatting */}
            <h4 className="font-sans text-xs font-semibold tracking-wide text-neutral-100 mb-2">
              {popupTitle}
            </h4>
            <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
              {popupDescription}
            </p>

            {/* Pointer arrow indicator */}
            <div
              className={`absolute h-3 w-3 rotate-45 border border-neutral-800 bg-neutral-950 ${
                popupPosition === "bottom"
                  ? "-top-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0"
                  : "-bottom-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SVG Components ---

function TimeSavingSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <circle cx="50" cy="54" r="36" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
      <path d="M 50 18 A 36 36 0 0 1 86 54" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
      <rect x="44" y="10" width="12" height="5" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      <path d="M 72 20 L 76 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line className="hai-clock-hand" x1="50" y1="54" x2="50" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path 
        className="hai-time-bolt" 
        d="M 54 36 L 40 52 L 48 52 L 44 68 L 58 48 L 50 48 Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

function GraphicDesignSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <path d="M 20 75 C 20 30, 80 30, 80 75" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" strokeOpacity="0.5"/>
      <path d="M 20 75 C 20 30, 80 30, 80 75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <g transform="translate(50,33) rotate(-45)">
        <path d="M 0 0 L -8 -15 L -4 -22 L 4 -22 L 8 -15 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="0" cy="-10" r="1.5" fill="currentColor"/>
      </g>
      <line x1="20" y1="45" x2="80" y2="45" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3"/>
      <circle className="hai-design-handle" cx="20" cy="45" r="4" fill="currentColor"/>
      <circle className="hai-design-handle" cx="80" cy="45" r="4" fill="currentColor"/>
      <rect x="17" y="72" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="77" y="72" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function DevOpsSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <path d="M 30 50 C 30 65, 45 65, 50 50 C 55 35, 70 35, 70 50 C 70 65, 55 65, 50 50 C 45 35, 30 35, 30 50 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
      <path className="hai-devops-flow" d="M 30 50 C 30 65, 45 65, 50 50 C 55 35, 70 35, 70 50 C 70 65, 55 65, 50 50 C 45 35, 30 35, 30 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="12 40"/>
      <g transform="translate(18, 15)">
        <rect x="0" y="0" width="22" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <circle className="hai-devops-server" cx="4" cy="3.5" r="1" fill="currentColor"/>
      </g>
      <g transform="translate(60, 68)">
        <rect x="0" y="0" width="22" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <circle className="hai-devops-server" cx="18" cy="3.5" r="1" fill="currentColor"/>
      </g>
      <path d="M 40 25 Q 50 15, 60 25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
    </svg>
  );
}

function AIChipSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <rect x="22" y="22" width="56" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect className="hai-ai-core" x="36" y="36" width="28" height="28" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <text x="50" y="55" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="monospace">AI</text>
    </svg>
  );
}

function AIAutomationSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <g className="hai-automation-gear" transform="translate(30, 35)">
        <path d="M 10 0 L 8 4 Q 5 5, 4 8 L 0 10 L 4 12 Q 5 15, 8 16 L 10 20 L 12 16 Q 15 15, 16 12 L 20 10 L 16 8 Q 15 5, 12 4 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
      </g>
      <g className="hai-automation-gear" transform="translate(55, 60) rotate(15)">
        <path d="M 15 0 L 12 6 Q 7 7, 6 12 L 0 15 L 6 18 Q 7 23, 12 24 L 15 30 L 18 24 Q 23 23, 24 18 L 30 15 L 24 12 Q 23 7, 18 6 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="15" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
      </g>
      {[ [75, 25], [85, 40], [70, 55], [60, 45] ].map(([cx, cy], i) => (
        <circle key={i} className="hai-automation-node" cx={cx} cy={cy} r="2.5" fill="currentColor"/>
      ))}
      <polyline points="75,25 85,40 70,55 60,45 75,25" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
      <line x1="40" y1="45" x2="60" y2="45" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3"/>
    </svg>
  );
}

function UiUxSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <g className="hai-uiux-screen">
        <rect x="15" y="15" width="45" height="70" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
        <line x1="22" y1="25" x2="35" y2="25" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="22" y="32" width="31" height="8" rx="2" fill="currentColor" fillOpacity="0.1"/>
        <rect x="22" y="45" width="31" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/>
      </g>
      <g className="hai-uiux-screen" transform="translate(15, 0)">
        <rect x="25" y="15" width="45" height="70" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="32" y1="25" x2="45" y2="25" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="48" cy="45" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M 48 55 L 48 70 M 38 60 L 58 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function MarketingSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <polyline points="15,85 15,15 85,15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path className="hai-marketing-path" d="M 15 75 Q 35 65, 45 45 T 85 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="100 100"/>
      <circle cx="85" cy="20" r="4" fill="currentColor"/>
      <g transform="translate(40, 50) scale(0.6)">
        <path d="M 10 30 L 10 10 L 30 10 M 10 10 L 30 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M 50 10 L 50 30 L 30 30 M 50 30 L 30 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function SeoSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <rect x="15" y="15" width="70" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
      <rect x="22" y="22" width="20" height="6" rx="2" fill="currentColor" fillOpacity="0.1"/>
      {[35, 48, 61, 74].map((y, i) => (
        <rect
          key={i}
          className="hai-seo-resultsline"
          x="22"
          y={y}
          width={i === 0 ? "56" : "45"}
          height="4"
          rx="2"
          fill="currentColor"
          fillOpacity="0.6"
        />
      ))}
      <g transform="translate(60, 60) scale(0.8)">
        <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="24" y1="24" x2="32" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function GlobeSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <defs>
        <radialGradient id="globeGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#globeGrad)" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <g className="hai-globe-rotate" fill="none" stroke="currentColor" strokeWidth="1">
        <ellipse cx="50" cy="50" rx="40" ry="14" strokeOpacity="0.4" />
        <ellipse cx="50" cy="50" rx="14" ry="40" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

function CodeSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-current">
      <rect x="8" y="14" width="84" height="72" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <polyline points="22,42 14,52 22,62" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="78,42 86,52 78,62" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="42" y1="38" x2="58" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect className="hai-code-cursor" x="32" y="72" width="6" height="2" fill="currentColor" />
    </svg>
  );
}