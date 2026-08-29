import { useMemo } from "react";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiPhp, SiLaravel,
  SiDjango, SiPython, SiTypescript, SiJavascript, SiGo,
  SiSwift, SiKotlin, SiFlutter, SiVuedotjs, SiAngular,
  SiExpress, SiNestjs, SiSpring, SiRubyonrails, SiRust,
  SiDocker, SiKubernetes, SiGooglecloud,
  SiTerraform, SiGithub, SiPostgresql, SiMongodb, SiRedis,
  SiTailwindcss, SiBootstrap, SiSvelte, SiFirebase, SiVercel,
  SiAnthropic, SiHuggingface, SiOpenai, SiGooglegemini,
  SiGithubcopilot, SiStackblitz, SiMake, SiClaude,
  SiPerplexity, SiOllama, SiReplicate, SiLangchain,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { motion } from "framer-motion";

type Ring = "inner" | "middle" | "outer";

type IconEntry = {
  kind: "icon";
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  label: string;
  color: string;
  ring: Ring;
};

type TechEntry = IconEntry;

export const TECH_ICONS: TechEntry[] = [
  // middle ring — Languages & core runtimes
  { kind: "icon", ring: "middle", icon: SiJavascript,    label: "JavaScript",   color: "#F7DF1E" },
  { kind: "icon", ring: "middle", icon: SiTypescript,    label: "TypeScript",   color: "#3178C6" },
  { kind: "icon", ring: "middle", icon: SiPython,        label: "Python",       color: "#3776AB" },
  { kind: "icon", ring: "middle", icon: SiGo,            label: "Go",           color: "#00ADD8" },
  { kind: "icon", ring: "middle", icon: SiRust,          label: "Rust",         color: "#DEA584" },
  { kind: "icon", ring: "middle", icon: SiSwift,         label: "Swift",        color: "#FA7343" },
  { kind: "icon", ring: "middle", icon: SiKotlin,        label: "Kotlin",       color: "#7F52FF" },
  { kind: "icon", ring: "middle", icon: SiPhp,           label: "PHP",          color: "#777BB4" },
  { kind: "icon", ring: "middle", icon: SiReact,         label: "React",        color: "#61DAFB" },
  { kind: "icon", ring: "middle", icon: SiNextdotjs,     label: "Next.js",      color: "#ffffff" },
  { kind: "icon", ring: "middle", icon: SiNodedotjs,     label: "Node.js",      color: "#339933" },
  { kind: "icon", ring: "middle", icon: SiExpress,       label: "Express",      color: "#ffffff" },
  { kind: "icon", ring: "middle", icon: SiNestjs,        label: "NestJS",       color: "#E0234E" },
  { kind: "icon", ring: "middle", icon: SiLaravel,       label: "Laravel",      color: "#FF2D20" },
  { kind: "icon", ring: "middle", icon: SiDjango,        label: "Django",       color: "#44B78B" },

  // outer ring — Frameworks, DevOps, Cloud, Databases
  { kind: "icon", ring: "outer", icon: SiSpring,        label: "Spring",       color: "#6DB33F" },
  { kind: "icon", ring: "outer", icon: SiVuedotjs,      label: "Vue.js",       color: "#4FC08D" },
  { kind: "icon", ring: "outer", icon: SiAngular,       label: "Angular",      color: "#DD0031" },
  { kind: "icon", ring: "outer", icon: SiSvelte,        label: "Svelte",       color: "#FF3E00" },
  { kind: "icon", ring: "outer", icon: SiFlutter,       label: "Flutter",      color: "#02569B" },
  { kind: "icon", ring: "outer", icon: SiRubyonrails,   label: "Rails",        color: "#CC0000" },
  { kind: "icon", ring: "outer", icon: SiTailwindcss,   label: "Tailwind",     color: "#06B6D4" },
  { kind: "icon", ring: "outer", icon: SiBootstrap,     label: "Bootstrap",    color: "#7952B3" },
  { kind: "icon", ring: "outer", icon: SiDocker,        label: "Docker",       color: "#2496ED" },
  { kind: "icon", ring: "outer", icon: SiKubernetes,    label: "Kubernetes",   color: "#326CE5" },
  { kind: "icon", ring: "outer", icon: FaAws,           label: "AWS",          color: "#FF9900" },
  { kind: "icon", ring: "outer", icon: SiGooglecloud,   label: "GCP",          color: "#4285F4" },
  { kind: "icon", ring: "outer", icon: SiTerraform,     label: "Terraform",    color: "#7B42BC" },
  { kind: "icon", ring: "outer", icon: SiPostgresql,    label: "PostgreSQL",   color: "#336791" },
  { kind: "icon", ring: "outer", icon: SiMongodb,       label: "MongoDB",      color: "#47A248" },
  { kind: "icon", ring: "outer", icon: SiRedis,         label: "Redis",        color: "#DC382D" },
  { kind: "icon", ring: "outer", icon: SiFirebase,      label: "Firebase",     color: "#FFCA28" },
  { kind: "icon", ring: "outer", icon: SiVercel,        label: "Vercel",       color: "#ffffff" },
  { kind: "icon", ring: "outer", icon: SiGithub,        label: "GitHub",       color: "#ffffff" },

  // inner ring — AI tools & automation
  { kind: "icon", ring: "inner", icon: SiOpenai,        label: "OpenAI",       color: "#00A67E" },
  { kind: "icon", ring: "inner", icon: SiClaude,        label: "Claude",       color: "#CC785C" },
  { kind: "icon", ring: "inner", icon: SiAnthropic,     label: "Anthropic",    color: "#D4A27F" },
  { kind: "icon", ring: "inner", icon: SiGooglegemini,  label: "Gemini",       color: "#4285F4" },
  { kind: "icon", ring: "inner", icon: SiGithubcopilot, label: "Copilot",      color: "#9B6EFF" },
  { kind: "icon", ring: "inner", icon: SiHuggingface,   label: "Hugging Face", color: "#FFD21E" },
  { kind: "icon", ring: "inner", icon: SiStackblitz,    label: "Bolt",         color: "#1389FD" },
  { kind: "icon", ring: "inner", icon: SiPerplexity,    label: "Perplexity",   color: "#20B2AA" },
  { kind: "icon", ring: "inner", icon: SiOllama,        label: "Ollama",       color: "#ffffff" },
  { kind: "icon", ring: "inner", icon: SiReplicate,     label: "Replicate",    color: "#ffffff" },
  { kind: "icon", ring: "inner", icon: SiLangchain,     label: "LangChain",    color: "#00BFA5" },
  { kind: "icon", ring: "inner", icon: SiMake,          label: "Make",         color: "#6D00CC" },
];

export const COUNTRIES = [
  { flag: "us", name: "United States",  revenue: "$420K", growth: "+12%" },
  { flag: "gb", name: "United Kingdom", revenue: "$280K", growth: "+8%"  },
  { flag: "jp", name: "Japan",          revenue: "$150K", growth: "+15%" },
  { flag: "de", name: "Germany",        revenue: "$120K", growth: "+5%"  },
  { flag: "ca", name: "Canada",         revenue: "$95K",  growth: "+10%" },
  { flag: "au", name: "Australia",      revenue: "$85K",  growth: "+7%"  },
  { flag: "ae", name: "UAE",            revenue: "$70K",  growth: "+20%" },
  { flag: "sa", name: "Saudi Arabia",   revenue: "$60K",  growth: "+18%" },
  { flag: "sg", name: "Singapore",      revenue: "$55K",  growth: "+22%" },
  { flag: "fr", name: "France",         revenue: "$50K",  growth: "+6%"  },
  { flag: "nl", name: "Netherlands",    revenue: "$45K",  growth: "+9%"  },
  { flag: "hk", name: "Hong Kong",      revenue: "$35K",  growth: "+14%" },
  { flag: "kr", name: "South Korea",    revenue: "$30K",  growth: "+19%" },
  { flag: "br", name: "Brazil",         revenue: "$28K",  growth: "+23%" },
  { flag: "my", name: "Malaysia",       revenue: "$22K",  growth: "+28%" },
  { flag: "qa", name: "Qatar",          revenue: "$18K",  growth: "+24%" },
];

// ─── Pure CSS keyframes injected once ───────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes orbit-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
  @keyframes orbit-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }

  .orbit-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    will-change: transform;
    animation: orbit-cw var(--spd) linear infinite;
  }

  .orbit-item {
    position: absolute;
    will-change: transform;
    animation: orbit-ccw var(--spd) linear infinite;
  }

  /* pause on hover of any child — keeps icons upright and readable */
  .orbit-ring:hover,
  .orbit-ring:hover .orbit-item {
    animation-play-state: paused;
  }
`;

// ─── Tech ring (icons) ───────────────────────────────────────────────────────
function TechOrbitRing({
  entries,
  radius,
  speed,
}: {
  entries: TechEntry[];
  radius: number;
  speed: number;
}) {
  const size = radius * 2;

  return (
    <div
      className="orbit-ring"
      style={
        {
          width: size,
          height: size,
          marginLeft: -radius,
          marginTop: -radius,
          "--spd": `${speed}s`,
          zIndex: 20,
        } as React.CSSProperties
      }
    >
      {entries.map((entry, i) => {
        const angle = (i / entries.length) * Math.PI * 2;
        const x = radius + radius * Math.cos(angle) - 18;
        const y = radius + radius * Math.sin(angle) - 18;
        return (
          <div
            key={entry.label}
            className="orbit-item"
            style={{ left: x, top: y }}
          >
            <div className="relative group">
              {/* glow ring */}
              <div className="absolute -inset-2 rounded-full bg-white/5 blur-sm group-hover:bg-purple-500/20 transition-colors duration-300" />
              {/* icon bubble */}
              <div className="relative w-9 h-9 flex items-center justify-center bg-secondary border border-white/10 rounded-full shadow-lg group-hover:border-purple-400/50 transition-all duration-300">
                <entry.icon
                  size={18}
                  style={{ color: entry.color }}
                  className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
              {/* tooltip */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-black/90 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] text-white whitespace-nowrap">
                  {entry.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Country ring (flags) ────────────────────────────────────────────────────
function CountryOrbitRing({
  countries,
  radius,
  speed,
}: {
  countries: typeof COUNTRIES;
  radius: number;
  speed: number;
}) {
  const size = radius * 2;

  return (
    <div
      className="orbit-ring"
      style={
        {
          width: size,
          height: size,
          marginLeft: -radius,
          marginTop: -radius,
          "--spd": `${speed}s`,
          zIndex: 20,
        } as React.CSSProperties
      }
    >
      {countries.map((country, i) => {
        const angle = (i / countries.length) * Math.PI * 2;
        const x = radius + radius * Math.cos(angle) - 22;
        const y = radius + radius * Math.sin(angle) - 22;
        return (
          <div
            key={country.name}
            className="orbit-item"
            style={{ left: x, top: y }}
          >
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-white/5 blur-sm group-hover:bg-blue-500/20 transition-colors duration-300" />
              <div className="relative w-11 h-11 flex items-center justify-center bg-secondary border border-white/10 rounded-full shadow-lg group-hover:border-blue-400/40 transition-all duration-300 overflow-hidden">
                <img
                  src={`https://flagcdn.com/w40/${country.flag}.png`}
                  srcSet={`https://flagcdn.com/w80/${country.flag}.png 2x`}
                  alt={country.name}
                  width={28}
                  height={21}
                  style={{ borderRadius: 3, objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              {/* tooltip */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] text-white whitespace-nowrap">
                  <div className="font-semibold">{country.name}</div>
                  <div className="flex gap-2 text-white/50 mt-0.5">
                    <span>{country.revenue}</span>
                    <span className="text-green-400">{country.growth}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Central card ────────────────────────────────────────────────────────────
function CentralCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ position: "absolute", zIndex: 30, width: 280 }}
    >
      <div
        className="rounded-[24px] overflow-hidden border border-white/10 shadow-2xl"
        style={{
          background: "rgba(14,14,24,0.94)",
          backdropFilter: "blur(28px)",
          boxShadow: "0 0 60px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* gradient tint overlay */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, transparent 60%, rgba(59,130,246,0.06) 100%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-[13px] leading-none">Time Global</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontFamily: "monospace", marginTop: 3 }}>
                timeglobal.com
              </p>
            </div>
          </div>
          {/* LIVE badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span style={{ color: "#4ade80", fontSize: "8px", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.04em" }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-white/[0.06]">
          {[
            { value: "13+",  label: "Years"     },
            { value: "150+", label: "Projects"  },
            { value: "16+",  label: "Countries" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-3"
              style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <span className="text-white font-bold" style={{ fontSize: "15px" }}>{s.value}</span>
              <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "7.5px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="px-4 pt-3 pb-4">
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", lineHeight: 1.65 }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Time Global</span>{" "}
            is an AI-first digital agency helping startups and businesses launch websites, SaaS
            platforms, automation systems, and AI solutions faster. Since 2013, our mission has
            been simple:
            <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              {" "}quick delivery, efficient execution, and measurable results.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export default function TechStack() {
  const innerIcons  = useMemo(() => TECH_ICONS.filter(e => e.ring === "inner"),  []);
  const middleIcons = useMemo(() => TECH_ICONS.filter(e => e.ring === "middle"), []);
  const outerIcons  = useMemo(() => TECH_ICONS.filter(e => e.ring === "outer"),  []);

  return (
    <section
      className="overflow-hidden relative flex flex-col items-center"
      style={{ background: "#0D0D18", minHeight: "140vh", paddingTop: "5rem", paddingBottom: "4rem" }}
    >
      {/* Inject CSS keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 900, height: 900, background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl w-full mx-auto px-6 relative" style={{ zIndex: 2 }}>

        {/* Section header — framer only for the one-time fade-in, NOT looping */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full font-mono text-sm font-bold mb-5 border"
            style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", borderColor: "rgba(124,58,237,0.2)" }}
          >
            {"<ecosystem>"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
          >
            All the tech that{" "}
            <span style={{ backgroundImage: "linear-gradient(to right,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              powers your vision
            </span>
          </motion.h2>
        </div>

        {/* Orbit area */}
        <div className="relative flex items-center justify-center" style={{ height: 1100 }}>

          {/* Static decorative ring guides */}
          {[360, 580, 820, 1050].map((d, i) => (
            <div
              key={d}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: d,
                height: d,
                border: i === 3
                  ? "1px solid rgba(96,165,250,0.12)"
                  : "1px solid rgba(255,255,255,0.04)",
                zIndex: 1,
              }}
            />
          ))}

          {/* Rings — pure CSS, zero JS per frame */}
          <TechOrbitRing    entries={innerIcons}   radius={180} speed={42}  />
          <TechOrbitRing    entries={middleIcons}  radius={290} speed={68}  />
          <TechOrbitRing    entries={outerIcons}   radius={410} speed={88}  />
          <CountryOrbitRing countries={COUNTRIES} radius={525} speed={115} />

          {/* Central card — framer only for the one-time mount animation */}
          <CentralCard />
        </div>
      </div>
      <div className="pb-16" />

    </section>
  );
}