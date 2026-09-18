import { Bot, Braces, Cog, ShieldCheck } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Grid } from '@/components/layout/grid'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { CTA } from '@/components/shared/cta'
import { PageHeader } from '@/components/shared/page-header'
import { SectionHeading } from '@/components/shared/section-heading'
import { ServiceCard } from '@/components/shared/service-card'
import { deliverySteps, services } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Software Engineering Services',
  description:
    'Custom software, practical AI, business automation, and software consulting from WixPearl.',
  path: '/services',
})

const icons = [Braces, Bot, Cog, ShieldCheck] as const

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Engineering shaped around the way your business works"
        description="Choose a focused engagement or combine capabilities into a complete solution. We keep the architecture proportionate, the delivery visible, and the result maintainable."
      />
      <Section spacing="sm">
        <Container>
          <Grid columns={2} gap="lg">
            {services.map((service, index) => {
              const Icon = icons[index] ?? Braces
              return (
                <ServiceCard
                  key={service.slug}
                  title={service.title}
                  description={service.description}
                  href={`/services/${service.slug}`}
                  icon={Icon}
                />
              )
            })}
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <Stack gap="2xl">
            <SectionHeading
              eyebrow="Delivery"
              title="A practical path from problem to production"
              description="Each phase produces something concrete and keeps important decisions visible."
            />
            <Grid columns={4} gap="lg">
              {deliverySteps.map((step) => (
                <div key={step.number} className="bg-card rounded-2xl border p-6">
                  <span className="text-primary font-mono text-sm">{step.number}</span>
                  <h2 className="mt-4 text-xl font-semibold">{step.title}</h2>
                  <p className="text-muted-foreground mt-3 leading-7">{step.description}</p>
                </div>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <CTA
        title="Not sure which service fits?"
        description="Describe the business problem. We will help define the smallest sensible starting point."
      />
    </>
  )
}
