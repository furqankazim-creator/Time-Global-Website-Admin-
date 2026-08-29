import { motion } from "framer-motion";
import { useTeam, type CmsTeamMember } from "@/lib/cms";

const TEAM_STATS = [
  { value: "50+", label: "Engineers & Designers" },
  { value: "15", label: "Countries Represented" },
  { value: "4.9/5", label: "Avg Team Rating" },
];

const TEAM_MEMBERS = [
  { name: "Alex Chen", role: "Principal Architect", color: "#6366f1" },
  { name: "Sarah Okonkwo", role: "Head of Design", color: "#10b981" },
  { name: "Marcus Rivera", role: "Engineering Lead", color: "#f59e0b" },
  { name: "Priya Sharma", role: "Product Manager", color: "#ec4899" },
];

type Member = (typeof TEAM_MEMBERS)[0];

// `color` is decorative and not in the CMS — cycle the existing palette so
// CMS members keep the same visual variety.
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

function toMember(m: CmsTeamMember, i: number): Member {
  return { name: m.name, role: m.role, color: COLORS[i % COLORS.length] };
}

export default function TeamSnapshot() {
  // Published CMS team members replace the bundled four.
  const { data: cms } = useTeam([]);
  const members: Member[] = cms.length > 0 ? cms.map(toMember) : TEAM_MEMBERS;

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-secondary/10 to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stats */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-4">Our Team</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              Thoughtfully assembled from{" "}
              <span className="text-primary italic">the best</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Our team spans full-stack engineers, cloud architects, product designers, and growth strategists — all united by a commitment to shipping world-class software.
            </p>

            {/* Stats Grid with enhanced styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TEAM_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-3">
                    <div className="absolute -inset-2 bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    <div className="relative text-4xl font-black text-primary group-hover:text-primary/80 transition-colors">
                      {stat.value}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Members with enhanced cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {members.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/40 transition-all group shadow-md hover:shadow-xl"
              >
                {/* Glow effect */}
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur"
                  style={{
                    background: `radial-gradient(400px circle at 50% 50%, ${member.color}20, transparent 80%)`
                  }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <motion.div
                    className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: member.color }}
                    whileHover={{ rotate: 8 }}
                  >
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </motion.div>

                  <div>
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors">
                      {member.role}
                    </p>
                  </div>

                  {/* Expertise indicator */}
                  <div className="pt-3 border-t border-border/50 flex gap-1.5">
                    {[...Array(3)].map((_, j) => (
                      <motion.div
                        key={j}
                        className="h-1.5 flex-1 bg-primary rounded-full opacity-40 group-hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: member.color,
                          opacity: 0.4 + j * 0.2
                        }}
                        whileHover={{ scaleY: 1.4 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
