import { useEffect, useState } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { useContactModal } from "@/hooks/use-contact-modal";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import Services from "@/components/Services";
import CollaborateCTA from "@/components/CollaborateCTA";
import {
  Code2, Smartphone, Cpu, Cloud, Rocket, Clock, ShieldCheck, Zap,
  ArrowRight, CheckCircle2, HeartHandshake, Compass, Layers, Check, MessageSquare,
  Database, FlaskConical
} from "lucide-react";
import { 
  SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, 
  SiJavascript, SiGo, SiSwift, SiKotlin, SiFlutter, 
  SiDocker, SiKubernetes, SiPostgresql, SiMongodb, SiOpenai,
  SiTensorflow, SiPytorch, SiHuggingface, SiLangchain, SiAnthropic,
  SiPandas, SiNumpy, SiScikitlearn, SiJupyter,
  SiTailwindcss, SiVuedotjs, SiRedux, SiVite,
  SiExpress, SiGraphql, SiNestjs, SiRedis, SiLaravel,
  SiFirebase, SiJetpackcompose, SiAndroid, SiIonic
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

type TechCategory = "all" | "frontend" | "backend" | "cloud" | "mobile" | "ai";

interface TechItem {
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  label: string;
  color: string;
  category: TechCategory;
}

const TECH_LIST: TechItem[] = [
  { icon: SiReact, label: "React", color: "#61DAFB", category: "frontend" },
  { icon: SiNextdotjs, label: "Next.js", color: "#ffffff", category: "frontend" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6", category: "frontend" },
  { icon: SiJavascript, label: "JavaScript", color: "#F7DF1E", category: "frontend" },
  { icon: SiTailwindcss, label: "Tailwind CSS", color: "#06B6D4", category: "frontend" },
  { icon: SiVuedotjs, label: "Vue.js", color: "#4FC08D", category: "frontend" },
  { icon: SiRedux, label: "Redux", color: "#764ABC", category: "frontend" },
  { icon: SiVite, label: "Vite", color: "#646CFF", category: "frontend" },
  { icon: SiNodedotjs, label: "Node.js", color: "#339933", category: "backend" },
  { icon: SiPython, label: "Python", color: "#3776AB", category: "backend" },
  { icon: SiGo, label: "Go", color: "#00ADD8", category: "backend" },
  { icon: SiPostgresql, label: "PostgreSQL", color: "#336791", category: "backend" },
  { icon: SiMongodb, label: "MongoDB", color: "#47A248", category: "backend" },
  { icon: SiExpress, label: "Express", color: "#ffffff", category: "backend" },
  { icon: SiNestjs, label: "NestJS", color: "#E0234E", category: "backend" },
  { icon: SiGraphql, label: "GraphQL", color: "#E10098", category: "backend" },
  { icon: SiRedis, label: "Redis", color: "#DC382D", category: "backend" },
  { icon: SiLaravel, label: "Laravel", color: "#FF2D20", category: "backend" },
  { icon: FaAws, label: "AWS", color: "#FF9900", category: "cloud" },
  { icon: SiDocker, label: "Docker", color: "#2496ED", category: "cloud" },
  { icon: SiKubernetes, label: "Kubernetes", color: "#326CE5", category: "cloud" },
  { icon: SiSwift, label: "Swift", color: "#FA7343", category: "mobile" },
  { icon: SiKotlin, label: "Kotlin", color: "#7F52FF", category: "mobile" },
  { icon: SiFlutter, label: "Flutter", color: "#02569B", category: "mobile" },
  { icon: SiJetpackcompose, label: "Jetpack Compose", color: "#4285F4", category: "mobile" },
  { icon: SiAndroid, label: "Android", color: "#3DDC84", category: "mobile" },
  { icon: SiIonic, label: "Ionic", color: "#3880FF", category: "mobile" },
  { icon: SiFirebase, label: "Firebase", color: "#FFCA28", category: "mobile" },
  { icon: SiOpenai, label: "OpenAI", color: "#00A67E", category: "ai" },
  { icon: SiAnthropic, label: "Claude / Anthropic", color: "#ffffff", category: "ai" },
  { icon: SiTensorflow, label: "TensorFlow", color: "#FF6F00", category: "ai" },
  { icon: SiPytorch, label: "PyTorch", color: "#EE4C2C", category: "ai" },
  { icon: SiHuggingface, label: "Hugging Face", color: "#FFD21E", category: "ai" },
  { icon: SiLangchain, label: "LangChain", color: "#ffffff", category: "ai" },
  { icon: SiScikitlearn, label: "scikit-learn", color: "#F7931E", category: "ai" },
  { icon: SiPandas, label: "Pandas", color: "#ffffff", category: "ai" },
  { icon: SiNumpy, label: "NumPy", color: "#ffffff", category: "ai" },
  { icon: SiJupyter, label: "Jupyter", color: "#F37626", category: "ai" },
];

const FAQS = [
  {
    q: "How does Time Global save my time?",
    a: "We implement automated CI/CD pipelines, reusable component libraries, and AI-driven workflows that reduce development time by up to 40%."
  },
  {
    q: "Do you offer post-launch support?",
    a: "Absolutely. We provide dedicated maintenance teams to ensure your excellent work continues to perform perfectly as you scale."
  },
  {
    q: "Can you work with our existing internal team?",
    a: "Yes, our engineers are trained to integrate seamlessly into your existing workflows, providing technical seniority where it's needed most."
  }
];

const DETAILED_SERVICES = [
  {
    title: "Custom Software Development",
    desc: "We transform complex business requirements into high-performance digital solutions. Our motive is to eliminate technical friction and save your team valuable time through intelligent automation.",
    icon: <Code2 className="w-7 h-7 text-blue-400" />,
    badge: "Core Service",
    features: ["Enterprise Architecture", "Legacy System Modernization", "API Integration & GraphQL", "Full-stack Web Applications"],
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20",
    metric: { value: "4–8 wks", label: "To First Release" },
  },
  {
    title: "Mobile App Innovation",
    desc: "Creating seamless mobile experiences that keep your users engaged. We focus on performance and intuitive UX, ensuring your product stands out in a crowded market.",
    icon: <Smartphone className="w-7 h-7 text-purple-400" />,
    badge: "Cross-Platform",
    features: ["iOS & Android Native Apps", "React Native & Flutter Solutions", "Progressive Web Apps (PWA)", "App Store Optimization & CI/CD"],
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20",
    metric: { value: "1 Codebase", label: "iOS + Android" },
  },
  {
    title: "AI & Machine Learning",
    desc: "Harnessing the power of AI to drive smarter decision-making. We build models that automate repetitive tasks, allowing you to focus on high-level strategic goals.",
    icon: <Cpu className="w-7 h-7 text-emerald-400" />,
    badge: "Next-Gen",
    features: ["Predictive Analytics & Forecasting", "Natural Language Processing (LLMs)", "Autonomous Workflows & Agents", "Custom Model Fine-tuning"],
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
    metric: { value: "40%", label: "Avg. Workload Reduction" },
  },
  {
    title: "Cloud & DevOps Excellence",
    desc: "Optimizing your infrastructure for maximum uptime and scalability. Our cloud solutions are engineered to save costs and time through automated deployment pipelines.",
    icon: <Cloud className="w-7 h-7 text-amber-400" />,
    badge: "Infrastructure",
    features: ["AWS / Azure / GCP Cloud Migration", "Kubernetes Orchestration", "Zero-Downtime CI/CD Pipelines", "Automated Security Auditing & SOC2"],
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20",
    metric: { value: "99.9%", label: "Uptime SLA" },
  },
  {
    title: "Data Engineering & Analytics",
    desc: "Turning scattered, siloed data into a single source of truth. We design pipelines and warehouses that make reporting fast and decisions evidence-based.",
    icon: <Database className="w-7 h-7 text-cyan-400" />,
    badge: "Data Platform",
    features: ["ETL / ELT Pipeline Design", "Data Warehousing & Lakehouses", "Real-time Dashboards & BI", "Governance & Data Quality"],
    gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20",
    metric: { value: "Real-time", label: "Reporting Latency" },
  },
  {
    title: "Quality Assurance & Testing",
    desc: "Shipping fast only pays off if it's also stable. Our QA practice embeds automated and manual testing into every sprint so regressions never reach production.",
    icon: <FlaskConical className="w-7 h-7 text-rose-400" />,
    badge: "Reliability",
    features: ["Automated Regression Suites", "Load & Performance Testing", "Security & Penetration Testing", "Manual Exploratory QA"],
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20",
    metric: { value: "0", label: "Critical Bugs Shipped" },
  },
];

const DELIVERY_STEPS = [
  {
    step: "01",
    title: "Discovery & Architecture",
    timeframe: "Week 1",
    desc: "We analyze your business goals, deconstruct system bottlenecks, and produce a bulletproof architectural blueprint and sprint plan.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Rapid Prototyping",
    timeframe: "Weeks 2-3",
    desc: "Interactive prototypes and core system wireframes give stakeholders an immediate visual model with validated user feedback loops.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Production Engineering",
    timeframe: "Weeks 4-8",
    desc: "Test-driven development, automated CI/CD pipelines, and rigorous QA ensure enterprise-grade security and uncompromising speed.",
    icon: Rocket,
  },
  {
    step: "04",
    title: "Scale & SLA Support",
    timeframe: "Continuous",
    desc: "Full observability, automated cloud scaling, and 24/7 technical oversight to keep your platform running at peak velocity.",
    icon: ShieldCheck,
  },
];

const VALUE_PROPS = [
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Time-Saving Motive",
    desc: "We architect systems that automate manual workflows, saving your business thousands of man-hours."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Rapid Execution",
    desc: "Our 'Learn-Build-Iterate' loop ensures your product reaches the market faster without compromising quality."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Precision Engineering",
    desc: "Every line of code is written with long-term stability and security in mind, reducing future maintenance time."
  }
];

export default function ServicesPage() {
  usePageMeta({ title: "Services", description: "Web and mobile development, cloud and DevOps, AI and enterprise automation — one partner for the whole stack." });

  const [selectedCategory, setSelectedCategory] = useState<TechCategory>("all");
  const { openModal } = useContactModal();

  const filteredTech = selectedCategory === "all"
    ? TECH_LIST
    : TECH_LIST.filter(t => t.category === selectedCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 relative bg-secondary overflow-hidden">
          <HeroBackdrop />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20"
            >
              {"<Our Expertise/>"}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
            >
              Excellent Work. <br />
              <span className="text-primary italic">Zero Time Wasted.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light mb-10"
            >
              Time Global combines technical mastery with a core motive to save our clients' time, delivering scalable solutions that drive sustainable growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => openModal()}
                className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                Schedule Strategy Session
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#services-breakdown"
                className="px-8 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold text-base hover:bg-muted transition-all"
              >
                Explore Offerings
              </a>
            </motion.div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16 border-y border-border/50 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUE_PROPS.map((prop, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Services Pillars */}
        <section id="services-breakdown" className="py-28 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-4 border border-primary/20">
                {"<Core Capabilities/>"}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Engineered for Maximum Impact</h2>
              <p className="text-lg text-muted-foreground">
                We combine deep technical craft with business intuition, delivering full-lifecycle systems built to scale seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DETAILED_SERVICES.map((srv, idx) => (
                <motion.div
                  key={srv.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.12, ease: "easeOut" }}
                  className={`rounded-2xl p-8 bg-card border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${srv.gradient}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                        {srv.icon}
                      </div>
                      <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {srv.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">{srv.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed mb-6">
                      {srv.desc}
                    </p>

                    <div className="space-y-2.5 mb-8">
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-sm font-medium">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openModal()}
                      className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 group shrink-0"
                    >
                      Inquire
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground leading-none">{srv.metric.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{srv.metric.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4-Step Delivery Roadmap */}
        <section className="py-24 px-6 bg-secondary/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-4 border border-primary/20">
                {"<How We Deliver/>"}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Predictable, High-Velocity Delivery</h2>
              <p className="text-lg text-muted-foreground">
                From napkin architecture to enterprise deployment in transparent, agile sprints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DELIVERY_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-card border border-border relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-mono font-black text-primary/40">
                          {step.step}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                          {step.timeframe}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1.5 text-xs text-primary font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Milestone Verified
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack Summary Section with Category Tabs */}
        <section className="py-28 px-6 bg-secondary/10 border-b border-border/50 tech-section overflow-hidden">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Built with the Best</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Our mastery of modern tools allows us to build faster and deliver more robust solutions.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {[
                { id: "all", label: "All Technologies" },
                { id: "frontend", label: "Frontend" },
                { id: "backend", label: "Backend & Data" },
                { id: "cloud", label: "Cloud & DevOps" },
                { id: "mobile", label: "Mobile" },
                { id: "ai", label: "AI & ML" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as TechCategory)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {filteredTech.map((tech, i) => (
                <div key={i} className="tech-icon flex flex-col items-center gap-3 group p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center">
                    <tech.icon size={32} color={tech.color} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-mono font-medium text-muted-foreground group-hover:text-primary transition-colors">{tech.label}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Existing Interactive Services Module */}
        <Services />

        {/* Success Metrics / Impact */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Your Partner in <br /><span className="text-primary italic">Continuous Growth.</span></h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">98% Client Satisfaction</h4>
                    <p className="text-muted-foreground">Long-term partnerships built on trust and consistent delivery of excellent work.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Strategic Tech Alignment</h4>
                    <p className="text-muted-foreground">We don't just build; we consult to ensure your tech stack saves time and scales with your business.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <h3 className="text-2xl font-bold mb-8">Service Delivery FAQ</h3>
              <div className="space-y-8">
                {FAQS.map((faq, i) => (
                  <div key={i} className="space-y-3">
                    <h5 className="font-bold text-primary flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {faq.q}
                    </h5>
                    <p className="text-muted-foreground text-sm leading-relaxed pl-3.5 border-l border-border/50">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CollaborateCTA />
      </main>
      <Footer />
    </div>
  );
}

