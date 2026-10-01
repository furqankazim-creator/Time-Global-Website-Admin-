import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/lib/usePageMeta";
import HeroSection from "@/components/HeroSection";
import IndustryShowcase from "@/components/IndustryShowcase";
import TechStack from "@/components/TechStack";
import ServiceMarquee from "@/components/ServiceMarquee";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import CollaborateCTA from "@/components/CollaborateCTA";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";
import { CaseStudySlider } from "@/components/CaseStudySlider";
import { SectionDivider } from "@/components/SectionDivider";

export default function HomePage() {
  usePageMeta({
    title: "Time Global",
    description:
      "AI-powered software development — web, mobile, cloud and automation for businesses worldwide.",
  });

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground">
      <Navbar />
      {/* Spacer to push content below fixed navbar */}
      <div className="h-[72px] shrink-0" />

      <main id="main-content" className="flex-1">
        {/* 1. Hero — bg-background */}
        <HeroSection />

        {/* fade: background → TechStack (secondary) */}
        <SectionDivider variant="bg-to-secondary" height="h-16" />

        {/* 2. TechStack */}
        <TechStack />

        {/* fade: TechStack (secondary) → IndustryShowcase (card) */}
        <SectionDivider variant="secondary-to-card" height="h-16" />

        {/* 3. IndustryShowcase — bg-card */}
        <IndustryShowcase />

        {/* fade: card → background */}
        <SectionDivider variant="card-to-bg" height="h-16" />

        {/* 4. CaseStudySlider — bg-background */}
        <CaseStudySlider />

        {/* fade: background → background (subtle primary shimmer between sibling sections) */}
        <SectionDivider variant="neutral" height="h-12" />

        {/* 5. BlogPreview — bg-background */}
        <BlogPreview />

        {/* fade: background → background */}
        <SectionDivider variant="neutral" height="h-12" />

        {/* 6. ServiceMarquee — bg-background border-y */}
        <ServiceMarquee />

        {/* fade: background → secondary */}
        <SectionDivider variant="bg-to-secondary" height="h-16" />

        {/* 7. Testimonials — bg-secondary */}
        <Testimonials />

        {/* fade: secondary → background */}
        <SectionDivider variant="secondary-to-bg" height="h-16" />

        {/* 8. Awards — bg-background */}
        <Awards />

        {/* fade: background → secondary (CollaborateCTA uses bg-secondary base) */}
        <SectionDivider variant="bg-to-secondary" height="h-16" />

        {/* 9. CollaborateCTA — bg-gradient from-secondary */}
        <CollaborateCTA />
      </main>

      <Footer />
    </div>
  );
}
