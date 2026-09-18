import { Grid } from '@/components/layout/grid'

import type { Principle } from '@/config/content'

interface PrinciplesGridProps {
  items: readonly Principle[]
  variant: 'numbered' | 'cards'
}

export function PrinciplesGrid({ items, variant }: PrinciplesGridProps) {
  return (
    <Grid columns={4} gap={variant === 'numbered' ? 'xl' : 'lg'}>
      {items.map((principle, index) =>
        variant === 'numbered' ? (
          <div key={principle.title} className="border-border/75 border-t pt-6">
            <span className="text-primary font-mono text-xs">0{index + 1}</span>
            <h3 className="font-display mt-4 text-xl font-semibold">{principle.title}</h3>
            <p className="text-muted-foreground mt-3 leading-7">{principle.description}</p>
          </div>
        ) : (
          <div key={principle.title} className="pearl-surface interactive-surface rounded-2xl p-6">
            <span aria-hidden="true" className="ambient-orb mb-5 block size-3 rounded-full" />
            <h2 className="text-2xl font-semibold">{principle.title}</h2>
            <p className="text-muted-foreground mt-3 leading-7">{principle.description}</p>
          </div>
        )
      )}
    </Grid>
  )
}
