import { Container } from '@/components/layout/container'

import SplashCursor from '../ui/SplashCursor'

export function HomeHero() {
  return (
    <div
      // data-particle-host
      className="relative isolate h-dvh"
    >
      {/* Enabler for Logo particle effect */}
      <div className="relative z-10">
        <section className="relative isolate overflow-hidden py-18 sm:py-24 lg:py-30">
          <SplashCursor
            simResolution={32}
            dyeResolution={256}
            densityDissipation={4.5}
            velocityDissipation={2}
            pressure={0.1}
            curl={1}
            splatRadius={0.1}
            splatForce={2500}
            colorUpdateSpeed={10}
            shading={true}
            rainbowMode={false}
            color="#9064ff"
          />
          <Container className="relative"></Container>
        </section>
      </div>
    </div>
  )
}
