import { Check } from 'lucide-react'
import Image from 'next/image'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { SectionHeading } from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/blur-fade'
import wixpearl3dGif from '@/public/assets/wixpearl-3d-image.gif'

const differences = [
  {
    title: 'Your Vision Comes First',
    description:
      'We listen, understand, and shape every solution around your unique goals and aspirations.',
  },
  {
    title: 'Creativity Meets Technology',
    description:
      'We bring creative thinking and technical expertise together to turn complex challenges into meaningful solutions.',
  },
  {
    title: 'Built With Purpose',
    description:
      'Every feature, interaction, and experience should serve a purpose and create real value.',
  },
  {
    title: "Ready for What's Next",
    description:
      "We think beyond today's requirements, creating adaptable solutions with tomorrow's possibilities in mind.",
  },
] as const

export function EngineeringProofSection() {
  return (
    <Section>
      <Container>
        <div
          data-particle-surface
          className="surface-subtle relative overflow-hidden rounded-xl p-8 sm:p-10 lg:p-12"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left: Heading + Clean System Preview */}
            <div className="space-y-8">
              <SectionHeading
                eyebrow="The WixPearl difference"
                title="Your Vision Is at the Heart of Everything We Create."
                description="Great technology starts with understanding people, their challenges, and what they want to achieve. At WixPearl, we focus on understanding your ideas, exploring possibilities, and creating digital experiences with a clear purpose."
              />

              {/* 3D Brand Architecture Visual */}
              <div className="mx-auto max-w-xs sm:mx-0 sm:max-w-sm">
                <Image
                  src={wixpearl3dGif}
                  alt="WixPearl 3D digital platform illustration"
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 1024px) 24rem, 20rem"
                  unoptimized
                />
              </div>
            </div>

            {/* Right: 4 Key Differentiators Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {differences.map((item, index) => (
                <BlurFade key={item.title} delay={0.05 * index} inView>
                  <article className="border-border bg-card flex h-full flex-col rounded-lg border p-5 sm:p-6">
                    <span className="mb-4 grid size-7 shrink-0 place-items-center rounded-full bg-[#ED1C24] text-white">
                      <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-heading text-lg font-semibold tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6 text-pretty">
                      {item.description}
                    </p>
                  </article>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
