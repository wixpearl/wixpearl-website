import { Clock3, Mail, MapPin } from 'lucide-react'

import { InquiryForm } from '@/components/contact/inquiry-form'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { ContactCard } from '@/components/shared/contact-card'
import { PageHeader } from '@/components/shared/page-header'
import { siteConfig } from '@/config/site'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Start a Project',
  description:
    'Tell WixPearl about the software, AI, automation, or consulting challenge your business needs to solve.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title="Tell us what is getting in the way"
        description="Share the business context, the outcome you need, and any constraints already known. We will review it and respond with a practical next step."
      />
      <Section spacing="sm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14">
            <div className="space-y-4">
              <h2 className="sr-only">Contact details</h2>
              <ContactCard
                title="Email"
                value={siteConfig.email}
                description="For direct questions or if the form is unavailable."
                href={`mailto:${siteConfig.email}`}
                icon={Mail}
              />
              <ContactCard
                title="Based in"
                value={siteConfig.location}
                description="Working with teams locally and internationally."
                icon={MapPin}
              />
              <ContactCard
                title="What happens next"
                value="A considered response"
                description="We review the context before recommending a call or discovery step."
                icon={Clock3}
              />
            </div>
            <InquiryForm />
          </div>
        </Container>
      </Section>
    </>
  )
}
