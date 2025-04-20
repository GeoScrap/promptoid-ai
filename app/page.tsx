import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/landing/footer";
import { SpaceBackground } from "@/components/space-background";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SpaceBackground />
      <MainNav />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}