import { Grid } from '@/components/layout/grid'
import { cn } from '@/lib/utils'

import type { Principle } from '@/config/content'

interface PrinciplesGridProps {
  items: readonly Principle[]
  variant?: 'numbered' | 'cards'
}

export function PrinciplesGrid({ items, variant: _variant = 'numbered' }: PrinciplesGridProps) {
  return (
    <Grid columns={4} gap="lg">
      {items.map((principle, index) => (
        <article
          key={principle.title}
          data-particle-surface
          className={cn(
            'group/principle pearl-surface relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-7',
            'shadow-sm transition-all duration-400 ease-out',
            'hover:border-primary/40 hover:-translate-y-1 hover:shadow-md',
            'dark:hover:bg-[var(--surface-raised)]'
          )}
        >
          {/* Top highlight bar on hover */}
          <span
            aria-hidden="true"
            className="via-primary/50 pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover/principle:opacity-100"
          />

          <div className="mb-5 flex items-center justify-between">
            <span
              className={cn(
                'border-border bg-primary/10 grid size-9 place-items-center rounded-xl border',
                'text-primary font-mono text-xs font-semibold transition-colors duration-300',
                'group-hover/principle:border-primary/40 group-hover/principle:bg-primary/20'
              )}
            >
              0{index + 1}
            </span>
            <span
              aria-hidden="true"
              className="ambient-orb size-2.5 rounded-full opacity-60 transition-opacity group-hover/principle:opacity-100"
            />
          </div>

          <h3 className="font-display text-heading text-lg font-semibold tracking-[-0.01em]">
            {principle.title}
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
            {principle.description}
          </p>
        </article>
      ))}
    </Grid>
  )
}
