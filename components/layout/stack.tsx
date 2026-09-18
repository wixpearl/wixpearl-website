import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const gaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
} as const

const alignments = {
  stretch: 'items-stretch',
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
} as const

type Gap = keyof typeof gaps
type Alignment = keyof typeof alignments

interface StackProps extends ComponentProps<'div'> {
  gap?: Gap
  align?: Alignment
}

export function Stack({ gap = 'md', align = 'stretch', className, ...props }: StackProps) {
  return (
    <div
      data-slot="stack"
      className={cn('flex flex-col', gaps[gap], alignments[align], className)}
      {...props}
    />
  )
}
