import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useContactModal } from "@/hooks/use-contact-modal";
import {
  X,
  Loader2,
  Send,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  User,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const RATE_LIMIT_KEY = "tg_last_submit";
const RATE_LIMIT_MS = 60_000;
const MIN_FILL_MS = 3_000;

/**
 * Submissions go to our own API, which stores the inquiry in MongoDB and
 * surfaces it in the admin "Contact Submissions" inbox — it also fires an
 * in-app notification and (if SMTP is configured) an email alert.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const LEADS_ENDPOINT = `${API_BASE}/api/v1/public/leads`;

function readLastSubmit(): number {
  try {
    return Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
  } catch {
    return 0;
  }
}

function markSubmitted(): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch {
    /* storage blocked */
  }
}

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000–$5,000",
  "$5,000–$10,000",
  "$10,000+",
] as const;

const CONTACT_METHOD_OPTIONS = ["Email", "Phone", "WhatsApp", "SMS"] as const;

const INDUSTRY_OPTIONS = [
  "Software / SaaS",
  "E-commerce & Retail",
  "Healthcare & Life Sciences",
  "Finance & Fintech",
  "Manufacturing & IoT",
  "Education & EdTech",
  "Real Estate & PropTech",
  "Logistics & Supply Chain",
  "Government & Public Sector",
  "Other",
] as const;

const TOPIC_OPTIONS = [
  "Custom Software / Web App",
  "AI & Automation Engineering",
  "Cloud & DevOps Architecture",
  "Mobile App (iOS / Android)",
  "Enterprise System Modernization",
  "General Partnership Enquiry",
] as const;

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  topic: "",
  industry: "",
  budgetRange: "",
  preferredContact: "Email",
  message: "",
};

const STATS = [
  { stat: "200+", label: "Projects Shipped", sub: "Global enterprise scale" },
  { stat: "16+", label: "Countries Served", sub: "Across 4 continents" },
  { stat: "98%", label: "Client Retention", sub: "Long-term engineering" },
  { stat: "13+", label: "Years in Market", sub: "Founded in 2013" },
] as const;

const WHY_US = [
  {
    title: "Senior Engineering Squads",
    desc: "Top 3% full-stack and AI engineers who move fast without breaking architecture.",
  },
  {
    title: "Transparent & Agile",
    desc: "Direct daily communication, weekly sprint demos, and zero technical debt.",
  },
  {
    title: "Rapid Time-to-Market",
    desc: "From concept to production launch in weeks, tailored to business ROI.",
  },
] as const;

// Luxury dark glass input styling
const FIELD_CLS =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white shadow-inner outline-none transition-all duration-200 placeholder:text-white/30 hover:border-white/20 hover:bg-white/[0.06] focus:border-primary focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/25 focus:shadow-[0_0_25px_rgba(16,185,129,0.15)]";

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [spamBlocked, setSpamBlocked] = useState(false);
  const [consent, setConsent] = useState(false);
  const openedAt = useRef<number>(0);

  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [showDetails, setShowDetails] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) openedAt.current = Date.now();
  }, [isOpen]);

  // Desktop mouse scrubbing
  useEffect(() => {
    if (!isOpen) return;
    if (window.innerWidth < 1024) return;
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let pendingSeek = false;
    let rafId = 0;

    const applySeek = () => {
      rafId = 0;
      if (video.readyState < 2 || !video.duration || isNaN(video.duration)) return;
      try {
        video.currentTime = targetTime;
      } catch {}
      pendingSeek = false;
    };

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (video.readyState < 2 || !video.duration || isNaN(video.duration)) return;
      if ((e.target as HTMLElement)?.closest?.("form, input, select, textarea, button")) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
      if (!pendingSeek) {
        pendingSeek = true;
        rafId = requestAnimationFrame(applySeek);
      }
    };

    video.pause();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isOpen, isVideoLoaded]);

  // Mobile autoplay
  useEffect(() => {
    if (!isOpen) return;
    const video = videoRef.current;
    if (!video) return;
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.loop = true;
      void video.play().catch(() => {});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setSpamBlocked(false);

    const data = new FormData(e.currentTarget);
    if (data.get("_gotcha")) return;
    if (Date.now() - openedAt.current < MIN_FILL_MS) {
      setSpamBlocked(true);
      return;
    }
    const lastSubmit = readLastSubmit();
    if (Date.now() - lastSubmit < RATE_LIMIT_MS) {
      setSpamBlocked(true);
      return;
    }

    const clientName = `${formData.firstName} ${formData.lastName}`.trim();

    setIsLoading(true);
    try {
      const response = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: clientName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          industry: formData.industry,
          budgetRange: formData.budgetRange,
          preferredContact: formData.preferredContact || "Email",
          topic: formData.topic,
          message: formData.message,
          sourcePage: window.location.pathname,
          consent: consent,
          website: String(data.get("_gotcha") ?? ""),
        }),
      });

      if (response.ok) {
        markSubmitted();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ ...EMPTY_FORM });
          setConsent(false);
          setShowDetails(false);
          closeModal();
        }, 3500);
        return;
      }

      const body = await response.json().catch(() => null);
      setErrorMsg(body?.error?.message ?? null);
      setIsError(true);
    } catch {
      setErrorMsg(null);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const chevron = (
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/70 transition-transform duration-200"
    />
  );

  const optionalBadge = (
    <span className="font-sans text-[10px] font-normal normal-case tracking-normal text-white/35">
      optional
    </span>
  );

  const hasExtraDetails = Boolean(
    formData.company || formData.industry || formData.topic || formData.budgetRange
  );

  // Left Column Content: Trust, Stats & Direct Reach
  const trustSection = (
    <div className="flex flex-col gap-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        {STATS.map(({ stat, label, sub }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
          >
            <div className="font-mono text-2xl font-black tracking-tight text-primary transition-transform duration-300 group-hover:scale-105">
              {stat}
            </div>
            <div className="mt-1 font-display text-xs font-bold text-white">
              {label}
            </div>
            <div className="mt-0.5 text-[11px] font-normal text-white/50">
              {sub}
            </div>
            <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Why Teams Choose Time Global */}
      <div className="space-y-3.5">
        <h3 className="font-display text-sm font-bold tracking-wider uppercase text-white/90 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" /> Why Leaders Choose Time Global
        </h3>
        <div className="space-y-3">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition-all hover:border-white/15"
            >
              <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary">
                <Check size={13} strokeWidth={3} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[12px] leading-relaxed text-white/65">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary font-mono uppercase tracking-wider mb-2.5">
          <Clock size={14} /> Response Time: &lt; 24 Hours
        </div>
        <p className="text-xs text-white/70 leading-relaxed mb-3">
          Need immediate consultation or non-disclosure agreement first? Reach out directly:
        </p>
        <div className="flex flex-wrap gap-2.5 text-xs">
          <a
            href="mailto:info@timeglobaltech.com"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-medium text-white transition hover:border-primary/50 hover:bg-primary/20 hover:text-primary"
          >
            <Mail size={13} /> info@timeglobaltech.com
          </a>
          <a
            href="tel:+923148455430"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-medium text-white transition hover:border-primary/50 hover:bg-primary/20 hover:text-primary"
          >
            <Phone size={13} /> +92 314 8455430
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Full-screen sliding drawer with premium styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ type: "spring", damping: 30, stiffness: 350, duration: 0.25 }}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain font-sans antialiased"
          >
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]" />
            </div>

            {/* Background interactive video overlay */}
            <video
              ref={videoRef}
              muted
              playsInline
              preload="none"
              onLoadedData={() => setIsVideoLoaded(true)}
              className={cn(
                "fixed inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-1000",
                isVideoLoaded ? "opacity-20 lg:opacity-25" : "opacity-0"
              )}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
            />
            <div className="fixed inset-0 bg-gradient-to-br from-black/95 via-zinc-950/90 to-black/95 pointer-events-none" />

            {/* Luxury Floating Close Button */}
            <button
              onClick={closeModal}
              data-testid="button-close-modal"
              aria-label="Close"
              className="fixed right-5 top-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-zinc-900/80 text-white/80 backdrop-blur-xl shadow-xl transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-primary hover:text-black sm:right-8 sm:top-8"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Content Container */}
            <div className="relative z-10 mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-8 sm:py-20">
              {isSuccess ? (
                /* Success Celebration State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-primary/40 bg-zinc-950/80 p-8 text-center backdrop-blur-2xl shadow-2xl shadow-primary/20"
                >
                  <div className="relative">
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 text-black shadow-lg shadow-primary/30">
                      <Check size={40} strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-25" />
                  </div>
                  <div className="space-y-2.5">
                    <h2 className="font-display text-3xl font-extrabold text-white">
                      Message Sent Successfully!
                    </h2>
                    <p className="text-sm leading-relaxed text-white/70">
                      Thank you for contacting <strong className="text-white">Time Global</strong>. Our solutions team will review your requirements and follow up within 24 hours.
                    </p>
                  </div>
                  <div className="w-full pt-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 3.5, ease: "linear" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Main 2-Column Split Layout */
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                  {/* LEFT COLUMN: Headings, Badge & Trust Architecture */}
                  <div className="flex flex-col gap-8 lg:sticky lg:top-20">
                    <div className="space-y-4">
                      {/* Eyebrow status pill */}
                      <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                          Let's Talk • Open For Projects
                        </span>
                      </div>

                      <h1 className="font-display text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]">
                        Let's build your <br />
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                          next breakthrough.
                        </span>
                      </h1>

                      <p className="max-w-md text-base leading-relaxed text-white/70 font-sans font-light">
                        Whether you need a full-scale AI platform, web & SaaS engineering, or high-performance cloud architecture, our senior team is ready to deliver.
                      </p>
                    </div>

                    {/* Trust Block (Desktop) */}
                    <div className="hidden lg:block">{trustSection}</div>
                  </div>

                  {/* RIGHT COLUMN: Luxury Form Card */}
                  <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.06)] backdrop-blur-2xl">
                    {/* Glowing Top Shimmer Line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

                    <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                      {/* Honeypot anti-spam field */}
                      <input
                        type="text"
                        name="_gotcha"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                      />

                      {/* Header bar within form card */}
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                            <Sparkles size={16} />
                          </div>
                          <div>
                            <h2 className="font-display text-base font-bold text-white">
                              Project Enquiry Form
                            </h2>
                            <p className="text-[11px] text-white/50 font-sans">
                              Fill the form below to get a detailed proposal & estimate
                            </p>
                          </div>
                        </div>
                        <span className="hidden sm:inline-block font-mono text-[11px] text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                          Fast Track
                        </span>
                      </div>

                      {/* Row 1: First Name & Last Name */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                            <User size={12} className="text-primary" /> First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Alex"
                            required
                            className={FIELD_CLS}
                          />
                        </div>
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                            <User size={12} className="text-primary" /> Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Morgan"
                            required
                            className={FIELD_CLS}
                          />
                        </div>
                      </div>

                      {/* Row 2: Email & Phone */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                            <Mail size={12} className="text-primary" /> Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="alex@company.com"
                            required
                            className={FIELD_CLS}
                          />
                        </div>
                        <div>
                          <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} className="text-primary" /> Phone
                            </span>
                            {optionalBadge}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 234-5678"
                            className={FIELD_CLS}
                          />
                        </div>
                      </div>

                      {/* Accordion Toggle: Project & Company Details */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowDetails((prev) => !prev)}
                          data-testid="button-toggle-details"
                          className={cn(
                            "group relative flex w-full items-center justify-between overflow-hidden rounded-xl border p-3.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40",
                            showDetails
                              ? "border-primary/50 bg-primary/[0.08] text-primary shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                              : "border-white/10 bg-white/[0.03] text-white/85 hover:border-primary/40 hover:bg-white/[0.06] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "grid h-6 w-6 place-items-center rounded-lg border text-[11px] font-bold transition-all duration-300",
                                showDetails
                                  ? "border-primary/60 bg-primary text-black shadow-sm shadow-primary/40"
                                  : "border-white/20 bg-white/10 text-white group-hover:border-primary/50 group-hover:text-primary"
                              )}
                            >
                              <SlidersHorizontal size={12} />
                            </div>
                            <div className="text-left">
                              <span className="font-display font-bold tracking-wide">
                                {showDetails
                                  ? "Hide Company & Budget Details"
                                  : "Add Company, Topic & Budget Details"}
                              </span>
                              {!showDetails && (
                                <span className="ml-2 font-mono text-[10px] text-white/40">
                                  (Optional)
                                </span>
                              )}
                            </div>
                            {hasExtraDetails && !showDetails && (
                              <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                                Configured
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            size={16}
                            className={cn(
                              "transition-transform duration-300",
                              showDetails
                                ? "rotate-180 text-primary"
                                : "text-white/50 group-hover:text-white"
                            )}
                          />
                        </button>
                      </div>

                      {/* Expandable Project Details Box */}
                      <div
                        className={cn(
                          "grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          showDetails
                            ? "grid-rows-[1fr] opacity-100 mt-1 mb-2"
                            : "grid-rows-[0fr] opacity-0 pointer-events-none"
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
                            {/* Company & Industry */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                                  <span className="flex items-center gap-1.5">
                                    <Building2 size={12} className="text-primary" /> Company
                                  </span>
                                  {optionalBadge}
                                </label>
                                <input
                                  type="text"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleChange}
                                  placeholder="Acme Global Inc"
                                  className={FIELD_CLS}
                                />
                              </div>

                              <div>
                                <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                                  <span>Industry</span>
                                  {optionalBadge}
                                </label>
                                <div className="relative">
                                  <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className={cn(
                                      FIELD_CLS,
                                      "cursor-pointer appearance-none pr-10 [&>option]:bg-zinc-900 [&>option]:text-white"
                                    )}
                                  >
                                    <option value="">Select industry…</option>
                                    {INDUSTRY_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>
                            </div>

                            {/* Project Topic */}
                            <div>
                              <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                                <span>Project Focus</span>
                                {optionalBadge}
                              </label>
                              <div className="relative">
                                <select
                                  name="topic"
                                  value={formData.topic}
                                  onChange={handleChange}
                                  className={cn(
                                    FIELD_CLS,
                                    "cursor-pointer appearance-none pr-10 [&>option]:bg-zinc-900 [&>option]:text-white"
                                  )}
                                >
                                  <option value="">Select primary scope…</option>
                                  {TOPIC_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                {chevron}
                              </div>
                            </div>

                            {/* Budget & Preferred Contact Method */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                                  <span>Estimated Budget</span>
                                  {optionalBadge}
                                </label>
                                <div className="relative">
                                  <select
                                    name="budgetRange"
                                    value={formData.budgetRange}
                                    onChange={handleChange}
                                    className={cn(
                                      FIELD_CLS,
                                      "cursor-pointer appearance-none pr-10 [&>option]:bg-zinc-900 [&>option]:text-white"
                                    )}
                                  >
                                    <option value="">Not specified</option>
                                    {BUDGET_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>

                              <div>
                                <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                                  <span>Preferred Contact</span>
                                </label>
                                <div className="relative">
                                  <select
                                    name="preferredContact"
                                    value={formData.preferredContact}
                                    onChange={handleChange}
                                    className={cn(
                                      FIELD_CLS,
                                      "cursor-pointer appearance-none pr-10 [&>option]:bg-zinc-900 [&>option]:text-white"
                                    )}
                                  >
                                    {CONTACT_METHOD_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare size={12} className="text-primary" /> Your Message
                          </span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          required
                          placeholder="Tell us about your project goals, timelines, and technical challenges…"
                          className={cn(FIELD_CLS, "resize-none leading-relaxed")}
                        />
                      </div>

                      {/* GDPR Consent Checkbox */}
                      <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.04]">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary focus:ring-primary"
                        />
                        <span className="text-xs leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">
                          I agree that <strong className="text-white">Time Global</strong> may store and process my details in order to respond to this inquiry.
                        </span>
                      </label>

                      {/* Alerts */}
                      {isError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-xs text-red-300 font-medium"
                        >
                          {errorMsg ?? (
                            <>
                              Unable to submit right now. Please email us directly at{" "}
                              <a href="mailto:info@timeglobaltech.com" className="font-bold underline text-white">
                                info@timeglobaltech.com
                              </a>
                            </>
                          )}
                        </motion.p>
                      )}

                      {spamBlocked && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-300 font-medium"
                        >
                          Please wait a moment before sending another message.
                        </motion.p>
                      )}

                      {/* Premium Shimmer Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        data-testid="button-submit-contact"
                        className="group/btn relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-primary via-emerald-400 to-teal-400 px-6 py-4 font-display text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {/* Shimmer light sweep */}
                        <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/30 transition-transform duration-700 ease-out group-hover/btn:translate-x-[350%]" />

                        {isLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin text-black" />
                            <span>Transmitting Enquiry…</span>
                          </>
                        ) : (
                          <>
                            <span className="relative z-10">Send Message</span>
                            <ArrowRight
                              size={16}
                              strokeWidth={2.5}
                              className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                            />
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Trust — Mobile view below the form */}
                  <div className="lg:hidden mt-4">{trustSection}</div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}