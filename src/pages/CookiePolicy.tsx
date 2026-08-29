import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect } from "react";
import { Shield, Lock, Globe, FileText, Mail, Info, Clock, ChevronRight, Fingerprint, MousePointer2, Settings, History } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroBackdrop } from "../components/HeroBackdrop";

export default function CookiePolicy() {
  usePageMeta({ title: "Cookie Policy", description: "How Time Global uses cookies on this site." });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "what-are-cookies",
      icon: Fingerprint,
      title: "1. What Are Cookies",
      content: (
        <div className="space-y-4">
          <p>Cookies are small text files stored on your device when you visit a website. They help websites operate efficiently, improve user experience, and support website functionality.</p>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies do not generally identify users directly but may be associated with browser or device information to provide a more personalized experience.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "why-use-cookies",
      icon: MousePointer2,
      title: "2. Why We Use Cookies",
      content: (
        <div className="space-y-4">
          <p>Time Global uses cookies and related technologies to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Enable core website functionality",
              "Improve website speed and performance",
              "Understand visitor interactions",
              "Measure content effectiveness",
              "Improve user experience",
              "Maintain website security",
              "Support analytics and improvements"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/10 p-3 rounded-xl border border-border/30">
                <ChevronRight size={14} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "types",
      icon: Info,
      title: "3. Types of Cookies We Use",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <h4 className="text-foreground font-bold mb-3">Essential Cookies</h4>
              <p className="text-sm text-muted-foreground mb-4">Necessary for the website to function properly.</p>
              <ul className="text-xs space-y-2 text-muted-foreground/80">
                <li>• Navigation functionality</li>
                <li>• Security verification</li>
                <li>• Session management</li>
              </ul>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <h4 className="text-foreground font-bold mb-3">Analytics Cookies</h4>
              <p className="text-sm text-muted-foreground mb-4">Help us understand visitor interactions.</p>
              <ul className="text-xs space-y-2 text-muted-foreground/80">
                <li>• Page visits & Traffic sources</li>
                <li>• Device information</li>
                <li>• Performance metrics</li>
              </ul>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <h4 className="text-foreground font-bold mb-3">Functional Cookies</h4>
              <p className="text-sm text-muted-foreground mb-4">Remember preferences and settings.</p>
              <ul className="text-xs space-y-2 text-muted-foreground/80">
                <li>• Language preferences</li>
                <li>• User settings</li>
                <li>• Interface selections</li>
              </ul>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <h4 className="text-foreground font-bold mb-3">Marketing Cookies</h4>
              <p className="text-sm text-muted-foreground mb-4">Evaluate campaign effectiveness.</p>
              <ul className="text-xs space-y-2 text-muted-foreground/80">
                <li>• Communication performance</li>
                <li>• Campaign evaluation</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "managing",
      icon: Settings,
      title: "5. Managing Cookies",
      content: (
        <div className="space-y-4">
          <p>You may control or disable cookies through your browser settings. Most browsers allow you to:</p>
          <div className="flex flex-wrap gap-3">
            {["View stored cookies", "Delete cookies", "Block all cookies", "Restrict categories"].map((tag, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">Disabling cookies may affect certain website features or functionality.</p>
        </div>
      )
    },
    {
      id: "retention",
      icon: History,
      title: "6. Cookie Retention",
      content: (
        <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cookies may remain active for different periods. Some expire after your session ends, while others remain until deleted or automatically expire.
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
              <Fingerprint size={14} />
              DIGITAL FOOTPRINT
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter"
            >
              Cookie <span className="text-primary italic">Policy</span>
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
                    This Cookie Policy explains how <span className="text-foreground font-bold underline decoration-primary/30">Time Global</span> uses cookies and similar technologies when you visit our website.
                  </p>
                  <p className="mt-6 text-sm">
                    By continuing to use our website, you agree to the use of cookies as described in this policy, unless disabled through your browser settings.
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

                {/* Third Party & Protection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Globe size={20} className="text-primary" />
                      4. Third-Party
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Some functionality may rely on trusted third-party providers who operate under their own cookie practices.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-primary" />
                      7. Data Protection
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Information collected through cookies is processed in accordance with our Privacy Policy.</p>
                  </div>
                </div>

                {/* Contact Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-primary/20"
                >
                  <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground mb-6">If you have questions regarding this Cookie Policy or our data practices, reach out to us.</p>
                  <a href="mailto:info@timeglobaltech.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
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
