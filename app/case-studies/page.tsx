import { Container } from '@/components/layout/container'
import { Grid } from '@/components/layout/grid'
import { Section } from '@/components/layout/section'
import { CaseStudyCard } from '@/components/shared/case-study-card'
import { CTA } from '@/components/shared/cta'
import { PageHeader } from '@/components/shared/page-header'
import { publishedCaseStudies } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Case Studies',
  description: 'Approved examples of software engineering outcomes delivered by WixPearl.',
  path: '/case-studies',
})

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Real work, shared with care"
        description="We publish client stories only after the facts, outcomes, and permissions are approved."
      />
      <Section spacing="sm">
        <Container>
          {publishedCaseStudies.length > 0 ? (
            <Grid columns={2}>
              {publishedCaseStudies.map((caseStudy) => (
                <CaseStudyCard
                  key={caseStudy.slug}
                  title={caseStudy.title}
                  description={caseStudy.summary}
                  href={`/case-studies/${caseStudy.slug}`}
                  industry={caseStudy.industry}
                  metrics={caseStudy.outcomes}
                />
              ))}
            </Grid>
          ) : (
            <div className="bg-card mx-auto max-w-3xl rounded-2xl border p-8 text-center sm:p-12">
              <h2 className="text-2xl font-semibold">Approved stories are being prepared</h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-xl leading-7">
                We will not publish placeholder clients or invented results. In the meantime, talk
                with us directly about relevant experience and how we would approach your project.
              </p>
            </div>
          )}
        </Container>
      </Section>
      <CTA
        title="Your business problem deserves a grounded engineering conversation."
        description="Tell us where the friction is. We will help identify a sensible route forward."
      />
    </>
  )
}
