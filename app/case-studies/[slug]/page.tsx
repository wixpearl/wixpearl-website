import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { CTA } from '@/components/shared/cta'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHeader } from '@/components/shared/page-header'
import { TechnologyBadge } from '@/components/shared/technology-badge'
import { getPublishedCaseStudy, publishedCaseStudies } from '@/config/content'
import { siteConfig } from '@/config/site'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return publishedCaseStudies.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getPublishedCaseStudy(slug)
  if (!caseStudy) return {}

  return createMetadata({
    title: caseStudy.title,
    description: caseStudy.summary,
    path: `/case-studies/${caseStudy.slug}`,
  })
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = getPublishedCaseStudy(slug)
  if (!caseStudy) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: caseStudy.title,
          description: caseStudy.summary,
          author: { '@type': 'Organization', name: siteConfig.name },
          publisher: { '@type': 'Organization', name: siteConfig.name },
          mainEntityOfPage: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
        }}
      />
      <PageHeader
        eyebrow={`${caseStudy.clientLabel} · ${caseStudy.industry}`}
        title={caseStudy.title}
        description={caseStudy.summary}
      />
      <Section spacing="sm">
        <Container size="md">
          <Stack gap="2xl">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold">The challenge</h2>
                <p className="text-muted-foreground mt-4 leading-8">{caseStudy.challenge}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">The solution</h2>
                <p className="text-muted-foreground mt-4 leading-8">{caseStudy.solution}</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Approved outcomes</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {caseStudy.outcomes.map((outcome) => (
                  <div
                    key={outcome.label}
                    className="pearl-surface interactive-surface rounded-2xl p-5"
                  >
                    <p className="font-display text-primary text-3xl font-semibold">
                      {outcome.value}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">{outcome.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {caseStudy.technologies.map((technology) => (
                <TechnologyBadge key={technology} name={technology} />
              ))}
            </div>
          </Stack>
        </Container>
      </Section>
      <CTA
        title="Have a similar challenge?"
        description="Tell us what your team needs to improve."
      />
    </>
  )
}
