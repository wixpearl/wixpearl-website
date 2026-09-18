import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { CaseStudy } from '@/config/content'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function CaseStudyCard({ caseStudy, headingLevel = 'h3', className }: CaseStudyCardProps) {
  const Heading = headingLevel

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className={cn('group/card relative block h-full', 'focus-visible:outline-none', className)}
    >
      <article
        className={cn(
          // Container — generous breathing space
          'relative flex h-full flex-col overflow-hidden rounded-2xl',
          'border-border/70 bg-card border',
          'p-7 sm:p-8',
          // Refined depth — whisper at rest, warm on hover
          'shadow-[0_1px_2px_0_color-mix(in_oklch,var(--ink)_4%,transparent)]',
          'transition-all duration-400 ease-out',
          'hover:border-primary/25 hover:-translate-y-1',
          'hover:shadow-[0_28px_56px_-28px_color-mix(in_oklch,var(--primary)_25%,transparent),0_8px_16px_-8px_color-mix(in_oklch,var(--ink)_8%,transparent)]',
          // Keyboard focus ring
          'group-focus-visible/card:ring-ring group-focus-visible/card:ring-offset-background group-focus-visible/card:ring-2 group-focus-visible/card:ring-offset-2'
        )}
      >
        {/* Top rim highlight — appears on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-8 top-0 h-px',
            'via-primary/60 bg-linear-to-r from-transparent to-transparent',
            'opacity-0 transition-opacity duration-400',
            'group-hover/card:opacity-100'
          )}
        />

        {/* Ambient corner glow — quiet depth on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-20 -right-20 size-48 rounded-full',
            'bg-primary/8 blur-3xl',
            'opacity-0 transition-opacity duration-500',
            'group-hover/card:opacity-100'
          )}
        />

        {/* ─── Header: industry + title ─────────────────────── */}
        <header className="relative">
          {caseStudy.industry ? (
            <span
              className={cn(
                'mb-4 inline-flex items-center gap-1.5 rounded-full',
                'border-primary/15 bg-primary/8 border',
                'px-3 py-1',
                'text-primary text-[0.6875rem] font-medium tracking-widest uppercase',
                'transition-colors duration-400',
                'group-hover/card:border-primary/30 group-hover/card:bg-primary/12'
              )}
            >
              <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
              {caseStudy.industry}
            </span>
          ) : null}

          <Heading className="font-display text-foreground text-2xl font-semibold tracking-[-0.015em] text-balance">
            {caseStudy.title}
          </Heading>
        </header>

        {/* ─── Description ──────────────────────────────────── */}
        <p className="text-muted-foreground relative mt-4 text-[0.9375rem] leading-7 text-pretty">
          {caseStudy.summary}
        </p>

        {/* ─── Metrics — the hero of this card ──────────────── */}
        {caseStudy.outcomes.length > 0 ? (
          <div
            className={cn(
              'relative mt-7 grid grid-cols-2 gap-x-6 gap-y-5',
              'border-border/60 bg-muted/30 rounded-xl border',
              'p-5',
              'transition-colors duration-400',
              'group-hover/card:border-primary/20 group-hover/card:bg-primary/4'
            )}
          >
            {caseStudy.outcomes.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <p
                  className={cn(
                    'font-display text-2xl font-semibold tracking-[-0.02em] tabular-nums',
                    'from-foreground to-foreground/70 bg-linear-to-br bg-clip-text text-transparent',
                    'transition-all duration-400',
                    'group-hover/card:from-primary group-hover/card:to-primary/70'
                  )}
                >
                  {metric.value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {/* ─── CTA — pinned to bottom ───────────────────────── */}
        <div className="relative mt-auto pt-7">
          <span
            className={cn(
              'text-primary inline-flex items-center gap-1.5 text-sm font-semibold',
              'transition-colors duration-300'
            )}
          >
            View case study
            <ArrowRight
              className={cn(
                'size-3.5',
                'transition-transform duration-400 ease-out',
                'group-hover/card:translate-x-1'
              )}
              aria-hidden="true"
            />
          </span>
        </div>
      </article>
    </Link>
  )
}
