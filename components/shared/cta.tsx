import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Cluster } from '@/components/layout/cluster'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CTAProps {
  title: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'luminous' | 'minimal'
  className?: string
}

export function CTA({
  title,
  description,
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
            'group/cta relative isolate overflow-hidden rounded-[2.5rem]',
            // Generous, escalating padding at each breakpoint
            'px-8 py-14 sm:px-12 sm:py-16 lg:px-20 lg:py-20',
            // Surface treatment
            isLuminous ? 'surface-dark' : 'pearl-surface text-foreground',
            // Cinematic depth
            isLuminous
              ? 'shadow-[0_2px_0_0_color-mix(in_oklch,white_6%,transparent)_inset,0_60px_140px_-60px_color-mix(in_oklch,var(--primary)_50%,transparent)]'
              : 'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_40px_100px_-50px_color-mix(in_oklch,var(--primary)_25%,transparent)]'
          )}
        >
          {/* ─── Atmospheric layers (luminous only) ─────────── */}
          {isLuminous ? (
            <>
              {/* Radial-masked grid — schematic feel */}
              <div
                aria-hidden="true"
                className="pearl-grid absolute inset-0 -z-10 opacity-[0.08]"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
                }}
              />

              {/* Primary glow — top right, dominant light */}
              <div
                aria-hidden="true"
                className="absolute -top-40 -right-24 -z-10 size-96 rounded-full bg-[oklch(0.6_0.22_265/0.28)] blur-[120px]"
              />

              {/* Secondary glow — bottom left, complementary */}
              <div
                aria-hidden="true"
                className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-[oklch(0.6_0.2_290/0.15)] blur-[110px]"
              />

              {/* Top rim light — signature hairline */}
              <div
                aria-hidden="true"
                className="absolute inset-x-20 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
              />

              {/* Floating orb — quiet drama */}
              <div
                aria-hidden="true"
                className="ambient-orb absolute top-12 right-[14%] -z-10 hidden size-10 rounded-full opacity-75 lg:block"
              />
            </>
          ) : (
            <>
              {/* Minimal variant — single ambient highlight */}
              <div
                aria-hidden="true"
                className="bg-primary/8 absolute -top-32 -right-20 -z-10 size-80 rounded-full blur-[110px]"
              />

              <div
                aria-hidden="true"
                className="via-primary/40 absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent to-transparent"
              />
            </>
          )}

          {/* ─── Content ──────────────────────────────────────── */}
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            {/* Left: heading + description */}
            <Stack gap="md" className="max-w-2xl">
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
                    isLuminous ? 'text-white/65' : 'text-muted-foreground'
                  )}
                >
                  {description}
                </p>
              ) : null}
            </Stack>

            {/* Right: action buttons */}
            <Cluster className="shrink-0">
              <Link
                data-particle-cta
                href={primaryHref}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group/primary relative overflow-hidden',
                  'transition-all duration-400 ease-out',
                  isLuminous
                    ? cn(
                        'shadow-primary/25 shadow-lg',
                        'hover:-translate-y-px',
                        'hover:shadow-primary/35 hover:shadow-xl'
                      )
                    : cn(
                        'shadow-primary/15 shadow-md',
                        'hover:-translate-y-px',
                        'hover:shadow-primary/25 hover:shadow-lg'
                      )
                )}
              >
                {/* Shimmer sweep on hover */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-0 -translate-x-full',
                    'bg-linear-to-r from-transparent via-white/25 to-transparent',
                    'transition-transform duration-700 ease-out',
                    'group-hover/primary:translate-x-full'
                  )}
                />
                <span className="relative flex items-center gap-2">
                  {primaryLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-400 group-hover/primary:translate-x-0.5"
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
                    'transition-all duration-400 ease-out',
                    isLuminous
                      ? cn(
                          'border-white/20 bg-white/2 text-white',
                          'hover:border-white/40 hover:bg-white/6',
                          'hover:-translate-y-px'
                        )
                      : 'hover:-translate-y-px'
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
