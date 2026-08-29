import { Link } from "wouter";

const MARQUEE_ITEMS = [
  { label: "Software Product Development", href: "/services" },
  { label: "Team Augmentation", href: "/careers" },
  { label: "Product Strategy", href: "/services" },
  { label: "UX", href: "/services" },
  { label: "UI", href: "/services" },
  { label: "AI & Automation", href: "/services" },
  { label: "Digital Transformation", href: "/services" },
];

const DiamondIcon = () => (
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ margin: "0 3rem", flexShrink: 0 }}
  >
    <rect
      y="9"
      width="12"
      height="12"
      transform="rotate(-45 0 9)"
      fill="currentColor"
      style={{ color: "var(--primary, #a78bfa)" }}
    />
  </svg>
);

// 4× so the -50% snap point always falls seamlessly mid-content
const REPEATED = [
  ...MARQUEE_ITEMS,
  ...MARQUEE_ITEMS,
  ...MARQUEE_ITEMS,
  ...MARQUEE_ITEMS,
];

export default function MarqueeText() {
  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "4rem 0",
        borderTop: "1px solid hsl(var(--border))",
        borderBottom: "1px solid hsl(var(--border))",
        background: "hsl(var(--background))",
      }}
    >
      <style>{`
        @keyframes _mq {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        ._mq_track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          /*
           * contain:layout+style tells the browser this subtree cannot
           * affect anything outside it — compositor can skip repaints
           * caused by hover/focus changes on child links.
           */
          contain: layout style;
          animation: _mq 120s linear infinite;
        }
        ._mq_wrap:hover ._mq_track {
          animation-play-state: paused;
        }
        ._mq_wrap {
          display: flex;
          width: 100%;
          -webkit-mask-image: linear-gradient(
            to right, transparent 0%, black 8%, black 92%, transparent 100%
          );
          mask-image: linear-gradient(
            to right, transparent 0%, black 8%, black 92%, transparent 100%
          );
        }
        ._mq_link {
          /*
           * ONLY transition color.
           * transition-all / hover:scale are the #1 cause of marquee jank —
           * any transform on a child forces the parent layer to repaint.
           */
          transition: color 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: hsl(var(--foreground));
        }
        ._mq_link:hover {
          color: hsl(var(--primary));
        }
      `}</style>

      <div className="_mq_wrap">
        <div className="_mq_track">
          {REPEATED.map((item, idx) => (
            <span
              key={idx}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <Link href={item.href}>
                <a
                  className="_mq_link font-display"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </a>
              </Link>
              <DiamondIcon />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}