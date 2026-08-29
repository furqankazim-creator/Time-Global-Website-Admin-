import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How long does a typical engagement take?",
    a: "Most projects run 4–12 weeks depending on scope and complexity. We start with a discovery phase (2–3 days) to fully understand your requirements, then move into architecture and build phases with weekly demos to keep you in the loop.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. All engagements include post-launch monitoring, performance tuning, and a dedicated support channel for production issues. We can also provide retainer agreements for ongoing development and optimization.",
  },
  {
    q: "What's your team composition like?",
    a: "We assemble custom teams based on your project's needs — typically 2–8 engineers plus a dedicated project manager. Our teams span full-stack developers, cloud architects, product designers, and DevOps specialists.",
  },
  {
    q: "Do you work with legacy systems or only greenfield projects?",
    a: "Both. We're experienced with major rewrites and migrations of monolithic systems. Several of our case studies involve migrating from legacy tech stacks to modern architectures — always with zero downtime.",
  },
  {
    q: "How do you communicate progress?",
    a: "Through weekly demos, daily standups, and a shared project dashboard. Transparency is foundational to how we work — no surprises, ever.",
  },
  {
    q: "What's your tech stack flexibility?",
    a: "High. We work across the full spectrum: React, Vue, Angular on frontend; Node.js, Python, Go, Java on backend; AWS, GCP, Azure for cloud; and more. We choose tools based on what's right for your problem, not what we prefer.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-4">Common Questions</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently asked <span className="text-primary italic">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Can't find the answer you're looking for? <a href="/contact" className="text-primary hover:underline">Contact us</a>
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                whileHover={{ x: 4 }}
                className="w-full flex items-start justify-between gap-6 p-6 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border hover:border-primary/40 transition-all text-left shadow-md hover:shadow-lg"
              >
                <h3 className="font-bold text-lg leading-snug pr-4">
                  {faq.q}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0, y: openIndex === i ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 text-primary text-xl leading-none mt-1 flex items-center justify-center w-6 h-6"
                >
                  ↓
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-6 text-foreground leading-relaxed bg-primary/5 border-l-2 border-primary/50 ml-3 rounded-b-lg text-sm space-y-3">
                      {faq.a}

                      {/* Helpful feedback */}
                      <div className="pt-4 border-t border-primary/20 mt-4">
                        <p className="text-xs text-muted-foreground mb-3">Was this helpful?</p>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            👍 Yes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            👎 No
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
