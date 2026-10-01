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
    transform-origin: center center;
    animation: orbit-cw var(--spd) linear infinite;
  }

  .orbit-item {
    position: absolute;
    transform-origin: center center;
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
        const x = radius + radius * Math.cos(angle) - 20;
        const y = radius + radius * Math.sin(angle) - 20;
        const isWhiteIcon = entry.color.toLowerCase() === "#ffffff";
        return (
          <div
            key={entry.label}
            className="orbit-item"
            style={{ left: x, top: y }}
          >
            <div className="relative group cursor-pointer">
              {/* ambient glow */}
              <div className="absolute -inset-2 rounded-full bg-purple-500/10 dark:bg-white/5 blur-sm group-hover:bg-purple-500/25 transition-colors duration-300 pointer-events-none" />
              {/* icon bubble */}
              <div className="relative w-10 h-10 flex items-center justify-center bg-card dark:bg-[#151528] border border-border/80 dark:border-white/15 rounded-full shadow-sm group-hover:border-primary/50 dark:group-hover:border-purple-400/60 group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                <entry.icon
                  size={19}
                  style={isWhiteIcon ? undefined : { color: entry.color }}
                  className={`opacity-90 group-hover:opacity-100 transition-opacity duration-200 ${
                    isWhiteIcon ? "text-slate-800 dark:text-white" : ""
                  }`}
                />
              </div>
              {/* tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-slate-900/95 dark:bg-black/95 backdrop-blur-md border border-slate-700/50 dark:border-white/10 px-2.5 py-1 rounded-md text-[10px] text-white font-medium whitespace-nowrap shadow-xl">
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
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 rounded-full bg-emerald-500/10 dark:bg-emerald-400/5 blur-sm group-hover:bg-emerald-500/25 transition-colors duration-300 pointer-events-none" />
              <div className="relative w-11 h-11 flex items-center justify-center bg-card dark:bg-[#151528] border border-border/80 dark:border-emerald-400/35 rounded-full shadow-md group-hover:border-emerald-400/80 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:scale-110 transition-all duration-300 overflow-hidden">
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
                <div className="bg-slate-900/95 dark:bg-black/95 backdrop-blur-md border border-slate-700/50 dark:border-white/10 px-3 py-1.5 rounded-lg text-[9px] text-white whitespace-nowrap shadow-xl">
                  <div className="font-semibold">{country.name}</div>
                  <div className="flex gap-2 text-slate-300 dark:text-white/60 mt-0.5">
                    <span>{country.revenue}</span>
                    <span className="text-emerald-400 font-medium">{country.growth}</span>
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[275px] pointer-events-auto"
    >
      <div className="rounded-[24px] overflow-hidden border border-border/80 dark:border-white/10 shadow-2xl bg-card/95 dark:bg-[#0E0E18]/95 backdrop-blur-2xl transition-colors duration-300">
        {/* gradient tint overlay */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, transparent 60%, rgba(59,130,246,0.06) 100%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/70 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md"
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
              <p className="text-foreground dark:text-white font-bold text-[13px] leading-none">Time Global</p>
              <p className="text-muted-foreground dark:text-white/40 text-[9px] font-mono mt-1">
                timeglobal.com
              </p>
            </div>
          </div>
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[8px] font-mono font-bold tracking-wider">
              LIVE
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-border/70 dark:border-white/[0.06]">
          {[
            { value: "13+",  label: "Years"     },
            { value: "150+", label: "Projects"  },
            { value: "16+",  label: "Countries" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center py-3 ${
                i < 2 ? "border-r border-border/70 dark:border-white/[0.06]" : ""
              }`}
            >
              <span className="text-foreground dark:text-white font-bold text-[15px]">{s.value}</span>
              <span className="text-muted-foreground dark:text-white/40 text-[7.5px] uppercase tracking-wider mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-muted-foreground dark:text-white/60 text-[10px] leading-relaxed">
            <span className="text-foreground dark:text-white font-semibold">Time Global</span>{" "}
            is an AI-first digital agency helping startups and businesses launch websites, SaaS
            platforms, automation systems, and AI solutions faster. Since 2013, our mission has
            been simple:
            <span className="text-foreground/90 dark:text-white/90 font-semibold">
              {" "}quick delivery, efficient execution, and measurable results.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Guide rings with distinct theme-adaptive colors and glow so orbits are clearly defined
const GUIDE_RINGS = [
  {
    diameter: 360,
    border: "border border-purple-500/40 dark:border-purple-400/35",
    shadow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
  {
    diameter: 580,
    border: "border border-cyan-500/35 dark:border-cyan-400/30",
    shadow: "shadow-[0_0_20px_rgba(6,182,212,0.12)]",
  },
  {
    diameter: 820,
    border: "border border-blue-500/35 dark:border-blue-400/30",
    shadow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
  },
  {
    diameter: 1050,
    border: "border border-emerald-500/40 dark:border-emerald-400/35",
    shadow: "shadow-[0_0_25px_rgba(16,185,129,0.18)]",
  },
];

// ─── Main section ────────────────────────────────────────────────────────────
export default function TechStack() {
  const innerIcons  = useMemo(() => TECH_ICONS.filter(e => e.ring === "inner"),  []);
  const middleIcons = useMemo(() => TECH_ICONS.filter(e => e.ring === "middle"), []);
  const outerIcons  = useMemo(() => TECH_ICONS.filter(e => e.ring === "outer"),  []);

  return (
    <section
      className="overflow-hidden relative flex flex-col items-center bg-secondary/40 dark:bg-[#0A0A14] py-16 sm:py-20 md:py-24 transition-colors duration-300"
    >
      {/* Inject CSS keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Ambient glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-300"
        style={{ width: 900, height: 900, background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-300"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10">

        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full font-mono text-xs sm:text-sm font-semibold mb-4 sm:mb-5 border bg-primary/10 text-primary border-primary/20 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25"
          >
            {"<ecosystem>"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="font-bold text-foreground dark:text-white leading-tight mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            All the tech that{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
              powers your vision
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto"
          >
            From modern frontend stacks and high-availability cloud backends to cutting-edge AI and international deployments.
          </motion.p>
        </div>

        {/* Orbit responsive scaling viewport — generous vertical space so top and bottom orbits are never cut off */}
        <div className="relative w-full flex items-center justify-center overflow-hidden h-[360px] min-[390px]:h-[400px] min-[480px]:h-[480px] sm:h-[640px] md:h-[780px] lg:h-[970px] xl:h-[1190px] 2xl:h-[1210px]">
          {/* Inner 1160px orbit system, smoothly scaled for mobile/tablet screens */}
          <div className="relative flex items-center justify-center w-[1160px] h-[1160px] shrink-0 scale-[0.29] min-[390px]:scale-[0.32] min-[480px]:scale-[0.39] sm:scale-[0.52] md:scale-[0.64] lg:scale-[0.80] xl:scale-[0.98] 2xl:scale-100 origin-center transition-transform duration-300">

            {/* Clearly visible static decorative ring guides with themed glowing paths */}
            {GUIDE_RINGS.map((ring) => (
              <div
                key={ring.diameter}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-colors duration-300 ${ring.border} ${ring.shadow}`}
                style={{ width: ring.diameter, height: ring.diameter, zIndex: 1 }}
              />
            ))}

            {/* Concentric rotating rings — pure CSS animations */}
            <TechOrbitRing    entries={innerIcons}   radius={180} speed={42}  />
            <TechOrbitRing    entries={middleIcons}  radius={290} speed={68}  />
            <TechOrbitRing    entries={outerIcons}   radius={410} speed={88}  />
            <CountryOrbitRing countries={COUNTRIES} radius={525} speed={115} />

            {/* Central card */}
            <CentralCard />
          </div>
        </div>
      </div>
    </section>
  );
}