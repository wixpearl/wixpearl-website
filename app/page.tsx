import { EngineeringProofSection } from '@/components/home/engineering-proof-section'
import { GlobalDeliverySection } from '@/components/home/global-delivery-section'
import {
  CapabilitiesSection,
  HomeDeliverySection,
  HomeFinalCta,
  SelectedWorkSection,
  TechnologySection,
} from '@/components/home/home-content-sections'
import { HomeHero } from '@/components/home/home-hero'

export default function Home() {
  return (
    <>
      <HomeHero />
      <CapabilitiesSection />
      <EngineeringProofSection />
      <SelectedWorkSection />
      <HomeDeliverySection />
      <TechnologySection />
      <GlobalDeliverySection />
      <HomeFinalCta />
    </>
  )
}
