import type { ReactNode, MouseEventHandler } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Signature CTA Button for Time Global.
 * Features:
 *  - Precision width & height constraints across sizes (sm, md, lg, xl)
 *  - Outfit display typography with crisp tracking
 *  - Luminous emerald gradients with ambient aura bloom
 *  - Top rim light highlight + animated diagonal shimmer sweep
 *  - Micro-lift and spring arrow interaction on hover
 */
type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler;
  /** Internal path (wouter Link), #anchor or external URL (plain <a>). */
  href?: string;
  variant?: "primary" | "outline" | "glass" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  arrow?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  "data-testid"?: string;
};

const base =
  "group/cta relative inline-flex items-center justify-center overflow-hidden font-display select-none outline-none " +
  "transition-all duration-300 ease-out will-change-transform " +
  "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
  "disabled:opacity-50 disabled:pointer-events-none disabled:transform-none " +
  // Animated shimmer sweep on hover
  "before:pointer-events-none before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-22deg] " +
  "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:ease-out " +
  "hover:before:translate-x-[350%]";

const variants = {
  primary:
    "bg-gradient-to-r from-emerald-500 via-primary to-teal-500 text-white font-bold " +
    "border border-emerald-300/30 " +
    "shadow-[0_4px_20px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.55)] hover:border-white/50 " +
    // Top light sheen line
    "after:pointer-events-none after:absolute after:inset-x-4 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent",
  glass:
    "bg-card/75 dark:bg-zinc-900/80 backdrop-blur-xl text-foreground font-semibold " +
    "border border-border/80 hover:border-primary/50 " +
    "shadow-md hover:shadow-lg hover:shadow-primary/15 hover:bg-muted/80 " +
    "after:pointer-events-none after:absolute after:inset-x-4 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
  secondary:
    "bg-secondary text-secondary-foreground font-semibold " +
    "border border-border hover:border-primary/40 hover:bg-secondary/80 " +
    "shadow-sm hover:shadow-md",
  outline:
    "border-2 border-primary/50 text-primary bg-primary/5 font-bold " +
    "hover:border-primary hover:bg-primary/15 " +
    "shadow-sm hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]",
};

const sizes = {
  sm: "h-9 min-w-[110px] px-4 text-xs tracking-wide rounded-lg gap-1.5",
  md: "h-11 min-w-[136px] px-6 text-sm tracking-wide rounded-xl gap-2",
  lg: "h-13 sm:h-14 min-w-[170px] sm:min-w-[190px] px-7 sm:px-8 text-base tracking-wide rounded-xl sm:rounded-2xl gap-2.5",
  xl: "h-15 sm:h-16 min-w-[210px] sm:min-w-[230px] px-9 sm:px-10 text-lg tracking-wide rounded-2xl gap-3",
};

export function CtaButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  icon,
  disabled,
  type = "button",
  className,
  ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10 leading-none">{children}</span>
      {arrow && (
        <ArrowRight
          size={size === "sm" ? 14 : size === "lg" || size === "xl" ? 18 : 16}
          strokeWidth={2.5}
          aria-hidden
          className="relative z-10 shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
        />
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
