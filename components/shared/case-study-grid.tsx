import { Grid } from '@/components/layout/grid'
import { CaseStudyCard } from '@/components/shared/case-study-card'
import { cn } from '@/lib/utils'

import type { CaseStudy } from '@/config/content'

interface CaseStudyGridProps {
  items: readonly CaseStudy[]
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function CaseStudyGrid({ items, headingLevel = 'h3', className }: CaseStudyGridProps) {
  return (
    <Grid columns={2} gap="lg" className={cn(className)}>
      {items.map((caseStudy) => (
        <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} headingLevel={headingLevel} />
      ))}
    </Grid>
  )
}
