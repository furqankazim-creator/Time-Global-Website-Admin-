import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shape3D } from "./Shape3D";
import { TECH_ICONS, COUNTRIES } from "./TechStack";
import { Cpu, Globe, Layout, ArrowRight, TrendingUp, ShieldCheck, Users } from "lucide-react";
import { SiAnthropic, SiGoogle } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const AI_NEWS = [
  {
    text: "Anthropic: in US valuation nears $1tn",
    url: "https://www.investopedia.com/anthropic-s-valuation-jumped-to-nearly-usd1-trillion-here-s-what-that-means-for-the-ipo-market-11986653",
    icon: SiAnthropic,
    color: "text-[#D97757]",
  },
  {
    text: "Microsoft: unveiled seven in-house AI models claims to beat Claude & Google's Nano Banana",
    url: "https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html",
    icon: FaMicrosoft,
    color: "text-[#00A4EF]",
  },
  {
    text: "Anthropic: Announcements Expanding Project Glasswing",
    url: "https://www.anthropic.com/news/expanding-project-glasswing",
    icon: SiAnthropic,
    color: "text-[#D97757]",
  },
  {
    text: "Google: Introducing Gemma 4 12B a unified, encoder-free multimodal model",
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12b/",
    icon: SiGoogle,
    color: "text-[#4285F4]",
  },
];

const MARQUEE_STYLES = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes marquee-reverse {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .marquee-track {
    display: flex; white-space: nowrap; will-change: transform;
    animation: marquee var(--mspd) linear infinite;
  }
  .marquee-track-reverse {
    display: flex; white-space: nowrap; will-change: transform;
    animation: marquee-reverse var(--mspd) linear infinite;
  }
  .marquee-track:hover, .marquee-track-reverse:hover { animation-play-state: paused; }
  @media (max-width: 768px) {
    .marquee-track, .marquee-track-reverse { animation-duration: calc(var(--mspd) * 0.6); }
  }
`;

function AINewsTicker() {
  return (
    <div className="relative flex overflow-hidden py-3 sm:py-5 border-y border-border/40 bg-secondary/40 w-full">
      <div className="marquee-track gap-8 sm:gap-16" style={{ "--mspd": "80s" } as React.CSSProperties}>
        {[...AI_NEWS, ...AI_NEWS].map((news, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4">
            <span className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-1.5 w-1.5 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 bg-primary" />
              </span>
              <span className="text-primary text-[8px] sm:text-[10px] uppercase font-bold tracking-widest">Live</span>
            </span>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm hover:text-primary flex items-center gap-2 sm:gap-3 transition-all duration-300 group font-mono font-bold text-muted-foreground uppercase tracking-[0.08em] sm:tracking-[0.1em]"
            >
              <news.icon className={`${news.color} text-base sm:text-xl group-hover:scale-110 transition-transform shrink-0`} />
              <span className="underline decoration-primary/20 underline-offset-2 sm:underline-offset-4 group-hover:decoration-primary/50 line-clamp-1">
                {news.text}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlagImage({ flagCode, name, className = "", size = "md" }: {
  flagCode: string; name: string; className?: string; size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const sizeMap = {
    sm: { width: 22, height: 16, textSize: "text-base" },
    md: { width: 32, height: 24, textSize: "text-2xl" },
    lg: { width: 40, height: 30, textSize: "text-3xl" },
  };
  const { width, height, textSize } = sizeMap[size];
  const fallback: Record<string, string> = {
    us:"🇺🇸",gb:"🇬🇧",jp:"🇯🇵",de:"🇩🇪",ca:"🇨🇦",au:"🇦🇺",ae:"🇦🇪",sa:"🇸🇦",
    sg:"🇸🇬",fr:"🇫🇷",nl:"🇳🇱",hk:"🇭🇰",kr:"🇰🇷",br:"🇧🇷",my:"🇲🇾",qa:"🇶🇦",
  };
  if (imgError)
    return <span className={`${textSize} leading-none select-none ${className}`} title={name}>{fallback[flagCode.toLowerCase()] || "🏳️"}</span>;
  return (
    <img
      src={`https://flagcdn.com/w${width * 2}/${flagCode.toLowerCase()}.png`}
      alt={name} width={width} height={height}
      className={`rounded-sm object-cover shrink-0 ${className}`}
      loading="lazy" onError={() => setImgError(true)}
    />
  );
}

function Ticker({ items, speed = 45, reverse = false }: { items: any[]; speed?: number; reverse?: boolean }) {
  return (
    <div className="relative flex overflow-hidden py-3 sm:py-5 border-y border-border/40 bg-secondary/40 w-full">
      <div
        className={reverse ? "marquee-track-reverse gap-8 sm:gap-14" : "marquee-track gap-8 sm:gap-14"}
        style={{ "--mspd": `${speed}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
            {item.icon ? (
              <item.icon size={18} style={{ color: item.color }} className="opacity-80 shrink-0" />
            ) : (
              <FlagImage flagCode={item.flag} name={item.name} size="sm" />
            )}
            <span className="text-xs sm:text-sm font-mono text-muted-foreground uppercase tracking-[0.12em] sm:tracking-[0.18em] font-bold truncate max-w-[120px] sm:max-w-none">
              {item.label || item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Orchestration Dashboard Mockup ────────────────────────────────────
function WorkflowMockup() {
  const agents = [
    { name: "Claude Opus",  role: "Analyst & Writer",  dotCls: "bg-[#D97757]", colHex: "#D97757", tasks: "1,240", badge: "Writing",  pct: 78 },
    { name: "Gemini Pro",   role: "Code Generation",   dotCls: "bg-[#4285F4]", colHex: "#4285F4", tasks: "892",   badge: "Coding",   pct: 56 },
    { name: "GPT-4o",       role: "Data Extraction",   dotCls: "bg-[#10A37F]", colHex: "#10A37F", tasks: "708",   badge: "Parsing",  pct: 44 },
  ];

  const logs = [
    { icon: "✉", col: "text-blue-400",    text: "Customer email classified → Support queue",    time: "09:41:22" },
    { icon: "◈", col: "text-emerald-400", text: "Invoice #4821 extracted & validated",          time: "09:41:19" },
    { icon: "▷", col: "text-violet-400",  text: "CRM record updated — Acme Corp",               time: "09:41:15" },
    { icon: "◎", col: "text-yellow-400",  text: "Slack alert sent → #sales channel",            time: "09:41:12" },
    { icon: "⊡", col: "text-cyan-400",    text: "PDF report generated in 0.8s",                 time: "09:41:08" },
    { icon: "✓", col: "text-emerald-400", text: "Workflow complete — 3 steps, 1.2s",            time: "09:41:04" },
    { icon: "→", col: "text-orange-400",  text: "Support ticket routed to Sales team",          time: "09:40:58" },
  ];

  const kpis = [
    { val: "2,840", label: "Tasks / hr",  sub: "↑ 18% vs last wk", pos: true  },
    { val: "94.2%", label: "Accuracy",    sub: "↑ 3.1%",            pos: true  },
    { val: "73h",   label: "Saved / wk",  sub: "across 5 teams",    pos: false },
    { val: "$12K",  label: "Cost saved",  sub: "per month",          pos: false },
  ];

  const integrations = ["Slack", "HubSpot", "Gmail", "Notion", "Postgres", "Stripe"];

  const pipelineSteps = [
    { label: "Receive Input", col: "text-blue-400"   },
    { label: "AI Process",    col: "text-violet-400" },
    { label: "Transform",     col: "text-amber-400"  },
    { label: "Deliver",       col: "text-emerald-400"},
  ];

  return (
    <div className="bg-surface-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/60 font-mono text-[10px] sm:text-xs font-bold tracking-wide">AI Orchestration Center</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold">● 3 agents running</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
            <div className="w-2 h-2 rounded-full bg-green-400/50" />
          </div>
        </div>
      </div>

      {/* Pipeline summary bar */}
      <div className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-white/[0.04] bg-white/[0.01] shrink-0 flex-wrap">
        {pipelineSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-1 sm:gap-1.5">
            <div className="px-1.5 sm:px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
              <span className={`text-[7px] sm:text-[8px] font-mono font-bold ${step.col}`}>{step.label}</span>
            </div>
            {i < pipelineSteps.length - 1 && (
              <span className="text-white/15 text-[8px]">→</span>
            )}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[6px] sm:text-[7px] text-white/25 font-mono">live</span>
        </div>
      </div>

      {/* Body: 3-col grid */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 2fr 1fr", aspectRatio: "8/5" }}>

        {/* LEFT: Agents */}
        <div className="border-r border-white/[0.05] p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 overflow-hidden">
          <div className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-widest mb-0.5">AI Agents</div>
          {agents.map(a => (
            <div key={a.name} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5 sm:p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.dotCls} animate-pulse`} />
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/70">{a.name}</span>
                </div>
                <span className="text-[5px] sm:text-[6px] font-mono font-bold px-1 py-0.5 rounded bg-white/[0.06]"
                  style={{ color: a.colHex }}>{a.badge}</span>
              </div>
              <div className="text-[5px] sm:text-[6px] text-white/25 font-mono mb-1.5 leading-none">{a.role}</div>
              <div className="w-full h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${a.pct}%`, backgroundColor: a.colHex + "66" }} />
              </div>
              <div className="text-[5px] sm:text-[6px] text-white/18 font-mono mt-1">{a.tasks} tasks</div>
            </div>
          ))}
        </div>

        {/* CENTER: Activity log */}
        <div className="border-r border-white/[0.05] p-2 sm:p-3 flex flex-col overflow-hidden">
          <div className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-widest mb-1.5">Live Activity Log</div>
          <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 overflow-hidden">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 py-0.5 sm:py-1 border-b border-white/[0.03]">
                <span className={`text-[8px] sm:text-[10px] shrink-0 ${log.col}`}>{log.icon}</span>
                <span className="text-[7px] sm:text-[9px] text-white/45 font-mono flex-1 truncate">{log.text}</span>
                <span className="text-[5px] sm:text-[6px] text-white/15 font-mono shrink-0 hidden sm:block">{log.time}</span>
              </div>
            ))}
          </div>
          {/* Typing indicator */}
          <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-white/[0.04]">
            <div className="flex gap-0.5 items-end">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-violet-400/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span className="text-[6px] sm:text-[7px] text-white/20 font-mono">Claude processing next task…</span>
          </div>
        </div>

        {/* RIGHT: KPIs */}
        <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 overflow-hidden">
          <div className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-widest mb-0.5">Performance</div>
          {kpis.map(k => (
            <div key={k.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5 sm:p-2">
              <div className="text-sm sm:text-base font-bold text-white/80 font-mono leading-none">{k.val}</div>
              <div className="text-[5px] sm:text-[7px] text-white/28 font-mono mt-0.5">{k.label}</div>
              <div className={`text-[5px] sm:text-[6px] font-mono mt-1 leading-none ${k.pos ? "text-emerald-400" : "text-white/18"}`}>
                {k.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: integrations */}
      <div className="px-3 sm:px-4 py-2 border-t border-white/[0.05] bg-white/[0.01] flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-hidden">
        <span className="text-[6px] sm:text-[7px] text-white/18 font-mono shrink-0 uppercase tracking-wider">Connected:</span>
        {integrations.map(s => (
          <span key={s} className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[6px] sm:text-[7px] font-mono text-white/28 shrink-0">{s}</span>
        ))}
      </div>
    </div>
  );
}

// ── PC Desktop SaaS Dashboard Mockup ──────────────────────────────────────
function DashboardMockup() {
  const stats = [
    { label: "REVENUE", val: "$128K", delta: "+18%", col: "text-emerald-400" },
    { label: "USERS",   val: "8,429", delta: "+11%", col: "text-blue-400"    },
    { label: "ORDERS",  val: "1,204", delta: "+24%", col: "text-purple-400"  },
    { label: "CHURN",   val: "2.1%",  delta: "−0.4%", col: "text-red-400"   },
  ];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const donut = [
    { dot: "bg-blue-400",   label: "Organic", pct: "40%" },
    { dot: "bg-purple-400", label: "Paid",    pct: "25%" },
    { dot: "bg-orange-400", label: "Social",  pct: "20%" },
    { dot: "bg-white/20",   label: "Other",   pct: "15%" },
  ];

  return (
    <div className="bg-surface-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 w-full aspect-video flex">
      {/* Sidebar */}
      <div className="w-11 sm:w-14 bg-surface-dark border-r border-white/[0.06] flex flex-col items-center py-3 gap-3 shrink-0">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center mb-1">
          <span className="text-primary text-[9px] sm:text-[10px] font-black">TG</span>
        </div>
        {["▣","≡","◎","⚙"].map((ic, i) => (
          <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[9px] sm:text-xs transition-colors ${i === 0 ? "bg-primary/20 text-primary border border-primary/40" : "text-white/20"}`}>
            {ic}
          </div>
        ))}
        <div className="mt-auto w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/25 border border-blue-500/40 flex items-center justify-center">
          <span className="text-blue-300 text-[6px] sm:text-[8px] font-bold">JD</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
          <div>
            <div className="text-[6px] sm:text-[8px] text-white/30 font-mono">Overview</div>
            <div className="text-[9px] sm:text-xs font-bold text-white/75">Analytics Dashboard</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hidden sm:block">
              <span className="text-[7px] text-white/35 font-mono">Last 30 days</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-1.5 p-2 shrink-0">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/[0.035] rounded-lg p-1.5 sm:p-2 border border-white/[0.05]">
              <div className="text-[5px] sm:text-[7px] text-white/25 font-mono tracking-wider mb-0.5">{s.label}</div>
              <div className="text-[9px] sm:text-xs font-bold text-white/80">{s.val}</div>
              <div className={`text-[6px] sm:text-[8px] font-mono ${s.col}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="flex-1 grid grid-cols-3 gap-1.5 px-2 pb-2 min-h-0">
          {/* Line chart (2/3) */}
          <div className="col-span-2 bg-white/[0.025] rounded-xl border border-white/[0.05] p-1.5 sm:p-2.5 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <span className="text-[5px] sm:text-[7px] text-white/30 font-mono tracking-wider uppercase">Revenue Over Time</span>
              <span className="text-[5px] sm:text-[7px] text-emerald-400/70 font-mono">● Live</span>
            </div>
            <div className="flex-1 relative min-h-0">
              <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,163,117,0.45)" />
                    <stop offset="100%" stopColor="rgba(0,163,117,0)" />
                  </linearGradient>
                </defs>
                {[20,40,60].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />)}
                <path d="M0,65 C15,60 20,45 35,40 C50,35 55,50 70,38 C85,26 90,20 105,25 C120,30 125,20 140,15 C155,10 160,18 175,12 C190,8 195,5 200,5 L200,80 L0,80 Z" fill="url(#revGrad)" />
                <path d="M0,65 C15,60 20,45 35,40 C50,35 55,50 70,38 C85,26 90,20 105,25 C120,30 125,20 140,15 C155,10 160,18 175,12 C190,8 195,5 200,5" fill="none" stroke="rgba(0,163,117,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="200" cy="5" r="2.5" fill="rgb(0,163,117)" />
                <circle cx="200" cy="5" r="5" fill="rgba(0,163,117,0.2)" />
              </svg>
            </div>
            <div className="flex justify-between mt-1 shrink-0">
              {months.map(m => <span key={m} className="text-[5px] sm:text-[6px] text-white/20 font-mono">{m}</span>)}
            </div>
          </div>

          {/* Donut chart (1/3) */}
          <div className="bg-white/[0.025] rounded-xl border border-white/[0.05] p-1.5 sm:p-2.5 flex flex-col min-h-0">
            <span className="text-[5px] sm:text-[7px] text-white/30 font-mono tracking-wider uppercase mb-1 shrink-0">Traffic</span>
            <div className="flex-1 flex items-center justify-center min-h-0">
              <svg viewBox="0 0 60 60" className="w-full max-w-[48px] sm:max-w-[56px]">
                {/* circumference r=20: ≈125.7 */}
                <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(59,130,246,0.85)"  strokeWidth="7" strokeDasharray="50 76"   strokeDashoffset="0"    transform="rotate(-90 30 30)" />
                <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(167,139,250,0.75)" strokeWidth="7" strokeDasharray="31 95"   strokeDashoffset="-50"  transform="rotate(-90 30 30)" />
                <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(251,146,60,0.7)"  strokeWidth="7" strokeDasharray="25 101"  strokeDashoffset="-81"  transform="rotate(-90 30 30)" />
                <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" strokeDasharray="19 107" strokeDashoffset="-106" transform="rotate(-90 30 30)" />
                <text x="30" y="33" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="7" fontWeight="bold">40%</text>
              </svg>
            </div>
            <div className="space-y-0.5 mt-1 shrink-0">
              {donut.map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${d.dot}`} />
                    <span className="text-[5px] sm:text-[6px] text-white/30 font-mono">{d.label}</span>
                  </div>
                  <span className="text-[5px] sm:text-[7px] text-white/50 font-mono font-bold">{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Live Project Activity Feed (countries) ────────────────────────────────
function GlobalMockup() {
  const rows = [
    { flag:"us", country:"USA",       client:"NovaCorp Health",  type:"Web App",    val:"$48K", status:"active"    },
    { flag:"gb", country:"UK",        client:"TechBridge Ltd",   type:"Mobile App", val:"$32K", status:"delivered" },
    { flag:"ae", country:"UAE",       client:"AlphaStream",      type:"AI Agent",   val:"$65K", status:"active"    },
    { flag:"de", country:"Germany",   client:"DataSync GmbH",    type:"SaaS",       val:"$29K", status:"review"    },
    { flag:"sg", country:"Singapore", client:"NextWave Inc",     type:"E-commerce", val:"$41K", status:"active"    },
    { flag:"au", country:"Australia", client:"CloudPeak Sys",    type:"API Dev",    val:"$18K", status:"delivered" },
    { flag:"ca", country:"Canada",    client:"Studio Prime",     type:"Mobile App", val:"$55K", status:"active"    },
    { flag:"jp", country:"Japan",     client:"Nexus Labs",       type:"AI/ML",      val:"$73K", status:"review"    },
  ];

  const statusStyle: Record<string, { label: string; cls: string }> = {
    active:    { label: "● In Progress", cls: "text-emerald-400" },
    delivered: { label: "✓ Delivered",   cls: "text-blue-400"    },
    review:    { label: "◎ In Review",   cls: "text-amber-400"   },
  };

  return (
    <div className="bg-surface-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 w-full aspect-video flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/50 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">Live Project Activity</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono text-[8px] sm:text-[9px]">5 active</span>
          <span className="text-white/20 font-mono text-[7px] sm:text-[8px]">16 countries</span>
        </div>
      </div>

      {/* Column labels */}
      <div className="grid px-3 sm:px-4 py-1 border-b border-white/[0.04] shrink-0"
        style={{ gridTemplateColumns: "28px 1fr auto auto" }}>
        <span />
        <span className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-wider">Client</span>
        <span className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-wider pr-2">Value</span>
        <span className="text-[6px] sm:text-[7px] text-white/20 font-mono uppercase tracking-wider">Status</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid items-center px-3 sm:px-4 py-1 sm:py-1.5 border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors"
            style={{ gridTemplateColumns: "28px 1fr auto auto" }}
          >
            <FlagImage flagCode={r.flag} name={r.country} size="sm" className="opacity-75" />
            <div className="min-w-0 pl-1">
              <div className="text-[8px] sm:text-[9px] text-white/60 font-mono font-bold truncate">{r.client}</div>
              <div className="text-[6px] sm:text-[7px] text-white/25 font-mono">{r.type}</div>
            </div>
            <span className="text-[8px] sm:text-[9px] text-white/55 font-mono font-bold pr-2 whitespace-nowrap">{r.val}</span>
            <span className={`text-[6px] sm:text-[8px] font-mono font-bold whitespace-nowrap ${statusStyle[r.status].cls}`}>
              {statusStyle[r.status].label}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 sm:px-4 py-2 border-t border-white/[0.05] bg-white/[0.02] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 sm:gap-5">
          {[
            { val: "$361K", label: "Pipeline",   col: "text-white/65" },
            { val: "60+",   label: "Projects",   col: "text-white/65" },
            { val: "94%",   label: "Satisfaction", col: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`font-bold text-xs sm:text-sm font-mono ${s.col}`}>{s.val}</div>
              <div className="text-white/20 font-mono tracking-wide" style={{ fontSize: 7 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/25">
          <span className="text-[8px] sm:text-[9px] text-primary font-mono font-bold">16 Countries</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export default function IndustryShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".showcase-row").forEach((row: any) => {
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: "top 85%" },
          y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const aiTools  = TECH_ICONS.slice(34, 46);
  const webTools = TECH_ICONS.slice(0, 34);

  return (
    // No bottom padding: the country ticker is the last child, and it's meant
    // to sit flush against the portfolio section below it. Any pb here renders
    // as a dead band between the two.
    <section ref={sectionRef} className="bg-card overflow-hidden" id="industries">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLES }} />

      <div className="flex flex-col gap-16 sm:gap-24">

        {/* ── 1. AI & Automation ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-0">
          <AINewsTicker />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-24">
            <div className="showcase-row grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-4 sm:mb-6">
                  <Cpu size={24} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">AI & Automation</h2>
                <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  Automate complex business processes with custom AI workflows. We integrate state-of-the-art LLMs and agentic frameworks to build self-correcting automation engines that save thousands of man-hours.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {["n8n Experts","LLM Fine-tuning","Autonomous Agents","Workflow Orchestration"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-[10px] sm:text-xs font-mono font-bold">{tag}</span>
                  ))}
                </div>
                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 hover:border-primary/60 transition-all group">
                  Automate your business
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="relative">
                <div className="absolute -right-6 sm:-right-12 -top-6 sm:-top-12 opacity-40 hidden sm:block z-0">
                  <Shape3D type="half-round" className="w-32 h-16 sm:w-48 sm:h-24" />
                </div>
                <div className="relative z-10">
                  <WorkflowMockup />
                </div>
                <div className="text-center mt-3 sm:mt-4 text-xs font-mono text-muted-foreground">
                  AI Orchestration Center — Claude · Gemini · GPT-4o · Live Agents
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-20"><Ticker items={aiTools} speed={60} reverse={true} /></div>
        </div>

        {/* ── 2. Web & Software Engineering ──────────────────────────────── */}
        <div className="flex flex-col gap-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-0 sm:pt-8">
            <div className="showcase-row grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute -left-6 sm:-left-12 -top-6 sm:-top-12 opacity-40 hidden sm:block z-0">
                  <Shape3D type="cube" className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>
                <div className="relative z-10">
                  <DashboardMockup />
                </div>
                <div className="text-center mt-3 sm:mt-4 text-xs font-mono text-muted-foreground">
                  Enterprise SaaS Platform — React · Node.js · PostgreSQL
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4 sm:mb-6">
                  <Layout size={24} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Web & Software Engineering</h2>
                <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  Scalable, high-performance software built for the future. We deliver full-stack solutions with technical precision, from pixel-perfect interfaces to robust backend architectures.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {["SaaS Platforms","Mobile Apps","Cloud-Native","Microservices"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-[10px] sm:text-xs font-mono font-bold">{tag}</span>
                  ))}
                </div>
                <a href="/work" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 hover:border-primary/60 transition-all group">
                  Explore our work
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-20"><Ticker items={webTools} speed={60} reverse={false} /></div>
        </div>

        {/* ── 3. Global Delivery Network ─────────────────────────────────── */}
        <div className="flex flex-col gap-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-0 sm:pt-8">
            <div className="showcase-row grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4 sm:mb-6">
                  <Globe size={24} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Global Delivery Network</h2>
                <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  Serving clients across 16+ countries with a distributed team of 80+ experts. We understand global markets and deliver solutions that resonate with users worldwide, from Silicon Valley to Saudi Arabia.
                </p>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {[
                    { icon: <TrendingUp size={16} className="text-emerald-600" />, val: "98%",  label: "Client Retention", bg: "bg-emerald-500/10 border-emerald-500/20" },
                    { icon: <Users size={16} className="text-blue-500" />,         val: "80+",  label: "Team Experts",      bg: "bg-blue-500/10 border-blue-500/20"       },
                    { icon: <ShieldCheck size={16} className="text-primary" />,    val: "24/7", label: "Global Support",    bg: "bg-primary/10 border-primary/20"         },
                  ].map((s, i) => (
                    <div key={i} className={`p-3 sm:p-4 rounded-xl border ${s.bg} flex flex-col gap-1`}>
                      {s.icon}
                      <div className="text-lg sm:text-xl font-bold text-foreground">{s.val}</div>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-mono tracking-wide leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
                <a href="/work" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 hover:border-primary/60 transition-all group">
                  Our global reach
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="relative">
                <div className="absolute -right-6 sm:-right-12 -bottom-6 sm:-bottom-12 opacity-40 hidden sm:block z-0">
                  <Shape3D type="torus" className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>
                <div className="relative z-10">
                  <GlobalMockup />
                </div>
                <div className="text-center mt-3 sm:mt-4 text-xs font-mono text-muted-foreground">
                  Live project activity across 16 countries
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12   sm:mt-20 "><Ticker items={COUNTRIES} speed={60} reverse={true} /></div>
        </div>
      </div>
    </section>
  );
}
