import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import CollaborateCTA from "@/components/CollaborateCTA";

gsap.registerPlugin(ScrollTrigger);

const PROCESS = [
  { step: "01", title: "Discovery", desc: "Understanding your business logic and user needs." },
  { step: "02", title: "Architecture", desc: "Designing scalable cloud and data structures." },
  { step: "03", title: "Development", desc: "Clean code delivery with automated testing." },
  { step: "04", title: "Scale", desc: "Monitoring and optimizing for global growth." }
];

export default function WhyUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground">
        {/* Spacer to push content below fixed bars */}
        <div className="h-[72px] shrink-0" />
        
        <main className="flex-1" ref={containerRef}>
          {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20"
                >
                  {"<Our Legacy since 2013/>"}
                </motion.div>
                <h1 className="hero-text text-4xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
                  Global Engineering <br />
                  <span className="text-primary italic">Local Expertise.</span>
                </h1>
                <div className="space-y-6">
                  <p className="hero-text text-lg text-muted-foreground leading-relaxed">
                    Since our establishment in <span className="text-foreground font-bold">2013</span>, Time Global has emerged as a leading multinational software development company, delivering rapid and efficient solutions. With our back office based in <span className="text-foreground font-bold underline decoration-primary/30">Pakistan</span>, we have built a team of highly skilled professionals who excel in executing complex software projects on a global scale.
                  </p>
                  <p className="hero-text text-lg text-muted-foreground leading-relaxed">
                    As trusted technology partners, we provide outsourced services to numerous front offices across <span className="text-foreground font-semibold">Europe, the United States, Canada, the Emirates, Saudi Arabia, and Australia</span>. Our commitment to excellence enables us to deliver outstanding results for our clients worldwide.
                  </p>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Time Global Team" 
                    width="1200"
                    height="900"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 z-20 bg-background/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">10+</div>
                      <div>
                        <div className="text-sm font-bold">Years of Excellence</div>
                        <div className="text-xs text-muted-foreground">Global Project Delivery</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-primary/20 rounded-3xl translate-x-4 translate-y-4" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <div className="bg-secondary/10 border-y border-border/50">
          <Portfolio />
        </div>

        {/* Interactive Process Roadmap */}
          <section className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Engineering DNA</h2>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  A structured approach to innovation, ensuring every line of code serves a strategic business purpose.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {PROCESS.map((p, i) => (
                  <div key={i} className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all group">
                    <div className="text-5xl font-black text-primary/30 dark:text-primary/10 group-hover:text-primary/40 dark:group-hover:text-primary/20 transition-colors mb-4">{p.step}</div>
                    <h4 className="text-xl font-bold mb-3">{p.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border z-10" />
                    )}
                  </div>
                ))}
              </div>
            </div>
        </section>

        <CollaborateCTA />
      </main>
        <Footer />
      </div>
    </>
  );
}
