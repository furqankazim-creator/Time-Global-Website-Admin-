import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useContactModal } from "@/hooks/use-contact-modal";
import { X, Loader2, Send, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const RATE_LIMIT_KEY = "tg_last_submit";
const RATE_LIMIT_MS = 60_000;
const MIN_FILL_MS = 3_000;

/**
 * Submissions go to our own API, which stores the inquiry in MongoDB and
 * surfaces it in the admin "Contact Submissions" inbox — it also fires an
 * in-app notification and (if SMTP is configured) an email alert. The server
 * enforces the real controls — rate limiting, honeypot and consent — since
 * the checks below run on the client and an attacker simply skips them.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const LEADS_ENDPOINT = `${API_BASE}/api/v1/public/leads`;

// localStorage throws in some privacy modes (Safari private windows, hardened
// browsers). A submission that already went through must not be reported as a
// failure just because we couldn't write a rate-limit timestamp.
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
    /* storage blocked — the 3s fill-time check still guards against rapid resubmits */
  }
}

// Budget bands. "" (nothing picked) is fine — a first-contact form shouldn't
// force a number. Note the en dash (–) in the ranges, not a hyphen.
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
  "Healthcare",
  "Manufacturing",
  "Finance & Fintech",
  "Education",
  "Real Estate",
  "Logistics & Supply Chain",
  "Government & Public Sector",
  "Other",
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

const TOPIC_OPTIONS = [
  "General enquiry",
  "Project collaboration",
  "Press & media",
  "Careers",
] as const;

const STATS = [
  { stat: "200+", label: "Projects delivered" },
  { stat: "40+", label: "Global clients" },
  { stat: "98%", label: "Client retention" },
  { stat: "12+", label: "Years delivering" },
] as const;

const WHY_US = [
  "Expert team with 12+ years of experience",
  "Dedicated support, every time zone",
  "Solutions that scale with you",
  "A proven delivery track record",
] as const;

// Shared field styling — solid light input, dark text, clear focus ring.
const FIELD_CLS =
  "w-full rounded-lg border border-white/15 bg-white/95 px-3.5 py-2.5 text-[15px] font-medium text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25";
const LABEL_CLS =
  "mb-1.5 flex items-center text-[11px] font-bold uppercase tracking-[0.13em] text-primary/90";

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [spamBlocked, setSpamBlocked] = useState(false);
  // Required by the API: leads are personal data, so consent must be explicit
  // and recorded with a timestamp (GDPR).
  const [consent, setConsent] = useState(false);
  const openedAt = useRef<number>(0);

  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [showDetails, setShowDetails] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) openedAt.current = Date.now();
  }, [isOpen]);

  // Desktop mouse scrubbing.
  // Seeking a network video is not cheap — each `currentTime` write can cost a
  // range request + decode. Driving that straight off `mousemove` (which can
  // fire 100+ times/sec) queued far more seeks than the decoder could keep up
  // with, which is what made the whole modal feel slow. Batching to one
  // pending seek per animation frame, and waiting for the video to actually
  // be ready, fixes that without losing the scrub feel.
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
      try { video.currentTime = targetTime; } catch {}
      pendingSeek = false;
    };

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (video.readyState < 2 || !video.duration || isNaN(video.duration)) return;
      // Don't waste GPU video decoding when hovering or interacting with form controls
      if ((e.target as HTMLElement)?.closest?.("form, input, select, textarea, button")) return;
      if (prevX === null) { prevX = e.clientX; return; }
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
    if (Date.now() - openedAt.current < MIN_FILL_MS) { setSpamBlocked(true); return; }
    const lastSubmit = readLastSubmit();
    if (Date.now() - lastSubmit < RATE_LIMIT_MS) { setSpamBlocked(true); return; }

    const clientName = `${formData.firstName} ${formData.lastName}`.trim();

    setIsLoading(true);
    try {
      const response = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // The API stores one `name`; the form collects two fields.
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
          // Server-side honeypot. Mirrors the _gotcha field above.
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

      // Surface the server's own message (e.g. "Too many requests. Please try
      // again later.") rather than a generic failure. Fields are left intact
      // so nothing typed is lost.
      const body = await response.json().catch(() => null);
      setErrorMsg(body?.error?.message ?? null);
      setIsError(true);
    } catch {
      // Network failure — generic, non-throwing.
      setErrorMsg(null);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // solid white inputs — dark text, clearly readable
  const chevron = (
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
    />
  );

  const optional = (
    <span className="ml-1.5 font-normal normal-case tracking-normal text-white/35">optional</span>
  );

  const trust = (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-2.5 sm:max-w-sm">
        {STATS.map(({ stat, label }) => (
          <div
            key={label}
            className="rounded-xl border border-primary/20 bg-primary/[0.08] p-3.5 backdrop-blur-sm"
          >
            <div className="text-xl font-black text-primary">{stat}</div>
            <div className="mt-0.5 text-[11px] font-semibold leading-tight text-white/70">
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white">Why teams choose us</h3>
        <ul className="space-y-2">
          {WHY_US.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                <Check size={11} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Full-screen panel sliding in from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.22 }}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain font-sans antialiased"
          >
            {/* Fixed backdrop: video + dark wash. Stays put while content scrolls. */}
            <video
              ref={videoRef}
              muted
              playsInline
              preload="none"
              onLoadedData={() => setIsVideoLoaded(true)}
              className={cn(
                "fixed inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-700",
                isVideoLoaded ? "opacity-30 lg:opacity-40" : "opacity-0"
              )}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
            />
            <div className="fixed inset-0 bg-gradient-to-br from-black via-black/85 to-black/95 pointer-events-none" />

            {/* Close */}
            <button
              onClick={closeModal}
              data-testid="button-close-modal"
              aria-label="Close"
              className="fixed right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-black/40 text-primary backdrop-blur transition hover:bg-primary hover:text-black sm:right-6 sm:top-6"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20">

              {isSuccess ? (
                <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl border border-primary/40 bg-primary/15 text-4xl text-primary shadow-lg shadow-primary/10">
                    <Check size={36} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">Thank you!</h2>
                    <p className="text-white/65">
                      Your message has been received — we'll be in touch within one business day.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14">

                  {/* LEFT — intro + trust (trust hidden on mobile, shown after the form) */}
                  <div className="flex flex-col gap-9 lg:sticky lg:top-16">
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Let's connect
                      </p>
                      <h2 className="text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                        Get in Touch
                      </h2>
                      <p className="max-w-md text-sm leading-relaxed text-white/60">
                        Tell us about your project and the team that fits it best will get back
                        to you, usually within a business day.
                      </p>
                    </div>
                    <div className="hidden lg:block">{trust}</div>
                  </div>

                  {/* RIGHT — form card */}
                  <div className="w-full overflow-hidden rounded-2xl border border-white/12 bg-zinc-950/85 shadow-2xl shadow-black/50 backdrop-blur-md transform-gpu">
                    <div className="h-1 w-full bg-gradient-to-r from-primary via-emerald-400 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-7">
                      {/* Honeypot */}
                      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                      {/* Name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={LABEL_CLS}>First Name</label>
                          <input
                            type="text" name="firstName" value={formData.firstName}
                            onChange={handleChange} placeholder="John" required
                            className={FIELD_CLS}
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Last Name</label>
                          <input
                            type="text" name="lastName" value={formData.lastName}
                            onChange={handleChange} placeholder="Doe" required
                            className={FIELD_CLS}
                          />
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={LABEL_CLS}>Email Address</label>
                          <input
                            type="email" name="email" value={formData.email}
                            onChange={handleChange} placeholder="hello@example.com" required
                            className={FIELD_CLS}
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Phone {optional}</label>
                          <input
                            type="tel" name="phone" value={formData.phone}
                            onChange={handleChange} placeholder="+1 (555) 000-0000"
                            className={FIELD_CLS}
                          />
                        </div>
                      </div>

                      {/* Collapsible Project & Company Details Toggle */}
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setShowDetails((prev) => !prev)}
                          data-testid="button-toggle-details"
                          className={cn(
                            "group flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30",
                            showDetails
                              ? "border-primary/40 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                              : "border-white/10 bg-white/[0.04] text-white/80 hover:border-primary/30 hover:bg-white/[0.07] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "grid h-5 w-5 place-items-center rounded-md border text-[11px] font-bold transition-all",
                                showDetails
                                  ? "border-primary/50 bg-primary text-black"
                                  : "border-white/20 bg-white/10 text-white/90 group-hover:border-primary/50 group-hover:text-primary"
                              )}
                            >
                              <SlidersHorizontal size={11} />
                            </div>
                            <span className="tracking-wide">
                              {showDetails ? "Hide Project & Company Details" : "Add Project & Company Details"}
                            </span>
                            {!showDetails && (
                              <span className="text-[11px] font-normal text-white/40">(Optional)</span>
                            )}
                            {(formData.company || formData.industry || formData.topic || formData.budgetRange) && !showDetails && (
                              <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                                Details added
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            size={15}
                            className={cn(
                              "transition-transform duration-300",
                              showDetails ? "rotate-180 text-primary" : "text-white/50 group-hover:text-white"
                            )}
                          />
                        </button>
                      </div>

                      {/* Detailed Fields (Hardware-Accelerated Accordion) */}
                      <div
                        className={cn(
                          "grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          showDetails
                            ? "grid-rows-[1fr] opacity-100 my-1"
                            : "grid-rows-[0fr] opacity-0 pointer-events-none"
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="my-1 space-y-3 rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-sm">
                            {/* Company + Industry */}
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className={LABEL_CLS}>Company {optional}</label>
                                <input
                                  type="text"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleChange}
                                  placeholder="Acme Corp"
                                  className={FIELD_CLS}
                                />
                              </div>
                              <div>
                                <label className={LABEL_CLS}>Industry {optional}</label>
                                <div className="relative">
                                  <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className={cn(FIELD_CLS, "cursor-pointer appearance-none pr-10")}
                                  >
                                    <option value="">Select…</option>
                                    {INDUSTRY_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>
                            </div>

                            {/* Topic */}
                            <div>
                              <label className={LABEL_CLS}>Topic {optional}</label>
                              <div className="relative">
                                <select
                                  name="topic"
                                  value={formData.topic}
                                  onChange={handleChange}
                                  className={cn(FIELD_CLS, "cursor-pointer appearance-none pr-10")}
                                >
                                  <option value="">Select a topic…</option>
                                  {TOPIC_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                                {chevron}
                              </div>
                            </div>

                            {/* Budget + Preferred contact */}
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className={LABEL_CLS}>Budget {optional}</label>
                                <div className="relative">
                                  <select
                                    name="budgetRange"
                                    value={formData.budgetRange}
                                    onChange={handleChange}
                                    className={cn(FIELD_CLS, "cursor-pointer appearance-none pr-10")}
                                  >
                                    <option value="">Not specified</option>
                                    {BUDGET_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>
                              <div>
                                <label className={LABEL_CLS}>Preferred Contact</label>
                                <div className="relative">
                                  <select
                                    name="preferredContact"
                                    value={formData.preferredContact}
                                    onChange={handleChange}
                                    className={cn(FIELD_CLS, "cursor-pointer appearance-none pr-10")}
                                  >
                                    {CONTACT_METHOD_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  {chevron}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className={LABEL_CLS}>Your Message</label>
                        <textarea
                          name="message" value={formData.message}
                          onChange={handleChange} rows={4} required
                          placeholder="Tell us how we can help…"
                          className={cn(FIELD_CLS, "resize-none")}
                        />
                      </div>

                      {/* Consent — the API rejects a lead without it. */}
                      <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                        />
                        <span className="text-xs leading-relaxed text-white/55">
                          I agree that Time Global may store and process my details in order
                          to respond to this enquiry.
                        </span>
                      </label>

                      {isError && (
                        <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-300">
                          {errorMsg ?? (
                            <>
                              Something went wrong. Email us at{" "}
                              <a href="mailto:info@timeglobaltech.com" className="underline">
                                info@timeglobaltech.com
                              </a>
                              .
                            </>
                          )}
                        </p>
                      )}
                      {spamBlocked && (
                        <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-center text-sm text-amber-300">
                          Please wait a moment before submitting again.
                        </p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit" disabled={isLoading}
                        data-testid="button-submit-contact"
                        className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-primary to-emerald-500 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-black shadow-lg shadow-primary/25 transition hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <><Loader2 size={18} className="animate-spin" /> Sending…</>
                        ) : (
                          <><span>Send Message</span><Send size={16} /></>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Trust — mobile only, below the form */}
                  <div className="lg:hidden">{trust}</div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}