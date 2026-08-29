import { useEffect, useRef } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import Services from "@/components/Services";
import CollaborateCTA from "@/components/CollaborateCTA";
import { Code2, Smartphone, Cpu, Cloud, Rocket, Clock, ShieldCheck, Zap, ArrowRight, CheckCircle2, HeartHandshake } from "lucide-react";
import { 
  SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, 
  SiJavascript, SiGo, SiSwift, SiKotlin, SiFlutter, 
  SiDocker, SiKubernetes, SiPostgresql, SiMongodb, SiOpenai
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const TECH_LIST = [
  { icon: SiReact, label: "React", color: "#61DAFB" },
  { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
  { icon: SiNodedotjs, label: "Node.js", color: "#339933" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { icon: SiPython, label: "Python", color: "#3776AB" },
  { icon: SiGo, label: "Go", color: "#00ADD8" },
  { icon: SiSwift, label: "Swift", color: "#FA7343" },
  { icon: SiKotlin, label: "Kotlin", color: "#7F52FF" },
  { icon: SiFlutter, label: "Flutter", color: "#02569B" },
  { icon: FaAws, label: "AWS", color: "#FF9900" },
  { icon: SiDocker, label: "Docker", color: "#2496ED" },
  { icon: SiKubernetes, label: "Kubernetes", color: "#326CE5" },
  { icon: SiPostgresql, label: "PostgreSQL", color: "#336791" },
  { icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { icon: SiOpenai, label: "OpenAI", color: "#00A67E" },
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
    icon: <Code2 className="w-8 h-8" />,
    features: ["Enterprise Architecture", "Legacy System Modernization", "API Integration", "Full-stack Web Apps"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Mobile App Innovation",
    desc: "Creating seamless mobile experiences that keep your users engaged. We focus on performance and intuitive UX, ensuring your product stands out in a crowded market.",
    icon: <Smartphone className="w-8 h-8" />,
    features: ["iOS & Android Development", "React Native Solutions", "Progressive Web Apps", "App Store Optimization"],
    color: "from-purple-500/20 to-indigo-500/20"
  },
  {
    title: "AI & Machine Learning",
    desc: "Harnessing the power of AI to drive smarter decision-making. We build models that automate repetitive tasks, allowing you to focus on high-level strategic goals.",
    icon: <Cpu className="w-8 h-8" />,
    features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "AI Model Fine-tuning"],
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Cloud & DevOps Excellence",
    desc: "Optimizing your infrastructure for maximum uptime and scalability. Our cloud solutions are engineered to save costs and time through automated deployment pipelines.",
    icon: <Cloud className="w-8 h-8" />,
    features: ["AWS/Azure Management", "Kubernetes Orchestration", "CI/CD Implementation", "Security Auditing"],
    color: "from-orange-500/20 to-amber-500/20"
  }
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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%",
        }
      });

      gsap.from(".tech-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: {
          each: 0.05,
          from: "random"
        },
        scrollTrigger: {
          trigger: ".tech-section",
          start: "top 70%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col" ref={containerRef}>
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">
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
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
            >
              Time Global combines technical mastery with a core motive to save our clients' time, delivering scalable solutions that drive sustainable growth.
            </motion.p>
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

        {/* Tech Stack Summary Section */}
        <section className="py-32 px-6 bg-secondary/10 border-y border-border/50 tech-section overflow-hidden">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Built with the Best</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our mastery of modern tools allows us to build faster and deliver more robust solutions.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12">
            {TECH_LIST.map((tech, i) => (
              <div key={i} className="tech-icon flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                  <tech.icon size={36} color={tech.color} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors">{tech.label}</span>
              </div>
            ))}
          </div>
        </section>

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
            
            <div className="bg-card border border-border p-12 rounded-3xl shadow-2xl relative">
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

