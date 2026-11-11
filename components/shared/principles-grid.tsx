import { Grid } from '@/components/layout/grid'
import { cn } from '@/lib/utils'

import type { Principle } from '@/config/content'

interface PrinciplesGridProps {
  items: readonly Principle[]
  variant?: 'numbered' | 'cards'
}

export function PrinciplesGrid({ items, variant: _variant = 'numbered' }: PrinciplesGridProps) {
  return (
    <Grid columns={3} gap="lg">
      {items.map((principle, index) => (
        <article
          key={principle.title}
          data-particle-surface
          className={cn(
            'pearl-surface flex h-full flex-col rounded-lg p-6 sm:p-7',
            'hover:border-primary/40 transition-colors duration-200'
          )}
        >
          <span className="text-primary mb-4 font-mono text-xs font-semibold tracking-wider">
            0{index + 1}
          </span>

          <h3 className="font-display text-heading text-lg font-semibold tracking-[-0.01em]">
            {principle.title}
          </h3>
          <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed text-pretty">
            {principle.description}
          </p>
        </article>
      ))}
    </Grid>
  )
}
