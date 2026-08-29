import type { ReactNode, MouseEventHandler } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

/**
 * The one CTA button for the public site. Before this, five different
 * primary-button recipes coexisted (two gradients, flat primary, pill,
 * and three hover behaviours) — every new page picked one at random.
 *
 * Signature animation, all CSS so it costs nothing:
 *  - lift + primary glow on hover
 *  - a shine sweep crossing the face once per hover
 *  - press-down on click
 *  - optional arrow that nudges right on hover
 */
type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler;
  /** Internal path (wouter Link), #anchor or external URL (plain <a>). */
  href?: string;
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  arrow?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  "data-testid"?: string;
};

const base =
  "group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-bold " +
  "transition-all duration-300 select-none outline-none " +
  "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  // shine sweep — a skewed light band that crosses on hover
  "before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] " +
  "before:bg-white/20 before:transition-transform before:duration-700 before:ease-out " +
  "hover:before:translate-x-[300%]";

const variants = {
  primary:
    "bg-gradient-to-r from-primary to-emerald-600 text-white border border-white/20 " +
    "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:border-white/40",
  outline:
    "border-2 border-primary/40 text-primary bg-transparent " +
    "hover:border-primary hover:bg-primary/10 before:bg-primary/10",
};

const sizes = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function CtaButton({
  children, onClick, href, variant = "primary", size = "md", arrow = false,
  disabled, type = "button", className, ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span
          aria-hidden
          className="relative z-10 transition-transform duration-300 group-hover/cta:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (href?.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
      {content}
    </button>
  );
}
