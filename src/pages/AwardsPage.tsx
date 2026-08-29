import { useEffect, useState } from "react";
import { usePageMeta } from "@/lib/usePageMeta";
import { motion } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight, Star,
  ShieldCheck, Trophy, ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ------------------------------- DATA ------------------------------- */

const ISO_BADGES = ["ISO 27001", "ISO 9001", "ISO 37001", "ISO 45001", "ISO 14001"];

const AWARDS = [
  {
    name: "Clutch",
    color: "from-[#FF3D2E] to-[#ff6b5e]",
    desc: "Since 2018, featured on lists including Top Cloud Consultants, Top B2B companies in Tech Industry, Top 15 App Modernization companies, and more.",
    badges: [
      { label: "Clutch 1000", year: "2025" },
      { label: "Top Computer Vision · Germany", year: "2025" },
      { label: "Top AI Consulting · Germany", year: "2025" },
      { label: "Top Chatbot · Philadelphia", year: "2024" },
      { label: "Top Digital Transformation · Poland", year: "2024" },
      { label: "Top Machine Learning · Stuttgart", year: "2024" },
      { label: "Top Software Developers · Toronto", year: "2024" },
    ],
  },
  {
    name: "TechBehemoths",
    color: "from-[#6C5CE7] to-[#a29bfe]",
    desc: "Featured as Top Web Development Company in Germany, Top Mobile Development Company in Germany, Top WordPress Development Company in Germany.",
    badges: [
      { label: "Custom Software Development", year: "2025" },
      { label: "ReactJS", year: "2025" },
      { label: "WordPress", year: "2025" },
      { label: "Web Development", year: "2024" },
      { label: "Top WordPress · Germany", year: "2022" },
      { label: "Top Web Dev · Germany", year: "2022" },
    ],
  },
  {
    name: "TopDevelopers.co",
    color: "from-[#0984E3] to-[#74b9ff]",
    desc: "Ranked among Top 100+ Software developers, Top 100+ Web development companies, Top Big Data analytics companies.",
    badges: [
      { label: "Top Software Developers", year: "2023" },
      { label: "Top Web Developers", year: "2021" },
      { label: "Top Big Data Companies", year: "2020" },
      { label: "Top Custom Software Dev", year: "2020" },
      { label: "Top Blockchain Developers", year: "2019" },
      { label: "Top Mobile App · USA", year: "2018" },
    ],
  },
  {
    name: "DesignRush",
    color: "from-[#E84393] to-[#fd79a8]",
    desc: "Recognized repeatedly for user-friendly interface and attention to detail in mobile apps, webpages, and enterprise applications.",
    badges: [
      { label: "Top Custom Software Dev", year: "2023" },
      { label: "Top Web Development", year: "2023" },
      { label: "Top Web Design", year: "2022" },
      { label: "Best Website Design Agency", year: "2018" },
    ],
  },
  {
    name: "Techreviewer",
    color: "from-[#E17055] to-[#fab1a0]",
    desc: "Named one of top IT service companies, included in Top Enterprise App Developers and Top Blockchain Companies lists.",
    badges: [
      { label: "Top Software Developers · USA", year: "2025" },
      { label: "Top Enterprise App Developers", year: "2021" },
      { label: "Top Blockchain Companies", year: "2019" },
    ],
  },
  {
    name: "SelectedFirms",
    color: "from-[#00B894] to-[#55efc4]",
    desc: "Included in Top Web and Software Development companies due to numerous positive customer reviews in USA and EU.",
    badges: [
      { label: "Top Cloud Consulting", year: "2023" },
      { label: "Top Enterprise Software", year: "2023" },
      { label: "Top Web & Software Dev", year: "2023" },
    ],
  },
  {
    name: "Feedbax",
    color: "from-[#0984E3] to-[#00cec9]",
    desc: "Recognized as a trusted software development provider highlighting expertise, client satisfaction, and consistent delivery.",
    badges: [
      { label: "Top Company · Web Development", year: "2025" },
      { label: "Top Company · Software Development", year: "2025" },
      { label: "Top Company · AI Development", year: "2025" },
    ],
  },
  {
    name: "GoodFirms",
    color: "from-[#6C5CE7] to-[#0984E3]",
    desc: "Stands out as one of Top App Developers and Top Blockchain Technology Companies.",
    badges: [
      { label: "Top App Developers", year: "2024" },
      { label: "Top Blockchain Technology", year: "2018" },
    ],
  },
  {
    name: "SoftwareWorld",
    color: "from-[#E17055] to-[#E84393]",
    desc: "Named as one of the Top Rated Software Development Companies.",
    badges: [{ label: "Top Rated Software Dev", year: "2020" }],
  },
];

const TESTIMONIALS = [
  {
    name: "Patrick Reich",
    position: "Co-Founder & CEO",
    company: "Bonnet",
    quote: "The expectations for quality were very high. The developers were very qualified and able to deliver the vision. Transparent communication throughout.",
  },
  {
    name: "Dimitri Popolov",
    position: "Research Data Manager",
    company: "CANet",
    quote: "We had a tight deadline and they found another developer overnight. When the partner is good, things just get done.",
  },
  {
    name: "Matti Vesterinen",
    position: "Solution Development Manager",
    company: "Helvar",
    quote: "Quality has been good, on the expected level. Good visibility, good communication, a great partner for extra resources.",
  },
  {
    name: "Tim Rosenberger",
    position: "Director Global R&D",
    company: "SpecTec",
    quote: "Impressed by the skillset, flexibility to ramp up quickly, and scalability to extend teams on short notice.",
  },
];

/* ----------------------------- SUB-PARTS ---------------------------- */

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      {eyebrow && (
        <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/15 text-primary font-mono text-sm font-bold mb-5 border border-primary/40">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">{title}</h2>
    </div>
  );
}

/* Single award badge placeholder — swap the inner div for an <img> later */
function AwardBadge({ color, label, year }: { color: string; label: string; year: string }) {
  return (
    <div className="snap-start shrink-0 w-40 flex flex-col items-center text-center">
      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${color} p-[3px] shadow-lg`}>
        <div className="w-full h-full rounded-full bg-white/15 backdrop-blur flex items-center justify-center border-2 border-white/40">
          <Trophy size={36} className="text-white drop-shadow" />
        </div>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-[11px] font-black text-gray-800 shadow">
          {year}
        </span>
      </div>
      <span className="mt-4 text-xs font-semibold text-foreground leading-tight">{label}</span>
    </div>
  );
}

/* Circular CSI badge with star decorations around the perimeter */
function CsiBadge() {
  const stars = Array.from({ length: 12 });
  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 shrink-0">
      {stars.map((_, i) => {
        const angle = (i / stars.length) * 360;
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ transform: `rotate(${angle}deg) translateY(-122px)` }}
          >
            <Star size={18} className="fill-primary text-primary" style={{ transform: `rotate(${-angle}deg)` }} />
          </div>
        );
      })}
      <div className="absolute inset-6 rounded-full bg-secondary border-4 border-primary/30 flex flex-col items-center justify-center text-center shadow-2xl">
        <span className="text-5xl font-black text-primary">98%</span>
        <span className="text-muted-foreground text-sm font-mono mt-1 tracking-wide">CSI Score</span>
      </div>
    </div>
  );
}

/* Reusable dark image placeholder */
function ImgPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`bg-gray-800 border border-border/40 flex flex-col items-center justify-center gap-2 ${className}`}>
      <ImageIcon size={28} className="text-muted-foreground" />
      <span className="text-muted-foreground font-mono text-xs px-3 text-center">{label}</span>
    </div>
  );
}

/* --------------------------- MAIN PAGE ------------------------------ */

export default function AwardsPage() {
  usePageMeta({ title: "Awards & Recognition", description: "Recognised by Clutch, TechBehemoths, GoodFirms and more for software development excellence." });

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = TESTIMONIALS.length;
  const next = () => setSlide((s) => (s + 1) % total);
  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const active = TESTIMONIALS[slide];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground">
      <Navbar />
      <div className="h-[72px] shrink-0" />

      <main className="flex-1">
        {/* ----------------------------- HERO ----------------------------- */}
        <section className="relative bg-secondary text-foreground overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: "url('/assets/awards-hero.jpg')",
            }}
          />
          {/* Dark overlay to keep text readable */}
          <div className="absolute inset-0 bg-secondary/85 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-lg bg-primary/15 text-primary font-mono text-sm font-bold mb-8 border border-primary/40 backdrop-blur-sm"
            >
              {'<Recognition/>'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
            >
              Awards and
              <br />
              <span className="text-primary italic">Recognition.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto mb-10"
            >
              Making tangible impact — and getting recognized for it. For 25+ years, leading independent research firms
              like Clutch, GoodFirms, DesignRush and Techreviewer have ranked us among the top technology partners,
              backed by real client results and verified reviews.
            </motion.p>

            <motion.a
              href="#recognition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all"
            >
              Explore Our Recognition
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </section>

        {/* ---------------------------- ABOUT ----------------------------- */}
        <section id="recognition" className="max-w-7xl mx-auto px-6 py-20 sm:py-28 space-y-16 sm:space-y-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
<img
  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
  alt="Server room"
  className="rounded-2xl aspect-[16/10] shadow-2xl object-cover w-full"
/>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              For <span className="text-foreground font-semibold">25+ years</span>, our company has been bolstering
              businesses with first-class tech services. Acknowledgments from independent research firms fuel us to
              achieve even greater results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed md:order-1 order-2">
              Software product development, enterprise automation, cloud consulting, mobile app development, web design,
              BI and Big Data, AI and Computer Vision are areas where our rich expertise has been recognized.
            </p>
<img
  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
  alt="Team collaboration"
  className="rounded-2xl aspect-[4/3] shadow-xl object-cover w-full md:order-2 order-1"
/>
          </div>
        </section>

        {/* --------------------- CUSTOMER SATISFACTION -------------------- */}
        <section className="bg-secondary/[0.03] dark:bg-white/[0.02] border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16">
              <CsiBadge />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-5">Customer Satisfaction</h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  We utilize the <span className="text-foreground font-semibold">Customer Satisfaction Index (CSI)</span> —
                  a key performance metric. We conduct a quarterly feedback survey to remain aligned with your business
                  goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------ CERTIFICATIONS ------------------------ */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="<Certification/>" title="Certification" />
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* ISO card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 transition-colors">
              <div className="flex flex-wrap gap-3 mb-6">
                {ISO_BADGES.map((iso) => (
                  <div
                    key={iso}
                    className="w-[88px] h-[88px] rounded-full border-2 border-primary/30 bg-muted/40 flex flex-col items-center justify-center text-center shadow-sm"
                  >
                    <ShieldCheck size={18} className="text-primary mb-1" />
                    <span className="text-[11px] font-bold text-foreground leading-tight">{iso}</span>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-xl mb-3">ISO Certifications</h3>
              <p className="text-muted-foreground leading-relaxed">
                These aren't just badges. They ensure every project is secure, sustainable, and delivered to the highest
                standards.
              </p>
            </div>

            {/* CIR card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-28 h-28 rounded-xl border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center text-center mb-6">
                <ShieldCheck size={24} className="text-primary mb-1" />
                <span className="font-black text-lg text-primary">CIR</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Crédit d'Impôt Recherche</h3>
              <p className="text-muted-foreground leading-relaxed">
                Certified in France, enabling clients to benefit from up to 30% tax credit on eligible R&D expenses.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------- AWARDS ---------------------------- */}
        <section className="bg-secondary/[0.03] dark:bg-white/[0.02] border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
            <SectionHeading eyebrow="<Awards/>" title="Awards" />
            <div className="space-y-6">
              {AWARDS.map((award) => (
                <div
                  key={award.name}
                  className="grid lg:grid-cols-[1fr_22rem] gap-6 lg:gap-10 p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-sm"
                >
                  {/* Scrollable badges */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-xl mb-5">{award.name}</h3>
                    <div className="flex flex-wrap gap-2 pb-2 -mx-1 px-1">
                      {award.badges.slice(0, 4).map((b) => (
                        <AwardBadge key={b.label + b.year} color={award.color} label={b.label} year={b.year} />
                      ))}
                    </div>
                  </div>
                  {/* Description */}
                  <div className="flex items-center lg:border-l border-border/50 lg:pl-10">
                    <p className="text-muted-foreground leading-relaxed">{award.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------ TESTIMONIALS -------------------------- */}
        <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="<Testimonials/>" title="What our clients say" />
          <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-8 sm:p-12 relative overflow-hidden">
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-foreground font-bold text-xl">
                  {active.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{active.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {active.position}, {active.company}
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg border border-border bg-muted/40 text-sm font-semibold text-muted-foreground">
                  {active.company}
                </div>
              </div>

              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-xl sm:text-2xl font-light leading-relaxed mb-6">“{active.quote}”</p>

              <a href="#" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:gap-2.5 transition-all">
                Read the case study <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
              <span className="font-mono text-muted-foreground text-sm">
                {slide + 1} / {total}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
