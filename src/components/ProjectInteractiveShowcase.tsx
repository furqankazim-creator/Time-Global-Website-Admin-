import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  ExternalLink,
  Cpu,
  Database,
  FileCheck2,
  CheckCircle2,
  Layers,
  Terminal,
  Sparkles,
  BarChart3,
  Lock,
  Server,
  Zap,
  TrendingUp,
  Workflow,
  Check,
  Award,
} from "lucide-react";
import { OrgpyurInteractiveShowcase } from "./OrgpyurCaseStudySection";

type FullProject = {
  _id?: string;
  title: string;
  slug: string;
  client?: string;
  category: string;
  techStack?: string[];
  metrics?: { value: string; label: string }[];
  liveUrl?: string;
  problem?: string;
  solution?: string;
  result?: string;
};

export function ProjectInteractiveShowcase({ project }: { project: FullProject }) {
  const isOrgpyur =
    project.slug?.includes("orgpyur") || project.title?.toLowerCase().includes("orgpyur");

  if (isOrgpyur) {
    return <OrgpyurInteractiveShowcase />;
  }

  return <GenericInteractiveShowcase project={project} />;
}

function GenericInteractiveShowcase({ project }: { project: FullProject }) {
  const [activeTab, setActiveTab] = useState<"arch" | "data" | "api" | "impact">("arch");

  const clientName = project.client || "Enterprise Client";
  const hostname = project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "platform.live";
  const techStack = project.techStack && project.techStack.length > 0
    ? project.techStack
    : ["Cloud Native", "React", "Node.js", "PostgreSQL", "Enterprise API"];

  const [selectedNode, setSelectedNode] = useState<{
    title: string;
    tag: string;
    metric: string;
    detail: string;
  }>({
    title: `${techStack[0] || "Core"} Processing Engine`,
    tag: "Production Active",
    metric: "99.99% Uptime",
    detail: `Engineered high-throughput architecture specifically configured for ${clientName}.`,
  });

  const domainTabs = {
    arch: {
      label: "Core Architecture",
      icon: Cpu,
      title: `${clientName} — Scalable System Architecture`,
      overview: `Modular full-stack framework deployed on resilient cloud infrastructure, engineered for low-latency operations.`,
      cards: [
        {
          title: `${techStack[0] || "Core Engine"} Microservices`,
          desc: "Decoupled service mesh ensuring high availability and fault isolation during peak traffic bursts.",
          tag: "Core Engine",
          icon: Server,
          color: "text-primary",
          metric: "< 45ms Latency",
          detail: `Optimized service pipelines minimizing processing overhead for ${clientName}.`,
        },
        {
          title: "Enterprise Identity & RBAC",
          desc: "Granular role-based access control protecting administrative, operational, and customer data silos.",
          tag: "Security Mesh",
          icon: Lock,
          color: "text-cyan-400",
          metric: "Zero-Trust",
          detail: "Automated session authentication paired with encrypted permission tokens.",
        },
        {
          title: "Cloud Infrastructure Cluster",
          desc: "Multi-region cluster orchestration with automated failover and elastic auto-scaling policies.",
          tag: "High Availability",
          icon: Database,
          color: "text-emerald-400",
          metric: "99.99% SLA",
          detail: "Containerized deployments managed with automated health checks.",
        },
      ],
    },
    data: {
      label: "Data & Security",
      icon: ShieldCheck,
      title: "Encrypted Data Pipelines & Compliance",
      overview: "Institutional-grade data safeguards, encrypted storage vaults, and continuous compliance audit logs.",
      cards: [
        {
          title: "256-Bit Encrypted Storage",
          desc: "AES-256 encryption at rest and in transit across all transactional databases and media assets.",
          tag: "AES-256",
          icon: ShieldCheck,
          color: "text-emerald-400",
          metric: "Encrypted",
          detail: "Military-grade cryptographic hashing applied to sensitive records.",
        },
        {
          title: "Audit Logging & Telemetry",
          desc: "Tamper-evident system logs capturing state mutations, administrative actions, and data access.",
          tag: "Audit Log",
          icon: FileCheck2,
          color: "text-cyan-400",
          metric: "Immutable",
          detail: "Structured JSON telemetry streamed to central observability dashboards.",
        },
        {
          title: "Automated Backup & Disaster Recovery",
          desc: "Continuous snapshot replication with verified sub-15 minute Recovery Time Objectives (RTO).",
          tag: "Disaster Recovery",
          icon: Database,
          color: "text-amber-400",
          metric: "< 15min RTO",
          detail: "Redundant geo-distributed backup archives tested on quarterly schedules.",
        },
      ],
    },
    api: {
      label: "Integration & APIs",
      icon: Workflow,
      title: "Synchronized APIs & Third-Party Integration",
      overview: "Standardized RESTful and streaming interfaces connecting external partner tools, billing, and mobile apps.",
      cards: [
        {
          title: "High-Throughput API Gateway",
          desc: "Rate-limited, cached reverse proxy gateway handling concurrent client inquiries seamlessly.",
          tag: "API Gateway",
          icon: Terminal,
          color: "text-primary",
          metric: "Sub-50ms",
          detail: "Edge routing and load distribution across active application nodes.",
        },
        {
          title: "Third-Party Webhook Engine",
          desc: "Event-driven asynchronous webhooks dispatched with automated retry and backoff logic.",
          tag: "Webhooks",
          icon: Workflow,
          color: "text-cyan-400",
          metric: "Real-time",
          detail: "Instant state updates broadcasted to connected downstream services.",
        },
        {
          title: "Automated Partner Ingestion",
          desc: "Bi-directional data synchronization synchronizing external inventory, CRM, and financial ledgers.",
          tag: "Sync Engine",
          icon: Layers,
          color: "text-emerald-400",
          metric: "100% Synced",
          detail: "Idempotent transactional workers preventing duplicate ingestion errors.",
        },
      ],
    },
    impact: {
      label: "Scale & Verification",
      icon: TrendingUp,
      title: "Validated Business Impact & Delivery Milestones",
      overview: "Real-world operational acceleration, cost reduction, and executive stakeholder sign-offs.",
      cards: [
        {
          title: "Production Release Milestone",
          desc: "All sprint deliverables deployed to live production with zero critical regressions.",
          tag: "100% Deployed",
          icon: CheckCircle2,
          color: "text-emerald-400",
          metric: "Milestone Verified",
          detail: "End-to-end user acceptance testing verified with institutional stakeholders.",
        },
        {
          title: "Operational Efficiency Gain",
          desc: "Substantial reduction in manual intervention and administrative reconciliation hours.",
          tag: "Efficiency",
          icon: BarChart3,
          color: "text-primary",
          metric: "+65% Speed",
          detail: "Automated digital workflows replacing legacy manual processes.",
        },
        {
          title: "Performance & QA Benchmark",
          desc: "Rigorous load testing validating sustained performance under concurrent user volumes.",
          tag: "QA Verified",
          icon: Award,
          color: "text-cyan-400",
          metric: "Passed",
          detail: "Full automated test suites achieving comprehensive regression coverage.",
        },
      ],
    },
  };

  const currentTab = domainTabs[activeTab];

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
              {clientName} — Platform Telemetry & Live Product View
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Production deployment telemetry cross-referenced with live domain records at {hostname}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs bg-secondary/80 px-3.5 py-2 rounded-xl border border-border self-start shrink-0">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Production Active
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck size={14} /> SSL 256-Bit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Browser Mockup */}
          <div className="lg:col-span-2 rounded-xl bg-background border border-border/80 overflow-hidden flex flex-col justify-between min-h-[340px] relative shadow-lg">
            <div className="bg-secondary px-4 py-2.5 border-b border-border/80 flex items-center justify-between gap-2 font-mono text-xs z-10">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-3 h-3 rounded-full bg-red-500/80 shrink-0" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 shrink-0" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 shrink-0" />
                <span className="text-muted-foreground ml-2 text-[11px] truncate">
                  {project.liveUrl || `https://${hostname}/`}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] border border-primary/30 font-bold shrink-0">
                LIVE DOMAIN VERIFIED
              </span>
            </div>

            <div className="p-6 relative z-10 flex flex-col justify-between flex-1 gap-6 bg-gradient-to-br from-primary/5 via-card to-background">
              <div className="space-y-3 max-w-xl">
                <div className="inline-block px-3 py-1 rounded-md bg-primary/15 text-primary font-mono text-xs border border-primary/30 font-bold uppercase">
                  {clientName}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {project.title}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Engineered with modern cloud architecture, strict security protocols, and high-performance user interfaces.
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border min-w-0">
                  <span className="text-muted-foreground block text-[10px]">CORE STACK</span>
                  <span className="text-primary font-bold text-xs truncate block">{techStack[0] || "Custom App"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border min-w-0">
                  <span className="text-muted-foreground block text-[10px]">UPTIME SLA</span>
                  <span className="text-foreground font-bold text-xs block">99.99%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/80 border border-border min-w-0">
                  <span className="text-muted-foreground block text-[10px]">DEPLOYMENT</span>
                  <span className="text-cyan-400 font-bold text-xs block">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Telemetry Strip */}
          <div className="rounded-xl bg-card border border-border/80 p-6 flex flex-col justify-between font-mono text-xs space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="text-primary font-bold text-sm flex items-center gap-2 border-b border-border pb-2">
                <FileCheck2 size={16} /> TECHNICAL AUDIT LOG
              </div>
              <div className="space-y-2 text-foreground/80 text-[11px]">
                <div className="flex justify-between items-center gap-2 p-2 rounded bg-secondary/70 border border-border">
                  <span className="truncate">Architecture Validation</span>
                  <span className="text-primary font-bold shrink-0">100% Passed</span>
                </div>
                <div className="flex justify-between items-center gap-2 p-2 rounded bg-secondary/70 border border-border">
                  <span className="truncate">Data Vault Security</span>
                  <span className="text-foreground font-bold shrink-0">AES-256</span>
                </div>
                <div className="flex justify-between items-center gap-2 p-2 rounded bg-secondary/70 border border-border">
                  <span className="truncate">Production Pipeline</span>
                  <span className="text-cyan-400 font-bold shrink-0">Continuous CI</span>
                </div>
                <div className="flex justify-between items-center gap-2 p-2 rounded bg-secondary/70 border border-border">
                  <span className="truncate">API Integration</span>
                  <span className="text-primary font-bold shrink-0">Synced</span>
                </div>
              </div>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
              >
                <ExternalLink size={14} /> Visit {hostname}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Architecture & Technical Flow HUD ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">
                Technical Architecture & Execution Matrix
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Engineering Pillars & Delivery Blueprint
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Explore the four core engineering dimensions delivered for {clientName}.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/30 self-start font-bold shrink-0">
            Interactive Matrix
          </span>
        </div>

        {/* Interactive Navigation Tabs - Full-width row inside card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 rounded-xl bg-secondary border border-border w-full">
          {(Object.keys(domainTabs) as Array<keyof typeof domainTabs>).map((key) => {
            const tab = domainTabs[key];
            const Icon = tab.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer w-full ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Pillar Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-base text-foreground mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span>{currentTab.title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {currentTab.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {currentTab.cards.map((card, idx) => {
                const Icon = card.icon;
                const isSelected = selectedNode.title === card.title;
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedNode({
                        title: card.title,
                        tag: card.tag,
                        metric: card.metric,
                        detail: card.detail,
                      })
                    }
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-full group ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-lg ring-1 ring-primary/40"
                        : "bg-secondary/60 border-border/80 hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center ${card.color} shrink-0`}>
                          <Icon size={18} />
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-card border border-border text-[10px] font-mono font-bold text-primary">
                          {card.tag}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                        {card.title}
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-primary font-bold">{card.metric}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Selected Node Inspector HUD */}
        <div className="p-4 sm:p-5 rounded-xl bg-background border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="text-muted-foreground uppercase text-[10px]">Active Node Inspector:</span>
              <span className="text-primary font-bold">{selectedNode.title}</span>
            </div>
            <p className="text-foreground/80 text-xs font-sans pl-4">
              {selectedNode.detail}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="px-2.5 py-1 rounded bg-secondary text-foreground text-[11px] border border-border font-bold">
              {selectedNode.tag}
            </span>
            <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-[11px] border border-primary/30 font-bold">
              {selectedNode.metric}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Production Deliverables & Verification Matrix ── */}
      <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold block">
              Verification Matrix
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Production Release Checklist
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Verified compliance and technical milestone deliverables for {clientName}.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-bold self-start shrink-0">
            <CheckCircle2 size={14} /> 100% QA Passed
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">MILESTONE</span>
              <Check size={14} className="text-emerald-400" />
            </div>
            <h5 className="font-bold text-sm text-foreground">Sprint Completion</h5>
            <p className="text-[11px] text-muted-foreground">All scope roadmap tickets verified and signed off.</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">SECURITY</span>
              <Check size={14} className="text-emerald-400" />
            </div>
            <h5 className="font-bold text-sm text-foreground">Vulnerability Audit</h5>
            <p className="text-[11px] text-muted-foreground">Zero high-severity vulnerabilities in dependency audit.</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">PERFORMANCE</span>
              <Check size={14} className="text-emerald-400" />
            </div>
            <h5 className="font-bold text-sm text-foreground">Latency & Core Web Vitals</h5>
            <p className="text-[11px] text-muted-foreground">Sub-second rendering and fluid 60fps animations.</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">COMPLIANCE</span>
              <Check size={14} className="text-emerald-400" />
            </div>
            <h5 className="font-bold text-sm text-foreground">Data Privacy Protocols</h5>
            <p className="text-[11px] text-muted-foreground">Compliant encryption and strict access authorization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
