import { cn } from 'cn'
import { Globe2 } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Eyebrow } from '@/components/shared/eyebrow'

export function GlobalDeliverySection() {
  return (
    <Section spacing="md">
      <Container>
        <div
          className={cn(
            'pearl-surface group/globe relative isolate overflow-hidden rounded-[2.5rem]',
            'px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16',
            'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_30px_80px_-50px_color-mix(in_oklch,var(--ink)_25%,transparent)]',
            'transition-shadow duration-500 ease-out',
            'hover:shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_40px_100px_-50px_color-mix(in_oklch,var(--primary)_25%,transparent)]'
          )}
        >
          <div
            aria-hidden="true"
            className="via-primary/50 absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent to-transparent"
          />
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute -right-24 -bottom-28 -z-10 size-80 rounded-full blur-[110px]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-20 -z-10 size-72 rounded-full bg-[oklch(0.7_0.15_200/0.08)] blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pearl-grid absolute inset-0 -z-10 opacity-[0.05]"
            style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)' }}
          />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <Eyebrow className="inline-flex items-center gap-2">
                <Globe2 className="text-primary size-3.5" aria-hidden="true" />
                Sri Lankan roots, global delivery
              </Eyebrow>
              <h2 className="font-display mt-6 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]">
                Close collaboration wherever your business operates.
              </h2>
            </div>
            <p className="text-muted-foreground text-[1.0625rem] leading-8 text-pretty sm:text-lg sm:leading-9 lg:self-end">
              WixPearl brings direct access to engineering, flexible collaboration, and a practical
              cost structure to businesses in Sri Lanka and around the world.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
