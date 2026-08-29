import { useContactModal } from "@/hooks/use-contact-modal";
import { motion } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";

export default function CollaborateCTA() {
  const { openModal } = useContactModal();

  return (
    <section className="py-32 px-6 bg-gradient-to-r from-secondary via-secondary to-secondary/80 text-secondary-foreground text-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main radial gradient */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,_var(--primary)_0%,_transparent_70%)] opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated grid */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[80px]"
            style={{
              width: 200 + i * 50,
              height: 200 + i * 50,
              background: "var(--primary)",
              opacity: 0.08 - i * 0.02,
              left: `${20 + i * 35}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30 - i * 15, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-primary/80 tracking-[0.3em] uppercase mb-6"
        >
          Let's build together
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]"
        >
          Ready to{" "}
          <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
            collaborate?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-secondary-foreground/85 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          Time Global invests in fresh ideas. We help entrepreneurs bring brilliant projects to market and turn them into profitable digital products.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <CtaButton size="lg" arrow onClick={openModal}>
            Let's discuss your idea
          </CtaButton>

          <CtaButton size="lg" variant="outline" href="/about">
            Learn more
          </CtaButton>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <p className="text-sm text-secondary-foreground/60">
            Limited availability this quarter • Average project timeline: 4-12 weeks
          </p>
        </motion.div>
      </div>
    </section>
  );
}
