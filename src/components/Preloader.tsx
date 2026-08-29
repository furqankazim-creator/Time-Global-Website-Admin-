// Preloader.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ModernHero from "./ModernHero";

export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide the preloader layout screen out of view smoothly
          gsap.to(root.current, {
            yPercent: -100,
            duration: 2.1,
            ease: "expo.inOut",
            onComplete: () => {
              setDone(true);
              document.documentElement.style.overflow = "";
              document.body.style.overflow = "";
            },
          });
        },
      });

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

     

      // ── Synchronized status labels for the 6s duration ──
      const labels = ["INITIALIZING", "LOADING ASSETS", "COMPILING SHADERS", "ALMOST READY"];
      labels.forEach((t, i) => {
        tl.call(() => {
          if (labelRef.current) labelRef.current.textContent = t;
        }, [], i * 1.2); // 1.5s intervals (4 items * 1.5s = exactly 6.0s total)
      });
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <>
      <div
        ref={root}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      >
        {/* ModernHero runs immediately in the background layer */}
        <ModernHero />
        
     
      </div>
    </>
  );
}