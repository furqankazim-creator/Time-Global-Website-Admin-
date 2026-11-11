import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Globe, ExternalLink, Cpu, Database,
  FileCheck2, CheckCircle2, ChevronRight, Layers,
  Terminal, Sparkles, Building2, BarChart3, Lock
} from "lucide-react";

export function OrgpyurInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"saas" | "fintech" | "healthtech" | "web3">("saas");
  const [selectedNode, setSelectedNode] = useState<{
    name: string;
    scope: string;
    status: string;
    detail: string;
  }>({
    name: "TGT Operational Audit Engine",
    scope: "Audit Core & Governance Oversight",
    status: "66% Milestone Reached",
    detail: "Technical roadmap sprint velocity synced with vendor contracts.",
  });

  const domains = {
    saas: {
      title: "Orgpyur Technologies Inc. — Enterprise SaaS Governance",
      overview: "Aligning technical engineering teams with board governance, CIPO trademark filings, and data storage SOPs.",
      cards: [
        {
          title: "MVP Sprint Audit (66%)",
          desc: "Technical roadmap tracking reaching 66% MVP completion milestone with clear sprint deliverables.",
          tag: "66% Milestone",
          icon: BarChart3,
          color: "text-primary",
        },
        {
          title: "CIPO Trademark Dossier",
          desc: "Structured intellectual property dossier compiled for Canadian Intellectual Property Office filing.",
          tag: "IP Protection",
          icon: ShieldCheck,
          color: "text-cyan-400",
        },
        {
          title: "orgpyur.com Architecture",
          desc: "Enterprise data storage & messaging MVP roadmap formalization for cloud engineering teams.",
          tag: "SaaS Storage",
          icon: Database,
          color: "text-amber-400",
        },
      ],
    },
    fintech: {
      title: "FinTech Regulatory & IP Audit",
      overview: "Audit frameworks for high-frequency financial platforms requiring stringent SOC 2, FINTRAC, and IP patent filings.",
      cards: [
        {
          title: "SOC 2 & FINTRAC Compliance",
          desc: "Executive audit checklists ensuring anti-money laundering and data security standards.",
          tag: "FinTech Audit",
          icon: Lock,
          color: "text-cyan-400",
        },
        {
          title: "Patented Algorithmic IP",
          desc: "IP dossier preparation for proprietary transaction matching & ledger algorithms.",
          tag: "Algorithm IP",
          icon: FileCheck2,
          color: "text-primary",
        },
        {
          title: "Institutional Investor Sync",
          desc: "Quarterly progress reporting formatted for venture capital and institutional board members.",
          tag: "VC Reporting",
          icon: BarChart3,
          color: "text-amber-400",
        },
      ],
    },
    healthtech: {
      title: "HealthTech Compliance & Clinical Governance",
      overview: "Operational governance for digital health platforms navigating HIPAA, PIPEDA, and clinical trial data audits.",
      cards: [
        {
          title: "HIPAA & PIPEDA Audit SOP",
          desc: "Patient data encryption and access logging governance across cloud messaging channels.",
          tag: "Health Audit",
          icon: ShieldCheck,
          color: "text-rose-400",
        },
        {
          title: "Clinical Board Minutes",
          desc: "Formalized medical board governance and clinical review meeting documentation.",
          tag: "Clinical Sync",
          icon: FileCheck2,
          color: "text-primary",
        },
        {
          title: "Medical IP Dossier",
          desc: "Trademark and patent filing dossiers for proprietary diagnostic telemetry tools.",
          tag: "Medical IP",
          icon: Cpu,
          color: "text-cyan-400",
        },
      ],
    },
    web3: {
      title: "Web3 Protocol & Decentralized IP Auditing",
      overview: "Governance oversight and smart contract security audit alignment for decentralized protocols.",
      cards: [
        {
          title: "Smart Contract Audit Track",
          desc: "Monitoring third-party security audits and tracking protocol vulnerability remediation.",
          tag: "Security Audit",
          icon: Terminal,
          color: "text-amber-400",
        },
        {
          title: "Foundation & DAO Governance",
          desc: "Structuring formal board minutes and governance voting frameworks for foundation councils.",
          tag: "DAO Governance",
          icon: Layers,
          color: "text-cyan-400",
        },
        {
          title: "Global Trademark Strategy",
          desc: "Multi-jurisdictional trademark filings protecting protocol brand assets.",
          tag: "Global IP",
          icon: Globe,
          color: "text-primary",
        },
      ],
    },
  };

  return (
    <div className="space-y-12 my-12">
      {/* ── 1. Live Platform Telemetry & Browser Viewport ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold block">
              Live Platform Integration
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Orgpyur Platform Telemetry & Live Product View
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Synchronized audit evidence cross-referenced with live domain records at orgpyur.com.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs bg-secondary/80 px-3.5 py-2 rounded-xl border border-border self-start shrink-0">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Domain Active
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck size={14} /> SSL Encrypted
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Browser Mockup */}
          <div className="lg:col-span-2 rounded-xl bg-background border border-border/80 overflow-hidden flex flex-col justify-between h-[360px] relative shadow-lg">
            <div className="bg-secondary px-4 py-2.5 border-b border-border/80 flex items-center justify-between font-mono text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-muted-foreground ml-2 text-[11px]">https://orgpyur.com/</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] border border-primary/30 font-bold">
                LIVE DOMAIN VERIFIED
              </span>
            </div>

            <div className="p-6 relative z-10 flex flex-col justify-between h-full bg-gradient-to-br from-primary/5 via-card to-background">
              <div className="space-y-4 max-w-lg">
                <div className="inline-block px-3 py-1 rounded-md bg-primary/15 text-primary font-mono text-xs border border-primary/30 font-bold">
                  ORGPYUR TECHNOLOGIES INC.
                </div>
                <h4 className="text-2xl font-bold text-foreground leading-tight">
                  Next-Generation Enterprise SaaS Architecture
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Empowering businesses with streamlined messaging protocols, secure data storage infrastructures, and compliant operational management.
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border">
                  <span className="text-muted-foreground block text-[10px]">MVP SPRINT</span>
                  <span className="text-primary font-bold text-sm">66% Completed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border">
                  <span className="text-muted-foreground block text-[10px]">CIPO TRADEMARK</span>
                  <span className="text-foreground font-bold text-sm">Dossier Ready</span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border">
                  <span className="text-muted-foreground block text-[10px]">BOARD AUDIT</span>
                  <span className="text-cyan-400 font-bold text-sm">100% Synced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Telemetry Strip */}
          <div className="rounded-xl bg-card border border-border/80 p-6 flex flex-col justify-between font-mono text-xs space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="text-primary font-bold text-sm flex items-center gap-2 border-b border-border pb-2">
                <FileCheck2 size={16} /> OPERATIONAL AUDIT LOG
              </div>
              <div className="space-y-2 text-foreground/80 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-secondary/70 border border-border">
                  <span>Technical Sprint Track</span>
                  <span className="text-primary font-bold">66% Milestone</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-secondary/70 border border-border">
                  <span>CIPO Application</span>
                  <span className="text-foreground font-bold">Compiled</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-secondary/70 border border-border">
                  <span>Board Minutes SOP</span>
                  <span className="text-cyan-400 font-bold">Meticulous</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-secondary/70 border border-border">
                  <span>Data Storage MVP</span>
                  <span className="text-primary font-bold">Formalized</span>
                </div>
              </div>
            </div>

            <a
              href="https://orgpyur.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
            >
              <ExternalLink size={14} /> Visit orgpyur.com Platform
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Governance Node Graph & Interactive Topology HUD ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">
                Enterprise Architecture & Governance Flow
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Operational Audit & IP Alignment Topology
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs bg-secondary px-3.5 py-2 rounded-xl border border-border w-fit">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" /> Board Oversight
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" /> CIPO Trademark
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" /> 66% MVP
            </span>
          </div>
        </div>

        <div className="relative w-full h-[460px] bg-background/80 rounded-2xl border border-border/80 overflow-hidden flex items-center justify-center p-4">
          {/* SVG Rings & Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="100" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
            <circle cx="50%" cy="50%" r="260" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="8 4" />

            <line x1="50%" y1="50%" x2="20%" y2="28%" stroke="var(--primary, #10b981)" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.7" />
            <line x1="50%" y1="50%" x2="80%" y2="28%" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="var(--primary, #10b981)" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.7" />
          </svg>

          {/* Central Hub Node */}
          <div
            className="relative z-20 flex flex-col items-center justify-center cursor-pointer group"
            onClick={() =>
              setSelectedNode({
                name: "TGT Operational Audit Engine",
                scope: "Audit Core & Governance Oversight",
                status: "100% Synced",
                detail: "Comprehensive milestone tracking, board reporting, and IP protection core.",
              })
            }
          >
            <div className="w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center p-2 backdrop-blur-md transition group-hover:scale-105 group-hover:border-primary">
              <div className="w-24 h-24 rounded-full bg-card border border-primary/30 flex flex-col items-center justify-center p-2 text-center shadow-lg">
                <Cpu className="text-primary text-xl mb-1" size={24} />
                <span className="text-[10px] font-mono font-bold text-foreground leading-tight">TGT AUDIT</span>
                <span className="text-[8px] font-mono text-primary font-bold">ENGINE HUB</span>
              </div>
            </div>
          </div>

          {/* Node 1: Founders & Board Governance */}
          <div
            className="absolute top-[16%] left-[8%] sm:left-[12%] z-20 cursor-pointer group"
            onClick={() =>
              setSelectedNode({
                name: "Founders & Board Governance",
                scope: "Salman Alim Khan & Executive Board",
                status: "Board Minutes Synced",
                detail: "Quarterly progress reports and legal minute-keeping framework.",
              })
            }
          >
            <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-primary/40 font-mono text-xs shadow-xl transition group-hover:border-primary group-hover:-translate-y-1">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <Building2 size={14} /> Founders & Board
              </div>
              <div className="text-[10px] text-muted-foreground">Quarterly Executive Audit</div>
            </div>
          </div>

          {/* Node 2: CIPO Trademark Dossier */}
          <div
            className="absolute top-[16%] right-[8%] sm:right-[12%] z-20 cursor-pointer group"
            onClick={() =>
              setSelectedNode({
                name: "CIPO Trademark Dossier",
                scope: "Intellectual Property Protection Package",
                status: "Compiled & Structured",
                detail: "Canadian Intellectual Property Office registration readiness.",
              })
            }
          >
            <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-cyan-400/50 font-mono text-xs shadow-xl transition group-hover:border-cyan-400 group-hover:-translate-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <ShieldCheck size={14} /> CIPO IP & Trademark
              </div>
              <div className="text-[10px] text-muted-foreground">Dossier Compilation</div>
            </div>
          </div>

          {/* Node 3: Technical Sprint Tracker */}
          <div
            className="absolute bottom-[16%] left-[8%] sm:left-[12%] z-20 cursor-pointer group"
            onClick={() =>
              setSelectedNode({
                name: "Technical Sprint Tracker",
                scope: "MVP Technical Roadmap Auditing",
                status: "66% Milestone Reached",
                detail: "Vendor engineering output aligned with agreed sprint contracts.",
              })
            }
          >
            <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-amber-400/50 font-mono text-xs shadow-xl transition group-hover:border-amber-400 group-hover:-translate-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <BarChart3 size={14} /> Technical Sprint Track
              </div>
              <div className="text-[10px] text-muted-foreground">66% MVP Completion</div>
            </div>
          </div>

          {/* Node 4: SaaS Data Architecture */}
          <div
            className="absolute bottom-[16%] right-[8%] sm:right-[12%] z-20 cursor-pointer group"
            onClick={() =>
              setSelectedNode({
                name: "SaaS Storage & Messaging Architecture",
                scope: "Enterprise Data Storage & Communication SOPs",
                status: "Complete SOP",
                detail: "Formalized specifications syncing technical vendors with platform vision.",
              })
            }
          >
            <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-primary/40 font-mono text-xs shadow-xl transition group-hover:border-primary group-hover:-translate-y-1">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <Database size={14} /> SaaS Data Architecture
              </div>
              <div className="text-[10px] text-muted-foreground">Data Storage & Messaging</div>
            </div>
          </div>

          {/* Live HUD Telemetry Card */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 p-4 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md font-mono text-xs z-30">
            <div className="flex justify-between items-center border-b border-border pb-2 mb-2">
              <span className="text-primary font-bold flex items-center gap-2">
                <Terminal size={14} /> GOVERNANCE HUD TELEMETRY
              </span>
              <span className="text-[10px] text-muted-foreground">CLICK NODE</span>
            </div>
            <div className="space-y-1 text-foreground/80">
              <div>&gt; Node: <span className="text-primary font-bold">{selectedNode.name}</span></div>
              <div>&gt; Scope: <span className="text-foreground">{selectedNode.scope}</span></div>
              <div>&gt; Metric: <span className="text-cyan-400 font-bold">{selectedNode.status}</span></div>
              <div>&gt; Detail: <span className="text-amber-400">{selectedNode.detail}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Cross-Industry Governance Scenario Matrix ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-mono text-primary tracking-widest uppercase font-bold">
              Governance & Audit Framework
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Cross-Industry Executive Governance Matrix
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Select an industry domain below to explore specialized milestone tracking, board reporting, and IP protection frameworks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/30 self-start font-bold shrink-0">
            Interactive Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-xl bg-secondary border border-border w-full">
          {(["saas", "fintech", "healthtech", "web3"] as const).map((key) => {
            const isActive = activeTab === key;
            const labels = {
              saas: "Enterprise SaaS & Governance (Orgpyur)",
              fintech: "FinTech Regulatory & IP Audit",
              healthtech: "HealthTech Clinical Governance",
              web3: "Web3 Protocol & IP Auditing",
            };
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3.5 py-2.5 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center sm:justify-start gap-2 cursor-pointer w-full ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <span className="truncate">{labels[key]}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> {domains[activeTab].title}
            </h4>
            <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
              {domains[activeTab].overview}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {domains[activeTab].cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="rounded-xl bg-secondary/60 border border-border/80 p-5 flex flex-col justify-between hover:border-primary/40 transition shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-border text-primary font-bold">
                        {c.tag}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-foreground mb-1.5">{c.title}</h5>
                    <p className="text-muted-foreground text-xs leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-border font-mono text-[10px] text-primary font-semibold flex justify-between">
                    <span>Governance Spec</span>
                    <span>Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Deliverables & Specifications Matrix Table ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="mb-6">
          <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">
            DELIVERABLES & SPECS
          </span>
          <h3 className="text-2xl font-bold text-foreground mt-1">
            Engagement Deliverables Summary (May 2025 – August 2025)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary text-primary">
                <th className="p-3.5 font-bold">CATEGORY</th>
                <th className="p-3.5 font-bold">DELIVERABLE / IMPLEMENTATION SPECIFICATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground/80">
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <Building2 size={14} className="text-primary" /> Client & Founder
                </td>
                <td className="p-3.5">Orgpyur Technologies Inc. (Salman Alim Khan)</td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <Layers size={14} className="text-primary" /> Engagement Type
                </td>
                <td className="p-3.5">Strategy & Business Consulting / Corporate Governance Audit</td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" /> Project Focus
                </td>
                <td className="p-3.5">MVP Governance & Quarterly Operational Audit</td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <BarChart3 size={14} className="text-primary" /> MVP Development Tracking
                </td>
                <td className="p-3.5 text-primary font-bold">
                  Technical roadmap auditing (successfully reached 66% completion milestone)
                </td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck size={14} className="text-primary" /> Intellectual Property
                </td>
                <td className="p-3.5">
                  CIPO (Canadian Intellectual Property Office) trademark application dossier compilation
                </td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <FileCheck2 size={14} className="text-primary" /> Corporate Governance
                </td>
                <td className="p-3.5">Board minutes documentation & formal governance reporting frameworks</td>
              </tr>
              <tr className="hover:bg-secondary/40 transition">
                <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                  <Database size={14} className="text-primary" /> Enterprise Architecture
                </td>
                <td className="p-3.5">SaaS data storage & messaging MVP roadmap formalization (orgpyur.com)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
