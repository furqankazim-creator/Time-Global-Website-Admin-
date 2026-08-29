import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect } from "react";
import { Shield, Lock, Globe, FileText, Mail, Info, Clock, ChevronRight, Banknote, Calendar, CheckCircle2, Scale, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroBackdrop } from "../components/HeroBackdrop";

const SECTIONS_DATA = [
  {
    id: "general",
    icon: Banknote,
    title: "1. General Refund Position",
    content: (
      <div className="space-y-4">
        <p>At Time Global, our services involve professional time, planning, development effort, technical resources, and custom execution. Because of this, payments are generally considered non-refundable.</p>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            All payments made to Time Global are generally non-refundable. However, clients may request a refund review under the specific conditions outlined below.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "window",
    icon: Calendar,
    title: "2. Refund Request Window",
    content: (
      <div className="space-y-4">
        <p>We provide a clear window for initiating a refund review to ensure timely resolution of concerns.</p>
        <div className="flex items-center gap-4 bg-secondary/10 p-6 rounded-2xl border border-border/30">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Clock size={24} />
          </div>
          <p className="text-sm text-muted-foreground">
            A client may submit a refund request within <span className="text-foreground font-bold underline decoration-primary/30">3 calendar days</span> from the payment date. Requests submitted after this window may not be considered.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "eligibility",
    icon: CheckCircle2,
    title: "3. Eligibility for Refund Review",
    content: (
      <div className="space-y-6">
        <p>A refund request may only be considered if the client demonstrates that:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Services materially failed to match scope",
            "Failed to provide contracted service",
            "Delivery obligations not fulfilled",
            "Significant unresolved service issues"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-border/30 text-sm text-muted-foreground">
              <Shield size={16} className="text-primary shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <div className="pt-4">
          <h4 className="text-foreground font-bold mb-3">Required Evidence:</h4>
          <div className="flex flex-wrap gap-2">
            {["Written agreements", "Project documentation", "Communication records", "Technical evidence", "Milestone records"].map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
      id: "process",
      icon: Scale,
      title: "4. Independent Review Process",
      content: (
        <div className="space-y-4">
          <p>Refund requests are not automatically approved. If a request is submitted:</p>
          <ul className="space-y-3">
            {[
              "Time Global will review all submitted evidence",
              "Additional information may be requested from the client",
              "Matter may be evaluated with subject matter experts",
              "Professional advisors may be consulted for independent review"
            ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <ChevronRight size={16} className="text-primary mt-0.5 shrink-0" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "outcomes",
    icon: Info,
    title: "5. Approved Refund Outcomes",
    content: (
      <div className="space-y-4">
        <p>If a review determines a material failure, we may offer:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Full Refund", desc: "Complete return of funds" },
            { label: "Partial Refund", desc: "For work already completed" },
            { label: "Remediation", desc: "Corrections or replacements" }
          ].map((outcome, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border text-center">
              <div className="text-primary font-bold mb-1">{outcome.label}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{outcome.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "non-refundable",
    icon: AlertCircle,
    title: "6. Non-Refundable Situations",
    content: (
      <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
        <p className="text-sm text-muted-foreground mb-4 font-bold">Refunds generally will not apply where:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <li>• Work has already been delivered or approved</li>
          <li>• Client changes requirements after approval</li>
          <li>• Delays result from missing client inputs</li>
          <li>• Third-party platforms affect outcomes</li>
          <li>• Client stops communication during execution</li>
        </ul>
      </div>
    )
  }
];

export default function RefundPolicy() {
  usePageMeta({ title: "Refund Policy", description: "Time Global's refund terms for services." });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 bg-secondary overflow-hidden border-b border-border/50">
          <HeroBackdrop />
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold mb-8"
            >
              <Banknote size={14} />
              TRANSACTION CLARITY
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter"
            >
              Refund <span className="text-primary italic">Policy</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 text-muted-foreground"
            >
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-xl border border-border/50">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-medium">Last Updated: June 2024</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-24 px-6 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-40 space-y-4">
                  <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      Policy Sections
                    </h3>
                    <nav className="space-y-1">
                      {SECTIONS_DATA.map((s) => (
                        <a 
                          key={s.id} 
                          href={`#${s.id}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all group"
                        >
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">{s.title.split('.')[1].trim()}</span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-card border border-border/50 shadow-sm leading-relaxed text-muted-foreground"
                >
                  <p className="text-xl">
                    This Refund Policy explains the limited circumstances under which a refund request may be reviewed for services provided by <span className="text-foreground font-bold underline decoration-primary/30">Time Global</span>.
                  </p>
                </motion.div>

                {SECTIONS_DATA.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-10 rounded-3xl bg-card border border-border/50 shadow-sm group hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <section.icon size={24} />
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </div>
                  </motion.div>
                ))}

                {/* Contact Footer */}
                <motion.div
                  id="contact"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-primary/20"
                >
                  <h2 className="text-3xl font-bold mb-4">Request a Review</h2>
                  <p className="text-muted-foreground mb-6">To initiate a refund review, please contact us with your project name, payment date, and supporting evidence.</p>
                  <div className="bg-card/50 p-6 rounded-2xl border border-border mb-8">
                    <div className="flex items-center gap-3 text-foreground font-bold mb-2">
                      <Mail size={18} className="text-primary" />
                      info@timeglobaltech.com
                    </div>
                    <p className="text-xs text-muted-foreground">Please include "Refund Review Request" in your subject line for faster processing.</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic text-center">Decision outcomes are based on documented project records and service obligations.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
