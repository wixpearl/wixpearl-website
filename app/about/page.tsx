import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { CTA } from '@/components/shared/cta'
import { PageHeader } from '@/components/shared/page-header'
import { PrinciplesGrid } from '@/components/shared/principles-grid'
import { SectionHeading } from '@/components/shared/section-heading'
import { principles } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'About',
  description:
    'WixPearl is a technology-driven software company focused on transforming ambitious ideas into practical, reliable digital solutions.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About WixPearl"
        title="Turning ideas into digital reality"
        description="Your Vision, Our Solution. We combine creativity, modern engineering, and strategic thinking to transform visions into practical, meaningful digital experiences."
      />
      <Section spacing="sm">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-heading text-3xl font-semibold tracking-tight">
                Driven by innovation. Inspired by your vision.
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-8">
                We don&apos;t just build technology. We build possibilities that solve real-world
                challenges and create lasting business value.
              </p>
            </div>
            <div className="border-border divide-border divide-y border-y">
              <div className="py-6">
                <h3 className="font-display text-heading text-xl font-semibold">Our Mission</h3>
                <p className="text-muted-foreground mt-2 leading-7">
                  Empower businesses through innovative, reliable, and accessible digital solutions
                  that bridge the gap between ideas and reality.
                </p>
              </div>
              <div className="py-6">
                <h3 className="font-display text-heading text-xl font-semibold">Our Vision</h3>
                <p className="text-muted-foreground mt-2 leading-7">
                  Become a trusted technology partner recognized for transforming ambitious ideas
                  into impactful digital innovations.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="surface-subtle border-x-0 border-y">
        <Container>
          <Stack gap="2xl">
            <SectionHeading
              eyebrow="Core values"
              title="The principles behind everything we create"
              description="Every project is built with purpose, attention to detail, and an accountable partnership."
            />
            <PrinciplesGrid items={principles} variant="cards" />
          </Stack>
        </Container>
      </Section>
      <CTA
        title="Let's build something meaningful."
        description="Have an idea, a challenge, or a vision for something new? Your next big idea starts here."
      />
    </>
  )
}
