// ModernHero.tsx — Maximum Video Clarity Version
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function ModernHero() {
  const [searchValue, setSearchValue] = useState("");
  const [language, setLanguage] = useState<"en" | "pl">("en");
  
  // Controls only the preloader counter UI visibility
  const [preloaderDone, setPreloaderDone] = useState(false);
  
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      
      const tl = gsap.timeline({
        onComplete: () => {
          // Smoothly fade out the HUD counter panel when finished
          gsap.to(rootRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              setPreloaderDone(true);
              document.documentElement.style.overflow = "";
              document.body.style.overflow = "";
            },
          });
        },
      });

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      // ── Cinematic 6-Second Count ──
      tl.to(obj, {
        val: 100,
        duration: 4.0,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.floor(obj.val);
          if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
          if (barRef.current) barRef.current.style.width = `${v}%`;
        },
      });

      const labels = ["INITIALIZING", "LOADING ASSETS", "COMPILING SHADERS", "ALMOST READY"];
      labels.forEach((t, i) => {
        tl.call(() => {
          if (labelRef.current) labelRef.current.textContent = t;
        }, [], i * 1.5);
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    // Forced dark backdrop setting context to keep video colors rich regardless of light theme
    <section className="dark relative min-h-[100vh] w-full flex flex-col  items-center justify-start overflow-hidden bg-surface-dark text-zinc-50 pt-24 md:pt-32">

      {/* ── Video Container (100% Unblurred & Crystal Clear) ── */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          // Full opacity (100%) with absolutely no blur or filters applied
          className="w-full h-full object-cover opacity-100"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
          onError={(e) => {
            (e.currentTarget as HTMLVideoElement).style.display = "none";
          }}
        />

        {/* Minimal edge fades to keep standard text readable on top */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-zinc-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950/60 to-transparent" />
      </div>

      {/* ── Preloader HUD Counter (Bottom Right) ── */}
      {!preloaderDone && (
        <div
          ref={rootRef}
    className="fixed top-25 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
        >
          {/* Solid panel backdrop so the text remains completely legible against the clear video */}
          <div className="relative w-[280px] sm:w-[320px] px-4 py-3 bg-zinc-950 border border-emerald-500/30 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-end justify-between mb-2">
              <div
                ref={labelRef}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                INITIALIZING
              </div>
              <div className="font-display text-3xl md:text-4xl font-black leading-none tracking-tight select-none">
                <span ref={countRef} className="text-emerald-400">000</span>
                <span className="text-emerald-400">%</span>
              </div>
            </div>
            <div className="h-[2px] w-full bg-zinc-800 overflow-hidden rounded-full">
              <div
                ref={barRef}
                className="h-full w-0 bg-emerald-500 shadow-[0_0_12px_hsl(163_100%_38%/0.8)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-0.5 h-6 rounded-full" />
        </motion.div>
      </motion.div>

    </section>
  );
}