import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Stack } from '@/components/layout/stack'
import { Eyebrow } from '@/components/shared/eyebrow'
import { HeroVisual } from '@/components/shared/hero-visual'
import { buttonVariants } from '@/components/ui/button'

export function HomeHero() {
  return (
    <div data-particle-host className="relative isolate">
      {/* <HomepageParticleField /> */}
      <div className="relative z-10">
        <section className="relative isolate overflow-hidden py-18 sm:py-24 lg:py-30">
          <div
            aria-hidden="true"
            className="pearl-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-148 opacity-30"
          />
          <div
            aria-hidden="true"
            className="bg-primary/10 pointer-events-none absolute top-8 left-[6%] -z-10 size-80 rounded-full blur-3xl"
          />
          <Container className="relative">
            <div className="grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-18">
              <Stack gap="xl" align="start">
                <Eyebrow className="surface-subtle rounded-full px-3.5 py-2">
                  Software engineering · AI · Automation
                </Eyebrow>
                <Stack gap="lg">
                  <h1
                    data-particle-text
                    className="font-display max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.048em] text-balance sm:text-6xl lg:text-7xl xl:text-[5.1rem]"
                  >
                    Software shaped around{' '}
                    <span className="text-gradient">how your business works.</span>
                  </h1>
                  <p className="text-muted-foreground max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
                    WixPearl turns complex operations into secure, dependable software with direct
                    engineering attention from discovery through delivery.
                  </p>
                </Stack>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href="/contact"
                    className={buttonVariants({
                      size: 'lg',
                      className: 'shadow-primary/20 shadow-lg',
                    })}
                  >
                    Discuss your project <ArrowRight data-icon="inline-end" />
                  </Link>
                  <Link
                    href="/services"
                    className={buttonVariants({ variant: 'outline', size: 'lg' })}
                  >
                    Explore services
                  </Link>
                </div>
                <p className="text-muted-foreground flex items-center gap-2.5 text-sm">
                  <span
                    className="bg-success size-2 rounded-full shadow-[0_0_0_4px_color-mix(in_oklch,var(--success)_13%,transparent)]"
                    aria-hidden="true"
                  />
                  Based in Sri Lanka · Working locally and internationally
                </p>
              </Stack>
              <HeroVisual />
            </div>
          </Container>
        </section>
      </div>
    </div>
  )
}
