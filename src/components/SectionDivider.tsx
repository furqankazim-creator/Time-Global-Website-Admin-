/**
 * SectionDivider — a smooth gradient fade between adjacent page sections.
 *
 * Inserts a short element whose background is a vertical gradient from
 * `fromColor` (CSS color value of the section above) to `toColor` (section
 * below), creating a seamless visual blend instead of a hard cut.
 *
 * Usage — pass the actual CSS color values (or CSS variables) used by the
 * sections above and below:
 *
 *   <SectionDivider fromColor="hsl(var(--background))" toColor="hsl(var(--secondary))" />
 *
 * Pre-built variant shortcuts are provided for the most common pairings on
 * this site so callers don't need to know raw HSL values.
 */
type Props = {
  /** CSS color for the top edge (matches section above). */
  fromColor?: string;
  /** CSS color for the bottom edge (matches section below). */
  toColor?: string;
  /** Tailwind height class. Default: "h-20" */
  height?: string;
  /** Named variant — shorthand for the most common pairings. */
  variant?: "bg-to-secondary" | "secondary-to-bg" | "bg-to-card" | "card-to-bg" | "secondary-to-card" | "card-to-secondary" | "neutral";
};

const VARIANT_COLORS: Record<NonNullable<Props["variant"]>, [string, string]> = {
  "bg-to-secondary":    ["hsl(var(--background))",  "hsl(var(--secondary))"],
  "secondary-to-bg":    ["hsl(var(--secondary))",   "hsl(var(--background))"],
  "bg-to-card":         ["hsl(var(--background))",  "hsl(var(--card))"],
  "card-to-bg":         ["hsl(var(--card))",         "hsl(var(--background))"],
  "secondary-to-card":  ["hsl(var(--secondary))",   "hsl(var(--card))"],
  "card-to-secondary":  ["hsl(var(--card))",        "hsl(var(--secondary))"],
  "neutral":            ["hsl(var(--background))",  "hsl(var(--background))"],
};

export function SectionDivider({
  fromColor,
  toColor,
  height = "h-20",
  variant,
}: Props) {
  const [from, to] = variant
    ? VARIANT_COLORS[variant]
    : [fromColor ?? "hsl(var(--background))", toColor ?? "hsl(var(--secondary))"];

  return (
    <div
      aria-hidden="true"
      className={`${height} w-full pointer-events-none select-none`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}
