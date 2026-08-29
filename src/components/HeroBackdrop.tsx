/**
 * The shared page-hero backdrop: a soft teal glow over the secondary surface.
 *
 * Every page hero used to roll its own — some with blue-500 orbs, some with
 * hardcoded rgba() radials, at four different opacities. This is the single
 * definition, so the tone is identical everywhere and there's one place to
 * tune it.
 *
 * Usage — the parent section owns `relative` and `overflow-hidden`, and the
 * content next to it needs `relative z-10`:
 *
 *   <section className="relative bg-secondary overflow-hidden">
 *     <HeroBackdrop />
 *     <div className="relative z-10">…</div>
 *   </section>
 */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
    </div>
  );
}
