import BookingUnderDevelopment from '@/components/features/BookingUnderDevelopment'
import FastKattepass from '@/components/features/FastKattepass'
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
      <section className="bg-muted/30 py-4">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            <BookingUnderDevelopment />
            <FastKattepass />
          </div>
        </div>
      </section>
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
