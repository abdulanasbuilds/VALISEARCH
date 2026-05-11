import { HeroSection } from "@/components/landing/HeroSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FeatureGrid } from "@/components/landing/FeatureGrid"
import { DashboardMockup } from "@/components/landing/DashboardMockup"
import { PricingCards } from "@/components/landing/PricingCards"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeatureGrid />
      <DashboardMockup />
      <PricingCards />
    </>
  )
}