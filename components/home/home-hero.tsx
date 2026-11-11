import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { HeroParticlesGL } from '@/components/home/hero-particles-gl'
import { Container } from '@/components/layout/container'
import { Stack } from '@/components/layout/stack'
import { Eyebrow } from '@/components/shared/eyebrow'
import { HeroVisual } from '@/components/shared/hero-visual'
import { AuroraText } from '@/components/ui/aurora-text'
import { BlurFade } from '@/components/ui/blur-fade'
import { buttonVariants } from '@/components/ui/button'
import { DotPattern } from '@/components/ui/dot-pattern'

const heroHighlights = [
  'Driven by Innovation',
  'Built Around Your Vision',
  'Designed for Tomorrow',
] as const

export function HomeHero() {
  return (
    <div
      data-particle-host
      className="relative isolate flex min-h-[calc(100svh-1rem)] flex-col justify-center overflow-hidden"
    >
      {/* Interactive WebGL particle swarm tied to logo & surfaces */}
      <HeroParticlesGL />

      {/* Magic UI DotPattern backdrop fading cleanly outward */}
      <DotPattern
        width={24}
        height={24}
        cr={1}
        className="text-heading/15 -z-10 [mask-image:radial-gradient(680px_circle_at_50%_42%,white,transparent)] dark:text-white/12"
      />

      {/* Signature curved brand ribbon in bottom-right edge */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-44 w-130 opacity-90 sm:h-56 sm:w-180 dark:opacity-75"
        viewBox="0 0 720 220"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 160 220 C 360 215, 520 165, 720 45 L 720 220 Z"
          className="fill-[#0B2447]/6 dark:fill-white/5"
        />
        <path
          d="M 280 220 C 460 205, 595 155, 720 75 L 720 220 Z"
          fill="#ED1C24"
          fillOpacity="0.9"
        />
      </svg>

      <div className="relative z-10 pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-18">
            <Stack gap="xl" align="start">
              <Stack gap="lg">
                <BlurFade delay={0.04} direction="up" inView={false}>
                  <Eyebrow>Innovate · Create · Transform</Eyebrow>
                </BlurFade>

                <BlurFade delay={0.12} direction="up" inView={false}>
                  <h1
                    data-particle-text
                    className="font-display max-w-4xl text-4xl leading-[1.06] font-semibold tracking-[-0.038em] text-balance sm:text-6xl lg:text-[4.1rem]"
                  >
                    Turning Ideas Into{' '}
                    <AuroraText colors={['#ED1C24', '#FF4D52', '#2878D0', '#D71920']} speed={1.2}>
                      Digital Reality.
                    </AuroraText>
                  </h1>
                </BlurFade>

                <BlurFade delay={0.2} direction="up" inView={false}>
                  <div className="max-w-xl space-y-3">
                    <p className="text-muted-foreground text-lg leading-8 text-pretty sm:text-xl">
                      We bring ideas to life through creativity, technology, and digital solutions
                      built for what&apos;s next.
                    </p>
                    <p className="text-heading font-display text-base font-semibold tracking-[-0.01em] sm:text-lg">
                      Your Vision, Our Solution.
                    </p>
                  </div>
                </BlurFade>
              </Stack>

              <BlurFade delay={0.26} direction="up" inView={false} className="w-full sm:w-auto">
                <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
                  <Link
                    data-particle-cta
                    href="/contact"
                    className={buttonVariants({ variant: 'cta', size: 'lg' })}
                  >
                    Let&apos;s Build Together{' '}
                    <ArrowRight
                      data-icon="inline-end"
                      className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href="/services"
                    className={buttonVariants({ variant: 'outline', size: 'lg' })}
                  >
                    Explore What We Do
                  </Link>
                </div>
              </BlurFade>

              <BlurFade delay={0.32} direction="up" inView={false}>
                <ul className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-medium sm:text-sm">
                  {heroHighlights.map((point) => (
                    <li key={point} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 shrink-0 text-[#16A36A]" aria-hidden="true" />
                      <span className="text-heading">{point}</span>
                    </li>
                  ))}
                </ul>
              </BlurFade>
            </Stack>

            <BlurFade delay={0.18} direction="up" inView={false}>
              <HeroVisual />
            </BlurFade>
          </div>
        </Container>
      </div>
    </div>
  )
}
