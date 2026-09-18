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
  className?: string
}

export function CTA({
  title,
  description,
  primaryLabel = 'Start a Project',
  primaryHref = '/contact',
  secondaryLabel,
  secondaryHref,
  className,
}: CTAProps) {
  return (
    <Section spacing="lg" className={className}>
      <Container>
        <div
          className={cn(
            'bg-foreground text-background rounded-2xl border px-6 py-12',
            'sm:px-10 sm:py-14',
            'lg:px-14 lg:py-16'
          )}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Stack gap="md" className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {title}
              </h2>

              {description ? (
                <p className="text-background/70 text-base leading-7 text-pretty sm:text-lg">
                  {description}
                </p>
              ) : null}
            </Stack>

            <Cluster>
              <Link href={primaryHref} className={buttonVariants({ size: 'lg' })}>
                {primaryLabel}
              </Link>

              {secondaryLabel && secondaryHref ? (
                <Link
                  href={secondaryHref}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                    className:
                      'border-background/30 text-background hover:bg-background hover:text-foreground bg-transparent',
                  })}
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
