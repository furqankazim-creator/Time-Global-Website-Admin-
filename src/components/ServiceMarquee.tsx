import { motion } from "framer-motion";

const SERVICES = [
  { label: "Software Product Development", href: "/services" },
  { label: "Team Augmentation", href: "/services" },
  { label: "Product Strategy", href: "/services" },
  { label: "UX", href: "/services" },
  { label: "UI", href: "/services" },
  { label: "AI", href: "/services" },
  { label: "Digital Transformation", href: "/services" },
  { label: "Cloud Services", href: "/services" }
];

const Separator = () => (
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-8 md:mx-16">
    <rect y="9" width="12" height="12" transform="rotate(-45 0 9)" fill="currentColor" className="text-primary/40"></rect>
  </svg>
);

export default function ServiceMarquee() {
  return (
    <section className="py-20 bg-background border-y border-border/50 overflow-hidden select-none">
      <div className="relative flex items-center">
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Duplicate for infinite loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {SERVICES.map((service, index) => (
                <div key={index} className="flex items-center">
                  <a
                    href={service.href}
                    className="text-4xl md:text-7xl font-black tracking-tighter hover:text-primary transition-colors duration-300 uppercase"
                  >
                    {service.label}
                  </a>
                  <Separator />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
