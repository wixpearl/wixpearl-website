import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { Grid } from '@/components/layout/grid'
import { Section } from '@/components/layout/section'
import { CTA } from '@/components/shared/cta'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHeader } from '@/components/shared/page-header'
import { buttonVariants } from '@/components/ui/button'
import { getService, services } from '@/config/content'
import { siteConfig } from '@/config/site'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)

  if (!service) return {}

  return createMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.description,
          provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
          areaServed: ['Sri Lanka', 'Worldwide'],
        }}
      />
      <PageHeader
        eyebrow="WixPearl service"
        title={service.title}
        description={service.promise}
        actions={
          <Link href="/contact" className={buttonVariants({ size: 'lg' })}>
            Discuss this service
          </Link>
        }
      />
      <Section className="bg-card/55 border-y">
        <Container>
          <Grid columns={2} gap="xl">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">What we can build</h2>
              <p className="text-muted-foreground mt-4 max-w-xl leading-7">
                The exact scope is shaped during discovery, but these are common areas where this
                capability creates value.
              </p>
            </div>
            <div className="space-y-4">
              {service.capabilities.map((capability) => (
                <div
                  key={capability}
                  className="pearl-surface interactive-surface flex gap-3 rounded-2xl p-4"
                >
                  <CheckCircle2
                    className="text-primary mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-tight">Designed for useful outcomes</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {service.outcomes.map((outcome) => (
                <div key={outcome} className="pearl-surface interactive-surface rounded-2xl p-6">
                  <p className="leading-7">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <CTA
        title={`Could ${service.shortTitle.toLowerCase()} remove friction from your operation?`}
        description="Share the context and constraints. We will respond with a practical next step."
      />
    </>
  )
}
