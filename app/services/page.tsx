import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { ServiceGrid } from '@/components/services/service-grid'
import { CTA } from '@/components/shared/cta'
import { DeliverySteps } from '@/components/shared/delivery-steps'
import { PageHeader } from '@/components/shared/page-header'
import { SectionHeading } from '@/components/shared/section-heading'
import { deliverySteps, services } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Software Engineering Services',
  description:
    'Custom software, practical AI, business automation, and software consulting from WixPearl.',
  path: '/services',
})

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
          <ServiceGrid items={services} columns={2} headingLevel="h2" />
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
            <DeliverySteps items={deliverySteps} variant="cards" />
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
