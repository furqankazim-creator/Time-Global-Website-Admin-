import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Quote } from "lucide-react";
import { useTeam, type CmsTeamMember } from "@/lib/cms";

/**
 * "Life at Time Global" — the team-quote marquee. Lifted out of the Careers
 * page so it can live on About (or anywhere) with its animation intact.
 * Reads team members from the admin panel; falls back to the bundled
 * stories when the CMS is empty or unreachable.
 */

const EMPLOYEE_STORIES = [
  {
    quote: "The culture of deep work and technical excellence here is unmatched. We tackle distributed system challenges that actually matter, all while maintaining a healthy remote balance.",
    author: "Zain Ahmed",
    role: "Senior Backend Engineer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "Time Global is where design meets high-scale engineering. I love that our design decisions are backed by data and that we have the technical freedom to build truly pixel-perfect interfaces.",
    author: "Emily Watson",
    role: "Lead Product Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "Scaling global infrastructure requires a unique mindset. Here, I'm empowered to automate everything and build resilient systems that serve clients across four continents.",
    author: "Lucas Silva",
    role: "DevOps Architect",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "The focus on continuous learning isn't just a perk—it's part of our DNA. The mentorship I've received here has been instrumental in my growth from a mid-level dev to a technical lead.",
    author: "Priya Sharma",
    role: "Frontend Specialist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "Leading the engineering team at Time Global is about fostering innovation and maintaining a high bar for code quality. We're building technology that sets industry standards.",
    author: "Marcus Thorne",
    role: "VP of Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
];

type Story = (typeof EMPLOYEE_STORIES)[0];

/** Bio is sanitized HTML; the quote card wants plain text. */
const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function toStory(m: CmsTeamMember): Story {
  return {
    // Members added without a bio still appear — with a neutral line rather
    // than being silently dropped from the marquee.
    quote:
      stripTags(m.bio ?? "") ||
      `Proud to be part of the Time Global ${m.department} team, building products that ship worldwide.`,
    author: m.name,
    role: m.role,
    // Deterministic placeholder keyed by id — a random one would change
    // every render and make the marquee flicker.
    image: m.photo?.url ?? `https://i.pravatar.cc/200?u=${m._id}`,
  };
}

export default function TeamMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Every published team member from the admin panel appears here — adding
  // a member is expected to add a card.
  const { data: cmsTeam } = useTeam();
  const stories: Story[] = cmsTeam.length > 0 ? cmsTeam.map(toStory) : EMPLOYEE_STORIES;

  useEffect(() => {
    if (!marqueeRef.current) return;
    const marquee = marqueeRef.current;

    const ctx = gsap.context(() => {
      // The list renders twice; sliding one copy's width loops seamlessly.
      const totalWidth = marquee.scrollWidth / 2;
      const tween = gsap.to(marquee, {
        x: `-=${totalWidth}`,
        duration: 80,
        ease: "none",
        repeat: -1,
      });

      const slow = () => gsap.to(tween, { timeScale: 0.2, duration: 0.5 });
      const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.5 });
      marquee.addEventListener("mouseenter", slow);
      marquee.addEventListener("mouseleave", fast);

      return () => {
        marquee.removeEventListener("mouseenter", slow);
        marquee.removeEventListener("mouseleave", fast);
      };
    }, marquee);

    return () => ctx.revert();
    // scrollWidth is baked in at tween creation — rebuild when CMS data
    // changes the card count, or the loop distance goes stale.
  }, [stories.length]);

  return (
    <section className="py-32 bg-secondary border-y border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Life at Time Global</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear directly from the people building the future of global technology.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />

        <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap" style={{ width: "max-content" }}>
          {[...stories, ...stories].map((story, i) => (
            <div
              key={i}
              className="inline-flex flex-col w-[450px] h-[440px] align-top whitespace-normal group p-10 rounded-3xl bg-card dark:bg-secondary border border-border/30 hover:border-primary/50 transition-all duration-500 relative shadow-2xl"
            >
              <div className="absolute top-10 right-10 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Quote size={80} />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <p className="text-xl text-foreground/70 leading-relaxed italic font-light line-clamp-7">
                  "{story.quote}"
                </p>

                <div className="mt-auto flex items-center gap-5 pt-8 border-t border-border">
                  <img
                    src={story.image}
                    alt={story.author}
                    width="64"
                    height="64"
                    className="w-16 h-16 rounded-2xl object-cover border border-border group-hover:scale-110 transition-transform duration-500"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {story.author}
                    </h4>
                    <p className="text-muted-foreground font-medium">{story.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
