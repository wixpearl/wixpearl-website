import { ArrowRight, Braces, Cpu, Globe2, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { CaseStudyGrid } from '@/components/shared/case-study-grid'
import { CTA } from '@/components/shared/cta'
import { DeliverySteps } from '@/components/shared/delivery-steps'
import { SectionHeading } from '@/components/shared/section-heading'
import { TechnologyBadge } from '@/components/shared/technology-badge'
import { buttonVariants } from '@/components/ui/button'
import { MagicCard } from '@/components/ui/magic-card'
import { deliverySteps, publishedCaseStudies, technologies } from '@/config/content'
import { cn } from '@/lib/utils'

const expertiseAreas = [
  {
    title: 'Custom Digital Solutions',
    subtitle: 'Technology built around your needs.',
    description:
      'We create tailored digital solutions that solve real challenges, simplify operations, and help businesses work smarter.',
    href: '/services/custom-software-development',
    icon: Braces,
  },
  {
    title: 'Digital Product Innovation',
    subtitle: 'Turning possibilities into real experiences.',
    description:
      'We transform promising ideas into practical, engaging, and scalable digital products designed to create lasting value.',
    href: '/services/ai',
    icon: Sparkles,
  },
  {
    title: 'Web & Digital Experiences',
    subtitle: 'Creating experiences that connect.',
    description:
      'We design and develop modern, intuitive digital experiences that help businesses establish their presence and connect with their audiences.',
    href: '/services/automation',
    icon: Globe2,
  },
  {
    title: 'Emerging Technologies',
    subtitle: "Exploring what's possible next.",
    description:
      'We embrace evolving technologies and fresh perspectives to discover smarter ways of solving problems and creating opportunities.',
    href: '/services/software-consulting',
    icon: Cpu,
  },
] as const

export function CapabilitiesSection() {
  return (
    <Section className="surface-subtle border-x-0">
      <Container>
        <Stack gap="2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="What we do"
              title="Smart Solutions. Meaningful Impact."
              description="Every challenge is different. That's why we believe in creating technology that fits your goals, not the other way around. From unique business needs to ambitious digital ideas, we combine creativity and technical expertise to build solutions that make a difference."
            />
            <div className="shrink-0">
              <Link href="/services" className={buttonVariants({ variant: 'default', size: 'lg' })}>
                Explore Our Solutions
                <ArrowRight data-icon="inline-end" className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {expertiseAreas.map(({ title, subtitle, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group/card relative block h-full rounded-lg focus-visible:outline-none"
              >
                <MagicCard
                  className="h-full rounded-lg"
                  gradientFrom="#ED1C24"
                  gradientTo="var(--heading)"
                  gradientColor="var(--soft-red)"
                  gradientOpacity={0.65}
                >
                  <article
                    data-particle-surface
                    className={cn(
                      'relative flex h-full flex-col rounded-lg p-6 sm:p-7',
                      'group-focus-visible/card:ring-ring group-focus-visible/card:ring-offset-background group-focus-visible/card:ring-2 group-focus-visible/card:ring-offset-2'
                    )}
                  >
                    <div
                      className={cn(
                        'mb-5 inline-flex size-10 shrink-0 items-center justify-center rounded-md border',
                        'border-[#ED1C24]/15 bg-[#FFF1F2] text-[#D71920]',
                        'dark:border-[#ED1C24]/25 dark:bg-[#38181D] dark:text-[#FF4D52]',
                        'transition-colors duration-200 group-hover/card:bg-[#ED1C24] group-hover/card:text-white dark:group-hover/card:bg-[#ED1C24] dark:group-hover/card:text-white'
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </div>

                    <h3 className="font-display text-heading text-xl font-semibold tracking-[-0.01em]">
                      {title}
                    </h3>
                    <p className="text-heading mt-2 text-sm font-medium">{subtitle}</p>
                    <p className="text-muted-foreground mt-2.5 text-[0.9375rem] leading-7 text-pretty">
                      {description}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D71920] dark:text-[#FF4D52]">
                        Explore
                        <ArrowRight
                          className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </article>
                </MagicCard>
              </Link>
            ))}
          </div>
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
        <Stack gap="2xl">
          <SectionHeading
            eyebrow="How we work"
            title="From Your First Idea to What's Next."
            description="We believe creating something great should be a collaborative, transparent, and exciting journey. Our approach keeps your vision at the center of every stage."
          />
          <DeliverySteps items={deliverySteps} variant="compact" />
        </Stack>
      </Container>
    </Section>
  )
}

export function TechnologySection() {
  return (
    <Section className="surface-subtle border-x-0">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="space-y-4">
            <SectionHeading
              eyebrow="Technology with purpose"
              title="Innovation That Goes Beyond the Ordinary."
              description="We believe great technology isn't about following every new trend. It's about finding the right ideas, tools, and approaches to make something genuinely better. At WixPearl, we combine modern technologies, creative problem-solving, and continuous learning to build digital solutions that are reliable, adaptable, and ready for the future."
            />
            <p className="text-heading font-display text-base font-semibold tracking-[-0.01em]">
              Technology is our tool. Your vision is our direction.
            </p>
          </div>

          <div
            data-particle-surface
            className="pearl-surface grid gap-3 rounded-lg p-6 sm:grid-cols-2 sm:p-8"
          >
            {technologies.map((technology) => (
              <TechnologyBadge
                key={technology}
                name={technology}
                className="justify-center sm:justify-start"
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function HomeFinalCta() {
  return (
    <CTA
      eyebrow="Have something in mind?"
      title="Let's Create Something Extraordinary."
      description="Big ideas, small beginnings, or challenges waiting for the right solution — every great journey starts with a conversation. Tell us what you envision. Together, we can explore the possibilities and bring your next idea to life."
      motto="Your Vision, Our Solution."
      primaryLabel="Start Your Project"
      primaryHref="/contact"
      secondaryLabel="Get in Touch"
      secondaryHref="/contact"
    />
  )
}
