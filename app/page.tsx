import BookingUnderDevelopment from '@/features/BookingUnderDevelopment'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { AboutSection } from '@/components/landing/AboutSection'
import { PartnersSection } from '@/components/landing/PartnersSection'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { ResponsibilitySection } from '@/components/landing/ResponsibilitySection'
import { PricingSection } from '@/components/landing/PricingSection'
import { ContactCTA } from '@/components/landing/ContactCTA'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BookingUnderDevelopment />
      <FeaturesGrid />
      <AboutSection />
      <PartnersSection />
      <FacilitiesSection />
      <ResponsibilitySection />
      <PricingSection />
      <ContactCTA />
    </div>
  )
}
