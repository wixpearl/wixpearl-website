import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Cluster } from '@/components/layout/cluster'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { BorderBeam } from '@/components/ui/border-beam'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CTAProps {
  eyebrow?: string
  title: string
  description?: string
  motto?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'luminous' | 'minimal'
  className?: string
}

export function CTA({
  eyebrow,
  title,
  description,
  motto,
  primaryLabel = 'Start a Project',
  primaryHref = '/contact',
  secondaryLabel,
  secondaryHref,
  variant = 'luminous',
  className,
}: CTAProps) {
  const isLuminous = variant === 'luminous'

  return (
    <Section spacing="lg" className={className}>
      <Container>
        <div
          data-particle-surface
          className={cn(
            'relative overflow-hidden rounded-lg',
            'px-8 py-14 sm:px-12 sm:py-16 lg:px-20 lg:py-20',
            isLuminous ? 'surface-dark' : 'pearl-surface text-foreground'
          )}
        >
          {isLuminous ? (
            <>
              <BorderBeam
                size={280}
                duration={8}
                borderWidth={2}
                colorFrom="#ED1C24"
                colorTo="#FF6B6F"
              />
              <BorderBeam
                size={280}
                duration={8}
                delay={4}
                reverse
                borderWidth={2}
                colorFrom="#6DAAF7"
                colorTo="#ED1C24"
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-full w-105 opacity-90"
                viewBox="0 0 420 200"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M 160 200 C 260 175, 340 120, 420 20 L 420 200 Z"
                  className="fill-[#12396B]/40 dark:fill-white/6"
                />
                <path
                  d="M 250 200 C 325 185, 375 150, 420 95 L 420 200 Z"
                  fill="#ED1C24"
                  fillOpacity="0.55"
                />
              </svg>
            </>
          ) : null}

          {/* ─── Content ──────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            {/* Left: eyebrow + heading + description + motto */}
            <Stack gap="md" className="max-w-2xl">
              {eyebrow ? (
                <p
                  className={cn(
                    'font-mono text-[0.7rem] font-semibold tracking-[0.17em] uppercase',
                    isLuminous ? 'text-[#FF5C61]' : 'text-[#D71920] dark:text-[#FF4D52]'
                  )}
                >
                  {eyebrow}
                </p>
              ) : null}

              <h2
                data-particle-text
                className={cn(
                  'font-display text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]',
                  isLuminous && 'text-white'
                )}
              >
                {title}
              </h2>

              {description ? (
                <p
                  className={cn(
                    'text-base leading-7 text-pretty sm:text-lg sm:leading-8',
                    isLuminous ? 'text-[#D7DFE9]' : 'text-muted-foreground'
                  )}
                >
                  {description}
                </p>
              ) : null}

              {motto ? (
                <p
                  className={cn(
                    'font-display pt-1 text-base font-semibold tracking-[-0.01em]',
                    isLuminous ? 'text-white' : 'text-heading'
                  )}
                >
                  {motto}
                </p>
              ) : null}
            </Stack>

            {/* Right: action buttons */}
            <Cluster className="shrink-0">
              <Link
                data-particle-cta
                href={primaryHref}
                className={cn(buttonVariants({ variant: 'cta', size: 'lg' }), 'group/primary')}
              >
                <span className="flex items-center gap-2">
                  {primaryLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover/primary:translate-x-0.5"
                  />
                </span>
              </Link>

              {secondaryLabel && secondaryHref ? (
                <Link
                  href={secondaryHref}
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                      size: 'lg',
                    }),
                    isLuminous &&
                      'border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5'
                  )}
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </Cluster>
          </div>
        </div>
      </Container>
    </Section>
  )
}
