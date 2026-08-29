import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/lib/usePageMeta";
import HeroSection from "@/components/HeroSection";
import IndustryShowcase from "@/components/IndustryShowcase";
import TechStack from "@/components/TechStack";
// import Portfolio from "@/components/Portfolio";
import ServiceMarquee from "@/components/ServiceMarquee";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import CollaborateCTA from "@/components/CollaborateCTA";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";
import { CaseStudySlider } from "@/components/CaseStudySlider";
export default function HomePage() {
  usePageMeta({ title: "Time Global", description: "AI-powered software development — web, mobile, cloud and automation for businesses worldwide." });

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans text-foreground">
     
      <Navbar />
      {/* Spacer to push content below fixed bars */}
      <div className="h-[72px] shrink-0" />
      <main className="flex-1">
        <HeroSection />
        <TechStack />
        <IndustryShowcase />
        <CaseStudySlider />
        <BlogPreview />
        {/* <Portfolio /> */}
        <ServiceMarquee />
        <Testimonials />
        <Awards />
        <CollaborateCTA />
      </main>
      <Footer />
    </div>
  );
}
