import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect } from "react";
import { Shield, Lock, Eye, Globe, User, FileText, Mail, Info, Clock, ChevronRight, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroBackdrop } from "../components/HeroBackdrop";

const SECTIONS_DATA = [
  {
    id: "collection",
    icon: Eye,
    title: "1. Information We Collect",
    content: (
      <div className="space-y-6">
        <p>We may collect information directly from you and automatically through website usage.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
            <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Information You Provide
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Full name & Email address</li>
              <li>Company name & Phone number</li>
              <li>Project requirements</li>
              <li>Messages via contact forms</li>
              <li>Business consultation data</li>
            </ul>
          </div>
          <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
            <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Collected Automatically
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>IP address & Browser type</li>
              <li>Device information</li>
              <li>Pages visited & Time spent</li>
              <li>Referral sources</li>
              <li>Cookies & Analytics data</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "usage",
    icon: Info,
    title: "2. How We Use Your Information",
    content: (
      <div className="space-y-4">
        <p>We use collected information to deliver and improve our services, respond to inquiries, and maintain security.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Deliver and improve our services",
            "Respond to inquiries and project requests",
            "Communicate regarding proposals",
            "Improve website performance",
            "Analyze traffic and engagement",
            "Maintain security and prevent misuse",
            "Comply with legal obligations"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/10 p-3 rounded-xl border border-border/30">
              <ChevronRight size={14} className="text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "cookies",
    icon: Lock,
    title: "3. Cookies and Tracking",
    content: (
      <div className="space-y-4">
        <p>Our website may use cookies and similar technologies to improve functionality and analyze usage.</p>
        <div className="flex flex-wrap gap-3">
          {["Remember preferences", "Understand behavior", "Improve performance", "Measure marketing"].map((tag, i) => (
            <span key={i} className="px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "third-party",
    icon: Users,
    title: "4. Third-Party Services",
    content: (
      <div className="space-y-4">
        <p>We may use trusted third-party services for analytics, communications, and hosting. These providers process information only to perform services on our behalf.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Analytics platforms", "Hosting providers", "Communication tools", "CRM systems", "Payment processors"].map((svc, i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/10 border border-border/30 text-center text-sm text-muted-foreground">
              {svc}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "rights",
    icon: User,
    title: "7. Your Privacy Rights",
    content: (
      <div className="space-y-4">
        <p>Depending on your location, you may have the right to access, correct, or delete your information.</p>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <ul className="space-y-3">
            {[
              "Request access to your information",
              "Correct inaccurate information",
              "Request deletion of personal information",
              "Withdraw consent where applicable",
              "Request limitations on processing"
            ].map((right, i) => (
              <li key={i} className="flex items-center gap-3 text-muted-foreground">
                <Shield size={16} className="text-primary shrink-0" />
                {right}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
];

export default function PrivacyPolicy() {
  usePageMeta({ title: "Privacy Policy", description: "How Time Global collects, uses and protects your data." });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative pt-32 pb-20 px-6 bg-secondary overflow-hidden border-b border-border/50">
          <HeroBackdrop />

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold mb-8"
            >
              <Lock size={14} />
              TRUST & TRANSPARENCY
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter"
            >
              Privacy <span className="text-primary italic">Policy</span> for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">Time Global</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 text-muted-foreground"
            >
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-xl border border-border/50">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-medium">Last Updated: June 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-xl border border-border/50">
                <Globe size={16} className="text-primary" />
                <span className="text-sm font-medium">Global Coverage</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-24 px-6 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Sidebar Navigation - Sticky */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-40 space-y-4">
                  <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      Quick Navigation
                    </h3>
                    <nav className="space-y-1">
                      {SECTIONS_DATA.map((s) => (
                        <a 
                          key={s.id} 
                          href={`#${s.id}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all group"
                        >
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                            {s.title.includes('.') ? s.title.split('.')[1].trim() : s.title}
                          </span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </nav>
                  </div>

                  <div className="p-8 rounded-3xl bg-primary text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                      <Shield size={80} />
                    </div>
                    <h4 className="text-xl font-bold mb-3 relative z-10">Data Protection</h4>
                    <p className="text-white/80 text-sm relative z-10 mb-6">We implement commercially reasonable technical safeguards to protect your personal information.</p>
                    <a href="mailto:info@timeglobaltech.com" className="inline-flex items-center gap-2 text-sm font-bold bg-white text-primary px-5 py-2.5 rounded-xl hover:shadow-xl transition-all relative z-10">
                      Contact Security
                    </a>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 rounded-3xl bg-card border border-border/50 shadow-sm leading-relaxed text-muted-foreground"
                >
                  <p className="text-xl mb-8">
                    Welcome to <span className="text-foreground font-bold underline decoration-primary/30">Time Global</span>. This Privacy Policy explains how we collect, use, protect, and manage your information when you interact with our services.
                  </p>
                  <p>
                    At Time Global, protecting user privacy and maintaining transparency are part of how we build digital experiences and AI-powered software solutions for clients globally.
                  </p>
                </motion.div>

                {SECTIONS_DATA.filter(s => s.id !== 'rights').map((section, idx) => (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
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

                {/* International & Security */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-secondary/20 border border-border/50"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-primary" />
                      5. Data Security
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We implement commercially reasonable technical and organizational safeguards to protect personal information against unauthorized access.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-secondary/20 border border-border/50"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Globe size={20} className="text-primary" />
                      6. International
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Because we serve clients globally, information may be processed or stored outside your country of residence.
                    </p>
                  </motion.div>
                </div>

                {/* Rights Section */}
                <motion.div
                  id="rights"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 rounded-3xl bg-card border border-border/50 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">7. Your Privacy Rights</h2>
                  </div>
                  {SECTIONS_DATA.find(s => s.id === 'rights')?.content}
                </motion.div>

                {/* Contact Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-primary/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-4">Questions?</h2>
                      <p className="text-muted-foreground mb-6">If you have questions about this Privacy Policy or wish to submit a privacy-related request, reach out to our team.</p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <a href="mailto:info@timeglobaltech.com" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                          <Mail size={18} />
                          info@timeglobaltech.com
                        </a>
                      </div>
                    </div>
                    <div className="w-48 h-48 rounded-full border-[12px] border-primary/10 flex items-center justify-center">
                      <Shield size={60} className="text-primary animate-pulse" />
                    </div>
                  </div>
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
