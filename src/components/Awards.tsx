import { Link } from "wouter";
import { motion } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Badges are drawn as inline SVG medallions rather than hotlinked from the
 * directories' own sites — those URLs block hotlinking and every card was
 * falling back to a plain navy box.
 */
const AWARD_BADGES = [
  { name: "Clutch 1000", year: "2025", color: "#EF4A45" },
  { name: "TechBehemoths", year: "2025", color: "#7C6CE7" },
  { name: "TopDevelopers.co", year: "2024", color: "#3B9AE8" },
  { name: "DesignRush", year: "2024", color: "#EC5F9B" },
  { name: "GoodFirms", year: "2024", color: "#33BC90" },
  { name: "Techreviewer", year: "2025", color: "#F0985B" },
];

/** Laurel-wreath award medallion: brand colour, star row, year plaque. */
function Medallion({ color, year }: { color: string; year: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* laurels */}
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
        {[0, 1].map((side) => (
          <g key={side} transform={side ? "translate(120,0) scale(-1,1)" : undefined}>
            <path d="M28 96 C 14 84, 10 62, 16 40" />
            {[
              [17, 44], [14.5, 55], [15, 66], [18, 77], [23, 87],
            ].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} q -10 2 -13 -7 q 10 -4 13 7`} fill={color} stroke="none" opacity="0.9" />
            ))}
          </g>
        ))}
      </g>
      {/* medal */}
      <circle cx="60" cy="52" r="30" fill={color} opacity="0.16" />
      <circle cx="60" cy="52" r="30" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="60" cy="52" r="23" fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" />
      {/* central star */}
      <path
        d="M60 38 l4.4 9 9.9 1.4 -7.1 7 1.7 9.8 -8.9 -4.6 -8.9 4.6 1.7 -9.8 -7.1 -7 9.9 -1.4 z"
        fill={color}
      />
      {/* star row */}
      <g fill={color}>
        {[38, 49, 60, 71, 82].map((x) => (
          <path key={x} d={`M${x} 96 l1.8 3.6 4 .6 -2.9 2.8 .7 4 -3.6 -1.9 -3.6 1.9 .7 -4 -2.9 -2.8 4 -.6 z`} />
        ))}
      </g>
      {/* year plaque */}
      <rect x="41" y="108" width="38" height="12" rx="6" fill={color} />
      <text x="60" y="117" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="monospace">
        {year}
      </text>
    </svg>
  );
}

export default function Awards() {
  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]"
          animate={{ y: [0, 50, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px]"
          animate={{ y: [0, -40, 0], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/15 text-primary font-mono text-sm font-bold mb-6 border border-primary/40 backdrop-blur-sm">
              {'<Recognition/>'}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Awards and Recognition
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Making tangible impact
          </motion.p>
        </div>

        {/* Preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-14">
          {AWARD_BADGES.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center"
            >
              <div className="w-full rounded-2xl bg-card border border-border/50 group-hover:border-primary/50 shadow-lg flex flex-col items-center p-5 pb-4 relative overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                {/* brand-coloured glow behind the medallion on hover */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ backgroundColor: badge.color }}
                />
                <div className="w-full aspect-square relative z-10">
                  <Medallion color={badge.color} year={badge.year} />
                </div>
                <p className="relative z-10 font-bold text-sm text-foreground mt-3 text-center leading-tight">
                  {badge.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Awards button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <CtaButton size="lg" arrow href="/awards" data-testid="link-view-all-awards">
            View All Awards
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
