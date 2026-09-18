import { Grid } from '@/components/layout/grid'
import { ServiceCard } from '@/components/shared/service-card'
import { cn } from '@/lib/utils'

import type { Service } from '@/config/content'

interface ServiceGridProps {
  items: readonly Service[]
  columns?: 2 | 4
  titleVariant?: 'full' | 'short'
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ServiceGrid({
  items,
  columns = 4,
  titleVariant = 'full',
  headingLevel = 'h3',
  className,
}: ServiceGridProps) {
  return (
    <Grid columns={columns} gap="lg" className={cn(className)}>
      {items.map((service) => (
        <ServiceCard
          key={service.slug}
          service={service}
          titleVariant={titleVariant}
          headingLevel={headingLevel}
        />
      ))}
    </Grid>
  )
}
