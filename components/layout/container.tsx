import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
} as const

type ContainerSize = keyof typeof containerSizes

interface ContainerProps extends ComponentProps<'div'> {
  size?: ContainerSize
}

export function Container({ size = 'xl', className, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', containerSizes[size], className)}
      {...props}
    />
  )
}
