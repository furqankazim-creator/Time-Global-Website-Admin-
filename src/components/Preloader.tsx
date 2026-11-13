import { useEffect, useState } from "react";

const INTRO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4";

/** A startup intro; its timeline completes even if the video cannot load. */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 300 : 4000;
    const exitDuration = reducedMotion ? 0 : 550;
    const startedAt = performance.now();
    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const fraction = Math.min((now - startedAt) / duration, 1);
      setProgress(Math.floor(fraction * 100));
      if (fraction < 1) frame = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        exitTimer = setTimeout(onComplete, exitDuration);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  const status = progress < 20 ? "INITIALIZING" : progress < 65 ? "LOADING EXPERIENCE" : progress < 100 ? "ALMOST READY" : "WELCOME TO TIME GLOBAL";

  return (
    <div
      className={`fixed inset-0 z-[10000] overflow-hidden bg-[#e9eaee] text-white transition-[transform,opacity] duration-500 ease-in-out motion-reduce:transition-none ${leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      aria-label="Welcome to Time Global"
    >
      {!videoFailed && (
        <video
          autoPlay muted playsInline preload="auto" aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          src={INTRO_VIDEO}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/50" />
      <div className={`absolute inset-0 place-items-center ${videoFailed || !videoReady ? "grid" : "hidden motion-reduce:grid"}`}><strong className="font-display text-4xl tracking-tight text-zinc-900 sm:text-7xl">TIME GLOBAL<span className="text-emerald-600">.</span></strong></div>
      <div className="absolute inset-x-0 top-[8%] flex justify-center px-5 sm:top-[10%]">
        <div className="w-full max-w-[320px] rounded-xl border border-emerald-500/30 bg-zinc-950 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          <div className="mb-3 flex items-end justify-between gap-3">
            <span className="font-mono text-[9px] tracking-[0.16em] text-zinc-400" role="status">{status}</span>
            <span aria-hidden="true" className="font-display text-4xl font-black leading-none tabular-nums tracking-tight text-emerald-400">{String(progress).padStart(3, "0")}%</span>
          </div>
          <div className="h-0.5 overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
            <div className="h-full bg-emerald-400 shadow-[0_0_12px_#34d399]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-7 flex items-center justify-between gap-4 px-6 sm:px-10">
        <span className="font-display text-xs font-bold tracking-[0.2em]">TIME GLOBAL</span>
        <button type="button" onClick={onComplete} className="rounded-full border border-white/30 bg-zinc-950/60 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400">Skip intro <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}
