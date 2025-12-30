import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesShowcase } from "@/components/sections/FeaturesShowcase";
import { GlobalReachSection } from "@/components/sections/GlobalReachSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function Landing() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesShowcase />
      <GlobalReachSection />
      <TestimonialsSection />
      <CTASection />
      <AIChatbot />
    </Layout>
  );
}
