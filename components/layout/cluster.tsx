import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const gaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const

const justifyments = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

const alignments = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
} as const

type Gap = keyof typeof gaps
type Justify = keyof typeof justifyments
type Alignment = keyof typeof alignments

interface ClusterProps extends ComponentProps<'div'> {
  gap?: Gap
  justify?: Justify
  align?: Alignment
  wrap?: boolean
}

export function Cluster({
  gap = 'md',
  justify = 'start',
  align = 'center',
  wrap = true,
  className,
  ...props
}: ClusterProps) {
  return (
    <div
      data-slot="cluster"
      className={cn(
        'flex',
        wrap && 'flex-wrap',
        gaps[gap],
        justifyments[justify],
        alignments[align],
        className
      )}
      {...props}
    />
  )
}
