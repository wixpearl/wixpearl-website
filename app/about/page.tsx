import { Container } from '@/components/layout/container'
import { Grid } from '@/components/layout/grid'
import { Section } from '@/components/layout/section'
import { CTA } from '@/components/shared/cta'
import { PageHeader } from '@/components/shared/page-header'
import { principles } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'About',
  description:
    'WixPearl is a Sri Lankan software engineering and IT consulting company focused on secure, reliable business systems.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About WixPearl"
        title="A software partner that stays close to the problem"
        description="We help businesses replace friction and uncertainty with software that is clear, dependable, and genuinely useful."
      />
      <Section spacing="sm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Why we exist</h2>
            </div>
            <div className="text-muted-foreground space-y-5 text-lg leading-8">
              <p>
                Too many teams adapt their work to inflexible software, carry fragile manual
                processes, or invest in technology that never addresses the real constraint.
              </p>
              <p>
                WixPearl starts with the operation itself. We learn how work moves, where risk
                accumulates, and what a better result looks like before selecting the architecture.
              </p>
              <p>
                Based in Sri Lanka, we work directly and transparently with businesses at home and
                abroad. The goal is lasting value—not unnecessary complexity.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="bg-card/55 border-y">
        <Container>
          <Grid columns={4} gap="lg">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-background rounded-2xl border p-6">
                <h2 className="text-xl font-semibold">{principle.title}</h2>
                <p className="text-muted-foreground mt-3 leading-7">{principle.description}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
      <CTA
        title="Looking for an engineering partner who understands the business context?"
        description="Start with the problem. We will bring a practical technical perspective."
      />
    </>
  )
}
