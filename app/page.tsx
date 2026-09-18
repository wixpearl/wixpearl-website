import { ArrowRight, Bot, Braces, CheckCircle2, Cog, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Grid } from '@/components/layout/grid'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { CTA } from '@/components/shared/cta'
import { Eyebrow } from '@/components/shared/eyebrow'
import { FeatureCard } from '@/components/shared/feature-card'
import { SectionHeading } from '@/components/shared/section-heading'
import { ServiceCard } from '@/components/shared/service-card'
import { TechnologyBadge } from '@/components/shared/technology-badge'
import { buttonVariants } from '@/components/ui/button'
import {
  deliverySteps,
  principles,
  publishedCaseStudies,
  services,
  technologies,
} from '@/config/content'
import { cn } from '@/lib/utils'

const serviceIcons = [Braces, Bot, Cog, ShieldCheck] as const

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <Stack gap="xl" align="start">
              <Eyebrow>Software engineering · AI · Automation</Eyebrow>
              <Stack gap="lg">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
                  Software engineered around your business.
                </h1>
                <p className="text-muted-foreground max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
                  WixPearl designs secure, robust, and reliable systems that make everyday work
                  simpler—delivered with direct engineering attention and practical value.
                </p>
              </Stack>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className={buttonVariants({ size: 'lg' })}>
                  Discuss your project <ArrowRight data-icon="inline-end" />
                </Link>
                <Link
                  href="/services"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  Explore services
                </Link>
              </div>
              <p className="text-muted-foreground text-sm">
                Based in Sri Lanka · Working with businesses locally and internationally
              </p>
            </Stack>

            <div className="bg-card/70 relative rounded-3xl border p-6 shadow-2xl shadow-violet-950/5 backdrop-blur sm:p-8">
              <div className="bg-primary/10 absolute -top-8 -right-8 size-40 rounded-full blur-3xl" />
              <Stack gap="lg" className="relative">
                <div className="flex items-center justify-between border-b pb-5">
                  <span className="text-sm font-semibold">Engineering that fits</span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                    From idea to production
                  </span>
                </div>
                {[
                  'Understand the operation before choosing technology',
                  'Design for security, reliability, and maintainability',
                  'Deliver useful increments with clear communication',
                  'Support the system as your business evolves',
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2
                      className="text-primary mt-0.5 size-5 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-muted-foreground leading-7">{item}</p>
                  </div>
                ))}
              </Stack>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-card/55 border-y">
        <Container>
          <Stack gap="2xl">
            <SectionHeading
              eyebrow="Capabilities"
              title="The right system for the work that matters"
              description="From focused automation to complete business platforms, every engagement starts with the problem and ends with a system your team can trust."
            />
            <Grid columns={4} gap="lg">
              {services.map((service, index) => {
                const Icon = serviceIcons[index] ?? Braces
                return (
                  <ServiceCard
                    key={service.slug}
                    title={service.shortTitle}
                    description={service.description}
                    href={`/services/${service.slug}`}
                    icon={Icon}
                  />
                )
              })}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container>
          <Stack gap="2xl">
            <SectionHeading
              eyebrow="Why WixPearl"
              title="Serious engineering, delivered personally"
              description="We combine disciplined technical work with the clarity and care of a small, accountable partner."
            />
            <Grid columns={4} gap="xl">
              {principles.map((principle) => (
                <FeatureCard
                  key={principle.title}
                  title={principle.title}
                  description={principle.description}
                  icon={ShieldCheck}
                />
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section className="bg-foreground text-background">
        <Container>
          <Stack gap="2xl">
            <SectionHeading
              eyebrow="Selected work"
              title="Evidence, not inflated claims"
              description="We only publish client work once its facts and outcomes are approved. Detailed case studies are being prepared now."
              className="[&_p]:text-background/65 **:data-[slot=eyebrow]:text-background/65"
            />
            {publishedCaseStudies.length > 0 ? (
              <Grid columns={2}>{/* Approved case-study cards render here. */}</Grid>
            ) : (
              <div className="border-background/20 bg-background/5 rounded-2xl border p-8 sm:p-10">
                <p className="text-background/75 max-w-2xl leading-7">
                  Have a problem that deserves to become our next measurable success story? We would
                  be glad to understand it.
                </p>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-background/30 text-background hover:bg-background hover:text-foreground mt-6 bg-transparent'
                  )}
                >
                  Start a conversation
                </Link>
              </div>
            )}
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="How we work"
              title="A clear path from uncertainty to dependable software"
              description="The process stays visible, collaborative, and grounded in business value."
            />
            <div className="bg-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
              {deliverySteps.map((step) => (
                <div key={step.number} className="bg-background p-7 sm:p-8">
                  <span className="text-primary font-mono text-sm">{step.number}</span>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-3 leading-7">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-card/55 border-y">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <SectionHeading
              eyebrow="Technical capability"
              title="Modern technology, chosen with purpose"
              description="We select tools for the problem, team, and operating environment—not for a trend."
            />
            <div className="flex flex-wrap gap-3">
              {technologies.map((technology) => (
                <TechnologyBadge key={technology} name={technology} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 rounded-3xl border p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <Eyebrow>Sri Lankan roots, global delivery</Eyebrow>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Close collaboration wherever your business operates.
              </h2>
            </div>
            <p className="text-muted-foreground self-end text-lg leading-8">
              WixPearl brings direct access to engineering, flexible collaboration, and a practical
              cost structure to businesses in Sri Lanka and around the world.
            </p>
          </div>
        </Container>
      </Section>

      <CTA
        title="Have a system your business has outgrown—or an idea worth building properly?"
        description="Tell us what is slowing your team down. We will help you identify the clearest next step."
      />
    </>
  )
}
