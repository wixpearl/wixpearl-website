import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { ServiceGrid } from '@/components/services/service-grid'
import { CaseStudyGrid } from '@/components/shared/case-study-grid'
import { CTA } from '@/components/shared/cta'
import { DeliverySteps } from '@/components/shared/delivery-steps'
import { PrinciplesGrid } from '@/components/shared/principles-grid'
import { SectionHeading } from '@/components/shared/section-heading'
import { TechnologyBadge } from '@/components/shared/technology-badge'
import {
  deliverySteps,
  principles,
  publishedCaseStudies,
  services,
  technologies,
} from '@/config/content'

export function CapabilitiesSection() {
  return (
    <Section className="surface-subtle border-x-0">
      <Container>
        <Stack gap="2xl">
          <SectionHeading
            eyebrow="Capabilities"
            title="The right system for the work that matters"
            description="From focused automation to complete business platforms, every engagement starts with the problem and ends with a system your team can trust."
          />
          <ServiceGrid items={services} columns={4} titleVariant="short" />
        </Stack>
      </Container>
    </Section>
  )
}

export function SelectedWorkSection() {
  if (publishedCaseStudies.length === 0) return null

  return (
    <Section className="surface-subtle border-x-0">
      <Container>
        <Stack gap="2xl">
          <SectionHeading
            eyebrow="Selected work"
            title="Evidence, not inflated claims"
            description="Approved client work, explained through the problem, the engineering, and the outcome."
          />
          <CaseStudyGrid items={publishedCaseStudies} />
        </Stack>
      </Container>
    </Section>
  )
}

export function HomeDeliverySection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <SectionHeading
            eyebrow="How we work"
            title="A clear path from uncertainty to dependable software"
            description="The process stays visible, collaborative, and grounded in business value."
          />
          <DeliverySteps items={deliverySteps} variant="compact" />
        </div>
      </Container>
    </Section>
  )
}

export function TechnologySection() {
  return (
    <Section className="surface-subtle border-x-0">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="Technical capability"
            title="Modern technology, chosen with purpose"
            description="We select tools for the problem, team, and operating environment - not for a trend."
          />
          <div className="relative">
            <div
              aria-hidden="true"
              className="bg-primary/6 pointer-events-none absolute -top-16 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full blur-[100px]"
            />
            <div className="border-border/60 bg-card/40 relative rounded-2xl border p-6 shadow-[0_1px_2px_0_color-mix(in_oklch,var(--ink)_3%,transparent)] backdrop-blur-sm sm:p-8">
              <span
                aria-hidden="true"
                className="via-primary/40 pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent to-transparent"
              />
              <div className="mb-6 flex items-center gap-2.5">
                <span aria-hidden="true" className="bg-primary/60 size-1.5 rounded-full" />
                <span className="text-muted-foreground font-mono text-[0.68rem] font-medium tracking-[0.14em] uppercase">
                  Stack we work with
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {technologies.map((technology) => (
                  <TechnologyBadge key={technology} name={technology} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function HomePrinciplesSection() {
  return (
    <Section>
      <Container>
        <Stack gap="2xl">
          <SectionHeading
            eyebrow="Why WixPearl"
            title="Serious engineering, delivered personally"
            description="Disciplined technical work with the clarity and care of a small, accountable partner."
          />
          <PrinciplesGrid items={principles} variant="numbered" />
        </Stack>
      </Container>
    </Section>
  )
}

export function HomeFinalCta() {
  return (
    <CTA
      title="Have a system your business has outgrown or an idea worth building properly?"
      description="Tell us what is slowing your team down. We will help you identify the clearest next step."
    />
  )
}
