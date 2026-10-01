import { useState } from "react";
import { useContactModal } from "@/hooks/use-contact-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Shape3D } from "./Shape3D";
import { useServices, type CmsService } from "@/lib/cms";
import { CtaButton } from "@/components/ui/cta-button";

const SERVICES = [
  {
    title: "Web Application Development",
    desc: "We build scalable, secure, and performant web applications using modern frameworks like React, Node.js, and cloud-native architectures. From SPAs to full-stack platforms, we cover the entire delivery cycle.",
    shape: "cube" as const,
  },
  {
    title: "Native & Cross-Platform Mobile Apps",
    desc: "From iOS to Android, we deliver exceptional mobile experiences using Swift, Kotlin, and React Native to reach users everywhere. Clean UI, native performance, and robust backend integration.",
    shape: "half-round" as const,
  },
  {
    title: "Project & Product Consulting",
    desc: "Need guidance? Our experts help validate ideas, design system architecture, and plan roadmaps for successful execution. We align technology with your business goals from day one.",
    shape: "torus" as const,
  },
  {
    title: "Integration with Third-Party Systems",
    desc: "We seamlessly connect your application with payment gateways, CRMs, ERPs, and external APIs to build cohesive digital ecosystems. Reliable, well-documented, and maintainable integrations.",
    shape: "cube" as const,
  },
];

const ACCORDION_ITEMS = [
  {
    num: "01",
    title: "Market Expansion Opportunities",
    desc: "Discover unexplored market potentials, identify new customer segments, and evaluate the viability of expanding into new regions.",
  },
  {
    num: "02",
    title: "Risk Mitigation",
    desc: "Stay current with emerging technologies, industry best practices, and innovative solutions to keep your business ahead of threats.",
  },
  {
    num: "03",
    title: "Competitive Edge",
    desc: "Examine competitors' strengths and weaknesses to uncover tactics that set you apart and secure a lasting market advantage.",
  },
  {
    num: "04",
    title: "Strategic Decision-Making",
    desc: "Gain invaluable insights for informed, strategic decisions aligned with current market dynamics and consumer behavior patterns.",
  },
  {
    num: "05",
    title: "Innovation & Technology Adoption",
    desc: "Stay current with the latest in emerging technologies, AI tools, and innovative solutions to future-proof your business.",
  },
];

type Svc = (typeof SERVICES)[0];

// The CMS has no `shape` field — it's decorative. Cycle the existing shapes
// so CMS-driven cards keep the same visual rhythm as the bundled ones.
const SHAPES = ["cube", "half-round", "torus"] as const;

function toSvc(s: CmsService, i: number): Svc {
  return {
    title: s.title,
    desc: s.shortDescription || s.title,
    shape: SHAPES[i % SHAPES.length],
  };
}

export default function Services() {
  // Published CMS services replace the bundled list; empty/unreachable CMS
  // keeps the originals so the section never renders blank.
  const { data: cms } = useServices();
  const items: Svc[] = cms.length > 0 ? cms.map(toSvc) : SERVICES;

  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const { openModal } = useContactModal();

  return (
    <section className="py-32 px-6 bg-card" id="services">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold mb-6 border border-primary/20">
          {"<services>"}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl leading-tight">
          What We Can Help You With
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Unleashing competitive advantage via software mastery and research brilliance.
        </p>
      </div>

      {/* Service tabs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        <div className="lg:col-span-5 flex flex-col gap-2">
          {items.map((srv, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              data-testid={`button-service-tab-${i}`}
              className={`text-left px-6 py-5 rounded-xl transition-all font-bold text-lg border-l-4 ${
                activeTab === i
                  ? "bg-background shadow-md border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
              }`}
            >
              {srv.title}
            </button>
          ))}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="bg-background rounded-2xl p-8 h-full flex flex-col justify-center border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none" />
              <div className="mb-8">
                <Shape3D type={SERVICES[activeTab].shape} className="w-16 h-16" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
                {SERVICES[activeTab].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 text-base">
                {SERVICES[activeTab].desc}
              </p>
              <div className="mt-8 relative z-10">
                <CtaButton size="md" arrow onClick={openModal}>
                  let's talk
                </CtaButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-muted-foreground font-mono">
          {"<consulting insights>"}
        </h3>
        {ACCORDION_ITEMS.map((item, i) => (
          <div key={i} className="border-b border-border">
            <button
              onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
              data-testid={`button-accordion-${i}`}
              aria-expanded={openAccordion === i}
              className="w-full py-7 flex items-center justify-between text-left focus:outline-none group"
            >
              <div className="flex items-center gap-5">
                <span className="text-xl font-mono text-primary/80 dark:text-primary/50 group-hover:text-primary transition-colors w-8 shrink-0">
                  {item.num}
                </span>
                <span className="text-xl md:text-2xl font-bold">{item.title}</span>
              </div>
              <span
                className={`text-2xl text-primary transition-transform duration-300 shrink-0 ml-4 ${
                  openAccordion === i ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence>
              {openAccordion === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="pb-7 pl-[52px] text-lg text-muted-foreground pr-8">
                    {item.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
