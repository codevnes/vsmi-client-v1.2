"use client";

import { Separator } from "@/components/ui/separator";

import { HeroSection } from "./components/HeroSection";
import { AIBanner } from "./components/AIBanner";
import { PricingPlans } from "./components/PricingPlans";
import { AIFeatures } from "./components/AIFeatures";
import { BenefitsSection } from "./components/BenefitsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CallToAction } from "./components/CallToAction";

import { premiumPlans, premiumBenefits, aiFeatures, testimonials } from "./data";

export default function PremiumPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-16">
      <HeroSection />
      <AIBanner />
      <PricingPlans plans={premiumPlans} />
      <AIFeatures features={aiFeatures} />
      <Separator className="max-w-4xl mx-auto" />
      <BenefitsSection benefits={premiumBenefits} />
      <TestimonialsSection testimonials={testimonials} />
      <CallToAction />
    </main>
  );
} 