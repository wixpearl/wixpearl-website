import { Cluster } from '@/components/layout/cluster'
import { Stack } from '@/components/layout/stack'
import { Eyebrow } from '@/components/shared/eyebrow'
import { cn } from '@/lib/utils'

import type { ComponentProps, ReactNode } from 'react'

const alignments = {
  start: 'items-start text-left',
  center: 'items-center text-center',
} as const

const titleSizes = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl lg:text-5xl',
  lg: 'text-4xl sm:text-5xl lg:text-6xl',
} as const

type Alignment = keyof typeof alignments
type TitleSize = keyof typeof titleSizes

interface SectionHeadingProps extends Omit<ComponentProps<'div'>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode

  align?: Alignment
  size?: TitleSize

  headingLevel?: 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  align = 'start',
  size = 'md',
  headingLevel = 'h2',
  className,
  ...props
}: SectionHeadingProps) {
  const Heading = headingLevel

  return (
    <div
      data-slot="section-heading"
      className={cn(
        'flex max-w-3xl flex-col gap-5',
        alignments[align],
        align === 'center' && 'mx-auto',
        className
      )}
      {...props}
    >
      <Stack gap="sm" align={align === 'center' ? 'center' : 'start'}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

        <Heading className={cn('font-semibold tracking-tight text-balance', titleSizes[size])}>
          {title}
        </Heading>

        {description && (
          <p className="text-muted-foreground max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </Stack>

      {actions && <Cluster justify={align === 'center' ? 'center' : 'start'}>{actions}</Cluster>}
    </div>
  )
}
