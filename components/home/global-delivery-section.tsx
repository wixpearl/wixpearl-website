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
          data-particle-surface
          className={cn(
            'pearl-surface group/globe relative isolate overflow-hidden rounded-[2.5rem]',
            'px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16',
            'shadow-[0_1px_0_0_rgba(228,233,240,0.8)_inset,0_30px_80px_-50px_rgba(11,36,71,0.1)]',
            'transition-shadow duration-500 ease-out',
            'hover:shadow-[0_1px_0_0_rgba(228,233,240,0.8)_inset,0_40px_100px_-50px_rgba(11,36,71,0.18)]'
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
            className="absolute -top-24 -left-20 -z-10 size-72 rounded-full bg-[#6DAAF7]/8 blur-[100px]"
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
              <h2
                data-particle-text
                className="font-display mt-6 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Close collaboration wherever your business operates.
              </h2>
            </div>
            <div>
              <p className="text-muted-foreground text-[1.0625rem] leading-8 text-pretty sm:text-lg sm:leading-9">
                WixPearl brings direct access to engineering, flexible collaboration, and a
                practical cost structure to businesses in Sri Lanka and around the world.
              </p>
              <div className="border-border/80 text-muted-foreground mt-8 grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2 sm:gap-4 sm:pt-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
                  <span>
                    <strong>Timezone Overlap:</strong> UK, EU, APAC & Americas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
                  <span>
                    <strong>Direct Comms:</strong> Slack, Teams, or Discord
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
