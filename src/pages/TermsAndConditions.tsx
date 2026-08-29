import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect } from "react";
import { Shield, Lock, Globe, FileText, Mail, Info, Clock, ChevronRight, Scale, Briefcase, CreditCard, RefreshCcw, Power, MessageSquare, AlertTriangle, UserCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroBackdrop } from "../components/HeroBackdrop";

export default function TermsAndConditions() {
  usePageMeta({ title: "Terms & Conditions", description: "The terms governing use of Time Global's website and services." });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "scope",
      icon: Briefcase,
      title: "1. Scope of Services",
      content: (
        <div className="space-y-4">
          <p>Time Global provides digital services that may include:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Custom software development",
              "Web application development",
              "AI and automation solutions",
              "Technical consulting",
              "Product design and implementation",
              "Maintenance and support services"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/10 p-3 rounded-xl border border-border/30">
                <ChevronRight size={14} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground mt-4">Project scope, deliverables, pricing, and timelines are governed by separate agreements or proposals.</p>
        </div>
      )
    },
    {
      id: "responsibilities",
      icon: UserCheck,
      title: "2. Client Responsibilities",
      content: (
        <div className="space-y-4">
          <p>To ensure project success, clients agree to:</p>
          <ul className="space-y-3">
            {[
              "Provide accurate and complete information",
              "Supply required assets and feedback in a timely manner",
              "Maintain lawful use of delivered services",
              "Avoid unauthorized redistribution of proprietary work"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "payments",
      icon: CreditCard,
      title: "3. Payments and Billing",
      content: (
        <div className="space-y-4">
          <p>Payment terms are communicated before project commencement. Unless otherwise agreed:</p>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">Invoices are due according to the approved proposal.</p>
            <p className="text-sm text-muted-foreground">Delayed payments may pause active work.</p>
            <p className="text-sm text-primary font-bold">Payments made indicate acceptance of agreed service scope.</p>
          </div>
        </div>
      )
    },
    {
      id: "ip",
      icon: Shield,
      title: "4. Intellectual Property",
      content: (
        <div className="space-y-4">
          <p>Unless otherwise agreed in writing, Time Global retains ownership of pre-existing tools and frameworks, while clients retain ownership of provided content.</p>
          <div className="flex flex-wrap gap-3">
            {["Proprietary Frameworks", "Final Deliverables", "Third-party APIs", "Client Content"].map((tag, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "availability",
      icon: Power,
      title: "6. Service Availability",
      content: (
        <div className="space-y-4">
          <p>We strive for reliability but do not guarantee uninterrupted availability. Interruptions may occur due to:</p>
          <div className="grid grid-cols-2 gap-4">
            {["Maintenance", "Infrastructure issues", "Security updates", "External events"].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/10 border border-border/30 text-center text-xs text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "liability",
      icon: AlertTriangle,
      title: "8. Limitation of Liability",
      content: (
        <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Time Global shall not be liable for indirect, incidental, or consequential damages. Total liability shall not exceed amounts paid for the relevant service engagement.
          </p>
        </div>
      )
    }
  ];

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
              <Scale size={14} />
              SERVICE AGREEMENT
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter"
            >
              Terms & <span className="text-primary italic">Conditions</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 text-muted-foreground"
            >
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-xl border border-border/50">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-medium">Last Updated: June 2026</span>
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
                      Sections
                    </h3>
                    <nav className="space-y-1">
                      {sections.map((s) => (
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

              {/* Main Content */}
              <div className="lg:col-span-8 space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-card border border-border/50 shadow-sm leading-relaxed text-muted-foreground"
                >
                  <p className="text-xl">
                    Welcome to <span className="text-foreground font-bold underline decoration-primary/30">Time Global</span>. These Terms govern your access to our services, software solutions, and related offerings.
                  </p>
                </motion.div>

                {sections.map((section, idx) => (
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

                {/* Dispute & Termination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <RefreshCcw size={20} className="text-primary" />
                      9. Termination
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Either party may terminate service engagement according to agreed project terms.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MessageSquare size={20} className="text-primary" />
                      10. Disputes
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">We encourage resolving concerns through good-faith communication first.</p>
                  </div>
                </div>

                {/* Contact Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-primary/20"
                >
                  <h2 className="text-3xl font-bold mb-4">Need Clarification?</h2>
                  <p className="text-muted-foreground mb-6">If you have questions about these Terms, reach out to our legal team.</p>
                  <a href="mailto:info@timeglobaltech.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                    <Mail size={18} />
                    info@timeglobaltech.com
                  </a>
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
