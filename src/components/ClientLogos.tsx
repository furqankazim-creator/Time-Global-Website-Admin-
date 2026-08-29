import { motion } from "framer-motion";

const CLIENTS = [
  { name: "FinTech EU", logo: "FT" },
  { name: "Retail Canada", logo: "RC" },
  { name: "Healthcare KSA", logo: "HK" },
  { name: "Logistics EU", logo: "LE" },
  { name: "Fashion UAE", logo: "FU" },
  { name: "EdTech Australia", logo: "EA" },
];

export default function ClientLogos() {
  return (
    <section className="py-20 px-6 border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-12 text-center">
          Trusted by Industry Leaders
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CLIENTS.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-center p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
            >
              <div className="text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-bold text-primary">{client.logo}</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">{client.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
