import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const columns = {
  1: 'grid-cols-1',

  2: 'grid-cols-1 sm:grid-cols-2',

  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',

  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',

  auto: 'grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]',
} as const

const gaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10',
} as const

type Columns = keyof typeof columns
type Gap = keyof typeof gaps

interface GridProps extends ComponentProps<'div'> {
  columns?: Columns
  gap?: Gap
}

export function Grid({ columns: columnCount = 3, gap = 'md', className, ...props }: GridProps) {
  return (
    <div
      data-slot="grid"
      className={cn('grid', columns[columnCount], gaps[gap], className)}
      {...props}
    />
  )
}
