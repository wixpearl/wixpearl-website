import { cn } from 'cn'
import { Check } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { SectionHeading } from '@/components/shared/section-heading'

const engineeringProof = [
  {
    title: 'Secure foundations',
    description: 'Security is considered in the architecture, data flow, delivery, and operation.',
  },
  {
    title: 'Dependable by design',
    description:
      'Reliability and maintainability shape the system from the first technical decision.',
  },
  {
    title: 'Direct engineering access',
    description: 'Work directly with engineers who explain trade-offs and remain accountable.',
  },
] as const

export function EngineeringProofSection() {
  return (
    <Section>
      <Container>
        <div
          className={cn(
            'surface-dark relative isolate overflow-hidden rounded-[2rem]',
            'px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20',
            'shadow-[0_2px_0_0_color-mix(in_oklch,white_6%,transparent)_inset,0_40px_120px_-60px_color-mix(in_oklch,var(--primary)_45%,transparent)]'
          )}
        >
          <div
            aria-hidden="true"
            className="pearl-grid absolute inset-0 -z-10 opacity-[0.08]"
            style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)' }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-24 -z-10 size-96 rounded-full bg-[oklch(0.6_0.22_265/0.18)] blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-[oklch(0.6_0.2_290/0.12)] blur-[110px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
          />
          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              eyebrow="Engineering proof"
              title="Care you can see in every decision"
              description="Strong systems come from disciplined choices, visible trade-offs, and an accountable engineering relationship."
              className={cn(
                '**:data-[slot=eyebrow]:text-violet-300',
                '[&_p]:text-white/65',
                '[&_h2]:tracking-[-0.02em] [&_h2]:text-white'
              )}
            />
            <ul className="divide-y divide-white/8 border-y border-white/8">
              {engineeringProof.map((item) => (
                <li
                  key={item.title}
                  className={cn(
                    'group/item relative grid gap-4 py-6 sm:grid-cols-[auto_1fr] sm:gap-5',
                    'transition-colors duration-300 hover:bg-white/1.5'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1/2 left-0 h-0 w-px -translate-y-1/2',
                      'bg-linear-to-b from-transparent via-violet-300/60 to-transparent',
                      'transition-all duration-500 group-hover/item:h-3/4'
                    )}
                  />
                  <span
                    className={cn(
                      'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full',
                      'border border-violet-300/20 bg-linear-to-br from-violet-300/15 to-violet-300/2 text-violet-200',
                      'transition-all duration-400 ease-out group-hover/item:scale-105',
                      'group-hover/item:border-violet-300/35 group-hover/item:bg-violet-300/12',
                      'group-hover/item:shadow-[0_0_20px_-4px_oklch(0.75_0.18_290/0.5)]'
                    )}
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-white/95">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-7 text-pretty text-white/60">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
