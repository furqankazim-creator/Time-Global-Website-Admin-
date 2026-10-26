import { motion, AnimatePresence } from "framer-motion";
import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import CollaborateCTA from "@/components/CollaborateCTA";
import { CtaButton } from "@/components/ui/cta-button";
import { JsonLd, type JobPostingSchema } from "@/components/JsonLd";
import { useJobs, type CmsJob } from "@/lib/cms";
import { 
  Briefcase, 
  Heart, 
  Rocket, 
  Coffee, 
  Laptop, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Users,
  Code2,
  Cpu,
  Target,
  Plus,
  Minus,
  Quote
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    title: "Engineering Excellence",
    desc: "We don't just write code; we architect solutions that scale and endure.",
    icon: <Code2 size={32} className="text-primary" />,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Radical Transparency",
    desc: "We share our successes and our failures. Growth comes from honesty.",
    icon: <ShieldCheck size={32} className="text-primary" />,
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "User-First Mindset",
    desc: "Every feature we build starts with the person who will use it.",
    icon: <Users size={32} className="text-primary" />,
    color: "from-purple-500/20 to-pink-500/20"
  }
];

const BENEFITS = [
  {
    icon: <Laptop size={24} />,
    title: "Remote-First",
    desc: "Work from anywhere in the world with flexible hours that suit your life."
  },
  {
    icon: <Rocket size={24} />,
    title: "Career Growth",
    desc: "Dedicated learning budget and mentorship to accelerate your path."
  },
  {
    icon: <Heart size={24} />,
    title: "Health & Wellness",
    desc: "Comprehensive health coverage and mental health support for you."
  },
  {
    icon: <Coffee size={24} />,
    title: "Culture of Joy",
    desc: "A collaborative environment where every voice matters and success is shared."
  }
];

const HIRING_PROCESS = [
  { step: "01", title: "Apply", desc: "Submit your application and showcase your best work." },
  { step: "02", title: "Review", desc: "Our team evaluates your potential, passion, and technical curiosity." },
  { step: "03", title: "Interview", desc: "A deep dive into your engineering mindset and past work." },
  { step: "04", title: "Task", desc: "A real-world challenge to demonstrate your problem-solving skills." },
  { step: "05", title: "Offer", desc: "Joining the mission to build global-scale technology." }
];

const OPENINGS = [
  {
    role: "Senior Full-Stack Engineer",
    type: "Full-time",
    location: "Remote",
    dept: "Engineering",
    salary: "$120k - $180k"
  },
  {
    role: "AI / ML Specialist",
    type: "Full-time",
    location: "Remote",
    dept: "Engineering",
    salary: "$130k - $190k"
  },
  {
    role: "Lead UI/UX Designer",
    type: "Full-time",
    location: "Remote",
    dept: "Design",
    salary: "$110k - $160k"
  },
  {
    role: "Cloud Architect (AWS/GCP)",
    type: "Full-time",
    location: "Remote",
    dept: "Engineering",
    salary: "$140k - $200k"
  },
  {
    role: "Product Manager",
    type: "Full-time",
    location: "Remote",
    dept: "PM",
    salary: "$100k - $150k"
  },
  {
    role: "Technical Sales Lead",
    type: "Full-time",
    location: "Remote",
    dept: "Sales",
    salary: "$90k - $140k"
  }
];

const CAREER_FAQS = [
  {
    q: "What is your remote work policy?",
    a: "We are a remote-first company. You can work from anywhere in the world as long as you have a stable internet connection and can overlap with your team's core hours."
  },
  {
    q: "Do you offer internships?",
    a: "Yes! We have a robust internship program for aspiring engineers and designers. Check our open positions for 'Intern' roles or send us your CV."
  },
  {
    q: "How long does the application process take?",
    a: "Typically, the process from application to offer takes 2-4 weeks, depending on the role and scheduling availability."
  }
];

type Opening = (typeof OPENINGS)[0] & { applyEmail?: string; slug?: string };

/** Job model departments are lowercase slugs; the filter shows them titled. */
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function toOpening(j: CmsJob): Opening {
  return {
    role: j.title,
    // "full-time" → "Full time"
    type: titleCase(j.type.replace("-", " ")),
    location: j.location || "Remote",
    dept: titleCase(j.department),
    // The Job model has no salary field; the card hides it when empty.
    salary: "",
    applyEmail: j.applyEmail,
    slug: j.slug,
  };
}

export default function CareersPage() {
  usePageMeta({ title: "Careers", description: "Join a remote-first team building software for clients across four continents." });

  const [activeDept, setActiveDept] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Published jobs from the admin panel; bundled list only covers an
  // unreachable API, and an empty CMS legitimately means "no open roles".
  const { data: cmsJobs } = useJobs();
  const openings: Opening[] = cmsJobs.length > 0 ? cmsJobs.map(toOpening) : OPENINGS;

  // Filters derive from what actually exists, so a new department in the
  // admin appears here without a code change.
  const departments = ["All", ...Array.from(new Set(openings.map((o) => o.dept)))];

  const filteredOpenings = activeDept === "All"
    ? openings
    : openings.filter((job) => job.dept === activeDept);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(".hero-text", 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2
        }
      );

      // Value Cards Animation
      gsap.fromTo(".value-card", 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".values-section",
            start: "top 80%",
          }
        }
      );

      // Opening Cards Animation
      gsap.fromTo(".opening-card", 
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".openings-list",
            start: "top 85%",
          }
        }
      );

      // Process Steps Animation
      gsap.fromTo(".process-step", 
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".process-section",
            start: "top 80%",
          }
        }
      );

    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col" ref={containerRef}>
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* JobPosting JSON-LD — one schema block per open role so Google Jobs
            can index them. Uses today's date as datePosted; validThrough is
            90 days from today as a reasonable default. */}
        {openings.map((job) => (
          <JsonLd
            key={job.role}
            schema={{
              type: "JobPosting",
              title: job.role,
              description: `${job.role} — ${job.type} position at Time Global. Location: ${job.location}. Department: ${job.dept}.`,
              datePosted: new Date().toISOString().split("T")[0],
              validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              employmentType: job.type.toLowerCase().includes("full") ? "FULL_TIME"
                : job.type.toLowerCase().includes("part") ? "PART_TIME"
                : job.type.toLowerCase().includes("intern") ? "INTERN"
                : "CONTRACTOR",
              jobLocation: job.location,
              ...(job.salary ? { baseSalary: job.salary } : {}),
            } satisfies JobPostingSchema}
          />
        ))}
        {/* Hero Section */}
        <section className="pt-24 pb-24 px-6 relative bg-secondary overflow-hidden text-center">
          <HeroBackdrop />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="hero-text inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-8 border border-primary/20 uppercase tracking-widest">
              {"<Join the mission/>"}
            </div>
            
            <h1 className="hero-text text-5xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight">
              Build the future <br />
              of <span className="text-primary italic">Global Technology.</span>
            </h1>
            
            <p className="hero-text text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              We're looking for world-class engineers, designers, and thinkers to solve complex problems at scale.
            </p>

            <div className="hero-text mt-12 flex flex-wrap justify-center gap-4">
              <CtaButton size="lg" arrow href="#openings">View Openings</CtaButton>
              <CtaButton size="lg" variant="glass" href="#culture">Our Culture</CtaButton>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="culture" className="py-32 px-6 values-section border-y border-border/50 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Our Core Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">The principles that guide every line of code we write and every decision we make.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VALUES.map((val, i) => (
                <div key={i} className="value-card group p-8 rounded-2xl bg-card dark:bg-secondary border border-border/30 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 text-left space-y-8 shadow-sm hover:shadow-xl relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${val.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {val.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{val.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hiring Process Section */}
        <section className="py-32 px-6 process-section bg-background">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-24 leading-tight tracking-tight">How We Hire</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {HIRING_PROCESS.map((step, i) => (
                <div key={i} className="process-step group relative">
                  <div className="mb-8 relative inline-block">
                    <div className="text-8xl font-black text-primary/30 dark:text-primary/10 group-hover:text-primary/40 dark:group-hover:text-primary/20 transition-colors font-mono">
                      {step.step}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.desc}</p>
                  
                  {i < HIRING_PROCESS.length - 1 && (
                    <div className="hidden md:block absolute top-20 left-full w-full h-px border-t-2 border-dashed border-border/50 -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-32 px-6 bg-secondary/10 border-y border-border/50" id="openings">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Open Positions</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">Join a team that values your growth as much as your output.</p>
              </div>
              
              <div className="flex flex-col gap-6 items-start lg:items-end">
                <div className="flex flex-wrap gap-2 p-1.5 bg-background rounded-xl border border-border">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeDept === dept 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
                <div className="px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest border border-primary/20">
                  {filteredOpenings.length} Positions Available
                </div>
              </div>
            </div>

            <div className="openings-list grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredOpenings.length > 0 ? (
                  filteredOpenings.map((job, i) => (
                    <motion.div 
                      key={job.role}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="opening-card group flex flex-col md:flex-row md:items-center justify-between p-8 bg-card dark:bg-secondary border border-border/30 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">{job.dept}</span>
                          <span className="text-muted-foreground flex items-center gap-1 text-xs font-mono">
                            <MapPin size={14} /> {job.location}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h3>
                        <div className="flex items-center gap-6 text-muted-foreground font-medium">
                          <span className="flex items-center gap-2"><Clock size={18} /> {job.type}</span>
                          {job.salary && <span className="flex items-center gap-2 text-primary/80 font-mono">{job.salary}</span>}
                        </div>
                      </div>
                      
                      <div className="mt-8 md:mt-0">
                        <CtaButton
                          size="md"
                          variant="primary"
                          arrow
                          href={`mailto:${job.applyEmail || "careers@timeglobaltech.com"}?subject=${encodeURIComponent(`Application: ${job.role}`)}`}
                        >
                          Apply Now
                        </CtaButton>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-card dark:bg-secondary rounded-3xl border border-dashed border-border">
                    {openings.length === 0 ? (
                      <>
                        <p className="text-xl text-muted-foreground mb-2">No open roles right now.</p>
                        <p className="text-muted-foreground mb-6">
                          We still read every speculative application.
                        </p>
                        <a
                          href="mailto:careers@timeglobaltech.com?subject=Speculative%20application"
                          className="text-primary font-bold hover:underline"
                        >
                          Send us your CV
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="text-xl text-muted-foreground mb-6">No positions found in this department.</p>
                        <button
                          onClick={() => setActiveDept("All")}
                          className="text-primary font-bold hover:underline"
                        >
                          View all positions
                        </button>
                      </>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">Perks of being a <span className="text-primary italic">Globalist.</span></h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-12">We believe in taking care of our people so they can focus on what they do best: building the impossible.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {BENEFITS.map((perk, i) => (
                    <div key={i} className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        {perk.icon}
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-tighter">{perk.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{perk.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="relative h-[600px] overflow-hidden shadow-2xl border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Team collaboration"
                    width="1200"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-10 left-10 right-10 z-20 p-8 rounded-3xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <p className="text-2xl font-bold italic leading-tight mb-4">"The best part about Time Global is the collective curiosity. We never stop asking 'what if?'"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50" />
                      <div>
                        <p className="font-bold">Alex Rivera</p>
                        <p className="text-sm text-muted-foreground">Senior Engineering Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Common Questions</h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about joining our global team.</p>
            </div>

            <div className="space-y-4">
              {CAREER_FAQS.map((faq, i) => (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full py-8 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">{faq.q}</span>
                    <span className="text-primary ml-4">
                      {openFaq === i ? <Minus size={24} /> : <Plus size={24} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-lg text-muted-foreground leading-relaxed pr-12">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-6 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">Don't see your role?</h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
              We're always on the lookout for exceptional talent. Send us your CV anyway and let's see how we can build the future together.
            </p>
            <div className="flex justify-center items-center">
              <CtaButton
                size="lg"
                href="mailto:careers@timeglobaltech.com?subject=Speculative%20Application"
              >
                Send your CV
              </CtaButton>
            </div>
          </div>
        </section>

        <CollaborateCTA />
      </main>

      <Footer />
    </div>
  );
}
